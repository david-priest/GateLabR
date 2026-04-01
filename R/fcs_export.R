# fcs_export.R — Export gated populations as FCS files using flowCore

#' Export a gated population as FCS file(s)
#'
#' Gates are always evaluated in the transformed ("exprs") space — the same
#' space in which they were drawn. The exported data matrix can be either the
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
#' @return Character vector of written file paths
export_population_as_fcs <- function(sce,
                                      population_id,
                                      populations,
                                      gates,
                                      root_population_id,
                                      assay_name    = "exprs",
                                      split_by_sample = TRUE,
                                      output_dir    = tempdir()) {

  if (!requireNamespace("flowCore", quietly = TRUE)) {
    stop("Package 'flowCore' is required.\n",
         "Install with: BiocManager::install('flowCore')")
  }

  available_assays <- SummarizedExperiment::assayNames(sce)

  # ── Gating is always done in transformed (exprs) space ───────────────────
  gate_assay <- if ("exprs" %in% available_assays) "exprs" else available_assays[1]
  gate_mat   <- t(SummarizedExperiment::assay(sce, gate_assay))   # events × channels

  # ── Compute population mask ───────────────────────────────────────────────
  if (length(gates) == 0 || population_id == root_population_id) {
    pop_mask <- rep(TRUE, nrow(gate_mat))
  } else {
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

  channel_names <- colnames(export_mat)

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

  written_files <- character(0)

  if (split_by_sample) {
    for (sid in unique(sample_ids)) {
      combined_mask <- pop_mask & (sample_ids == sid)
      if (sum(combined_mask) == 0L) next
      sub_mat <- export_mat[combined_mask, , drop = FALSE]
      ff      <- .matrix_to_flowframe(sub_mat, channel_names)
      fname   <- file.path(output_dir,
                           paste0(gsub("[^A-Za-z0-9._-]", "_", sid),
                                  "_", pop_name, ".fcs"))
      flowCore::write.FCS(ff, fname)
      written_files <- c(written_files, fname)
      message("Wrote ", nrow(sub_mat), " events → ", basename(fname))
    }
  } else {
    sub_mat <- export_mat[pop_mask, , drop = FALSE]
    ff      <- .matrix_to_flowframe(sub_mat, channel_names)
    fname   <- file.path(output_dir,
                         paste0(pop_name, "_", assay_name, ".fcs"))
    flowCore::write.FCS(ff, fname)
    written_files <- fname
    message("Wrote ", nrow(sub_mat), " events → ", basename(fname))
  }

  written_files
}


#' Build a minimal flowFrame from a numeric matrix (events × channels)
.matrix_to_flowframe <- function(mat, channel_names) {
  storage.mode(mat) <- "numeric"
  colnames(mat)     <- channel_names

  n <- ncol(mat)
  params_df <- data.frame(
    name     = channel_names,
    desc     = channel_names,
    range    = rep(2^18, n),
    minRange = apply(mat, 2, min, na.rm = TRUE),
    maxRange = apply(mat, 2, max, na.rm = TRUE),
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
