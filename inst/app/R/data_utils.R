# data_utils.R — SCE data extraction, downsampling, base64 encoding

#' Extract transposed assay data from SCE (events x channels matrix)
extract_assay_data <- function(sce, assay_name = "exprs") {
  if (!assay_name %in% SummarizedExperiment::assayNames(sce)) {
    stop("Assay '", assay_name, "' not found. Available: ",
         paste(SummarizedExperiment::assayNames(sce), collapse = ", "))
  }
  # as.matrix() forces dense — handles sparse (dgCMatrix) and DelayedArray backends
  as.matrix(t(SummarizedExperiment::assay(sce, assay_name)))
}

#' Resolve the event-by-channel matrix used to evaluate stored gates
#'
#' Flow gates drawn on the logicle display are stored in linear coordinates,
#' whereas CyTOF gates and gates drawn on other assays remain in display
#' coordinates. This helper is the single boundary between those storage
#' conventions and callers that evaluate a gating strategy.
#'
#' @param sce SingleCellExperiment containing the gated data.
#' @param assay_name Currently selected/displayed assay.
#' @param gate_value_space Optional explicit workspace value space ("raw" or
#'   "display"). When omitted, the saved workspace metadata is consulted.
#' @param gating_data Optional authoritative event-by-channel matrix from the
#'   live app session. This is used for flow sessions because it already reflects
#'   the current compensation state.
#' @return Dense numeric matrix with events in rows and channels in columns.
gating_matrix_for_sce <- function(sce, assay_name = "exprs",
                                  gate_value_space = NULL,
                                  gating_data = NULL) {
  n_events <- ncol(sce)
  channel_names <- rownames(sce)

  validate_matrix <- function(mat, source) {
    mat <- as.matrix(mat)
    if (nrow(mat) != n_events) {
      stop(source, " has ", nrow(mat), " events; expected ", n_events, ".")
    }
    if (is.null(colnames(mat)) && ncol(mat) == length(channel_names)) {
      colnames(mat) <- channel_names
    }
    if (is.null(colnames(mat)) || !setequal(colnames(mat), channel_names)) {
      stop(source, " channels do not match the SingleCellExperiment.")
    }
    mat[, channel_names, drop = FALSE]
  }

  if (!is.null(gating_data)) {
    return(validate_matrix(gating_data, "Live gating data"))
  }

  md <- S4Vectors::metadata(sce)
  if (is.null(gate_value_space)) {
    gate_value_space <- md$gating_workspace$gate_value_space
  }
  if (is.null(gate_value_space) || !gate_value_space %in% c("raw", "display")) {
    # Current flow/exprs workspaces store gates in the linear domain. Legacy or
    # non-flow workspaces without an explicit marker use their display assay.
    is_flow_exprs <- identical(md$instrument_type, "flow") &&
      identical(assay_name, "exprs") &&
      "counts" %in% SummarizedExperiment::assayNames(sce)
    gate_value_space <- if (is_flow_exprs) "raw" else "display"
  }

  if (identical(gate_value_space, "raw")) {
    if (!"counts" %in% SummarizedExperiment::assayNames(sce)) {
      stop("This workspace stores gates in raw coordinates, but the SCE has no 'counts' assay.")
    }
    mat <- extract_assay_data(sce, "counts")
    if (identical(md$instrument_type, "flow") && isTRUE(md$comp_on) &&
        !is.null(md$spillover_matrix)) {
      if (!exists("compensate_matrix", mode = "function")) {
        stop("Compensated flow gating requires compensate_matrix().")
      }
      mat <- compensate_matrix(mat, md$spillover_matrix)
    }
    return(validate_matrix(mat, "Raw gating assay"))
  }

  mat <- extract_assay_data(sce, assay_name)
  if (identical(assay_name, "counts")) mat <- asinh(mat / 5)
  validate_matrix(mat, "Display gating assay")
}

#' Get channel names from SCE
get_channel_names <- function(sce) {
  rownames(sce)
}

#' Get available assay names
get_assay_names <- function(sce) {
  SummarizedExperiment::assayNames(sce)
}

#' Get colData column names (for future subsetting)
get_coldata_names <- function(sce) {
  colnames(SummarizedExperiment::colData(sce))
}

#' Transform values for display
#' "exprs" assay is assumed pre-transformed (arcsinh); "counts" gets arcsinh(x/5)
transform_for_display <- function(values, assay_name) {
  if (assay_name == "counts") {
    return(asinh(values / 5))
  }
  values
}

#' Stride-based downsampling (deterministic, fast, order-preserving)
fast_downsample <- function(mat, max_events) {
  n <- nrow(mat)
  max_events_num <- suppressWarnings(as.numeric(max_events))
  if (!is.finite(max_events_num) || max_events_num <= 0 || n <= max_events_num) return(mat)
  idx <- round(seq(1, n, length.out = as.integer(max_events_num)))
  mat[idx, , drop = FALSE]
}

#' Downsample a logical mask
fast_downsample_mask <- function(mask, max_events) {
  n <- length(mask)
  max_events_num <- suppressWarnings(as.numeric(max_events))
  if (!is.finite(max_events_num) || max_events_num <= 0 || n <= max_events_num) return(mask)
  idx <- round(seq(1, n, length.out = as.integer(max_events_num)))
  mask[idx]
}

#' Encode numeric vector as base64 float32 (little-endian)
#' Matches the Python app's base64 encoding for D3 consumption
encode_float32_base64 <- function(x) {
  x <- as.numeric(x)  # ensure plain numeric vector
  raw_bytes <- writeBin(x, raw(), size = 4L, endian = "little")
  base64enc::base64encode(raw_bytes)
}

#' Compute axis range for a channel
compute_axis_range <- function(values) {
  if (length(values) == 0) return(c(0, 1))
  p_low <- as.numeric(quantile(values, 0.001, na.rm = TRUE))
  p_high <- as.numeric(quantile(values, 0.999, na.rm = TRUE))
  span <- p_high - p_low
  if (span < 1e-10) span <- 1
  padding <- span * 0.05
  c(p_low - padding, p_high + padding)
}

#' Build the full plot data list for D3
#' This is the R equivalent of main.py's update_plot_data() Tier 3
build_plot_data <- function(assay_data, x_channel, y_channel, assay_name,
                            gates, gate_order, selected_gate_id,
                            display_mode, active_pop_id, pop_mask,
                            gate_counts, max_events = 50000L,
                            reset_view = FALSE, gates_only = FALSE,
                            point_alpha = 0.35,
                            x_range_override = NULL,
                            y_range_override = NULL,
                            # Flow scatter-channel flags.  Set TRUE only for FSC/SSC in
                            # flow sessions; CyTOF must always leave these FALSE.
                            x_is_scatter_log = FALSE,
                            y_is_scatter_log = FALSE,
                            x_scatter_cofactor = 150,
                            y_scatter_cofactor = 150) {

  # Resolve the active-population row indices WITHOUT copying the full,
  # all-channel matrix. For a large SCE that copy (every channel × every event)
  # dominated plot-change time even though only two channels are plotted and the
  # result is immediately downsampled — so downsampling never helped. Instead we
  # downsample the row indices first, then pull only the two plotted channels at
  # only the sampled rows.
  if (!is.null(pop_mask)) {
    pop_idx <- which(pop_mask)
  } else {
    pop_idx <- seq_len(nrow(assay_data))
  }
  n_total <- length(pop_idx)

  max_events_num <- suppressWarnings(as.numeric(max_events))
  if (is.finite(max_events_num) && max_events_num > 0 && n_total > max_events_num) {
    draw_idx <- pop_idx[round(seq(1, n_total, length.out = as.integer(max_events_num)))]
  } else {
    draw_idx <- pop_idx
  }

  # assay_data is already in display coordinates (pre-transformed in server).
  # Gather only the sampled rows of the two plotted channels.
  x_vals <- assay_data[draw_idx, x_channel]
  y_vals <- assay_data[draw_idx, y_channel]

  # Prefer caller-supplied ranges (computed from the full dataset); otherwise
  # fall back to the sampled values. The gating path always supplies overrides,
  # so the fallback only matters for ad-hoc callers.
  x_range <- if (!is.null(x_range_override)) x_range_override else compute_axis_range(x_vals)
  y_range <- if (!is.null(y_range_override)) y_range_override else compute_axis_range(y_vals)

  # Base64 encode
  x_b64 <- encode_float32_base64(x_vals)
  y_b64 <- encode_float32_base64(y_vals)

  # Build gate overlay list
  gate_overlays <- build_gate_overlay_list(gates, gate_order, gate_counts)

  list(
    x_b64 = x_b64,
    y_b64 = y_b64,
    n_events = n_total,
    x_range = x_range,
    y_range = y_range,
    x_label = x_channel,
    y_label = y_channel,
    # x_is_log / y_is_log: TRUE only for flow FSC/SSC scatter channels.
    # Used by cytof_plot.js to select the scatter-tick formatter.
    # Must always be FALSE for CyTOF metal channels.
    x_is_log = isTRUE(x_is_scatter_log),
    y_is_log = isTRUE(y_is_scatter_log),
    x_scatter_cofactor = as.numeric(x_scatter_cofactor),
    y_scatter_cofactor = as.numeric(y_scatter_cofactor),
    x_is_logicle = FALSE,
    y_is_logicle = FALSE,
    gates = gate_overlays,
    selected_gate_id = selected_gate_id,
    display_mode = display_mode,
    contour_threshold = 5L,
    kde_bandwidth = 0,
    reset_view = reset_view,
    gates_only = gates_only,
    point_alpha = point_alpha
  )
}

#' Build gates-only update (fast path — no event data)
build_gates_only_data <- function(current_plot_data, gates, gate_order,
                                  gate_counts, selected_gate_id) {
  gate_overlays <- build_gate_overlay_list(gates, gate_order, gate_counts)
  current_plot_data$gates <- gate_overlays
  current_plot_data$selected_gate_id <- selected_gate_id
  current_plot_data$gates_only <- TRUE
  current_plot_data$reset_view <- FALSE
  current_plot_data
}

# ══════════════════════════════════════════════════════════════════════════════
# Phase 2: Multi-sample overlay support
# ══════════════════════════════════════════════════════════════════════════════

#' Default color palette for sample overlay (distinguishable colors)
SAMPLE_COLORS <- c(
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
  "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5"
)

#' Named palettes offered for the gating "Color by marker / metadata" overlay.
#' Keys are the selectInput values; the labels live in the UI.
OVERLAY_PALETTES <- c(
  "Paired (matches Division)" = "paired",
  "Tableau (default)"         = "default",
  "Viridis"                   = "viridis",
  "Plasma"                    = "plasma",
  "Cividis"                   = "cividis",
  "Inferno"                   = "inferno",
  "Set 2"                     = "set2",
  "Dark 3"                    = "dark3"
)

#' Generate k colours for a named overlay palette (gating tab colour-by).
#' "paired" matches the Division tab's Div0..DivN palette so colouring by `div`
#' lines up with the division histogram. Sequential palettes (viridis, …) come
#' from grDevices::hcl.colors so no extra package is needed.
overlay_color_palette <- function(name, k) {
  k <- max(1L, as.integer(k))
  if (is.null(name) || !nzchar(name)) name <- "paired"
  paired <- c("#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
              "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928")
  ramp <- function(base) if (k <= length(base)) base[seq_len(k)] else
    grDevices::colorRampPalette(base)(k)
  switch(name,
    paired  = ramp(paired),
    default = ramp(SAMPLE_COLORS),
    viridis = grDevices::hcl.colors(k, "Viridis"),
    plasma  = grDevices::hcl.colors(k, "Plasma"),
    cividis = grDevices::hcl.colors(k, "Cividis"),
    inferno = grDevices::hcl.colors(k, "Inferno"),
    set2    = grDevices::hcl.colors(k, "Set 2"),
    dark3   = grDevices::hcl.colors(k, "Dark 3"),
    ramp(paired)
  )
}

#' Get colData factor values for a given column
get_coldata_factor <- function(sce, coldata_name) {
  cd <- SummarizedExperiment::colData(sce)
  if (!coldata_name %in% colnames(cd)) return(NULL)
  vals <- cd[[coldata_name]]
  if (is.factor(vals)) levels(vals) else sort(unique(as.character(vals)))
}

#' Build plot data with per-point color indices for multi-sample overlay
#' color_indices: integer vector (0-based) mapping each event to a color
#' color_palette: character vector of hex colors
build_plot_data_overlay <- function(assay_data, x_channel, y_channel, assay_name,
                                    gates, gate_order, selected_gate_id,
                                    display_mode, active_pop_id, pop_mask,
                                    gate_counts, color_indices, color_palette,
                                    color_labels, max_events = 50000L,
                                    reset_view = FALSE, point_alpha = 0.45,
                                    x_range_override = NULL,
                                    y_range_override = NULL,
                                    x_is_scatter_log = FALSE,
                                    y_is_scatter_log = FALSE,
                                    x_scatter_cofactor = 150,
                                    y_scatter_cofactor = 150) {
  # Get event data for the active population
  if (!is.null(pop_mask)) {
    pop_data <- assay_data[pop_mask, , drop = FALSE]
    color_indices <- color_indices[pop_mask]
  } else {
    pop_data <- assay_data
  }

  # assay_data is already in display coordinates (pre-transformed in server)
  x_vals <- pop_data[, x_channel]
  y_vals <- pop_data[, y_channel]

  x_range <- if (!is.null(x_range_override)) x_range_override else compute_axis_range(x_vals)
  y_range <- if (!is.null(y_range_override)) y_range_override else compute_axis_range(y_vals)

  # Downsample
  n_total <- length(x_vals)
  max_events_num <- suppressWarnings(as.numeric(max_events))
  if (is.finite(max_events_num) && max_events_num > 0 && n_total > max_events_num) {
    idx <- round(seq(1, n_total, length.out = as.integer(max_events_num)))
    x_vals <- x_vals[idx]
    y_vals <- y_vals[idx]
    color_indices <- color_indices[idx]
  }

  x_b64 <- encode_float32_base64(x_vals)
  y_b64 <- encode_float32_base64(y_vals)

  # Encode color indices as base64 uint8 (0-255, one byte per point)
  color_b64 <- base64enc::base64encode(as.raw(color_indices))

  gate_overlays <- build_gate_overlay_list(gates, gate_order, gate_counts)

  list(
    x_b64 = x_b64,
    y_b64 = y_b64,
    n_events = n_total,
    x_range = x_range,
    y_range = y_range,
    x_label = x_channel,
    y_label = y_channel,
    x_is_log = isTRUE(x_is_scatter_log),
    y_is_log = isTRUE(y_is_scatter_log),
    x_scatter_cofactor = as.numeric(x_scatter_cofactor),
    y_scatter_cofactor = as.numeric(y_scatter_cofactor),
    x_is_logicle = FALSE,
    y_is_logicle = FALSE,
    gates = gate_overlays,
    selected_gate_id = selected_gate_id,
    display_mode = display_mode,
    contour_threshold = 5L,
    kde_bandwidth = 0,
    reset_view = reset_view,
    gates_only = FALSE,
    point_alpha = point_alpha,
    # Overlay-specific fields
    color_b64 = color_b64,
    color_palette = as.list(color_palette),
    color_labels = as.list(color_labels),
    overlay_mode = TRUE
  )
}

#' Compute per-subset gate statistics
#' Returns a data.frame with columns: subset_label, gate_name, event_count,
#'   percent_of_parent, total_in_subset
compute_subset_gate_stats <- function(gates, assay_data, subset_factor,
                                       selected_levels, pop_mask = NULL) {
  if (is.null(pop_mask)) pop_mask <- rep(TRUE, nrow(assay_data))

  results <- list()
  for (level in selected_levels) {
    subset_mask <- pop_mask & (subset_factor == level)
    parent_count <- sum(subset_mask)
    if (parent_count == 0) next

    subset_data <- assay_data[subset_mask, , drop = FALSE]
    for (gid in names(gates)) {
      gate <- gates[[gid]]
      mask <- get_gate_mask(gate, subset_data)
      n_in <- sum(mask)
      pct <- round(n_in / parent_count * 100, 2)
      results[[length(results) + 1L]] <- data.frame(
        subset = level,
        gate = gate$name,
        gate_id = gid,
        count = n_in,
        pct = pct,
        total = parent_count,
        stringsAsFactors = FALSE
      )
    }
  }

  if (length(results) == 0) return(data.frame())
  do.call(rbind, results)
}

#' Build gate overlay list for D3
build_gate_overlay_list <- function(gates, gate_order, gate_counts) {
  overlays <- list()
  # Use gate_order to maintain display order
  ordered_ids <- if (length(gate_order) > 0) gate_order else names(gates)
  for (gid in ordered_ids) {
    gate <- gates[[gid]]
    if (is.null(gate)) next
    counts <- gate_counts[[gid]]
    if (identical(gate$gate_type, "quadrant")) {
      q <- counts$quadrants
      overlays[[length(overlays) + 1L]] <- list(
        gate_id = gate$gate_id,
        name = gate$name,
        gate_type = "quadrant",
        x_channel = gate$x_channel,
        y_channel = gate$y_channel,
        center = as.numeric(gate$center),
        color = gate$color,
        label_offset = gate$label_offset,
        quadrant_counts = if (!is.null(q)) vapply(q, function(z) as.numeric(z$event_count %||% 0), numeric(1)) else NULL,
        quadrant_pcts   = if (!is.null(q)) vapply(q, function(z) as.numeric(z$percent_of_parent %||% 0), numeric(1)) else NULL
      )
    } else {
      overlays[[length(overlays) + 1L]] <- list(
        gate_id = gate$gate_id,
        name = gate$name,
        gate_type = gate$gate_type,
        x_channel = gate$x_channel,
        y_channel = gate$y_channel,
        vertices = gate$vertices,
        color = gate$color,
        label_offset = gate$label_offset,
        event_count = if (!is.null(counts)) counts$event_count else NULL,
        percent_of_parent = if (!is.null(counts)) counts$percent_of_parent else NULL
      )
    }
  }
  overlays
}
