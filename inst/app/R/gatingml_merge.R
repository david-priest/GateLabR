# gatingml_merge.R — collision-safe integration of imported Gating-ML strategies

.gating_import_unique_id <- function(source_id, used_ids) {
  if (!source_id %in% used_ids) return(source_id)
  suffix <- 1L
  candidate <- paste0(source_id, "-imported")
  while (candidate %in% used_ids) {
    suffix <- suffix + 1L
    candidate <- paste0(source_id, "-imported-", suffix)
  }
  candidate
}

.gating_import_ordered_ids <- function(order, available) {
  ids <- unique(c(as.character(order), names(available)))
  ids[nzchar(ids) & ids %in% names(available)]
}

.gating_import_mapped_id <- function(id_map, source_id) {
  source_id <- as.character(source_id)
  if (length(source_id) != 1L || !source_id %in% names(id_map)) return(NULL)
  unname(id_map[[source_id]])
}

#' Add an imported gating strategy beside the current strategy
#'
#' The imported synthetic root is omitted. Its direct children are attached to
#' the current root so both strategies retain their original All Events ancestry.
#' Scientific labels are preserved; only colliding internal IDs are remapped.
merge_gating_strategies <- function(current, imported) {
  current_gates <- current$gates
  if (is.null(current_gates)) current_gates <- list()
  imported_gates <- imported$gates
  if (is.null(imported_gates)) imported_gates <- list()
  current_populations <- current$populations
  imported_populations <- imported$populations
  current_root <- as.character(current$root_population_id %||% "")
  imported_root <- as.character(imported$root_population_id %||% "")

  if (length(current_root) != 1L || !nzchar(current_root) ||
      is.null(current_populations[[current_root]])) {
    stop("The current population hierarchy has no valid root.", call. = FALSE)
  }
  if (length(imported_root) != 1L || !nzchar(imported_root) ||
      is.null(imported_populations[[imported_root]])) {
    stop("The imported population hierarchy has no valid root.", call. = FALSE)
  }

  gates <- current_gates
  gate_id_map <- character(0)
  used_gate_ids <- names(gates)
  if (is.null(used_gate_ids)) used_gate_ids <- character(0)
  for (source_id in names(imported_gates)) {
    target_id <- .gating_import_unique_id(source_id, used_gate_ids)
    used_gate_ids <- c(used_gate_ids, target_id)
    gate_id_map[[source_id]] <- target_id
    gate <- imported_gates[[source_id]]
    gate$gate_id <- target_id
    gates[[target_id]] <- gate
  }

  current_order <- .gating_import_ordered_ids(current$gate_order, current_gates)
  imported_order <- .gating_import_ordered_ids(imported$gate_order, imported_gates)
  gate_order <- c(current_order, unname(gate_id_map[imported_order]))

  populations <- lapply(current_populations, function(pop) {
    pop$children <- as.character(pop$children)
    pop$gate_refs <- lapply(pop$gate_refs, function(ref) as.list(ref))
    pop
  })
  population_id_map <- character(0)
  used_population_ids <- names(populations)
  for (source_id in setdiff(names(imported_populations), imported_root)) {
    target_id <- .gating_import_unique_id(source_id, used_population_ids)
    used_population_ids <- c(used_population_ids, target_id)
    population_id_map[[source_id]] <- target_id
  }

  for (source_id in setdiff(names(imported_populations), imported_root)) {
    source_pop <- imported_populations[[source_id]]
    target_id <- population_id_map[[source_id]]
    source_parent <- source_pop$parent_id
    parent_id <- if (identical(source_parent, imported_root)) {
      current_root
    } else if (!is.null(source_parent) && nzchar(as.character(source_parent))) {
      .gating_import_mapped_id(population_id_map, source_parent)
    } else {
      NULL
    }
    if (is.null(parent_id) || is.null(populations[[parent_id]])) {
      stop(sprintf("Imported population \"%s\" has a missing parent.", source_pop$name), call. = FALSE)
    }

    gate_refs <- lapply(source_pop$gate_refs, function(ref) {
      mapped_gate_id <- .gating_import_mapped_id(gate_id_map, ref$gate_id)
      if (is.null(mapped_gate_id)) {
        stop(sprintf("Imported population \"%s\" has a dangling gate reference.", source_pop$name), call. = FALSE)
      }
      ref$gate_id <- mapped_gate_id
      ref
    })
    source_pop$population_id <- target_id
    source_pop$parent_id <- parent_id
    source_pop$children <- character(0)
    source_pop$gate_refs <- gate_refs
    source_pop["event_count"] <- list(NULL)
    source_pop["percent_of_parent"] <- list(NULL)
    populations[[target_id]] <- source_pop
  }

  for (target_id in unname(population_id_map)) {
    parent_id <- populations[[target_id]]$parent_id
    if (is.null(parent_id) || is.null(populations[[parent_id]])) {
      stop(sprintf("Imported population \"%s\" has a missing parent.", populations[[target_id]]$name), call. = FALSE)
    }
    populations[[parent_id]]$children <- unique(c(populations[[parent_id]]$children, target_id))
  }
  populations <- sort_population_tree(populations, current_root)

  list(
    gates = gates,
    gate_order = gate_order,
    populations = populations,
    root_population_id = current_root,
    gate_id_map = gate_id_map,
    population_id_map = population_id_map
  )
}

has_gating_strategy <- function(graph) {
  gates <- graph$gates
  populations <- graph$populations
  root_id <- as.character(graph$root_population_id %||% "")
  length(gates) > 0L || any(setdiff(names(populations), root_id) != "")
}

#' Explain why merging would reinterpret gates already in the workspace
gating_merge_space_conflict <- function(has_existing_strategy,
                                        is_flow,
                                        current_compensation,
                                        imported_compensation_target = NULL,
                                        current_cytof_cofactor = 5,
                                        imported_cytof_cofactor = NULL) {
  if (!isTRUE(has_existing_strategy)) return(NULL)
  if (!is.null(imported_compensation_target) &&
      !identical(isTRUE(imported_compensation_target), isTRUE(current_compensation))) {
    return(paste(
      "Merge is unavailable because this import would change compensation and reinterpret",
      "the existing gates. Replace the current strategy instead."
    ))
  }
  imported_cofactor <- suppressWarnings(as.numeric(imported_cytof_cofactor %||% NA))
  current_cofactor <- suppressWarnings(as.numeric(current_cytof_cofactor %||% NA))
  if (!isTRUE(is_flow) && is.finite(imported_cofactor) && is.finite(current_cofactor) &&
      abs(imported_cofactor - current_cofactor) > 1e-12) {
    return(paste(
      "Merge is unavailable because this import uses a different CyTOF cofactor and would",
      "reinterpret the existing gates. Replace the current strategy instead."
    ))
  }
  NULL
}
