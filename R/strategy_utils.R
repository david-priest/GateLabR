# strategy_utils.R — Gating strategy + illustration batch computation

#' Compute gating strategy steps for a population.
#' Returns a list of steps, each containing the parent events (before gate)
#' and the gate definition, ready for mini-plot rendering.
#'
#' @param gates List of gate objects
#' @param populations List of population objects
#' @param root_pop_id Root population ID
#' @param assay_data Matrix (events x channels), already in display coords
#' @param population_id Target population to trace
#' @param full_path If TRUE, trace from root; if FALSE, only this pop's gates
#' @param max_events Max events per plot
#' @return List of step lists
compute_gating_strategy <- function(gates, populations, root_pop_id,
                                     assay_data, population_id,
                                     full_path = FALSE, max_events = 10000L) {
  pop <- populations[[population_id]]
  if (is.null(pop)) return(list())

  if (full_path) {
    # Walk ancestry chain from root to this population
    ancestry <- character(0)
    current <- population_id
    while (!is.null(current) && current != root_pop_id) {
      ancestry <- c(current, ancestry)
      current <- populations[[current]]$parent_id
    }

    # Collect all gate refs in order (root → pop)
    all_refs <- list()
    for (anc_id in ancestry) {
      anc <- populations[[anc_id]]
      if (!is.null(anc$gate_refs) && length(anc$gate_refs) > 0) {
        for (ref in anc$gate_refs) {
          all_refs[[length(all_refs) + 1L]] <- list(
            ref = ref,
            pop_name = anc$name
          )
        }
      }
    }
  } else {
    # Just this population's gate refs
    all_refs <- list()
    if (!is.null(pop$gate_refs) && length(pop$gate_refs) > 0) {
      for (ref in pop$gate_refs) {
        all_refs[[length(all_refs) + 1L]] <- list(
          ref = ref,
          pop_name = pop$name
        )
      }
    }
  }

  if (length(all_refs) == 0) return(list())

  # Apply gates sequentially, collecting plot data at each step
  n_total <- nrow(assay_data)
  running_mask <- rep(TRUE, n_total)

  steps <- list()
  for (item in all_refs) {
    ref <- item$ref
    gate <- gates[[ref$gate_id]]
    if (is.null(gate)) next

    n_before <- sum(running_mask)
    if (n_before == 0) break

    # Compute gate mask on ALL events, then intersect with running mask
    gate_mask <- get_gate_mask(gate, assay_data)
    if (ref$include) {
      new_mask <- running_mask & gate_mask
    } else {
      new_mask <- running_mask & !gate_mask
    }
    n_after <- sum(new_mask)

    pct_pass <- if (n_before > 0) round(n_after / n_before * 100, 1) else 0

    # Downsample the PARENT events (before this gate) for plotting
    parent_indices <- which(running_mask)
    if (length(parent_indices) > max_events) {
      sample_idx <- parent_indices[round(seq(1, length(parent_indices),
                                              length.out = max_events))]
    } else {
      sample_idx <- parent_indices
    }

    plot_data <- assay_data[sample_idx, , drop = FALSE]
    x_vals <- as.numeric(plot_data[, gate$x_channel])
    y_vals <- as.numeric(plot_data[, gate$y_channel])

    steps[[length(steps) + 1L]] <- list(
      gate_id = gate$gate_id,
      gate_name = gate$name,
      x_channel = gate$x_channel,
      y_channel = gate$y_channel,
      vertices = gate$vertices,
      gate_type = gate$gate_type,
      color = gate$color,
      label_offset = gate$label_offset,
      include = ref$include,
      x = x_vals,
      y = y_vals,
      x_range = compute_axis_range(x_vals),
      y_range = compute_axis_range(y_vals),
      n_before = n_before,
      n_after = n_after,
      pct_pass = pct_pass,
      pop_name = item$pop_name
    )

    running_mask <- new_mask
  }

  steps
}

#' Compute illustration batch: events for each population × channel pair.
#' Returns list of plot configs keyed by "pop_id|x_channel".
compute_illustration_batch <- function(assay_data, gates, gate_order,
                                        populations, root_pop_id,
                                        pop_ids, x_channels,
                                        y_channel = NULL,
                                        plot_type = "biplot",
                                        max_events = 10000L) {
  # Compute gating strategy once for all populations
  result <- apply_gating_strategy(gates, populations, root_pop_id, assay_data)

  plots <- list()
  gate_counts_by_pop <- list()

  for (pop_id in pop_ids) {
    pop_mask <- result$masks[[pop_id]]
    if (is.null(pop_mask)) next

    pop_events <- assay_data[pop_mask, , drop = FALSE]
    n_pop <- nrow(pop_events)

    # Compute gate counts for this population
    gate_counts_by_pop[[pop_id]] <- compute_gate_counts(gates, pop_mask, assay_data)

    for (x_ch in x_channels) {
      if (!x_ch %in% colnames(assay_data)) next

      # Downsample
      if (n_pop > max_events) {
        idx <- round(seq(1, n_pop, length.out = max_events))
        plot_events <- pop_events[idx, , drop = FALSE]
      } else {
        plot_events <- pop_events
      }

      x_vals <- as.numeric(plot_events[, x_ch])
      key <- paste0(pop_id, "|", x_ch)

      if (plot_type == "biplot" && !is.null(y_channel) &&
          y_channel %in% colnames(assay_data)) {
        y_vals <- as.numeric(plot_events[, y_channel])
        plots[[key]] <- list(
          x = x_vals,
          y = y_vals,
          x_range = compute_axis_range(x_vals),
          y_range = compute_axis_range(y_vals),
          n_events = n_pop,
          x_label = x_ch,
          y_label = y_channel
        )
      } else {
        # Histogram (x only)
        plots[[key]] <- list(
          x = x_vals,
          x_range = compute_axis_range(x_vals),
          n_events = n_pop,
          x_label = x_ch,
          y_label = NULL
        )
      }
    }
  }

  list(plots = plots, gate_counts = gate_counts_by_pop, populations = result$populations)
}

#' Build a gate overlay list filtered for a specific channel pair
#' (only gates on matching x/y channels, including flipped)
build_gates_for_channels <- function(gates, gate_order, gate_counts,
                                      x_channel, y_channel) {
  overlays <- list()
  for (gid in gate_order) {
    gate <- gates[[gid]]
    if (is.null(gate)) next

    flipped <- FALSE
    if (gate$x_channel == x_channel && gate$y_channel == y_channel) {
      # Exact match
    } else if (gate$x_channel == y_channel && gate$y_channel == x_channel) {
      flipped <- TRUE
    } else {
      next
    }

    verts <- gate$vertices
    if (flipped) {
      # Swap x/y coordinates in vertices
      verts <- lapply(verts, function(v) list(v[[2]], v[[1]]))
    }

    counts <- gate_counts[[gid]]
    pct_text <- if (!is.null(counts)) {
      paste0(" ", counts$percent_of_parent, "%")
    } else ""

    overlays[[length(overlays) + 1L]] <- list(
      gate_id = gid,
      name = paste0(gate$name, pct_text),
      gate_type = gate$gate_type,
      vertices = verts,
      color = gate$color,
      label_offset = gate$label_offset
    )
  }
  overlays
}
