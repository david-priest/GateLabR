# Internal workspace validation shared by the React SCE host bridge.
#
# These functions deliberately live in the package namespace. The legacy Shiny
# application has equivalent helpers under inst/app/R, but installed package
# code must not depend on those files having been sourced into .GlobalEnv.

.gatelabr_workspace_error <- function(detail) {
  stop("Invalid GateLabR workspace: ", detail, call. = FALSE)
}

.gatelabr_workspace_coordinate_pairs_valid <- function(value, min_rows) {
  if (is.data.frame(value)) value <- as.matrix(value)
  if (is.matrix(value)) {
    return(
      ncol(value) == 2L &&
        nrow(value) >= min_rows &&
        is.numeric(value) &&
        all(is.finite(value))
    )
  }
  if (!is.list(value) || length(value) < min_rows) return(FALSE)
  all(vapply(value, function(pair) {
    is.numeric(pair) && length(pair) == 2L && all(is.finite(pair))
  }, logical(1)))
}

.gatelabr_normalize_workspace_graph <- function(workspace) {
  if (!is.list(workspace)) return(workspace)
  if (is.null(workspace$gate_order) && is.list(workspace$gates)) {
    workspace$gate_order <- names(workspace$gates)
    if (is.null(workspace$gate_order)) workspace$gate_order <- character(0)
  }
  workspace
}

.gatelabr_validate_workspace_graph <- function(workspace) {
  workspace <- .gatelabr_normalize_workspace_graph(workspace)
  if (!is.list(workspace)) {
    .gatelabr_workspace_error("the workspace payload is not a list.")
  }
  required <- c("gates", "gate_order", "populations", "root_population_id")
  missing_fields <- setdiff(required, names(workspace))
  if (length(missing_fields)) {
    .gatelabr_workspace_error(paste0(
      "missing required field(s): ",
      paste(missing_fields, collapse = ", "),
      "."
    ))
  }

  gates <- workspace$gates
  if (!is.list(gates)) {
    .gatelabr_workspace_error("gates must be a named list keyed by gate_id.")
  }
  gate_ids <- names(gates)
  if (is.null(gate_ids)) gate_ids <- character(0)
  if (length(gates) &&
      (length(gate_ids) != length(gates) ||
        any(!nzchar(gate_ids)) ||
        anyDuplicated(gate_ids))) {
    .gatelabr_workspace_error(
      "gates must have unique, non-empty list names."
    )
  }

  for (gate_id in gate_ids) {
    gate <- gates[[gate_id]]
    if (!is.list(gate)) {
      .gatelabr_workspace_error(sprintf("gate '%s' is not a list.", gate_id))
    }
    if (!is.character(gate$gate_id) ||
        length(gate$gate_id) != 1L ||
        !identical(gate$gate_id, gate_id)) {
      .gatelabr_workspace_error(sprintf(
        "gate map key '%s' does not match its gate_id.",
        gate_id
      ))
    }
    if (!is.character(gate$name) ||
        length(gate$name) != 1L ||
        !nzchar(trimws(gate$name))) {
      .gatelabr_workspace_error(sprintf(
        "gate '%s' has no name.",
        gate_id
      ))
    }
    if (!is.character(gate$x_channel) ||
        length(gate$x_channel) != 1L ||
        !nzchar(gate$x_channel) ||
        !is.character(gate$y_channel) ||
        length(gate$y_channel) != 1L ||
        !nzchar(gate$y_channel)) {
      .gatelabr_workspace_error(sprintf(
        "gate '%s' has invalid channel identifiers.",
        gate_id
      ))
    }
    if (!is.character(gate$gate_type) ||
        length(gate$gate_type) != 1L ||
        !gate$gate_type %in% c("polygon", "rectangle", "quadrant")) {
      .gatelabr_workspace_error(sprintf(
        "gate '%s' has an unsupported gate_type.",
        gate_id
      ))
    }
    if (identical(gate$gate_type, "polygon") &&
        !.gatelabr_workspace_coordinate_pairs_valid(gate$vertices, 3L)) {
      .gatelabr_workspace_error(sprintf(
        "polygon gate '%s' has invalid geometry.",
        gate_id
      ))
    }
    if (identical(gate$gate_type, "rectangle") &&
        !.gatelabr_workspace_coordinate_pairs_valid(gate$vertices, 2L)) {
      .gatelabr_workspace_error(sprintf(
        "rectangle gate '%s' has invalid geometry.",
        gate_id
      ))
    }
    if (identical(gate$gate_type, "quadrant") &&
        (!is.numeric(gate$center) ||
          length(gate$center) != 2L ||
          !all(is.finite(gate$center)))) {
      .gatelabr_workspace_error(sprintf(
        "quadrant gate '%s' has an invalid center.",
        gate_id
      ))
    }
  }

  gate_order <- workspace$gate_order
  if (!is.character(gate_order)) {
    .gatelabr_workspace_error(
      "gate_order must be a character vector of gate IDs."
    )
  }
  if (anyDuplicated(gate_order)) {
    .gatelabr_workspace_error("gate_order contains duplicate IDs.")
  }
  missing_order <- setdiff(gate_ids, gate_order)
  unknown_order <- setdiff(gate_order, gate_ids)
  if (length(missing_order) || length(unknown_order)) {
    detail <- c(
      if (length(missing_order)) {
        paste0("missing: ", paste(missing_order, collapse = ", "))
      },
      if (length(unknown_order)) {
        paste0("unknown: ", paste(unknown_order, collapse = ", "))
      }
    )
    .gatelabr_workspace_error(paste0(
      "gate_order does not match the gate list (",
      paste(detail, collapse = "; "),
      ")."
    ))
  }

  populations <- workspace$populations
  if (!is.list(populations) || length(populations) == 0L) {
    .gatelabr_workspace_error(
      "populations must be a non-empty named list."
    )
  }
  population_ids <- names(populations)
  if (is.null(population_ids) ||
      length(population_ids) != length(populations) ||
      any(!nzchar(population_ids)) ||
      anyDuplicated(population_ids)) {
    .gatelabr_workspace_error(
      "populations must have unique, non-empty list names."
    )
  }
  root_id <- workspace$root_population_id
  if (!is.character(root_id) ||
      length(root_id) != 1L ||
      !nzchar(root_id) ||
      !root_id %in% population_ids) {
    .gatelabr_workspace_error(
      "root_population_id is missing or does not identify a population."
    )
  }

  for (population_id in population_ids) {
    population <- populations[[population_id]]
    if (!is.list(population)) {
      .gatelabr_workspace_error(sprintf(
        "population '%s' is not a list.",
        population_id
      ))
    }
    if (!is.character(population$population_id) ||
        length(population$population_id) != 1L ||
        !identical(population$population_id, population_id)) {
      .gatelabr_workspace_error(sprintf(
        "population map key '%s' does not match its population_id.",
        population_id
      ))
    }
    if (!is.character(population$name) ||
        length(population$name) != 1L ||
        !nzchar(trimws(population$name))) {
      .gatelabr_workspace_error(sprintf(
        "population '%s' has no name.",
        population_id
      ))
    }
    if (!is.character(population$gate_logic) ||
        length(population$gate_logic) != 1L ||
        !population$gate_logic %in% c("and", "or")) {
      .gatelabr_workspace_error(sprintf(
        "population '%s' has invalid gate_logic.",
        population_id
      ))
    }
    if (!is.character(population$children)) {
      .gatelabr_workspace_error(sprintf(
        "population '%s' has invalid children.",
        population_id
      ))
    }
    if (anyDuplicated(population$children)) {
      .gatelabr_workspace_error(sprintf(
        "population '%s' lists a child more than once.",
        population_id
      ))
    }
    if (!is.list(population$gate_refs)) {
      .gatelabr_workspace_error(sprintf(
        "population '%s' has invalid gate_refs.",
        population_id
      ))
    }

    if (identical(population_id, root_id)) {
      if (!is.null(population$parent_id)) {
        .gatelabr_workspace_error(
          "the root population must have parent_id = NULL."
        )
      }
      if (length(population$gate_refs)) {
        .gatelabr_workspace_error(
          "the root population cannot contain gate references."
        )
      }
    } else {
      if (!is.character(population$parent_id) ||
          length(population$parent_id) != 1L ||
          !population$parent_id %in% population_ids) {
        .gatelabr_workspace_error(sprintf(
          "population '%s' has a missing parent.",
          population_id
        ))
      }
      if (identical(population$parent_id, population_id)) {
        .gatelabr_workspace_error(sprintf(
          "population '%s' cannot be its own parent.",
          population_id
        ))
      }
    }

    for (child_id in population$children) {
      if (!child_id %in% population_ids) {
        .gatelabr_workspace_error(sprintf(
          "population '%s' refers to missing child '%s'.",
          population_id,
          child_id
        ))
      }
      if (!identical(populations[[child_id]]$parent_id, population_id)) {
        .gatelabr_workspace_error(sprintf(
          "parent/child links disagree for population '%s'.",
          child_id
        ))
      }
    }

    for (gate_ref in population$gate_refs) {
      if (!is.list(gate_ref) ||
          !is.character(gate_ref$gate_id) ||
          length(gate_ref$gate_id) != 1L ||
          !gate_ref$gate_id %in% gate_ids) {
        .gatelabr_workspace_error(sprintf(
          "population '%s' has a dangling gate reference.",
          population_id
        ))
      }
      if (!is.logical(gate_ref$include) ||
          length(gate_ref$include) != 1L ||
          is.na(gate_ref$include)) {
        .gatelabr_workspace_error(sprintf(
          paste0(
            "population '%s' has a gate reference without a boolean ",
            "include value."
          ),
          population_id
        ))
      }
      gate <- gates[[gate_ref$gate_id]]
      if (identical(gate$gate_type, "quadrant")) {
        quadrant <- gate_ref$quadrant
        if (!is.numeric(quadrant) ||
            length(quadrant) != 1L ||
            !is.finite(quadrant) ||
            quadrant != as.integer(quadrant) ||
            !quadrant %in% 1:4) {
          .gatelabr_workspace_error(sprintf(
            "population '%s' has an invalid quadrant reference.",
            population_id
          ))
        }
      } else if (!is.null(gate_ref$quadrant)) {
        .gatelabr_workspace_error(sprintf(
          paste0(
            "population '%s' assigns a quadrant to a non-quadrant gate."
          ),
          population_id
        ))
      }
    }
  }

  for (population_id in setdiff(population_ids, root_id)) {
    parent_id <- populations[[population_id]]$parent_id
    if (!population_id %in% populations[[parent_id]]$children) {
      .gatelabr_workspace_error(sprintf(
        "population '%s' is absent from its parent's children list.",
        population_id
      ))
    }
  }

  for (population_id in population_ids) {
    seen <- character(0)
    current <- population_id
    while (!is.null(current)) {
      if (current %in% seen) {
        .gatelabr_workspace_error(sprintf(
          "population hierarchy contains a cycle at '%s'.",
          current
        ))
      }
      seen <- c(seen, current)
      current <- populations[[current]]$parent_id
    }
  }

  reached <- character(0)
  queue <- root_id
  while (length(queue)) {
    current <- queue[[1]]
    queue <- queue[-1]
    if (current %in% reached) next
    reached <- c(reached, current)
    queue <- c(queue, populations[[current]]$children)
  }
  unreachable <- setdiff(population_ids, reached)
  if (length(unreachable)) {
    .gatelabr_workspace_error(paste0(
      "population hierarchy contains unreachable nodes: ",
      paste(unreachable, collapse = ", "),
      "."
    ))
  }

  invisible(TRUE)
}

.gatelabr_validate_workspace_channels <- function(workspace, channel_ids) {
  invalid_gates <- character(0)
  for (gate_id in names(workspace$gates)) {
    gate <- workspace$gates[[gate_id]]
    if (!gate$x_channel %in% channel_ids ||
        !gate$y_channel %in% channel_ids) {
      invalid_gates <- c(invalid_gates, gate_id)
    }
  }
  invalid_gates
}
