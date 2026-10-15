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
# `gating`, its id `gating$active_hierarchy_id`; the others are kept beside it under
# `gating$stored_hierarchies`, each with its id. A workspace with no hierarchy list has one tree.
# (It read `gating$hierarchy_id`, which no workspace carries, and so returned the active tree for
# any id; a stored hierarchy's populations were then looked up in the wrong tree.)
.gatelabr_workspace_tree <- function(parsed, hierarchy_id) {
  gating <- parsed$gating
  if (!is.list(gating)) return(NULL)
  own <- gating$active_hierarchy_id
  if (is.null(own) || is.null(hierarchy_id) ||
      identical(as.character(own), as.character(hierarchy_id))) {
    return(gating)
  }
  for (tree in gating$stored_hierarchies) {
    if (is.list(tree) && identical(as.character(tree$id), as.character(hierarchy_id))) {
      if (is.null(tree$gates)) tree$gates <- gating$gates
      return(tree)
    }
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

#' Write the active tree of the memberships an explicit save brought to the hierarchy.
#'
#' Each population becomes a node under its parent's node, written in place: a node the app
#' holds and the user did not change is left exactly as it was, per-sample gates and all; a
#' changed gate is set on the samples whose gate changed; a new population is added. One with a
#' single included rectangle, polygon or ellipse is written as that gate on every sample, each
#' sample's from the tree that sample is gated under (its own tailoring where it has one), and is
#' kept only when flowWorkspace selects exactly the events GateLab did on every sample; every
#' other population, and a gate whose events differ, is written as its per-sample membership.
#' Nodes the app was never given (an OR, a node on a calibration table, and everything under
#' them) are kept where they are; nodes it was given and no longer has are removed.
#' @noRd
.gatelabr_gatingset_write_populations <- function(gs, parsed, memberships, record = NULL, received = NULL) {
  prepared <- .gatelabr_gatingset_memberships(gs, memberships)
  owned <- .gatelabr_gatingset_owned(gs, parsed, record, received)
  .gatelabr_gatingset_write_prepared(gs, parsed, prepared, owned = owned,
                                     node_map = if (is.list(record)) record$nodes else NULL)
}

# ── which tree each sample is gated under ─────────────────────────────────────

.gatelabr_scalar_or <- function(value, default = NULL) {
  value <- if (is.null(value)) character(0) else as.character(unlist(value))
  if (length(value) == 1L && !is.na(value) && nzchar(value)) value else default
}

# Name a JSON object's entries by `key` when it arrived as an array.
.gatelabr_named_by <- function(entries, key) {
  if (!is.list(entries)) return(list())
  if (length(entries) && is.null(names(entries))) {
    names(entries) <- vapply(entries, function(entry) as.character(entry[[key]]), character(1))
  }
  entries
}

# Every hierarchy of a workspace with its gates, populations and provenance, as the app keeps
# them (hierarchies.ts): the active one is `gating`, the others `gating$stored_hierarchies`; a
# file's tailored copy names the tree it came from (`source_hierarchy_id`) and its own ids'
# counterparts there (`source_population_ids`). `first` is the hierarchy a file with no
# assignment is gated under (fileHierarchyId: the first listed).
.gatelabr_workspace_trees <- function(parsed) {
  gating <- if (is.list(parsed)) parsed$gating else NULL
  if (!is.list(gating)) return(NULL)
  refs <- if (is.list(gating$hierarchies)) gating$hierarchies else list()
  ref_ids <- vapply(refs, function(ref) as.character(ref$id), character(1))
  active <- .gatelabr_scalar_or(gating$active_hierarchy_id, if (length(ref_ids)) ref_ids[[1]] else "main")
  trees <- list()
  add <- function(id, gates, populations, stored = list()) {
    ref <- if (id %in% ref_ids) refs[[match(id, ref_ids)]] else stored
    provenance <- function(field) if (!is.null(ref[[field]])) ref[[field]] else stored[[field]]
    trees[[id]] <<- list(
      id = id,
      gates = .gatelabr_named_by(gates, "gate_id"),
      populations = .gatelabr_named_by(populations, "population_id"),
      root = .gatelabr_scalar_or(if (is.null(stored$root_population_id)) gating$root_population_id else stored$root_population_id),
      source = .gatelabr_scalar_or(provenance("source_hierarchy_id")),
      source_populations = provenance("source_population_ids"),
      copy = !is.null(provenance("owner_sample_id")) || !is.null(provenance("owner_group_id"))
    )
  }
  add(active, gating$gates, gating$populations, list(root_population_id = gating$root_population_id))
  for (stored in gating$stored_hierarchies) {
    if (!is.list(stored)) next
    id <- .gatelabr_scalar_or(stored$id)
    if (is.null(id) || identical(id, active)) next
    add(id, if (is.null(stored$gates)) gating$gates else stored$gates, stored$populations, stored)
  }
  first <- if (length(ref_ids) && ref_ids[[1]] %in% names(trees)) ref_ids[[1]] else active
  lineage <- function(tree_id, population_id) {
    keys <- character(0)
    tree <- trees[[tree_id]]
    id <- population_id
    while (!is.null(tree)) {
      key <- paste(tree$id, id, sep = "\r")
      if (key %in% keys) break
      keys <- c(keys, key)
      parent <- tree$source_populations[[id]]
      if (is.null(parent) || is.null(tree$source)) break
      id <- as.character(parent)
      tree <- trees[[tree$source]]
    }
    keys
  }
  # The tree at the top of a copy chain: the family a tree belongs to (groups.ts, templateOf).
  family <- function(tree_id) {
    seen <- character(0)
    tree <- trees[[tree_id]]
    while (!is.null(tree) && isTRUE(tree$copy) && !is.null(tree$source) && !tree$id %in% seen &&
           !is.null(trees[[tree$source]])) {
      seen <- c(seen, tree$id)
      tree <- trees[[tree$source]]
    }
    if (is.null(tree)) tree_id else tree$id
  }
  # Population `population_id` of tree `from` in tree `to`, by provenance (hierarchies.ts,
  # correspondingHierarchyId): the one population of `to` whose lineage meets its lineage.
  indexes <- list()
  counterpart <- function(from, population_id, to) {
    target <- trees[[to]]
    if (is.null(target) || is.null(trees[[from]]$populations[[population_id]])) return(NULL)
    if (identical(from, to)) return(population_id)
    if (is.null(indexes[[to]])) {
      candidates <- names(target$populations)
      indexes[[to]] <<- lapply(candidates, function(candidate) lineage(to, candidate))
      names(indexes[[to]]) <<- candidates
    }
    keys <- lineage(from, population_id)
    matches <- names(indexes[[to]])[vapply(indexes[[to]], function(own) any(own %in% keys), logical(1))]
    if (length(matches) == 1L) matches else NULL
  }
  # What a population is across every tree of its family: its id at the top of its lineage,
  # which for a population GateLab translated from the object is the node's path.
  canonical <- function(tree_id, population_id) {
    keys <- lineage(tree_id, population_id)
    sub("^[^\r]*\r", "", keys[[length(keys)]])
  }
  list(trees = trees, active = active, first = first, family = family,
       counterpart = counterpart, canonical = canonical)
}

# The tree each sample of the object is gated under: its workspace sample's `hierarchyId`
# when the workspace assigns trees per file, else the first hierarchy. The workspace's samples
# are the object's, matched by id (`<dataset>:<sample>`), by file name, then by position.
.gatelabr_workspace_sample_trees <- function(parsed, workspace_trees, samples) {
  entries <- if (is.list(parsed$samples)) parsed$samples else list()
  per_file <- isTRUE(parsed$gating$perFileHierarchies)
  ids <- vapply(entries, function(entry) .gatelabr_scalar_or(entry$sampleId, ""), character(1))
  files <- vapply(entries, function(entry) .gatelabr_scalar_or(entry$fileName, ""), character(1))
  vapply(seq_along(samples), function(index) {
    sample <- samples[[index]]
    at <- which(endsWith(ids, paste0(":", sample)) | ids == sample)
    if (length(at) != 1L) at <- which(files == sample)
    if (length(at) != 1L) at <- if (index <= length(entries)) index else integer(0)
    assigned <- if (length(at) == 1L) .gatelabr_scalar_or(entries[[at]]$hierarchyId) else NULL
    if (per_file && !is.null(assigned) && assigned %in% names(workspace_trees$trees)) assigned else workspace_trees$first
  }, character(1))
}

# Where sample `index`'s gating of population `population_id` of the active tree comes from
# (hostedMemberships.ts, hostedMembershipReader): the tree the sample is gated under when it is
# of the active tree's family, through the population's counterpart there; else the active tree.
# NULL when the sample's own tree has no counterpart (the app sent it as not evaluated).
.gatelabr_workspace_sample_source <- function(workspace_trees, sample_trees, index, population_id) {
  active <- workspace_trees$active
  own <- sample_trees[[index]]
  if (identical(own, active) || is.null(workspace_trees$trees[[own]]) ||
      !identical(workspace_trees$family(own), workspace_trees$family(active))) {
    return(list(tree = active, population = population_id))
  }
  if (identical(population_id, workspace_trees$trees[[active]]$root)) {
    return(list(tree = own, population = workspace_trees$trees[[own]]$root))
  }
  mapped <- workspace_trees$counterpart(active, population_id, own)
  if (is.null(mapped)) NULL else list(tree = own, population = mapped)
}

# ── the nodes the app holds ───────────────────────────────────────────────────

# The nodes of the object that are the app's to change: those it was given at opening (the
# record keeps the list from the first write; the session state has it before), those an
# earlier save wrote (the record's node map), and those whose path is a population id of the
# workspace (a translated node keeps its path as its id). Everything else -- what the host
# left out at opening, what was added in R since, the colData export's nodes -- is kept as it
# is, and so is everything under it. A record written by GateLabR 1.6.1, whose save removed
# every node and wrote the tree back, holds no node map: every node is then the app's, as then.
.gatelabr_gatingset_owned <- function(gs, parsed, record = NULL, received = NULL) {
  existing <- setdiff(flowWorkspace::gs_get_pop_paths(gs, path = "full"), "root")
  if (length(existing) == 0L) return(character(0))
  written_before <- is.list(record) && isTRUE(record$hierarchy_written)
  if (written_before && is.null(record$nodes)) return(existing)
  workspace_trees <- .gatelabr_workspace_trees(parsed)
  ids <- unique(unlist(lapply(workspace_trees$trees, function(tree) names(tree$populations))))
  mapped <- if (is.list(record)) as.character(unlist(record$nodes)) else character(0)
  if (is.null(received) && is.list(record)) received <- record$received_nodes
  if (is.null(received) && length(mapped) == 0L && !written_before) {
    # Never written and nothing recorded of the opening: the app was given what the host can
    # describe, which it describes the same way now.
    received <- attr(.gatelabr_gatingset_hierarchy_payload(gs), "received")
  }
  owned <- intersect(existing, unique(c(ids, mapped, as.character(unlist(received)))))
  unowned <- setdiff(existing, owned)
  owned[!vapply(owned, .gatelabr_gatingset_below, logical(1), unowned)]
}

# ── comparing, keeping and restoring nodes ────────────────────────────────────

# Whether `path` is below any of `ancestors`. (paste0() of an empty vector and "/" is "/",
# under which every path lies, so the empty case is answered first.)
.gatelabr_gatingset_below <- function(path, ancestors) {
  length(ancestors) > 0L && any(startsWith(path, paste0(ancestors, "/")))
}

.gatelabr_gatingset_join <- function(parent, name) {
  if (identical(parent, "root")) paste0("/", name) else paste0(parent, "/", name)
}

.gatelabr_gatingset_is_geometric <- function(gate) {
  methods::is(gate, "rectangleGate") || methods::is(gate, "polygonGate") || methods::is(gate, "ellipsoidGate")
}

# Whether two flowCore gates are the same gate: class, channels and geometry, to a relative
# 1e-9 (a geometry mapped into the app's space and back moves in the last digits).
.gatelabr_gatingset_gates_equal <- function(a, b, tolerance = 1e-9) {
  if (is.null(a) || is.null(b) || !identical(class(a), class(b))) return(FALSE)
  if (!identical(as.character(flowCore::parameters(a)), as.character(flowCore::parameters(b)))) return(FALSE)
  close <- function(x, y) {
    x <- as.numeric(x)
    y <- as.numeric(y)
    length(x) == length(y) && all(
      (is.infinite(x) & is.infinite(y) & x == y) |
        (is.finite(x) & is.finite(y) & abs(x - y) <= tolerance * pmax(1, abs(y)))
    )
  }
  if (methods::is(a, "rectangleGate")) return(close(a@min, b@min) && close(a@max, b@max))
  if (methods::is(a, "polygonGate")) {
    return(identical(dim(a@boundaries), dim(b@boundaries)) && close(a@boundaries, b@boundaries))
  }
  if (methods::is(a, "ellipsoidGate")) {
    return(close(a@mean, b@mean) && close(a@cov, b@cov) && close(a@distance, b@distance))
  }
  FALSE
}

# Every node below `path` (and `path` itself with `include_self`), in the object's order, as
# every sample holds it: per-sample gates, or per-sample indices for a node of fixed indices,
# with its negation and its place relative to `path`, so that it can be added back as it was.
.gatelabr_gatingset_snapshot <- function(gs, path, include_self = FALSE) {
  samples <- flowWorkspace::sampleNames(gs)
  all_paths <- flowWorkspace::gs_get_pop_paths(gs, path = "full")
  below <- all_paths[startsWith(all_paths, paste0(if (identical(path, "root")) "" else path, "/"))]
  members <- c(if (include_self) path, below)
  base <- if (include_self) flowWorkspace::gs_pop_get_parent(gs, path) else path
  base_depth <- if (identical(base, "root") || !nzchar(base)) 0L else lengths(strsplit(sub("^/", "", base), "/", fixed = TRUE))
  lapply(members, function(member) {
    parts <- strsplit(sub("^/", "", member), "/", fixed = TRUE)[[1]]
    gates <- stats::setNames(lapply(samples, function(sample) flowWorkspace::gh_pop_get_gate(gs[[sample]], member)), samples)
    indices <- if (.gatelabr_gatingset_is_indices_gate(gates[[1]])) {
      stats::setNames(lapply(samples, function(sample) {
        as.logical(flowWorkspace::gh_pop_get_indices(gs[[sample]], member))
      }), samples)
    }
    list(path = member, relative = parts[(base_depth + 1L):length(parts)], gates = gates, indices = indices,
         negated = isTRUE(flowWorkspace::gh_pop_is_negated(gs[[samples[[1]]]], member)))
  })
}

# Add a snapshot's nodes back under `base`, each under its own parent as it was. A name taken
# there meanwhile gets a suffix. Returns the paths added, by the paths they had.
.gatelabr_gatingset_restore <- function(gs, base, snapshot) {
  placed <- list()
  for (entry in snapshot) {
    parent <- Reduce(.gatelabr_gatingset_join, utils::head(entry$relative, -1L), base)
    parent_original <- sub("/[^/]*$", "", entry$path)
    if (!is.null(placed[[parent_original]])) parent <- placed[[parent_original]]
    taken <- basename(flowWorkspace::gs_pop_get_children(gs, parent))
    name <- .gatelabr_gatingset_node_name(utils::tail(entry$relative, 1L), taken)
    .gatelabr_gatingset_add(gs, parent, name, entry$gates, entry$indices, entry$negated)
    placed[[entry$path]] <- .gatelabr_gatingset_join(parent, name)
  }
  placed
}

# Add a node: per-sample indices, or per-sample gates (one gate when every sample's is the same).
.gatelabr_gatingset_add <- function(gs, parent, name, gates = NULL, indices = NULL, negated = FALSE) {
  if (!is.null(indices)) {
    flowWorkspace::gs_pop_add(gs, indices, parent = parent, name = name)
    return(invisible(NULL))
  }
  value <- if (all(vapply(gates, identical, logical(1), gates[[1]]))) gates[[1]] else gates
  flowWorkspace::gs_pop_add(gs, value, parent = parent, name = name, negated = isTRUE(negated))
  invisible(NULL)
}

# Replace one node, keeping everything under it: what it holds becomes per-sample `gates` or
# per-sample `indices`, under the same parent and name, and its subtree is added back below.
.gatelabr_gatingset_replace <- function(gs, path, gates = NULL, indices = NULL, negated = FALSE) {
  parent <- flowWorkspace::gs_pop_get_parent(gs, path)
  if (!nzchar(parent)) parent <- "root"
  below <- .gatelabr_gatingset_snapshot(gs, path)
  flowWorkspace::gs_pop_remove(gs, path)
  .gatelabr_gatingset_add(gs, parent, basename(path), gates, indices, negated)
  .gatelabr_gatingset_restore(gs, path, below)
  invisible(path)
}

# A booleanFilter over full node paths, as flowWorkspace evaluates one (a term may start with
# its slash), from the text of `gate` with each term's node moved: `moved` maps the node a term
# named, by its path before, to its path now. NULL when no term moved; NA when a term names a
# node that is gone.
.gatelabr_gatingset_moved_boolean <- function(gate, paths_before, parent_before, moved, exists_now) {
  text <- .gatelabr_gatingset_boolean_text(gate)
  pieces <- regmatches(text, gregexpr("[&|!()]|[^&|!()]+", text))[[1]]
  changed <- FALSE
  for (index in seq_along(pieces)) {
    piece <- pieces[[index]]
    if (grepl("^[&|!()]$", piece)) next
    before <- .gatelabr_gatingset_resolve_term(piece, paths_before, parent_before)
    if (is.null(before)) next
    now <- if (!is.null(moved[[before]])) moved[[before]] else before
    if (!exists_now(now)) return(NA)
    if (!identical(now, before)) {
      pieces[[index]] <- now
      changed <- TRUE
    }
  }
  if (!changed) return(NULL)
  rewritten <- paste(pieces, collapse = "")
  methods::new("booleanFilter", expr = as.expression(as.symbol(rewritten)), args = list(),
               filterId = gate@filterId, deparse = rewritten)
}

# ── the write ─────────────────────────────────────────────────────────────────

.gatelabr_gatingset_parent_path <- function(path) {
  parent <- sub("/[^/]*$", "", path)
  if (nzchar(parent)) parent else "root"
}

# The write itself, from populations already prepared (parents before children, masks per
# sample): what an explicit save brings, or what an SCE's stored memberships hold
# (gatingset_export.R). `parsed` is the workspace the populations belong to, whose trees give
# each sample's own gates; `owned` the existing nodes that are the app's to change, every other
# node being kept; `node_map` the record's map from a population (by its id at the top of its
# copy chain) to the node an earlier save wrote it to.
.gatelabr_gatingset_write_prepared <- function(gs, parsed, prepared, owned = character(0), node_map = NULL) {
  samples <- flowWorkspace::sampleNames(gs)
  channels <- .gatelabr_gatingset_channels(gs)$pnn
  axes_of <- lapply(samples, function(sample) .gatelabr_gatingset_axes(gs, channels, sample))
  workspace_trees <- .gatelabr_workspace_trees(parsed)
  if (is.null(workspace_trees)) {
    workspace_trees <- .gatelabr_workspace_trees(list(gating = list(gates = list(), populations = list())))
  }
  # The memberships' active hierarchy is the workspace's; a workspace that lists no hierarchy
  # has one tree, whatever id the memberships give it.
  if (!is.null(prepared$active) && !is.null(workspace_trees$trees[[prepared$active]])) {
    workspace_trees$active <- prepared$active
  }
  sample_trees <- .gatelabr_workspace_sample_trees(parsed, workspace_trees, samples)

  existing <- setdiff(flowWorkspace::gs_get_pop_paths(gs, path = "full"), "root")
  parent_of <- stats::setNames(vapply(existing, function(path) {
    parent <- flowWorkspace::gs_pop_get_parent(gs, path)
    if (nzchar(parent)) parent else "root"
  }, character(1)), existing)
  owned <- intersect(owned, existing)
  unowned <- setdiff(existing, owned)
  left_out <- if (length(unowned)) tryCatch({
    payload <- .gatelabr_gatingset_hierarchy_payload(gs)
    stats::setNames(vapply(payload$leftOut, `[[`, character(1), "reason"),
                    vapply(payload$leftOut, `[[`, character(1), "path"))
  }, error = function(...) character(0)) else character(0)
  reason_of <- function(path) if (path %in% names(left_out)) left_out[[path]] else "not in the app's workspace"
  masks_of <- function(population) stats::setNames(lapply(samples, function(sample) population$masks[[sample]]), samples)

  # ── plan: each population's per-sample gates and the node it is written to ──
  plan <- list()
  node_of <- list()
  claimed <- character(0)
  sibling_names <- list()
  for (population in prepared$populations) {
    id <- population$population_id
    if (is.na(population$parent_id)) {
      node_of[[id]] <- "root"
      plan[[id]] <- list(root = TRUE, id = id)
      next
    }
    if (is.null(plan[[population$parent_id]])) next
    parent_node <- node_of[[population$parent_id]]
    canonical <- tryCatch(workspace_trees$canonical(workspace_trees$active, id), error = function(...) id)
    # Each sample's own gate: from the tree that sample is gated under (its tailoring).
    gates <- lapply(seq_along(samples), function(index) {
      source <- .gatelabr_workspace_sample_source(workspace_trees, sample_trees, index, id)
      if (is.null(source)) return(NULL)
      tree <- workspace_trees$trees[[source$tree]]
      .gatelabr_gatingset_gate(tree$gates, tree$populations[[source$population]], population$name, axes_of[[index]])
    })
    form <- NULL
    if (!any(vapply(gates, is.null, logical(1)))) {
      negated <- vapply(gates, function(gate) isTRUE(attr(gate, "gatelabr_negated")), logical(1))
      if (length(unique(negated)) == 1L) {
        form <- list(negated = negated[[1]], gates = stats::setNames(lapply(gates, function(gate) {
          attr(gate, "gatelabr_negated") <- NULL
          gate
        }), samples))
      }
    }
    # Its name, unique among its siblings in the app and the nodes kept beside them.
    key <- population$parent_id
    if (is.null(sibling_names[[key]])) {
      sibling_names[[key]] <- if (is.na(parent_node)) character(0) else
        basename(unowned[unname(parent_of[unowned]) == parent_node])
    }
    name <- .gatelabr_gatingset_node_name(population$name, sibling_names[[key]])
    sibling_names[[key]] <- c(sibling_names[[key]], name)
    # The node it was written to before, the node it was translated from, or the node of its
    # name under its parent's: the first of these that is the app's, not yet taken, and under
    # the node its parent is written to. One that is elsewhere is where it came from: it is
    # written anew, and the old node goes.
    candidates <- unique(c(
      if (is.list(node_map) && !is.null(node_map[[canonical]])) as.character(unlist(node_map[[canonical]])),
      canonical,
      if (!is.na(parent_node)) .gatelabr_gatingset_join(parent_node, .gatelabr_gatingset_node_name(population$name, character(0)))
    ))
    origin <- NA_character_
    node <- NA_character_
    for (candidate in candidates) {
      if (!candidate %in% owned || candidate %in% claimed) next
      if (is.na(origin)) origin <- candidate
      if (!is.na(parent_node) && identical(unname(parent_of[[candidate]]), parent_node)) {
        node <- candidate
        break
      }
    }
    if (!is.na(node)) {
      claimed <- c(claimed, node)
      origin <- node
    }
    node_of[[id]] <- node
    plan[[id]] <- list(id = id, population = population, canonical = canonical, form = form,
                       node = node, origin = origin, name = name)
  }

  report <- list(gates = character(0), masks = character(0), replaced = character(0),
                 kept = character(0), tailored = character(0), renamed = character(0),
                 removed = character(0), kept_nodes = list(), lost = list(),
                 hierarchies = prepared$hierarchies, populations = 0L, nodes = list())

  # ── nodes the app had and no longer has go; what is kept under them is put aside ──
  doomed <- setdiff(owned, claimed)
  topmost <- doomed[!vapply(doomed, function(path) .gatelabr_gatingset_below(path, setdiff(doomed, path)), logical(1))]
  moved_to <- list()
  for (entry in plan) {
    if (!isTRUE(entry$root) && !is.na(entry$origin) && is.na(entry$node)) moved_to[[entry$origin]] <- entry$id
  }
  put_aside <- list()
  for (path in unowned) {
    if (!parent_of[[path]] %in% owned) next
    if (!path %in% topmost && !.gatelabr_gatingset_below(path, topmost)) next
    put_aside[[length(put_aside) + 1L]] <- list(
      anchor = parent_of[[path]], path = path,
      snapshot = .gatelabr_gatingset_snapshot(gs, path, include_self = TRUE)
    )
  }
  for (path in topmost) flowWorkspace::gs_pop_remove(gs, path)
  report$removed <- topmost

  # ── renames, top-down, through a temporary name so that two nodes may swap theirs ──
  moved <- list()
  now <- function(path) {
    for (step in moved) {
      if (identical(path, step$from)) {
        path <- step$to
      } else if (startsWith(path, paste0(step$from, "/"))) {
        path <- paste0(step$to, substring(path, nchar(step$from) + 1L))
      }
    }
    path
  }
  renaming <- Filter(function(entry) {
    !isTRUE(entry$root) && !is.na(entry$node) && !identical(basename(entry$node), entry$name)
  }, plan)
  for (phase in 1:2) {
    for (index in seq_along(renaming)) {
      entry <- renaming[[index]]
      current <- now(entry$node)
      target <- if (phase == 1L) paste0(entry$name, " .gatelabr-rename-", index) else entry$name
      flowWorkspace::gs_pop_set_name(gs, current, target)
      moved[[length(moved) + 1L]] <- list(
        from = current, to = .gatelabr_gatingset_join(.gatelabr_gatingset_parent_path(current), target))
    }
  }
  report$renamed <- unname(vapply(renaming, `[[`, character(1), "name"))

  # A boolean naming a renamed node names it by its new path (cytolib finds a boolean's terms by
  # name, and a rename leaves them naming nothing). One naming a node that went is replaced by
  # the app's population where the app holds it, and goes, with the reason, where it does not.
  moved_paths <- stats::setNames(lapply(existing, now), existing)
  rewrite <- function(gate, parent_before, live) {
    if (!methods::is(gate, "booleanFilter") || .gatelabr_gatingset_is_indices_gate(gate)) return(NULL)
    .gatelabr_gatingset_moved_boolean(gate, existing, parent_before, moved_paths, function(target) target %in% live)
  }
  broken <- character(0)
  live <- flowWorkspace::gs_get_pop_paths(gs, path = "full")
  for (path in existing) {
    here <- now(path)
    if (!here %in% live) next
    rewritten <- rewrite(tryCatch(flowWorkspace::gh_pop_get_gate(gs[[samples[[1]]]], here), error = function(...) NULL),
                         parent_of[[path]], live)
    if (is.null(rewritten)) next
    if (identical(rewritten, NA)) {
      if (path %in% owned) {
        broken <- c(broken, here)
      } else {
        report$lost[[length(report$lost) + 1L]] <- list(
          path = path, reason = paste0(reason_of(path), "; it names a node the app's tree no longer has"))
        flowWorkspace::gs_pop_remove(gs, here)
        live <- flowWorkspace::gs_get_pop_paths(gs, path = "full")
      }
      next
    }
    for (sample in samples) flowWorkspace::gh_pop_set_gate(gs[[sample]], here, rewritten)
  }

  # ── top-down: a node the app holds changes only where its gate changed; a new one is added ──
  path_of <- list()
  for (entry in plan) {
    if (isTRUE(entry$root)) {
      path_of[[entry$id]] <- "root"
      next
    }
    population <- entry$population
    parent_path <- path_of[[population$parent_id]]
    if (is.null(parent_path)) next
    form <- entry$form
    path <- .gatelabr_gatingset_join(parent_path, entry$name)
    if (!is.na(entry$node)) {
      entry$status <- "kept"
      if (path %in% broken) {
        if (!is.null(form)) {
          .gatelabr_gatingset_replace(gs, path, gates = form$gates, negated = form$negated)
          entry$status <- "gate"
        } else {
          .gatelabr_gatingset_replace(gs, path, indices = masks_of(population))
          entry$status <- "masks"
        }
      } else if (!is.null(form)) {
        held <- lapply(samples, function(sample) flowWorkspace::gh_pop_get_gate(gs[[sample]], path))
        geometric <- all(vapply(held, .gatelabr_gatingset_is_geometric, logical(1)))
        same_side <- identical(isTRUE(flowWorkspace::gh_pop_is_negated(gs[[samples[[1]]]], path)), isTRUE(form$negated))
        if (geometric && same_side) {
          # Set on the samples whose gate changed and on no other.
          for (index in seq_along(samples)) {
            if (.gatelabr_gatingset_gates_equal(form$gates[[index]], held[[index]])) next
            flowWorkspace::gh_pop_set_gate(gs[[samples[[index]]]], path, form$gates[[index]])
            entry$status <- "gate"
          }
        }
      }
    } else {
      .gatelabr_gatingset_add(
        gs, parent_path, entry$name,
        gates = if (!is.null(form)) form$gates,
        indices = if (is.null(form)) masks_of(population),
        negated = !is.null(form) && isTRUE(form$negated)
      )
      entry$status <- if (is.null(form)) "masks" else "gate"
    }
    path_of[[entry$id]] <- path
    plan[[entry$id]] <- entry
  }

  # What was kept under a node that went is added back under the node its population moved to.
  live <- flowWorkspace::gs_get_pop_paths(gs, path = "full")
  for (aside in put_aside) {
    target <- if (!is.null(moved_to[[aside$anchor]])) path_of[[moved_to[[aside$anchor]]]] else NULL
    if (is.null(target)) {
      report$lost[[length(report$lost) + 1L]] <- list(
        path = aside$path,
        reason = paste0(reason_of(aside$path), "; removed with '", aside$anchor, "', which the app's tree no longer has"))
      next
    }
    snapshot <- lapply(aside$snapshot, function(node) {
      if (is.null(node$indices)) {
        node$gates <- lapply(node$gates, function(gate) {
          rewritten <- rewrite(gate, .gatelabr_gatingset_parent_path(node$path), live)
          if (is.null(rewritten) || identical(rewritten, NA)) gate else rewritten
        })
      }
      node
    })
    placed <- .gatelabr_gatingset_restore(gs, target, snapshot)
    report$kept_nodes[[length(report$kept_nodes) + 1L]] <- list(path = placed[[aside$path]], reason = reason_of(aside$path))
  }
  aside_paths <- vapply(put_aside, `[[`, character(1), "path")
  live <- flowWorkspace::gs_get_pop_paths(gs, path = "full")
  for (path in unowned) {
    if (path %in% aside_paths || parent_of[[path]] %in% unowned || !now(path) %in% live) next
    report$kept_nodes[[length(report$kept_nodes) + 1L]] <- list(path = now(path), reason = reason_of(path))
  }
  flowWorkspace::recompute(gs)

  # ── every node holds the app's events on every sample ──
  # One that does not is written as the population's gate where it was something else, and as
  # its per-sample membership otherwise. A second pass catches a boolean elsewhere whose
  # events moved with a node replaced in the first.
  exact <- function(path, population) {
    all(vapply(samples, function(sample) {
      identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[sample]], path)),
                as.logical(population$masks[[sample]]))
    }, logical(1)))
  }
  for (pass in 1:2) {
    for (entry in plan) {
      if (isTRUE(entry$root) || is.null(entry$status)) next
      path <- path_of[[entry$id]]
      if (exact(path, entry$population)) next
      if (pass == 1L && !is.null(entry$form) && !identical(entry$status, "gate")) {
        .gatelabr_gatingset_replace(gs, path, gates = entry$form$gates, negated = entry$form$negated)
        flowWorkspace::recompute(gs, path)
        if (exact(path, entry$population)) {
          plan[[entry$id]]$status <- "gate"
          next
        }
      }
      .gatelabr_gatingset_replace(gs, path, indices = masks_of(entry$population))
      flowWorkspace::recompute(gs, path)
      if (!is.null(entry$form)) report$replaced <- c(report$replaced, entry$name)
      plan[[entry$id]]$status <- "masks"
    }
    flowWorkspace::recompute(gs)
  }

  for (entry in plan) {
    if (isTRUE(entry$root) || is.null(entry$status)) next
    bucket <- switch(entry$status, kept = "kept", gate = "gates", "masks")
    report[[bucket]] <- c(report[[bucket]], entry$name)
    if (!identical(entry$status, "masks") && !is.null(entry$form) &&
        !all(vapply(entry$form$gates, identical, logical(1), entry$form$gates[[1]]))) {
      report$tailored <- c(report$tailored, entry$name)
    }
    report$populations <- report$populations + 1L
    report$nodes[[entry$canonical]] <- path_of[[entry$id]]
  }
  report$replaced <- unique(report$replaced)
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
      if (any(vapply(p, is.null, logical(1))) || p$M <= 0) NULL else {
        inverse <- flowCore::inverseLogicleTransform(
          flowCore::logicleTransform(w = p$W, t = p$T, m = p$M, a = p$A))@.Data
        # GateLab stores normalized coordinates (T maps to 1); flowCore's inverse expects
        # decades (T maps to M). The factor remains M when A is nonzero.
        function(y) inverse(y * p$M)
      }
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
  fields <- setdiff(names(own), c("kind", "standard", "tableChannels", "spline"))
  all(vapply(fields, function(field) {
    a <- suppressWarnings(as.numeric(spec[[field]]))
    b <- suppressWarnings(as.numeric(own[[field]]))
    length(a) == 1L && length(b) == 1L && is.finite(a) && is.finite(b) &&
      abs(a - b) <= 1e-9 * max(1, abs(b))
  }, logical(1)))
}

# The flowWorkspace gate a population can be written as, or NULL when it has none: one gate
# reference, no quadrant, a rectangle, polygon or ellipse. An excluded reference (the parent's
# events outside the gate, FlowJo's NOT gate) is the same gate added negated, which the result
# says through its `gatelabr_negated` attribute. A rectangle is mapped bound by bound from the
# app's space through linear into the object's, which is exact for an axis-aligned edge under
# any transform; a polygon or ellipse is mapped only when the app's space is the object's by
# parameters, so that its edges stay straight.
.gatelabr_gatingset_gate <- function(gates, population, node, axes) {
  if (!is.list(population)) return(NULL)
  refs <- population$gate_refs
  if (!is.list(refs) || length(refs) != 1L) return(NULL)
  ref <- refs[[1]]
  if (!is.list(ref) || !is.null(ref$quadrant)) return(NULL)
  built <- .gatelabr_gatingset_gate_shape(gates, ref, node, axes)
  if (is.null(built)) return(NULL)
  if (!isTRUE(ref$include)) attr(built, "gatelabr_negated") <- TRUE
  built
}

.gatelabr_gatingset_gate_shape <- function(gates, ref, node, axes) {
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
      channel <- c(x, y)[[index]]
      own <- axis_pair[[index]]
      # In the object's own space (by parameters), a bound maps by the axis's affine `backward`,
      # exactly, as a polygon's vertices do: a gate the object gave the app comes back as it
      # was. Otherwise from the app's space to linear, then through the object's own transform
      # into the space its gates are evaluated in; through a biexponential's spline and its
      # inverse that moves a bound in its last digits.
      same <- .gatelabr_gatingset_same_space(specs[[index]], own)
      undo <- if (same) NULL else .gatelabr_spec_inverse(specs[[index]])
      if (!same && is.null(undo)) return(NULL)
      to_object <- function(value) {
        if (.gatelabr_gatingset_unbounded(value)) return(sign(value) * Inf)
        if (same) return(own$backward(value))
        linear <- undo(value)
        if (is.function(own$transform)) own$transform(linear) else linear
      }
      low <- to_object(min(vertices[, index]))
      high <- to_object(max(vertices[, index]))
      if (is.nan(low) || is.nan(high)) return(NULL)
      # flowCore's rectangle holds an event on either edge; a GateLab rectangle drawn since
      # 2026-09 is half-open (models.ts, RectangleBounds), its upper edge out. The object's
      # closed upper bound is set just below the app's, so the two hold the same events
      # wherever values tie on the edge; the recompute check after the write settles the rest.
      if (identical(gate$bounds, "half-open") && is.finite(high)) {
        high <- high - abs(high) * .Machine$double.eps - .Machine$double.xmin
      }
      # A range gate repeats its channel on both axes (hostedHierarchy.ts, and the Gating-ML
      # importer): the object gets one dimension, over the two ranges' intersection.
      previous <- bounds[[channel]]
      bounds[[channel]] <- if (is.null(previous)) c(low, high) else c(max(previous[[1]], low), min(previous[[2]], high))
    }
    if (any(vapply(bounds, function(range) range[[1]] > range[[2]], logical(1)))) return(NULL)
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

.gatelabr_gatingset_populations <- function(gs, populations = NULL, by = c("name", "path")) {
  by <- match.arg(by)
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
  # By path, a column is the node's full path, as flowWorkspace names it.
  labels <- if (identical(by, "path")) hierarchy$population_id else hierarchy$population
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
