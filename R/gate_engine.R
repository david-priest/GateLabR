# gate_engine.R — Point-in-polygon, rectangle containment, gating strategy BFS

#' Compute boolean mask for a polygon gate
#' Uses sp::point.in.polygon (C-level, fast)
gate_mask_polygon <- function(x_vals, y_vals, vertices) {
  # vertices is a list of c(x, y) pairs
  vx <- vapply(vertices, `[[`, numeric(1), 1)
  vy <- vapply(vertices, `[[`, numeric(1), 2)
  pip <- sp::point.in.polygon(x_vals, y_vals, vx, vy)
  pip >= 1L  # 1 = inside, 2 = on edge, 0 = outside
}

#' Compute boolean mask for a rectangle gate
gate_mask_rectangle <- function(x_vals, y_vals, vertices) {
  xs <- vapply(vertices, `[[`, numeric(1), 1)
  ys <- vapply(vertices, `[[`, numeric(1), 2)
  x_vals >= min(xs) & x_vals <= max(xs) & y_vals >= min(ys) & y_vals <= max(ys)
}

#' Compute boolean mask for any gate type
#' @param gate Gate definition list
#' @param assay_data Matrix (events x channels), already transformed for display
#' @return Logical vector of length nrow(assay_data)
get_gate_mask <- function(gate, assay_data) {
  x_ch <- gate$x_channel
  y_ch <- gate$y_channel

  # Check channels exist

  if (!x_ch %in% colnames(assay_data) || !y_ch %in% colnames(assay_data)) {
    warning("Gate '", gate$name, "' references missing channel(s): ",
            x_ch, ", ", y_ch)
    return(rep(FALSE, nrow(assay_data)))
  }

  x <- assay_data[, x_ch]
  y <- assay_data[, y_ch]

  if (gate$gate_type == "polygon") {
    gate_mask_polygon(x, y, gate$vertices)
  } else if (gate$gate_type == "rectangle") {
    gate_mask_rectangle(x, y, gate$vertices)
  } else {
    warning("Unknown gate type: ", gate$gate_type)
    rep(FALSE, nrow(assay_data))
  }
}

#' Apply the full gating strategy via BFS traversal
#' Returns a named list: pop_id -> logical mask (indices into assay_data rows)
#'
#' This mirrors gate_engine.py::apply_gating_strategy()
apply_gating_strategy <- function(gates, populations, root_population_id,
                                  assay_data, gate_masks = NULL) {
  n_events <- nrow(assay_data)
  result <- list()

  # Resolve a gate's event mask, preferring a caller-supplied precomputed mask
  # (see get_cached_gate_masks in the server) and falling back to a fresh
  # computation. The fallback guarantees correctness whenever the cache is
  # absent, incomplete, or the wrong length, so caching can never desync results.
  .resolve_gate_mask <- function(gate_id, gate_def) {
    if (!is.null(gate_masks)) {
      m <- gate_masks[[gate_id]]
      if (!is.null(m) && length(m) == n_events) return(m)
    }
    get_gate_mask(gate_def, assay_data)
  }

  # Root gets all events
  root_mask <- rep(TRUE, n_events)
  result[[root_population_id]] <- root_mask

  # Update root population counts
  populations[[root_population_id]]$event_count <- n_events
  populations[[root_population_id]]$percent_of_parent <- 100.0

  # BFS traversal
  queue <- root_population_id
  while (length(queue) > 0) {
    pop_id <- queue[1]
    queue <- queue[-1]
    pop <- populations[[pop_id]]
    parent_mask <- result[[pop_id]]

    for (child_id in pop$children) {
      child <- populations[[child_id]]
      if (is.null(child)) next

      if (length(child$gate_refs) > 0) {
        gate_logic <- child$gate_logic %||% "and"

        if (identical(gate_logic, "or")) {
          # Boolean OR: union of all gate masks, then intersect with parent
          or_mask <- rep(FALSE, n_events)
          for (ref in child$gate_refs) {
            gate_def <- gates[[ref$gate_id]]
            if (is.null(gate_def)) next
            gate_mask <- .resolve_gate_mask(ref$gate_id, gate_def)
            or_mask <- or_mask | if (isTRUE(ref$include)) gate_mask else !gate_mask
          }
          child_mask <- parent_mask & or_mask
        } else {
          # Boolean AND (default): intersect each gate_ref against the running set
          child_mask <- parent_mask
          for (ref in child$gate_refs) {
            gate_def <- gates[[ref$gate_id]]
            if (is.null(gate_def)) next
            gate_mask <- .resolve_gate_mask(ref$gate_id, gate_def)
            if (isTRUE(ref$include)) {
              child_mask <- child_mask & gate_mask
            } else {
              child_mask <- child_mask & !gate_mask
            }
          }
        }
      } else {
        # No gate refs: inherit parent events
        child_mask <- parent_mask
      }

      result[[child_id]] <- child_mask

      # Update population counts
      child_count <- sum(child_mask)
      parent_count <- sum(parent_mask)
      populations[[child_id]]$event_count <- child_count
      populations[[child_id]]$percent_of_parent <-
        if (parent_count > 0) round(child_count / parent_count * 100, 2) else 0

      queue <- c(queue, child_id)
    }
  }

  list(masks = result, populations = populations)
}

#' Compute gate counts for all gates within the active population
#' Returns: named list gate_id -> list(event_count, percent_of_parent)
compute_gate_counts <- function(gates, pop_mask, assay_data) {
  if (is.null(pop_mask)) {
    pop_mask <- rep(TRUE, nrow(assay_data))
  }
  parent_count <- sum(pop_mask)

  # Subset assay_data to population events for efficiency
  pop_data <- assay_data[pop_mask, , drop = FALSE]

  counts <- list()
  for (gid in names(gates)) {
    gate <- gates[[gid]]
    mask <- get_gate_mask(gate, pop_data)
    n_in <- sum(mask)
    pct <- if (parent_count > 0) round(n_in / parent_count * 100, 2) else 0
    counts[[gid]] <- list(event_count = n_in, percent_of_parent = pct)
  }
  counts
}
