# gatingset.R -- what GateLabR writes to a flowWorkspace GatingSet, and reads from it.
#
# The object is served from its own parts (gatingset_host.R). This file holds the record the
# app keeps on it, the write of populations to its hierarchy, and the readers. The workspace
# record lives in a cytoframe keyword on every sample, which save_gs() keeps where an R
# attribute is lost; the hierarchy is the record of the populations: an explicit save writes
# every population of the active tree back as a node, as a flowWorkspace gate where the space
# allows and as the exact membership otherwise. Design note: the vault's
# `Coding/GateLab/GateLabR — GatingSet support (design, 2026-10-13).md`.

.gatelabr_gatingset_keyword <- "GATELAB_WORKSPACE"

.gatelabr_is_gatingset <- function(x) {
  methods::is(x, "GatingSet")
}

.gatelabr_require_gatingset_support <- function() {
  for (pkg in c("flowWorkspace", "flowCore")) {
    if (!requireNamespace(pkg, quietly = TRUE)) {
      stop(
        "A GatingSet needs the ", pkg, " package: BiocManager::install(\"", pkg, "\").",
        call. = FALSE
      )
    }
  }
  invisible(TRUE)
}

# ── the record on the object ─────────────────────────────────────────────────

# The workspace record, read from the keyword of the first sample's cytoframe. NULL when the
# object holds none.
.gatelabr_gatingset_record <- function(gs) {
  frame <- flowWorkspace::gs_cyto_data(gs)[[1]]
  text <- flowWorkspace::keyword(frame)[[.gatelabr_gatingset_keyword]]
  if (!is.character(text) || length(text) != 1L || is.na(text) || !nzchar(text)) return(NULL)
  record <- tryCatch(
    jsonlite::fromJSON(text, simplifyVector = TRUE),
    error = function(cause) {
      warning("The GatingSet's GateLab workspace keyword is unreadable: ", conditionMessage(cause),
              call. = FALSE)
      NULL
    }
  )
  if (!is.list(record) || !is.character(record$workspace_json)) return(NULL)
  record$revision <- as.integer(record$revision)
  record
}

# Store the record as the keyword on every sample's cytoframe. In the session the keyword is in
# memory; save_gs() writes it with the object.
.gatelabr_gatingset_store_record <- function(gs, record) {
  text <- as.character(jsonlite::toJSON(record, auto_unbox = TRUE, null = "null", na = "null",
                                        digits = NA))
  frames <- flowWorkspace::gs_cyto_data(gs)
  for (index in seq_along(frames)) {
    frame <- frames[[index]]
    if (.gatelabr_gatingset_keyword %in% names(flowWorkspace::keyword(frame))) {
      flowWorkspace::cf_keyword_set(frame, .gatelabr_gatingset_keyword, text)
    } else {
      flowWorkspace::cf_keyword_insert(frame, .gatelabr_gatingset_keyword, text)
    }
  }
  invisible(gs)
}

# ── populations to the hierarchy ──────────────────────────────────────────────

# The gates and populations of one hierarchy of a GateLab workspace. The active tree is
# `gating`; the others are kept beside it under `gating$stored_hierarchies`, each with its id.
.gatelabr_workspace_tree <- function(parsed, hierarchy_id) {
  gating <- parsed$gating
  if (!is.list(gating)) return(NULL)
  own <- gating$hierarchy_id
  if (is.null(own) || identical(as.character(own), as.character(hierarchy_id))) return(gating)
  for (tree in gating$stored_hierarchies) {
    if (is.list(tree) && identical(as.character(tree$id), as.character(hierarchy_id))) return(tree)
  }
  gating
}

# A node name flowWorkspace can hold: "/" separates path elements, so it cannot be in a name.
.gatelabr_gatingset_node_name <- function(name, taken) {
  name <- gsub("/", "-", as.character(name), fixed = TRUE)
  if (!nzchar(name)) name <- "population"
  candidate <- name
  index <- 1L
  while (candidate %in% taken) {
    index <- index + 1L
    candidate <- paste0(name, " (", index, ")")
  }
  candidate
}

# The populations of the active hierarchy of a memberships payload, parents before children,
# each with its masks per sample. The payload is the app's (workspaceContract.ts): hierarchies,
# and populations with one packed mask per sample.
.gatelabr_gatingset_memberships <- function(gs, memberships) {
  if (!is.list(memberships) || !is.list(memberships$hierarchies) || !is.list(memberships$populations)) {
    stop("Population memberships payload is malformed.", call. = FALSE)
  }
  hierarchies <- memberships$hierarchies
  if (length(hierarchies) == 0L) stop("Population memberships name no hierarchy.", call. = FALSE)
  ids <- vapply(hierarchies, function(hierarchy) .gatelabr_membership_scalar(hierarchy$id, "hierarchy id"), character(1))
  active <- ids[vapply(hierarchies, function(hierarchy) isTRUE(hierarchy$active), logical(1))]
  active <- if (length(active)) active[[1]] else ids[[1]]
  partition <- .gatelabr_gatingset_partition(gs, include_metadata = FALSE)
  samples <- partition$levels
  rows <- list()
  for (population in memberships$populations) {
    if (!is.list(population)) stop("Population memberships: a population is malformed.", call. = FALSE)
    if (!identical(.gatelabr_membership_scalar(population$hierarchyId, "hierarchy id"), active)) next
    name <- .gatelabr_membership_scalar(population$populationName, "population name")
    parent <- population$parentId
    parent <- if (is.null(parent) || length(parent) != 1L || is.na(parent) || !nzchar(as.character(parent))) {
      NA_character_
    } else {
      as.character(parent)
    }
    membership <- .gatelabr_assemble_membership(population$sampleMasks, partition, samples, name)
    rows[[length(rows) + 1L]] <- list(
      population_id = .gatelabr_membership_scalar(population$populationId, "population id"),
      name = name,
      parent_id = parent,
      masks = stats::setNames(lapply(partition$event_indices, function(index) membership[index] %in% TRUE), samples)
    )
  }
  if (length(rows) == 0L) stop("Population memberships name no population.", call. = FALSE)
  # Parents before children, whatever order the payload came in.
  ordered <- list()
  placed <- character(0)
  remaining <- rows
  repeat {
    before <- length(remaining)
    keep <- list()
    for (row in remaining) {
      if (is.na(row$parent_id) || row$parent_id %in% placed) {
        ordered[[length(ordered) + 1L]] <- row
        placed <- c(placed, row$population_id)
      } else {
        keep[[length(keep) + 1L]] <- row
      }
    }
    remaining <- keep
    if (length(remaining) == 0L || length(remaining) == before) break
  }
  for (row in remaining) {
    warning("Population '", row$name, "' has a parent outside its hierarchy and was not written.",
            call. = FALSE)
  }
  list(active = active, hierarchies = length(hierarchies), populations = ordered)
}

#' Rebuild the hierarchy from the active tree of the memberships an explicit save brought.
#'
#' Each population becomes a node under its parent's node. One with a single included
#' rectangle, polygon or ellipse becomes that gate where the object's space allows it
#' (.gatelabr_gatingset_gate), and is kept only when flowWorkspace selects exactly the events
#' GateLab did; every other population, and a gate whose events differ, is written as its
#' per-sample membership, which flowWorkspace holds as a node of its own kind. Nodes the tree
#' no longer has are removed first: the tree in GateLab is the tree.
#' @noRd
.gatelabr_gatingset_write_populations <- function(gs, parsed, memberships) {
  prepared <- .gatelabr_gatingset_memberships(gs, memberships)
  tree <- .gatelabr_workspace_tree(parsed, prepared$active)
  gates <- if (is.list(tree)) tree$gates else list()
  tree_populations <- if (is.list(tree)) tree$populations else list()
  if (is.list(gates) && length(gates) && is.null(names(gates))) {
    names(gates) <- vapply(gates, function(gate) as.character(gate$gate_id), character(1))
  }
  if (is.list(tree_populations) && length(tree_populations) && is.null(names(tree_populations))) {
    names(tree_populations) <- vapply(tree_populations,
                                      function(population) as.character(population$population_id),
                                      character(1))
  }
  samples <- flowWorkspace::sampleNames(gs)
  axes <- .gatelabr_gatingset_axes(gs, .gatelabr_gatingset_channels(gs)$pnn)

  for (child in flowWorkspace::gs_pop_get_children(gs, "root")) {
    flowWorkspace::gs_pop_remove(gs, child)
  }
  paths <- list()
  report <- list(gates = character(0), masks = character(0), replaced = character(0),
                 hierarchies = prepared$hierarchies, populations = 0L)
  for (population in prepared$populations) {
    if (is.na(population$parent_id)) {
      paths[[population$population_id]] <- "root"
      next
    }
    parent_path <- paths[[population$parent_id]]
    if (is.null(parent_path)) next
    siblings <- basename(flowWorkspace::gs_pop_get_children(gs, parent_path))
    node <- .gatelabr_gatingset_node_name(population$name, siblings)
    path <- if (identical(parent_path, "root")) paste0("/", node) else paste0(parent_path, "/", node)
    masks <- population$masks
    gate <- .gatelabr_gatingset_gate(gates, tree_populations[[population$population_id]], node, axes)
    written <- "masks"
    if (!is.null(gate)) {
      added <- tryCatch({
        flowWorkspace::gs_pop_add(gs, gate, parent = parent_path, name = node)
        flowWorkspace::recompute(gs, path)
        TRUE
      }, error = function(...) FALSE)
      exact <- added && all(vapply(seq_along(samples), function(index) {
        identical(
          as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], path)),
          as.logical(masks[[index]])
        )
      }, logical(1)))
      if (exact) {
        written <- "gate"
      } else {
        if (added) flowWorkspace::gs_pop_remove(gs, path)
        report$replaced <- c(report$replaced, node)
      }
    }
    if (identical(written, "masks")) {
      flowWorkspace::gs_pop_add(gs, masks, parent = parent_path, name = node)
    }
    report[[if (written == "gate") "gates" else "masks"]] <-
      c(report[[if (written == "gate") "gates" else "masks"]], node)
    report$populations <- report$populations + 1L
    paths[[population$population_id]] <- path
  }
  flowWorkspace::recompute(gs)
  report
}

# The app's UNBOUNDED (Number.MAX_VALUE) read by R: no bound on that side.
.gatelabr_gatingset_unbounded <- function(value) {
  !is.finite(value) || abs(value) >= 1e300
}

# The function from a GateLab transform spec's space back to linear values, or NULL for a
# kind R cannot invert. A gate stated in no space is in the sample's gating space, which for
# the linear values the app is served is the linear value.
.gatelabr_spec_inverse <- function(spec) {
  if (is.null(spec)) return(function(y) y)
  if (!is.list(spec) || !is.character(spec$kind)) return(NULL)
  number <- function(name) {
    value <- suppressWarnings(as.numeric(spec[[name]]))
    if (length(value) != 1L || !is.finite(value)) NULL else value
  }
  switch(
    spec$kind,
    identity = function(y) y,
    asinh = {
      cofactor <- number("cofactor")
      if (is.null(cofactor) || cofactor <= 0) NULL else function(y) cofactor * sinh(y)
    },
    logicle = {
      p <- list(T = number("T"), W = number("W"), M = number("M"), A = number("A"))
      if (any(vapply(p, is.null, logical(1)))) NULL else
        flowCore::inverseLogicleTransform(flowCore::logicleTransform(w = p$W, t = p$T, m = p$M, a = p$A))@.Data
    },
    biex = {
      p <- list(maxValue = number("maxValue"), pos = number("pos"), neg = number("neg"),
                widthBasis = number("widthBasis"), channelRange = number("channelRange"))
      if (any(vapply(p, is.null, logical(1)))) NULL else
        flowWorkspace::flowjo_biexp(channelRange = p$channelRange, maxValue = p$maxValue,
                                    pos = p$pos, neg = p$neg, widthBasis = p$widthBasis, inverse = TRUE)
    },
    wsplog = {
      p <- list(offset = number("offset"), decades = number("decades"))
      if (any(vapply(p, is.null, logical(1))) || p$offset <= 0 || p$decades <= 0) NULL else
        function(y) 10^(y * p$decades + log10(p$offset))
    },
    flog = {
      p <- list(T = number("T"), M = number("M"))
      if (any(vapply(p, is.null, logical(1))) || p$T <= 0 || p$M <= 0) NULL else
        function(y) p$T * 10^((y - 1) * p$M)
    },
    NULL
  )
}

# Whether a GateLab spec is the object's axis by parameters, so that straight edges in one
# space are straight in the other and the axis's affine `backward` map carries the geometry.
.gatelabr_gatingset_same_space <- function(spec, axis) {
  own <- axis$spec
  if (is.null(own)) return(is.null(spec) || identical(spec$kind, "identity"))
  if (!is.list(spec) || !identical(spec$kind, own$kind)) return(FALSE)
  fields <- setdiff(names(own), c("kind", "standard", "tableChannels"))
  all(vapply(fields, function(field) {
    a <- suppressWarnings(as.numeric(spec[[field]]))
    b <- suppressWarnings(as.numeric(own[[field]]))
    length(a) == 1L && length(b) == 1L && is.finite(a) && is.finite(b) &&
      abs(a - b) <= 1e-9 * max(1, abs(b))
  }, logical(1)))
}

# The flowWorkspace gate a population can be written as, or NULL when it has none: one
# included gate reference, no quadrant, a rectangle, polygon or ellipse. A rectangle is mapped
# bound by bound from the app's space through linear into the object's, which is exact for an
# axis-aligned edge under any transform; a polygon or ellipse is mapped only when the app's
# space is the object's by parameters, so that its edges stay straight.
.gatelabr_gatingset_gate <- function(gates, population, node, axes) {
  if (!is.list(population)) return(NULL)
  refs <- population$gate_refs
  if (!is.list(refs) || length(refs) != 1L) return(NULL)
  ref <- refs[[1]]
  if (!is.list(ref) || !isTRUE(ref$include) || !is.null(ref$quadrant)) return(NULL)
  gate <- gates[[as.character(ref$gate_id)]]
  if (!is.list(gate) || !gate$gate_type %in% c("rectangle", "polygon", "ellipse")) return(NULL)
  x <- as.character(gate$x_channel)
  y <- as.character(gate$y_channel)
  if (!x %in% names(axes) || !y %in% names(axes)) return(NULL)
  specs <- if (identical(gate$space, "display") && is.list(gate$transforms)) {
    list(gate$transforms[[x]], gate$transforms[[y]])
  } else {
    list(NULL, NULL)
  }
  axis_pair <- list(axes[[x]], axes[[y]])
  if (any(vapply(axis_pair, function(axis) !is.null(axis$unsupported), logical(1)))) return(NULL)

  if (identical(gate$gate_type, "rectangle")) {
    vertices <- matrix(as.numeric(unlist(gate$vertices)), ncol = 2L, byrow = TRUE)
    if (nrow(vertices) < 2L || any(is.na(vertices))) return(NULL)
    bounds <- list()
    for (index in 1:2) {
      undo <- .gatelabr_spec_inverse(specs[[index]])
      if (is.null(undo)) return(NULL)
      channel <- c(x, y)[[index]]
      own <- axis_pair[[index]]
      # From the app's space to linear, then through the object's own transform into the space
      # its gates are evaluated in.
      to_object <- function(value) {
        if (.gatelabr_gatingset_unbounded(value)) return(sign(value) * Inf)
        linear <- undo(value)
        if (is.function(own$transform)) own$transform(linear) else linear
      }
      low <- to_object(min(vertices[, index]))
      high <- to_object(max(vertices[, index]))
      if (is.nan(low) || is.nan(high)) return(NULL)
      bounds[[channel]] <- c(low, high)
    }
    return(flowCore::rectangleGate(filterId = node, .gate = bounds))
  }

  same <- all(vapply(1:2, function(index) {
    .gatelabr_gatingset_same_space(specs[[index]], axis_pair[[index]])
  }, logical(1)))
  if (!same) return(NULL)
  backward <- lapply(axis_pair, `[[`, "backward")
  if (identical(gate$gate_type, "ellipse")) {
    mean <- as.numeric(unlist(gate$mean))
    covariance <- matrix(as.numeric(unlist(gate$covariance)), 2L, 2L, byrow = TRUE)
    distance_square <- as.numeric(gate$distance_square)
    if (length(mean) != 2L || any(!is.finite(covariance)) || !is.finite(distance_square) ||
        distance_square <= 0) {
      return(NULL)
    }
    slopes <- vapply(backward, function(map) map(1) - map(0), numeric(1))
    covariance <- diag(slopes) %*% covariance %*% diag(slopes)
    dimnames(covariance) <- list(c(x, y), c(x, y))
    return(flowCore::ellipsoidGate(
      filterId = node, .gate = covariance,
      mean = stats::setNames(c(backward[[1]](mean[[1]]), backward[[2]](mean[[2]])), c(x, y)),
      distance = sqrt(distance_square)
    ))
  }
  vertices <- matrix(as.numeric(unlist(gate$vertices)), ncol = 2L, byrow = TRUE)
  if (nrow(vertices) < 3L || any(!is.finite(vertices))) return(NULL)
  vertices <- cbind(backward[[1]](vertices[, 1L]), backward[[2]](vertices[, 2L]))
  colnames(vertices) <- c(x, y)
  flowCore::polygonGate(filterId = node, .gate = vertices)
}

# ── readers ───────────────────────────────────────────────────────────────────

# The hierarchy of a GatingSet as gatelabHierarchy() reports an SCE's: every node below root,
# with its path as its id. Counts are summed over the samples.
.gatelabr_gatingset_hierarchy <- function(gs) {
  .gatelabr_require_gatingset_support()
  paths <- setdiff(flowWorkspace::gs_get_pop_paths(gs, path = "full"), "root")
  samples <- seq_along(flowWorkspace::sampleNames(gs))
  rows <- lapply(paths, function(path) {
    parts <- strsplit(sub("^/", "", path), "/", fixed = TRUE)[[1]]
    parent <- if (length(parts) > 1L) parts[[length(parts) - 1L]] else NA_character_
    gate <- tryCatch(flowWorkspace::gh_pop_get_gate(gs[[1]], path), error = function(...) NULL)
    data.frame(
      population_id = path,
      population = parts[[length(parts)]],
      parent = parent,
      depth = length(parts),
      path = paste(parts, collapse = " > "),
      gates = if (is.null(gate)) "" else class(gate)[[1]],
      event_count = sum(vapply(samples, function(index) {
        as.integer(flowWorkspace::gh_pop_get_count(gs[[index]], path))
      }, integer(1))),
      stringsAsFactors = FALSE
    )
  })
  out <- if (length(rows)) do.call(rbind, rows) else data.frame(
    population_id = character(0), population = character(0), parent = character(0),
    depth = integer(0), path = character(0), gates = character(0), event_count = integer(0),
    stringsAsFactors = FALSE
  )
  rownames(out) <- NULL
  out
}

# One population's membership over every event, in sample order.
.gatelabr_gatingset_membership <- function(gs, path) {
  unlist(lapply(seq_along(flowWorkspace::sampleNames(gs)), function(index) {
    as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], path))
  }), use.names = FALSE)
}

.gatelabr_gatingset_event_names <- function(gs) {
  samples <- flowWorkspace::sampleNames(gs)
  counts <- .gatelabr_gatingset_event_counts(gs)
  paste0(rep(samples, counts), "_", unlist(lapply(counts, seq_len)))
}

.gatelabr_gatingset_populations <- function(gs, populations = NULL) {
  hierarchy <- .gatelabr_gatingset_hierarchy(gs)
  if (!is.null(populations)) {
    if (!is.character(populations) || length(populations) == 0L) {
      stop("populations must be a character vector of population names or paths.", call. = FALSE)
    }
    picked <- integer(0)
    for (wanted in populations) {
      by_name <- which(hierarchy$population == wanted)
      by_path <- which(hierarchy$population_id == wanted)
      if (length(by_name) > 1L) {
        stop("Population name '", wanted, "' is shared by ", length(by_name),
             " nodes; pass a node path from gatelabHierarchy() instead.", call. = FALSE)
      }
      hit <- if (length(by_name) == 1L) by_name else if (length(by_path) == 1L) by_path else NULL
      if (is.null(hit)) {
        stop("No population called '", wanted, "' in the GatingSet. Populations: ",
             paste(hierarchy$population, collapse = ", "), ".", call. = FALSE)
      }
      picked <- c(picked, hit)
    }
    hierarchy <- hierarchy[picked, ]
  }
  names <- .gatelabr_gatingset_event_names(gs)
  out <- matrix(FALSE, nrow = length(names), ncol = nrow(hierarchy),
                dimnames = list(names, NULL))
  labels <- hierarchy$population
  duplicated_names <- labels %in% labels[duplicated(labels)]
  labels[duplicated_names] <- paste0(labels[duplicated_names], " (", hierarchy$population_id[duplicated_names], ")")
  colnames(out) <- labels
  for (index in seq_len(nrow(hierarchy))) {
    out[, index] <- .gatelabr_gatingset_membership(gs, hierarchy$population_id[[index]])
  }
  out
}

.gatelabr_gatingset_leaf_population <- function(gs, ungated = "ungated") {
  hierarchy <- .gatelabr_gatingset_hierarchy(gs)
  levels <- hierarchy$population
  duplicated_names <- levels %in% levels[duplicated(levels)]
  levels[duplicated_names] <- paste0(levels[duplicated_names], " (", hierarchy$population_id[duplicated_names], ")")
  if (ungated %in% levels) stop("ungated must differ from every population name.", call. = FALSE)
  event_count <- length(.gatelabr_gatingset_event_names(gs))
  leaf <- rep(NA_integer_, event_count)
  best_depth <- rep(0L, event_count)
  for (index in seq_len(nrow(hierarchy))) {
    membership <- .gatelabr_gatingset_membership(gs, hierarchy$population_id[[index]])
    deeper <- membership & hierarchy$depth[[index]] > best_depth
    leaf[deeper] <- index
    best_depth[deeper] <- hierarchy$depth[[index]]
  }
  codes <- ifelse(is.na(leaf), length(levels) + 1L, leaf)
  factor(c(levels, ungated)[codes], levels = c(levels, ungated))
}

# What the stop-time warning asks of a GatingSet: "none" until an explicit save wrote the
# hierarchy, "current" after one; the hierarchy is never stale.
.gatelabr_gatingset_memberships_status <- function(gs) {
  record <- tryCatch(.gatelabr_gatingset_record(gs), error = function(...) NULL)
  if (is.null(record)) return("absent")
  if (isTRUE(record$hierarchy_written)) "current" else "none"
}
