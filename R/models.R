# models.R — Gate, population, and workspace data structure constructors

GATE_COLORS <- c("#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00",
                 "#a65628", "#f781bf", "#999999", "#e6ab02", "#66c2a5")

#' Get the next gate color from the palette
next_gate_color <- function(n_existing) {
  GATE_COLORS[((n_existing) %% length(GATE_COLORS)) + 1L]
}

#' Create a new gate definition
new_gate <- function(name, gate_type, x_channel, y_channel, vertices,
                     color = NULL, label_offset = c(0, 0)) {
  list(
    gate_id = uuid::UUIDgenerate(),
    name = name,
    gate_type = gate_type,
    x_channel = x_channel,
    y_channel = y_channel,
    vertices = vertices,
    color = color %||% GATE_COLORS[1],
    label_offset = as.numeric(label_offset)
  )
}

#' Create a new population node
#' @param gate_logic "and" (default) or "or" — how multiple gate_refs are combined
new_population <- function(name, gate_refs = list(), parent_id = NULL, gate_logic = "and") {
  list(
    population_id = uuid::UUIDgenerate(),
    name = name,
    gate_refs = gate_refs,
    gate_logic = gate_logic,
    parent_id = parent_id,
    children = character(0),
    event_count = NULL,
    percent_of_parent = NULL
  )
}

#' Create the root population
new_root_population <- function(event_count = NULL) {
  pop <- new_population("All Events")
  pop$event_count <- event_count
  pop$percent_of_parent <- 100.0
  pop
}

#' Create a new quadrant gate definition
#'
#' A quadrant gate divides a channel pair into four regions at a crosshair
#' centre. It carries `center = c(cx, cy)` instead of `vertices`; each of its
#' four quadrants becomes a population (gate_refs reference it with a `quadrant`
#' index 1-4). Quadrant numbering: 1 = x-/y+, 2 = x+/y+, 3 = x+/y-, 4 = x-/y-.
new_quadrant_gate <- function(name, x_channel, y_channel, center,
                              color = NULL, label_offset = c(0, 0)) {
  list(
    gate_id = uuid::UUIDgenerate(),
    name = name,
    gate_type = "quadrant",
    x_channel = x_channel,
    y_channel = y_channel,
    center = as.numeric(center),
    color = color %||% GATE_COLORS[1],
    label_offset = as.numeric(label_offset)
  )
}

#' Create a gate reference (for population boolean expressions)
#' @param quadrant For quadrant gates, which quadrant (1-4) this ref selects;
#'   NULL for ordinary polygon/rectangle gates.
new_gate_ref <- function(gate_id, include = TRUE, quadrant = NULL) {
  ref <- list(gate_id = gate_id, include = include)
  if (!is.null(quadrant)) ref$quadrant <- as.integer(quadrant)
  ref
}

#' Validate a gate definition
validate_gate <- function(gate) {
  if (is.null(gate$gate_id) || nchar(gate$gate_id) == 0) {
    stop("Gate must have a gate_id")
  }
  if (is.null(gate$name) || nchar(gate$name) == 0) {
    stop("Gate must have a name")
  }
  if (!gate$gate_type %in% c("polygon", "rectangle", "quadrant")) {
    stop("Gate type must be 'polygon', 'rectangle' or 'quadrant', got: ", gate$gate_type)
  }
  if (gate$gate_type == "polygon" && length(gate$vertices) < 3) {
    stop("Polygon gate must have at least 3 vertices")
  }
  if (gate$gate_type == "rectangle" && length(gate$vertices) < 2) {
    stop("Rectangle gate must have at least 2 vertices (corners)")
  }
  if (gate$gate_type == "quadrant" && length(gate$center) != 2) {
    stop("Quadrant gate must have a center of length 2")
  }
  TRUE
}

#' Add a child population to a parent
link_child_to_parent <- function(populations, child_id, parent_id) {
  populations[[parent_id]]$children <- unique(c(populations[[parent_id]]$children, child_id))
  populations[[child_id]]$parent_id <- parent_id
  populations
}

#' Sort all population children recursively by population name
#'
#' Keeps tree topology unchanged while ensuring deterministic display order.
sort_population_tree <- function(populations, root_population_id) {
  if (is.null(root_population_id) || is.null(populations[[root_population_id]])) {
    return(populations)
  }

  recurse_sort <- function(pop_id) {
    pop <- populations[[pop_id]]
    if (is.null(pop)) return()

    child_ids <- pop$children
    child_ids <- unique(child_ids)
    child_ids <- child_ids[child_ids %in% names(populations)]
    child_ids <- child_ids[child_ids != pop_id]

    if (length(child_ids) > 1) {
      child_names <- vapply(child_ids, function(cid) {
        nm <- populations[[cid]]$name
        if (is.null(nm) || !nzchar(nm)) cid else nm
      }, character(1))
      child_ids <- child_ids[order(tolower(child_names), child_ids)]
    }

    populations[[pop_id]]$children <<- child_ids
    for (cid in child_ids) recurse_sort(cid)
  }

  recurse_sort(root_population_id)
  populations
}

#' Remove a population and its entire subtree
remove_population_subtree <- function(populations, pop_id) {
  # Collect all IDs to remove via BFS
  to_remove <- character(0)
  queue <- pop_id
  while (length(queue) > 0) {
    current <- queue[1]
    queue <- queue[-1]
    to_remove <- c(to_remove, current)
    pop <- populations[[current]]
    if (!is.null(pop) && length(pop$children) > 0) {
      queue <- c(queue, pop$children)
    }
  }

  # Remove child reference from parent
  parent_id <- populations[[pop_id]]$parent_id
  if (!is.null(parent_id) && !is.null(populations[[parent_id]])) {
    populations[[parent_id]]$children <- setdiff(
      populations[[parent_id]]$children, pop_id
    )
  }

  # Remove all collected populations
  for (rid in to_remove) {
    populations[[rid]] <- NULL
  }

  populations
}

#' Remove one population but keep descendants by reparenting its direct children
#' to the deleted population's parent.
remove_population_reparent_children <- function(populations, pop_id) {
  pop <- populations[[pop_id]]
  if (is.null(pop)) return(populations)

  parent_id <- pop$parent_id
  child_ids <- unique(pop$children)
  child_ids <- child_ids[child_ids %in% names(populations)]
  child_ids <- child_ids[child_ids != pop_id]

  if (!is.null(parent_id) && !is.null(populations[[parent_id]])) {
    populations[[parent_id]]$children <- setdiff(populations[[parent_id]]$children, pop_id)
    populations[[parent_id]]$children <- unique(c(populations[[parent_id]]$children, child_ids))
    for (cid in child_ids) {
      if (!is.null(populations[[cid]])) populations[[cid]]$parent_id <- parent_id
    }
  } else {
    for (cid in child_ids) {
      if (!is.null(populations[[cid]])) populations[[cid]]$parent_id <- NULL
    }
  }

  populations[[pop_id]] <- NULL
  populations
}

#' Check for cycles when reparenting
would_create_cycle <- function(populations, pop_id, new_parent_id) {
  current <- new_parent_id
  while (!is.null(current)) {
    if (current == pop_id) return(TRUE)
    current <- populations[[current]]$parent_id
  }
  FALSE
}

# ══════════════════════════════════════════════════════════════════════════════
# Phase 2: Undo/Redo support
# ══════════════════════════════════════════════════════════════════════════════

MAX_UNDO <- 20L

#' Create a snapshot of the current gate/population state
snapshot_state <- function(gates, gate_order, populations, root_population_id) {
  list(
    gates = gates,
    gate_order = gate_order,
    populations = populations,
    root_population_id = root_population_id
  )
}

#' Push a snapshot onto the undo stack
push_undo <- function(undo_stack, snapshot) {
  undo_stack <- c(list(snapshot), undo_stack)
  if (length(undo_stack) > MAX_UNDO) {
    undo_stack <- undo_stack[seq_len(MAX_UNDO)]
  }
  undo_stack
}

#' Pop from undo stack, push current state to redo stack
undo_op <- function(undo_stack, redo_stack, current_snapshot) {
  if (length(undo_stack) == 0) return(NULL)
  prev <- undo_stack[[1]]
  undo_stack <- undo_stack[-1]
  redo_stack <- c(list(current_snapshot), redo_stack)
  list(state = prev, undo_stack = undo_stack, redo_stack = redo_stack)
}

#' Pop from redo stack, push current state to undo stack
redo_op <- function(undo_stack, redo_stack, current_snapshot) {
  if (length(redo_stack) == 0) return(NULL)
  next_state <- redo_stack[[1]]
  redo_stack <- redo_stack[-1]
  undo_stack <- c(list(current_snapshot), undo_stack)
  list(state = next_state, undo_stack = undo_stack, redo_stack = redo_stack)
}
