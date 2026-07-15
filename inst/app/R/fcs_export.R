# fcs_export.R — Export gated populations as FCS files using flowCore

#' Export a gated population as FCS file(s)
#'
#' Gates are evaluated in their stored workspace coordinate space. Current flow
#' workspaces store gates in linear coordinates; CyTOF and other workspaces use
#' display coordinates. The exported data matrix can independently be either the
#' transformed (exprs) or raw (counts) assay.
#'
#' @param sce        SingleCellExperiment object
#' @param population_id  ID of the population to export
#' @param populations    Population list (from rv$populations)
#' @param gates          Gates list (from rv$gates)
#' @param root_population_id  Root population ID
#' @param assay_name "exprs" (arcsinh-transformed) or "counts" (raw)
#' @param split_by_sample  If TRUE, one FCS per sample_id; otherwise one combined file
#' @param output_dir Directory to write FCS files into (default: tempdir())
#' @param filename_prefix Optional prefix prepended to written filenames.
#' @param filename_suffix Optional suffix appended before ".fcs".
#' @param precomputed_masks Optional named list of population masks returned by
#'   apply_gating_strategy(... )$masks to reuse across multiple exports.
#' @param gating_data Optional authoritative event-by-channel gating matrix from
#'   the live app session.
#' @param gate_value_space Optional explicit workspace gate value space.
#' @return Character vector of written file paths
export_population_as_fcs <- function(sce,
                                      population_id,
                                      populations,
                                      gates,
                                      root_population_id,
                                      assay_name    = "exprs",
                                      split_by_sample = TRUE,
                                      output_dir    = tempdir(),
                                      filename_prefix = "",
                                      filename_suffix = "",
                                      precomputed_masks = NULL,
                                      gating_data = NULL,
                                      gate_value_space = NULL) {

  if (!requireNamespace("flowCore", quietly = TRUE)) {
    stop("Package 'flowCore' is required.\n",
         "Install with: BiocManager::install('flowCore')")
  }

  available_assays <- SummarizedExperiment::assayNames(sce)

  # ── Resolve the coordinate space in which gates are stored ───────────────
  gate_assay <- if ("exprs" %in% available_assays) "exprs" else available_assays[1]
  gate_mat <- gating_matrix_for_sce(
    sce,
    assay_name = gate_assay,
    gate_value_space = gate_value_space,
    gating_data = gating_data
  )

  # ── Compute population mask ───────────────────────────────────────────────
  if (!is.null(precomputed_masks) && !is.null(precomputed_masks[[population_id]])) {
    pop_mask <- precomputed_masks[[population_id]]
    if (!is.logical(pop_mask) || length(pop_mask) != nrow(gate_mat)) {
      warning("Ignoring invalid precomputed mask for population '", population_id, "'.")
      pop_mask <- NULL
    }
  } else {
    pop_mask <- NULL
  }

  if (is.null(pop_mask) && (length(gates) == 0 || population_id == root_population_id)) {
    pop_mask <- rep(TRUE, nrow(gate_mat))
  } else if (is.null(pop_mask)) {
    result   <- apply_gating_strategy(gates, populations, root_population_id, gate_mat)
    pop_mask <- result$masks[[population_id]]
    if (is.null(pop_mask)) pop_mask <- rep(TRUE, nrow(gate_mat))
  }

  # ── Matrix to export (may differ from gating assay) ──────────────────────
  if (!assay_name %in% available_assays) {
    warning("Assay '", assay_name, "' not found; exporting '", gate_assay, "' instead.")
    assay_name <- gate_assay
  }
  export_mat <- t(SummarizedExperiment::assay(sce, assay_name))  # events × channels

  display_channel_names <- colnames(export_mat)
  channel_names <- display_channel_names
  channel_desc <- display_channel_names

  md <- S4Vectors::metadata(sce)
  channel_to_pnn <- md$channel_to_pnn
  if (!is.null(channel_to_pnn) && length(channel_to_pnn) > 0) {
    mapped <- vapply(display_channel_names, function(ch) {
      val <- channel_to_pnn[[ch]]
      if (is.null(val) || !nzchar(as.character(val))) ch else as.character(val)
    }, character(1))
    channel_names <- mapped
  } else {
    pnn_to_channel <- md$pnn_to_channel
    if (!is.null(pnn_to_channel) && length(pnn_to_channel) > 0) {
      inv <- setNames(names(pnn_to_channel), as.character(unlist(pnn_to_channel, use.names = FALSE)))
      inv <- inv[!duplicated(names(inv))]
      mapped <- vapply(display_channel_names, function(ch) {
        val <- inv[[ch]]
        if (is.null(val) || !nzchar(as.character(val))) ch else as.character(val)
      }, character(1))
      channel_names <- mapped
    }
  }

  # ── Sample IDs ───────────────────────────────────────────────────────────
  cd         <- SummarizedExperiment::colData(sce)
  sample_ids <- if ("sample_id" %in% colnames(cd)) {
    as.character(cd$sample_id)
  } else {
    rep("sample", ncol(sce))
  }

  # ── Population name for filenames ─────────────────────────────────────────
  pop      <- populations[[population_id]]
  pop_name <- if (!is.null(pop)) {
    gsub("[^A-Za-z0-9._-]", "_", pop$name)
  } else "population"

  if (!dir.exists(output_dir)) dir.create(output_dir, recursive = TRUE)
  safe_suffix <- trimws(as.character(filename_suffix %||% ""))
  safe_suffix <- gsub("[^A-Za-z0-9._-]", "_", safe_suffix)
  safe_suffix <- if (nchar(safe_suffix) > 0) paste0("_", safe_suffix) else ""

  written_files <- character(0)

  if (split_by_sample) {
    for (sid in unique(sample_ids)) {
      combined_mask <- pop_mask & (sample_ids == sid)
      if (sum(combined_mask) == 0L) next
      sub_mat <- export_mat[combined_mask, , drop = FALSE]
      ff      <- .matrix_to_flowframe(sub_mat, channel_names, channel_desc)
      fname   <- file.path(output_dir,
                  paste0(filename_prefix,
                    gsub("[^A-Za-z0-9._-]", "_", sid),
                    "_", pop_name, safe_suffix, ".fcs"))
      flowCore::write.FCS(ff, fname)
      written_files <- c(written_files, fname)
      message("Wrote ", nrow(sub_mat), " events → ", basename(fname))
    }
  } else {
    sub_mat <- export_mat[pop_mask, , drop = FALSE]
    ff      <- .matrix_to_flowframe(sub_mat, channel_names, channel_desc)
    fname   <- file.path(output_dir,
                         paste0(filename_prefix, pop_name, "_", assay_name, safe_suffix, ".fcs"))
    flowCore::write.FCS(ff, fname)
    written_files <- fname
    message("Wrote ", nrow(sub_mat), " events → ", basename(fname))
  }

  written_files
}


#' Build a minimal flowFrame from a numeric matrix (events × channels)
.matrix_to_flowframe <- function(mat, channel_names, channel_desc = NULL) {
  # Use single-precision (float32) storage: FCS 3.0 writes 32-bit floats anyway,
  # so converting here halves the working-memory footprint and avoids a second
  # type conversion inside flowCore::write.FCS().
  if (mode(mat) != "single") mode(mat) <- "single"
  colnames(mat) <- channel_names

  if (is.null(channel_desc) || length(channel_desc) != length(channel_names)) {
    channel_desc <- channel_names
  }

  # Compute column ranges in a single pass instead of two separate apply() calls.
  mat_rng  <- apply(mat, 2, range, na.rm = TRUE)  # 2 × n matrix

  n <- ncol(mat)
  params_df <- data.frame(
    name     = channel_names,
    desc     = channel_desc,
    range    = rep(2^18, n),
    minRange = mat_rng[1L, ],
    maxRange = mat_rng[2L, ],
    stringsAsFactors = FALSE,
    row.names = paste0("$P", seq_len(n))
  )
  varMeta <- data.frame(
    labelDescription = c("Name of Parameter",
                          "Description of Parameter",
                          "Range of Parameter",
                          "Minimum Parameter Value after Transformation",
                          "Maximum Parameter Value after Transformation"),
    row.names = c("name", "desc", "range", "minRange", "maxRange")
  )
  adf <- methods::new("AnnotatedDataFrame",
                      data        = params_df,
                      varMetadata = varMeta)
  flowCore::flowFrame(exprs = mat, parameters = adf)
}
