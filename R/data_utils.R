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
  if (n <= max_events) return(mat)
  idx <- round(seq(1, n, length.out = max_events))
  mat[idx, , drop = FALSE]
}

#' Downsample a logical mask
fast_downsample_mask <- function(mask, max_events) {
  n <- length(mask)
  if (n <= max_events) return(mask)
  idx <- round(seq(1, n, length.out = max_events))
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
                            y_range_override = NULL) {

  # Get event data for the active population
  if (!is.null(pop_mask)) {
    pop_data <- assay_data[pop_mask, , drop = FALSE]
  } else {
    pop_data <- assay_data
  }

  # assay_data is already in display coordinates (pre-transformed in server)
  x_vals <- pop_data[, x_channel]
  y_vals <- pop_data[, y_channel]

  # Use overridden ranges (from full dataset) or compute from pop data
  x_range <- if (!is.null(x_range_override)) x_range_override else compute_axis_range(x_vals)
  y_range <- if (!is.null(y_range_override)) y_range_override else compute_axis_range(y_vals)

  # Downsample for display
  n_total <- length(x_vals)
  if (n_total > max_events) {
    idx <- round(seq(1, n_total, length.out = max_events))
    x_vals <- x_vals[idx]
    y_vals <- y_vals[idx]
  }

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
    x_is_log = FALSE,
    y_is_log = FALSE,
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
                                    y_range_override = NULL) {
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
  if (n_total > max_events) {
    idx <- round(seq(1, n_total, length.out = max_events))
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
    x_is_log = FALSE,
    y_is_log = FALSE,
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
  overlays
}
