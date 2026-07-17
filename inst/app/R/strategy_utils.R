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
  max_events_int <- suppressWarnings(as.integer(max_events))
  use_all_events <- is.na(max_events_int) || !is.finite(max_events) || max_events_int <= 0L

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
    if (!use_all_events && length(parent_indices) > max_events_int) {
      sample_idx <- parent_indices[round(seq(1, length(parent_indices),
                                              length.out = max_events_int))]
    } else {
      sample_idx <- parent_indices
    }

    plot_data <- assay_data[sample_idx, , drop = FALSE]
    x_vals <- as.numeric(plot_data[, gate$x_channel])
    y_vals <- as.numeric(plot_data[, gate$y_channel])

    # Include gate vertices + label position in range so they are visible
    extra_x <- numeric(0)
    extra_y <- numeric(0)
    verts <- gate$vertices
    if (!is.null(verts) && length(verts) >= 2) {
      for (v in verts) {
        vx <- if (is.list(v)) as.numeric(v[[1]]) else as.numeric(v[1])
        vy <- if (is.list(v)) as.numeric(v[[2]]) else as.numeric(v[2])
        if (is.finite(vx)) extra_x <- c(extra_x, vx)
        if (is.finite(vy)) extra_y <- c(extra_y, vy)
      }
      # Label position = centroid + offset
      if (length(extra_x) > 0 && length(extra_y) > 0) {
        cx <- mean(extra_x); cy <- mean(extra_y)
        lo <- gate$label_offset
        if (!is.null(lo)) {
          ox <- if (is.list(lo)) as.numeric(lo[[1]] %||% 0) else as.numeric(lo[1])
          oy <- if (is.list(lo)) as.numeric(lo[[2]] %||% 0) else as.numeric(lo[2])
          if (is.finite(ox)) extra_x <- c(extra_x, cx + ox)
          if (is.finite(oy)) extra_y <- c(extra_y, cy + oy)
        }
      }
    }

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
      x_range = .expand_range_for_points(compute_axis_range(x_vals), extra_x),
      y_range = .expand_range_for_points(compute_axis_range(y_vals), extra_y),
      n_before = n_before,
      n_after = n_after,
      n_total = n_total,
      pct_pass = pct_pass,
      pct_total = if (n_total > 0) round(n_after / n_total * 100, 1) else 0,
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
  max_events_int <- suppressWarnings(as.integer(max_events))
  use_all_events <- is.na(max_events_int) || !is.finite(max_events) || max_events_int <= 0L
  valid_x_channels <- intersect(x_channels, colnames(assay_data))
  if (length(valid_x_channels) == 0) {
    return(list(plots = list(), gate_counts = list(), populations = list()))
  }

  # Compute gating strategy once for all populations
  result <- apply_gating_strategy(gates, populations, root_pop_id, assay_data)

  plots <- list()
  gate_counts_by_pop <- list()

  for (pop_id in pop_ids) {
    pop_mask <- result$masks[[pop_id]]
    if (is.null(pop_mask)) next

    pop_events <- assay_data[pop_mask, , drop = FALSE]
    n_pop <- nrow(pop_events)
    if (n_pop == 0) next

    if (!use_all_events && n_pop > max_events_int) {
      idx <- unique(as.integer(round(seq.int(1L, n_pop, length.out = max_events_int))))
      idx <- idx[idx >= 1L & idx <= n_pop]
      if (length(idx) == 0L) idx <- seq_len(n_pop)
    } else {
      idx <- seq_len(n_pop)
    }

    # Compute gate counts for this population
    gate_counts_by_pop[[pop_id]] <- compute_gate_counts(gates, pop_mask, assay_data)

    y_vals <- NULL
    if (plot_type == "biplot" && !is.null(y_channel) && y_channel %in% colnames(assay_data)) {
      y_vals <- as.numeric(pop_events[idx, y_channel])
    }

    for (x_ch in valid_x_channels) {
      x_vals <- as.numeric(pop_events[idx, x_ch])
      key <- paste0(pop_id, "|", x_ch)

      if (!is.null(y_vals)) {
        plots[[key]] <- list(
          x = x_vals,
          y = y_vals,
          x_range = NULL,
          y_range = NULL,
          n_events = n_pop,
          x_label = x_ch,
          y_label = y_channel
        )
      } else {
        # Histogram (x only)
        plots[[key]] <- list(
          x = x_vals,
          x_range = NULL,
          n_events = n_pop,
          x_label = x_ch,
          y_label = NULL
        )
      }
    }
  }

  list(plots = plots, gate_counts = gate_counts_by_pop, populations = result$populations)
}

#' Compute a population-by-channel expression heatmap.
#'
#' Summaries are calculated from every finite event in each selected population;
#' the Illustration preview event cap intentionally does not apply. `assay_data`
#' is the same display/transformed matrix used by the other Illustration plots.
#'
#' @param assay_data Matrix (events x channels), already in display coordinates.
#' @param gates List of gate objects.
#' @param populations Population hierarchy.
#' @param root_pop_id Root population ID.
#' @param pop_ids Ordered population IDs (heatmap rows).
#' @param channels Ordered channel names (heatmap columns).
#' @param summary_stat `"median"` (default) or `"mean"`.
#' @param scale_mode One of `"none"`, `"column_minmax"`,
#'   `"row_minmax"`, or `"column_zscore"`.
#' @param z_limit Symmetric clipping limit for column z-scores.
#' @return A list containing raw and scaled matrices plus row metadata.
compute_illustration_heatmap <- function(assay_data, gates, populations,
                                         root_pop_id, pop_ids, channels,
                                         summary_stat = "median",
                                         scale_mode = "column_minmax",
                                         z_limit = 2.5) {
  valid_channels <- intersect(as.character(channels), colnames(assay_data))
  valid_pop_ids <- intersect(as.character(pop_ids), names(populations))
  summary_stat <- match.arg(as.character(summary_stat), c("median", "mean"))
  scale_mode <- match.arg(as.character(scale_mode),
                          c("none", "column_minmax", "row_minmax", "column_zscore"))
  z_limit <- suppressWarnings(as.numeric(z_limit))
  if (!is.finite(z_limit) || z_limit <= 0) z_limit <- 2.5

  raw_values <- matrix(
    NA_real_, nrow = length(valid_pop_ids), ncol = length(valid_channels),
    dimnames = list(valid_pop_ids, valid_channels)
  )
  pop_counts <- setNames(integer(length(valid_pop_ids)), valid_pop_ids)
  pop_names <- setNames(character(length(valid_pop_ids)), valid_pop_ids)

  if (length(valid_pop_ids) == 0 || length(valid_channels) == 0 || nrow(assay_data) == 0) {
    return(list(
      raw_values = raw_values, values = raw_values,
      pop_ids = valid_pop_ids, pop_names = pop_names,
      pop_counts = pop_counts, channels = valid_channels,
      summary_stat = summary_stat, scale_mode = scale_mode,
      z_limit = z_limit, legend_min = NA_real_, legend_max = NA_real_
    ))
  }

  result <- apply_gating_strategy(gates, populations, root_pop_id, assay_data)
  summarize <- if (identical(summary_stat, "mean")) base::mean else stats::median

  for (i in seq_along(valid_pop_ids)) {
    pop_id <- valid_pop_ids[[i]]
    mask <- result$masks[[pop_id]]
    idx <- if (is.null(mask)) integer(0) else which(mask %in% TRUE)
    pop_counts[[pop_id]] <- length(idx)
    nm <- populations[[pop_id]]$name %||% pop_id
    pop_names[[pop_id]] <- if (is.na(nm) || !nzchar(as.character(nm))) pop_id else as.character(nm)
    if (length(idx) == 0) next

    for (j in seq_along(valid_channels)) {
      vals <- as.numeric(assay_data[idx, valid_channels[[j]]])
      vals <- vals[is.finite(vals)]
      if (length(vals)) raw_values[i, j] <- summarize(vals)
    }
  }

  scaled <- scale_illustration_heatmap(raw_values, scale_mode, z_limit)
  finite_scaled <- scaled[is.finite(scaled)]
  legend_range <- if (identical(scale_mode, "column_zscore")) {
    c(-z_limit, z_limit)
  } else if (scale_mode %in% c("column_minmax", "row_minmax")) {
    c(0, 1)
  } else if (length(finite_scaled)) {
    range(finite_scaled)
  } else {
    c(NA_real_, NA_real_)
  }
  if (all(is.finite(legend_range)) && legend_range[[1]] == legend_range[[2]]) {
    legend_range <- legend_range + c(-0.5, 0.5)
  }

  list(
    raw_values = raw_values,
    values = scaled,
    pop_ids = valid_pop_ids,
    pop_names = pop_names,
    pop_counts = pop_counts,
    channels = valid_channels,
    summary_stat = summary_stat,
    scale_mode = scale_mode,
    z_limit = z_limit,
    legend_min = legend_range[[1]],
    legend_max = legend_range[[2]]
  )
}

#' Scale a heatmap summary matrix while preserving missing values.
scale_illustration_heatmap <- function(values, scale_mode = "column_minmax", z_limit = 2.5) {
  scale_mode <- match.arg(as.character(scale_mode),
                          c("none", "column_minmax", "row_minmax", "column_zscore"))
  out <- values
  if (identical(scale_mode, "none") || length(values) == 0) return(out)

  minmax <- function(x) {
    finite <- is.finite(x)
    if (!any(finite)) return(x)
    limits <- range(x[finite])
    if (limits[[2]] <= limits[[1]]) {
      x[finite] <- 0.5
    } else {
      x[finite] <- (x[finite] - limits[[1]]) / (limits[[2]] - limits[[1]])
    }
    x
  }

  if (identical(scale_mode, "column_minmax")) {
    for (j in seq_len(ncol(out))) out[, j] <- minmax(out[, j])
  } else if (identical(scale_mode, "row_minmax")) {
    for (i in seq_len(nrow(out))) out[i, ] <- minmax(out[i, ])
  } else {
    z_limit <- suppressWarnings(as.numeric(z_limit))
    if (!is.finite(z_limit) || z_limit <= 0) z_limit <- 2.5
    for (j in seq_len(ncol(out))) {
      x <- out[, j]
      finite <- is.finite(x)
      n <- sum(finite)
      if (n == 0) next
      centre <- mean(x[finite])
      spread <- if (n > 1) stats::sd(x[finite]) else 0
      if (!is.finite(spread) || spread <= 0) {
        x[finite] <- 0
      } else {
        x[finite] <- pmax(-z_limit, pmin(z_limit, (x[finite] - centre) / spread))
      }
      out[, j] <- x
    }
  }
  out
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
    if (identical(gate$x_channel, x_channel) && identical(gate$y_channel, y_channel)) {
      # Exact match
    } else if (identical(gate$x_channel, y_channel) && identical(gate$y_channel, x_channel)) {
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
    pct_parent <- if (!is.null(counts)) counts$percent_of_parent else NULL

    overlays[[length(overlays) + 1L]] <- list(
      gate_id = gid,
      name = gate$name,
      percent_of_parent = pct_parent,
      gate_type = gate$gate_type,
      vertices = verts,
      color = gate$color,
      label_offset = gate$label_offset
    )
  }
  overlays
}

#' Expand a data range to ensure extra points (gate vertices, label positions)
#' are visible with a small padding margin.
.expand_range_for_points <- function(data_range, extra_pts) {
  if (length(extra_pts) == 0) return(data_range)
  extra_pts <- extra_pts[is.finite(extra_pts)]
  if (length(extra_pts) == 0) return(data_range)
  span <- data_range[2] - data_range[1]
  pad <- span * 0.03  # small margin so labels don't sit at the edge
  lo <- min(data_range[1], min(extra_pts) - pad)
  hi <- max(data_range[2], max(extra_pts) + pad)
  c(lo, hi)
}
