# workspace.R — Save/load gating workspace to/from SCE metadata

#' Save the gating workspace into SCE metadata
#' @return The modified SCE object
save_workspace <- function(sce, gates, gate_order, populations,
                           root_population_id,
                           gate_value_space = "display",
                           cytof_axis_range = list(),
                           global_scale_ranges = list(),
                           plot_range_override = NULL,
                           illust_pop_palette = list(),
                           illust_pop_selected = NULL,
                           illust_settings = NULL,
                           illust_presets = list(),
                           division_profiles = list(),
                           division_channel = NULL,
                           division_xrange = NULL,
                           division_bins = NULL,
                           division_subsample = NULL) {
  workspace <- list(
    gates = gates,
    gate_order = gate_order,
    populations = populations,
    root_population_id = root_population_id,
    gate_value_space = gate_value_space,
    cytof_axis_range = cytof_axis_range,
    global_scale_ranges = global_scale_ranges,
    plot_range_override = plot_range_override,
    illust_pop_palette = illust_pop_palette,
    illust_pop_selected = illust_pop_selected,
    illust_settings = illust_settings,
    illust_presets = illust_presets,
    division_profiles = division_profiles,
    division_channel = division_channel,
    division_xrange = division_xrange,
    division_bins = division_bins,
    division_subsample = division_subsample,
    version = 3L,
    saved_at = as.character(Sys.time())
  )
  S4Vectors::metadata(sce)$gating_workspace <- workspace
  sce
}

#' Load a gating workspace from SCE metadata
#' @return The workspace list, or NULL if none found
load_workspace <- function(sce) {
  ws <- S4Vectors::metadata(sce)$gating_workspace
  if (is.null(ws)) return(NULL)

  required <- c("gates", "populations", "root_population_id")
  if (!all(required %in% names(ws))) {
    warning("Workspace is missing required fields, ignoring.")
    return(NULL)
  }

  ws
}

#' Check whether an SCE has a saved workspace
has_workspace <- function(sce) {
  !is.null(S4Vectors::metadata(sce)$gating_workspace)
}

#' Validate workspace channels against current SCE
#' Returns list of invalid gate IDs (channels not found)
validate_workspace_channels <- function(workspace, channel_names) {
  invalid_gates <- character(0)
  for (gid in names(workspace$gates)) {
    gate <- workspace$gates[[gid]]
    if (!gate$x_channel %in% channel_names || !gate$y_channel %in% channel_names) {
      invalid_gates <- c(invalid_gates, gid)
    }
  }
  invalid_gates
}

#' Export a population as a colData column in the SCE
#' Applies the gating strategy to ALL cells, regardless of what was displayed
#' @return The modified SCE object
export_population_to_coldata <- function(sce, population_id, pop_name,
                                         gates, populations,
                                         root_population_id,
                                         assay_name = "exprs",
                                         col_name   = NULL,
                                         in_label   = "TRUE",
                                         out_label  = "FALSE") {
  # Extract full assay data
  assay_data <- t(SummarizedExperiment::assay(sce, assay_name))

  # Apply transform if needed
  if (assay_name == "counts") {
    assay_data <- asinh(assay_data / 5)
  }

  # Run full gating strategy
  result <- apply_gating_strategy(gates, populations, root_population_id,
                                  assay_data)
  pop_mask <- result$masks[[population_id]]

  if (is.null(pop_mask)) {
    stop("Population '", pop_name, "' not found in gating results.")
  }

  # Derive column name if not supplied
  if (is.null(col_name) || !nzchar(trimws(col_name))) {
    col_name <- gsub("[^A-Za-z0-9_]", "_", trimws(pop_name))
    col_name <- gsub("_+", "_", col_name)
    col_name <- sub("^_|_$", "", col_name)
    if (!nzchar(col_name)) col_name <- "population"
  }

  # Always reset the column first so repeated exports with the same name
  # never carry stale levels/assignments from a previous gating definition.
  SummarizedExperiment::colData(sce)[[col_name]] <- NULL
  SummarizedExperiment::colData(sce)[[col_name]] <- factor(
    pop_mask,
    levels = c(TRUE, FALSE),
    labels = c(in_label, out_label)
  )

  message("Exported population '", pop_name, "' as colData column '", col_name,
          "' (", in_label, " / ", out_label, ")")
  sce
}

# ── Division profiling helpers (pure; used by the Division tab) ────────────────

#' Seed N division-gate boundaries from a dye-channel value vector.
#'
#' Best-effort: finds the brightest (undivided) peak and the first valley to its
#' left, then lays down `n` evenly-spaced boundaries stepping down from there.
#' The Division tab lets the user drag each line afterwards, so this only needs
#' to be a reasonable starting point; falls back to even quantile spacing if the
#' peak/valley heuristics misfire. Returns a sorted-ascending numeric vector.
seed_division_boundaries <- function(values, n = 6) {
  values <- values[is.finite(values)]
  n <- as.integer(n)
  if (length(values) < 10L || n < 1L) return(numeric(0))
  rng <- stats::quantile(values, c(0.005, 0.995), names = FALSE)
  d <- tryCatch(stats::density(values, n = 512), error = function(e) NULL)
  peak_x <- if (!is.null(d)) {
    up <- d$x > stats::median(values)
    if (any(up)) d$x[up][which.max(d$y[up])] else rng[2]
  } else rng[2]
  first_valley <- NA_real_
  if (!is.null(d)) {
    mins <- which(diff(sign(diff(d$y))) > 0) + 1L     # local minima (slope - -> +)
    left <- mins[d$x[mins] < peak_x]
    if (length(left)) first_valley <- d$x[left[length(left)]]
  }
  if (!is.finite(first_valley)) first_valley <- peak_x - 0.12 * (rng[2] - rng[1])
  spacing <- (first_valley - rng[1]) / max(1L, n)
  if (!is.finite(spacing) || spacing <= 0) spacing <- (rng[2] - rng[1]) / (n + 2L)
  sort(first_valley - spacing * (seq_len(n) - 1L))
}

#' Assign each cell an integer division level from sorted boundaries.
#'
#' Div0 = brightest (above the top boundary). With N boundaries, levels run 0..N.
assign_division_levels <- function(expr, boundaries) {
  b <- sort(boundaries[is.finite(boundaries)])
  if (!length(b)) return(rep(0L, length(expr)))
  as.integer(length(b) - findInterval(expr, b))
}

#' Write a per-cell division-level vector as an ordered colData factor.
#'
#' Thin writer: the caller computes the integer level vector (0 = Div0 = brightest)
#' in DISPLAY space — see the Division tab — and passes it here. `NA` marks cells
#' in samples for which no boundaries were set. Levels are ordered
#' Div0 < Div1 < ... < Div`n_levels`. The column is reset first so repeated writes
#' never carry stale levels. Returns the modified SCE.
write_division_coldata <- function(sce, levels, n_levels, col_name = "div") {
  if (length(levels) != ncol(sce)) {
    stop("division level vector length (", length(levels),
         ") != number of cells (", ncol(sce), ").")
  }
  hi <- suppressWarnings(max(as.numeric(levels), na.rm = TRUE))
  if (!is.finite(hi)) hi <- 0
  n_levels <- max(as.integer(n_levels), as.integer(hi), 0L)
  labs <- paste0("Div", 0:n_levels)
  SummarizedExperiment::colData(sce)[[col_name]] <- NULL
  SummarizedExperiment::colData(sce)[[col_name]] <- factor(
    ifelse(is.na(levels), NA_character_, paste0("Div", levels)),
    levels = labs, ordered = TRUE
  )
  sce
}
