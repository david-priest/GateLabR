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
                           illust_presets = list()) {
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
    version = 2L,
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
                                         assay_name = "exprs") {
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

  # Add as factor column
  col_name <- make.names(pop_name)
  SummarizedExperiment::colData(sce)[[col_name]] <- factor(
    pop_mask,
    levels = c(TRUE, FALSE),
    labels = c("In", "Out")
  )

  message("Exported population '", pop_name, "' as colData column '", col_name, "'")
  sce
}
