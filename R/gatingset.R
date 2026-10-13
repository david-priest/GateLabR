# gatingset.R -- a flowWorkspace GatingSet as the object GateLabR serves and writes back to.
#
# A GatingSet holds, per sample, a cytoframe whose values are compensated and transformed in
# place, each channel's transformation with its inverse, and a hierarchy of nodes. Everything
# else in this package is written against a SingleCellExperiment, so the GatingSet is served
# through an SCE built from it at launch: the channels as rows, the events of every sample in
# order as columns, the compensated linear values (the inverse of the stored transforms) as one
# assay named `compensated`, so the app draws through its own display transforms and applies no
# matrix a second time. The workspace record lives in a cytoframe keyword, which save_gs() keeps
# where an R attribute is lost, and the hierarchy is the record of the populations: an explicit
# save writes every population of the active tree back as a node. Design note: the vault's
# `Coding/GateLab/GateLabR — GatingSet support (design, 2026-10-13).md`.

.gatelabr_gatingset_keyword <- "GATELAB_WORKSPACE"
.gatelabr_gatingset_assay <- "compensated"

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

# Every sample's events as flowWorkspace holds them before its transforms: the compensated
# linear values. A GatingSet with no transformation stores linear values already.
.gatelabr_gatingset_linear <- function(gh) {
  transformed <- length(flowWorkspace::gh_get_transformations(gh)) > 0L
  frame <- if (transformed) {
    flowWorkspace::gh_pop_get_data(gh, "root", inverse.transform = TRUE)
  } else {
    flowWorkspace::gh_pop_get_data(gh, "root")
  }
  flowCore::exprs(frame)
}

#' The SingleCellExperiment the app is served for a GatingSet.
#'
#' Rows are the cytoframe parameters ($PnN as the row name, $PnS as the marker), columns the
#' events of every sample in `sampleNames()` order, `sample_id` and the `pData()` columns the
#' colData, and the one assay the compensated linear values. The metadata declares the assay's
#' role and space and carries the workspace record read from the keyword, so the host layer
#' treats the object as it treats any SCE.
#' @noRd
.gatelabr_gatingset_sce <- function(gs) {
  .gatelabr_require_gatingset_support()
  samples <- flowWorkspace::sampleNames(gs)
  if (length(samples) == 0L) stop("The GatingSet holds no samples.", call. = FALSE)
  frames <- lapply(seq_along(samples), function(index) .gatelabr_gatingset_linear(gs[[index]]))
  counts <- vapply(frames, nrow, integer(1))
  first <- flowWorkspace::gh_pop_get_data(gs[[1]], "root")
  parameters <- flowCore::pData(flowCore::parameters(first))
  # The columns come as AsIs; plain character, or identical() and the row names refuse them.
  pnn <- as.character(unclass(parameters$name))
  pns <- as.character(unclass(parameters$desc))
  pns[is.na(pns)] <- ""
  # The values are taken in the parameters' order by name, so a sample whose matrix lists them
  # in another order is served the same; one that lacks or adds a parameter is refused.
  for (index in seq_along(frames)) {
    found <- colnames(frames[[index]])
    if (is.null(found) || !setequal(found, pnn) || length(found) != length(pnn)) {
      stop(
        "Sample `", samples[[index]], "` of the GatingSet has other parameters than `",
        samples[[1]], "`; GateLabR serves one panel.",
        call. = FALSE
      )
    }
    frames[[index]] <- frames[[index]][, pnn, drop = FALSE]
  }
  values <- t(do.call(rbind, frames))
  storage.mode(values) <- "double"
  row_ids <- make.unique(pnn, sep = "__")
  dimnames(values) <- list(
    row_ids,
    paste0(rep(samples, counts), "_", unlist(lapply(counts, seq_len)))
  )
  pd <- flowWorkspace::pData(gs)
  col_data <- S4Vectors::DataFrame(sample_id = rep(samples, counts))
  for (field in setdiff(colnames(pd), c("name", "sample_id"))) {
    col_data[[field]] <- rep(pd[[field]], counts)
  }
  rownames(col_data) <- colnames(values)
  row_data <- S4Vectors::DataFrame(gatelabr_pnn = pnn, gatelabr_pns = pns)
  rownames(row_data) <- row_ids
  assays <- list(values)
  names(assays) <- .gatelabr_gatingset_assay
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = assays,
    colData = col_data,
    rowData = row_data
  )
  md <- list(
    gatelabr_assay_roles = stats::setNames(list("compensated"), .gatelabr_gatingset_assay),
    gatelabr_assay_coordinate_spaces = stats::setNames(list("linear"), .gatelabr_gatingset_assay),
    gatelabr_gatingset = list(samples = samples, event_counts = counts)
  )
  record <- .gatelabr_gatingset_record(gs)
  if (!is.null(record)) md$gatelab_workspace <- record
  S4Vectors::metadata(sce) <- md
  sce
}

# ── the record on the object ─────────────────────────────────────────────────

# The workspace record as the SCE host stores it in metadata(), read from the keyword of the
# first sample's cytoframe. NULL when the object holds none.
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
  record$version <- as.integer(record$version)
  record
}

# Write the record to every sample's cytoframe, the same value on each, so that a sample
# subset of the object still carries it. Memberships are left out: the hierarchy is the record
# of the populations, and the masks would be a second copy of it.
.gatelabr_gatingset_store_record <- function(gs, record) {
  record <- record[setdiff(names(record), "memberships")]
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

# ── write-back ────────────────────────────────────────────────────────────────

#' Apply what the app wrote to its SCE copy to the GatingSet it stands for.
#'
#' Every write stores the workspace record. A save that brought memberships (an explicit one,
#' whose memberships carry the record's own revision) also rebuilds the hierarchy from the
#' active tree. Returns the report of that rebuild, or NULL when none ran.
#' @noRd
.gatelabr_gatingset_apply <- function(gs, sce) {
  md <- S4Vectors::metadata(sce)$gatelab_workspace
  if (!is.list(md) || !is.character(md$workspace_json)) return(invisible(NULL))
  .gatelabr_gatingset_store_record(gs, md)
  memberships <- md$memberships
  if (!is.list(memberships) ||
      !identical(as.integer(memberships$revision), as.integer(md$revision))) {
    return(invisible(NULL))
  }
  report <- .gatelabr_gatingset_write_populations(gs, sce, md)
  # The record says the hierarchy was written from this revision, which is what the stop-time
  # warning and the readers' status ask.
  md$hierarchy_written <- TRUE
  .gatelabr_gatingset_store_record(gs, md)
  invisible(report)
}

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

#' Rebuild the hierarchy from the active tree of the memberships an explicit save brought.
#'
#' Each population becomes a node under its parent's node. One with a single included gate
#' that is a rectangle, polygon or ellipse in display space under the GatingSet's own
#' transforms is written as that gate, and kept only when flowWorkspace selects exactly the
#' events GateLab did; every other population, and a gate whose events differ, is written as
#' its per-sample membership, which flowWorkspace holds as a node of its own kind. Nodes the
#' tree no longer has are removed first: the tree in GateLab is the tree.
#' @noRd
.gatelabr_gatingset_write_populations <- function(gs, sce, md) {
  memberships <- md$memberships
  hierarchies <- memberships$hierarchies
  active <- hierarchies$hierarchy_id[hierarchies$active %in% TRUE]
  if (length(active) == 0L) active <- hierarchies$hierarchy_id[[1]]
  active <- active[[1]]
  populations <- memberships$populations[memberships$populations$hierarchy_id == active, ]
  populations <- populations[order(populations$depth), ]
  parsed <- tryCatch(jsonlite::fromJSON(md$workspace_json, simplifyVector = FALSE),
                     error = function(cause) NULL)
  tree <- if (is.list(parsed)) .gatelabr_workspace_tree(parsed, active) else NULL
  gates <- if (is.list(tree)) tree$gates else list()
  tree_populations <- if (is.list(tree)) tree$populations else list()
  if (is.list(gates) && is.null(names(gates))) {
    names(gates) <- vapply(gates, function(gate) as.character(gate$gate_id), character(1))
  }
  if (is.list(tree_populations) && is.null(names(tree_populations))) {
    names(tree_populations) <- vapply(tree_populations,
                                      function(population) as.character(population$population_id),
                                      character(1))
  }

  samples <- flowWorkspace::sampleNames(gs)
  partition <- .gatelabr_sample_partition(sce, "sample_id", include_metadata = FALSE)
  if (!identical(partition$levels, samples)) {
    stop("The app's samples are not the GatingSet's samples; relaunch on the object.", call. = FALSE)
  }
  event_count <- ncol(sce)
  masks_of <- function(population_id) {
    packed <- memberships$masks[[paste0(active, "/", population_id)]]
    bits <- .gatelabr_unpack_bits(packed, event_count)
    stats::setNames(lapply(partition$event_indices, function(rows) bits[rows]), samples)
  }

  for (child in flowWorkspace::gs_pop_get_children(gs, "root")) {
    flowWorkspace::gs_pop_remove(gs, child)
  }
  paths <- list()
  report <- list(gates = character(0), masks = character(0), replaced = character(0))
  for (row in seq_len(nrow(populations))) {
    population_id <- populations$population_id[[row]]
    parent_id <- populations$parent_id[[row]]
    if (is.na(parent_id)) {
      paths[[population_id]] <- "root"
      next
    }
    parent_path <- paths[[parent_id]]
    if (is.null(parent_path)) {
      warning("Population '", populations$population[[row]], "' has no parent node and was not written.",
              call. = FALSE)
      next
    }
    siblings <- basename(flowWorkspace::gs_pop_get_children(gs, parent_path))
    node <- .gatelabr_gatingset_node_name(populations$population[[row]], siblings)
    path <- if (identical(parent_path, "root")) paste0("/", node) else paste0(parent_path, "/", node)
    masks <- masks_of(population_id)
    gate <- .gatelabr_gatingset_gate(gs, gates, tree_populations[[population_id]], node)
    written <- "masks"
    if (!is.null(gate)) {
      flowWorkspace::gs_pop_add(gs, gate, parent = parent_path, name = node)
      flowWorkspace::recompute(gs, path)
      exact <- all(vapply(seq_along(samples), function(index) {
        identical(
          as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], path)),
          as.logical(masks[[index]])
        )
      }, logical(1)))
      if (exact) {
        written <- "gate"
      } else {
        flowWorkspace::gs_pop_remove(gs, path)
        report$replaced <- c(report$replaced, node)
      }
    }
    if (identical(written, "masks")) {
      flowWorkspace::gs_pop_add(gs, masks, parent = parent_path, name = node)
    }
    report[[if (written == "gate") "gates" else "masks"]] <-
      c(report[[if (written == "gate") "gates" else "masks"]], node)
    paths[[population_id]] <- path
  }
  report
}

# The flowWorkspace gate a population can be written as, or NULL when it has none: one included
# gate reference, no quadrant, a rectangle, polygon or ellipse in display space whose transforms
# on both axes are the GatingSet's own.
.gatelabr_gatingset_gate <- function(gs, gates, population, node) {
  if (!is.list(population)) return(NULL)
  refs <- population$gate_refs
  if (!is.list(refs) || length(refs) != 1L) return(NULL)
  ref <- refs[[1]]
  if (!is.list(ref) || !isTRUE(ref$include) || !is.null(ref$quadrant)) return(NULL)
  gate <- gates[[as.character(ref$gate_id)]]
  if (!is.list(gate) || !identical(gate$space, "display")) return(NULL)
  if (!gate$gate_type %in% c("rectangle", "polygon", "ellipse")) return(NULL)
  x <- as.character(gate$x_channel)
  y <- as.character(gate$y_channel)
  transforms <- gate$transforms
  if (!is.list(transforms)) return(NULL)
  for (channel in c(x, y)) {
    if (!isTRUE(.gatelabr_gatingset_transform_matches(gs, channel, transforms[[channel]]))) {
      return(NULL)
    }
  }
  if (identical(gate$gate_type, "ellipse")) {
    mean <- as.numeric(unlist(gate$mean))
    covariance <- matrix(as.numeric(unlist(gate$covariance)), 2L, 2L, byrow = TRUE)
    distance_square <- as.numeric(gate$distance_square)
    if (length(mean) != 2L || any(!is.finite(covariance)) || !is.finite(distance_square) ||
        distance_square <= 0) {
      return(NULL)
    }
    dimnames(covariance) <- list(c(x, y), c(x, y))
    return(flowCore::ellipsoidGate(
      filterId = node, .gate = covariance,
      mean = stats::setNames(mean, c(x, y)), distance = sqrt(distance_square)
    ))
  }
  vertices <- matrix(as.numeric(unlist(gate$vertices)), ncol = 2L, byrow = TRUE)
  if (any(!is.finite(vertices))) return(NULL)
  if (identical(gate$gate_type, "rectangle")) {
    if (nrow(vertices) < 2L) return(NULL)
    bounds <- stats::setNames(list(range(vertices[, 1]), range(vertices[, 2])), c(x, y))
    return(flowCore::rectangleGate(filterId = node, .gate = bounds))
  }
  if (nrow(vertices) < 3L) return(NULL)
  colnames(vertices) <- c(x, y)
  flowCore::polygonGate(filterId = node, .gate = vertices)
}

# The R function of a GateLab transform spec, or NULL for a kind R cannot rebuild.
.gatelabr_transform_function <- function(spec) {
  if (!is.list(spec) || !is.character(spec$kind)) return(NULL)
  number <- function(name) {
    value <- suppressWarnings(as.numeric(spec[[name]]))
    if (length(value) != 1L || !is.finite(value)) NULL else value
  }
  switch(
    spec$kind,
    identity = function(x) x,
    asinh = {
      cofactor <- number("cofactor")
      if (is.null(cofactor) || cofactor <= 0) NULL else function(x) asinh(x / cofactor)
    },
    logicle = {
      parameters <- list(T = number("T"), W = number("W"), M = number("M"), A = number("A"))
      if (any(vapply(parameters, is.null, logical(1)))) NULL else
        flowCore::logicleTransform(w = parameters$W, t = parameters$T, m = parameters$M,
                                   a = parameters$A)
    },
    biex = {
      parameters <- list(maxValue = number("maxValue"), pos = number("pos"), neg = number("neg"),
                         widthBasis = number("widthBasis"), channelRange = number("channelRange"))
      if (any(vapply(parameters, is.null, logical(1)))) NULL else
        flowWorkspace::flowjo_biexp(
          channelRange = parameters$channelRange, maxValue = parameters$maxValue,
          pos = parameters$pos, neg = parameters$neg, widthBasis = parameters$widthBasis
        )
    },
    NULL
  )
}

#' Whether a GateLab transform spec is, numerically, the GatingSet's transform of a channel.
#'
#' The parameters of a transform stored in the GatingSet are not readable from R, so the two
#' are compared as functions over the channel's own values: 200 quantiles of the linear values
#' plus their extremes, to within 1e-6 of the transformed range. A channel the GatingSet does
#' not transform matches the identity only.
#' @noRd
.gatelabr_gatingset_transform_matches <- function(gs, channel, spec) {
  gh <- gs[[1]]
  stored <- flowWorkspace::gh_get_transformations(gh)[[channel]]
  candidate <- .gatelabr_transform_function(spec)
  if (is.null(candidate)) return(FALSE)
  if (is.null(stored)) return(identical(spec$kind, "identity"))
  if (identical(spec$kind, "identity")) return(FALSE)
  linear <- .gatelabr_gatingset_linear(gh)
  if (!channel %in% colnames(linear)) return(FALSE)
  values <- linear[, channel]
  values <- values[is.finite(values)]
  if (length(values) == 0L) return(FALSE)
  probe <- unique(c(range(values), stats::quantile(values, probs = seq(0, 1, length.out = 200),
                                                  names = FALSE)))
  expected <- stored(probe)
  observed <- tryCatch(candidate(probe), error = function(cause) NULL)
  if (is.null(observed) || length(observed) != length(expected)) return(FALSE)
  scale <- max(diff(range(expected)), 1e-12)
  all(is.finite(observed)) && max(abs(observed - expected)) <= 1e-6 * scale
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
  counts <- vapply(seq_along(samples), function(index) {
    nrow(flowWorkspace::gh_pop_get_data(gs[[index]], "root"))
  }, integer(1))
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
