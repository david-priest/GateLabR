# fcs_import.R — Import FCS files into SingleCellExperiment objects
#
# Autodetects CyTOF vs flow cytometry from channel names and applies the
# appropriate transforms per the cytof-gating Python app's transform.py:
#
#   CyTOF: arcsinh(x / 5) for metal channels only
#          Raw for Time, Event_length, Center, Offset, Width, Residual, etc.
#
#   Flow:  Logicle (biexponential) for fluorescence / signal channels
#          arcsinh(x / 150) for FSC/SSC scatter channels
#          Raw for QC/timing channels (Time, Event_length, Width, etc.)

# ---------------------------------------------------------------------------
# Channel classification helpers
# ---------------------------------------------------------------------------

#' QC / instrument channels that should NEVER be transformed (CyTOF or flow)
.is_qc_channel <- function(channel_names) {
  qc_exact <- c("Time", "Event_length", "Cell_length", "Center", "Offset",
                "Width", "Residual", "file_number", "Beads")
  in_exact   <- tolower(channel_names) %in% tolower(qc_exact)
  in_pattern <- grepl(
    "gaussian|amplitude|beaddist|^width$|^center$|^offset$|^residual$",
    channel_names, ignore.case = TRUE)
  in_exact | in_pattern
}

#' CyTOF metal channels: Di suffix OR element+mass-number pattern
.is_metal_channel <- function(channel_names) {
  non_metal_exact  <- c("Time", "Event_length", "Cell_length",
                        "Center", "Offset", "Width", "Residual",
                        "file_number", "Beads", "Dead", "Live", "Viability")
  non_metal_prefix <- c("^FSC", "^SSC", "^Viab", "^Scatter")

  is_non_metal <- tolower(channel_names) %in% tolower(non_metal_exact) |
    Reduce(`|`, lapply(non_metal_prefix,
                       function(p) grepl(p, channel_names, ignore.case = TRUE)))

  looks_metal <- grepl("Di$", channel_names, ignore.case = TRUE) |
    grepl("[0-9]{2,3}[A-Z][a-z]", channel_names) |
    grepl("[A-Z][a-z]?[0-9]{2,3}", channel_names)

  looks_metal & !is_non_metal
}

#' Flow scatter channels (FSC / SSC / LightLoss and variants)
.is_scatter_channel <- function(channel_names) {
  grepl(
    paste0("^FSC|^SSC",
           "|^FS[[:space:]\\-_]|^SS[[:space:]\\-_]",  # Beckman-Coulter: FS INT, SS LOG
           "|^FS$|^SS$",                                # bare FS / SS
           "|^LightLoss|^Extinction"),
    channel_names, ignore.case = TRUE
  ) & !.is_qc_channel(channel_names)
}

# ---------------------------------------------------------------------------
# Instrument-type autodetection
# ---------------------------------------------------------------------------

#' Autodetect CyTOF vs flow cytometry from channel names
#'
#' Heuristic (mirrors cytof-gating Python transform.py logic):
#'   - If >= 25% of channels (and >= 3) are metal channels  → "cytof"
#'   - If >= 2 FSC/SSC scatter channels present              → "flow"
#'   - Fallback: any metals → "cytof", otherwise → "flow"
#'
#' @param channel_names Character vector of channel names
#' @return "cytof" or "flow"
detect_instrument_type <- function(channel_names) {
  n_total   <- length(channel_names)
  n_metal   <- sum(.is_metal_channel(channel_names))
  n_scatter <- sum(.is_scatter_channel(channel_names))

  if (n_metal >= 3 && (n_metal / n_total) >= 0.25) return("cytof")
  if (n_scatter >= 2)                               return("flow")
  if (n_metal > 0)                                  return("cytof")
  return("flow")
}

# ---------------------------------------------------------------------------
# Main import function
# ---------------------------------------------------------------------------

#' Import one or more FCS files and return a SingleCellExperiment
#'
#' @param file_paths   Character vector of FCS file paths
#' @param sample_names Optional character vector of sample names (derived from
#'                     filenames if NULL)
#' @param cofactor     Arcsinh cofactor for CyTOF metal channels (default 5)
#' @return A SingleCellExperiment with assays "counts" (raw) and "exprs"
#'         (transformed). SCE metadata contains instrument_type, transform_type,
#'         experiment_info (for the sample-filter table), and cofactor.
import_fcs_files <- function(file_paths, sample_names = NULL, cofactor = 5) {

  if (!requireNamespace("flowCore", quietly = TRUE)) {
    stop("Package 'flowCore' is required.\n",
         "Install with: BiocManager::install('flowCore')")
  }

  if (length(file_paths) == 0) stop("No FCS file paths provided")

  if (is.null(sample_names)) {
    sample_names <- tools::file_path_sans_ext(basename(file_paths))
  }
  if (length(sample_names) != length(file_paths)) {
    stop("sample_names length must match file_paths length")
  }

  message("Importing ", length(file_paths), " FCS file(s) ...")

  all_counts     <- list()
  all_exprs      <- list()
  all_sample_ids <- character(0)
  channel_names  <- NULL
  instrument_type <- NULL

  for (i in seq_along(file_paths)) {

    ff      <- flowCore::read.FCS(file_paths[i], transformation = FALSE,
                                   truncate_max_range = FALSE)
    raw_mat <- flowCore::exprs(ff)

    # Resolve display names: prefer $PnS (desc), fall back to $PnN (name)
    params <- flowCore::parameters(ff)
    pdata  <- flowCore::pData(params)
    if ("desc" %in% colnames(pdata)) {
      desc          <- pdata$desc
      names_pn      <- pdata$name
      display_names <- ifelse(is.na(desc) | nchar(trimws(desc)) == 0,
                              names_pn, desc)
    } else {
      display_names <- pdata$name
    }
    colnames(raw_mat) <- display_names

    # Detect instrument type from the first file's channel names
    if (is.null(channel_names)) {
      channel_names   <- display_names
      instrument_type <- detect_instrument_type(channel_names)
      message("  Detected: ", instrument_type,
              " | metal channels: ", sum(.is_metal_channel(channel_names)),
              " | scatter channels: ", sum(.is_scatter_channel(channel_names)),
              " | QC channels: ", sum(.is_qc_channel(channel_names)))
    } else {
      # Check channel consistency across files
      if (!identical(sort(display_names), sort(channel_names))) {
        warning("File '", basename(file_paths[i]),
                "' has different channels; using common channels only.")
        common <- intersect(channel_names, display_names)
        if (length(common) == 0) stop("No common channels between files")
        channel_names <- common
      }
    }

    raw_mat   <- raw_mat[, channel_names, drop = FALSE]
    exprs_mat <- raw_mat  # will be overwritten per-channel below

    # ── Transform ──────────────────────────────────────────────────────────
    if (instrument_type == "cytof") {

      # Metal channels: arcsinh(x / cofactor)
      metal_mask <- .is_metal_channel(channel_names)
      if (any(metal_mask)) {
        exprs_mat[, metal_mask] <- asinh(raw_mat[, metal_mask] / cofactor)
        if (i == 1)
          message("  CyTOF: arcsinh/", cofactor, " on ",
                  sum(metal_mask), " metal channel(s); ",
                  sum(!metal_mask), " channel(s) left raw")
      } else {
        warning("No metal channels detected; arcsinh/", cofactor,
                " applied to all channels as fallback.")
        exprs_mat <- asinh(raw_mat / cofactor)
      }

    } else {
      # Flow cytometry — three channel classes
      qc_mask      <- .is_qc_channel(channel_names)
      scatter_mask <- .is_scatter_channel(channel_names) & !qc_mask
      signal_mask  <- !qc_mask & !scatter_mask

      # 1. Signal (fluorescence) channels → logicle via flowCore::estimateLogicle
      if (any(signal_mask)) {
        sig_chs <- channel_names[signal_mask]
        # estimateLogicle needs a flowFrame with the original $PnN column names,
        # not necessarily display names. Build a minimal one for the estimation.
        tmp_ff <- flowCore::flowFrame(exprs = raw_mat[, sig_chs, drop = FALSE])

        logicle_exprs <- tryCatch({
          trans  <- flowCore::estimateLogicle(tmp_ff, channels = sig_chs)
          tmp_ft <- flowCore::transform(tmp_ff, trans)
          flowCore::exprs(tmp_ft)[, sig_chs, drop = FALSE]
        }, error = function(e) {
          message("  logicle failed (", conditionMessage(e),
                  "); using arcsinh/150 fallback for signal channels")
          asinh(raw_mat[, sig_chs, drop = FALSE] / 150)
        })
        exprs_mat[, sig_chs] <- logicle_exprs
        if (i == 1)
          message("  Flow: logicle on ", sum(signal_mask), " signal channel(s)")
      }

      # 2. Scatter channels (FSC/SSC) → arcsinh(x / 150)
      if (any(scatter_mask)) {
        exprs_mat[, scatter_mask] <- asinh(raw_mat[, scatter_mask] / 150)
        if (i == 1)
          message("  Flow: arcsinh/150 on ", sum(scatter_mask),
                  " scatter channel(s): ",
                  paste(channel_names[scatter_mask], collapse = ", "))
      }

      # 3. QC/timing channels → left as raw
      if (any(qc_mask) && i == 1) {
        message("  Flow: ", sum(qc_mask), " QC channel(s) left raw: ",
                paste(channel_names[qc_mask], collapse = ", "))
      }
    }

    all_counts[[i]]  <- raw_mat
    all_exprs[[i]]   <- exprs_mat
    all_sample_ids   <- c(all_sample_ids,
                           rep(sample_names[i], nrow(raw_mat)))
  }

  # Concatenate all files
  counts_combined <- do.call(rbind, all_counts)
  exprs_combined  <- do.call(rbind, all_exprs)

  # Build SCE: channels × events
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(
      counts = t(counts_combined),
      exprs  = t(exprs_combined)
    )
  )

  # colData: sample_id as factor (enables "Color by colData" in the app)
  SummarizedExperiment::colData(sce)$sample_id <- factor(all_sample_ids)

  # experiment_info (used by build_sample_table() for the sample-filter DataTable)
  exp_info <- data.frame(
    sample_id = sample_names,
    n_cells   = vapply(all_counts, nrow, integer(1)),
    file_name = basename(file_paths),
    stringsAsFactors = FALSE
  )

  # Store provenance in SCE metadata
  S4Vectors::metadata(sce)$experiment_info <- exp_info
  S4Vectors::metadata(sce)$instrument_type <- instrument_type
  S4Vectors::metadata(sce)$transform_type  <-
    if (instrument_type == "cytof") "arcsinh" else "logicle"
  S4Vectors::metadata(sce)$cofactor <- cofactor

  message("Done: ", ncol(sce), " events, ", nrow(sce),
          " channels, ", length(sample_names), " sample(s) [", instrument_type, "]")
  sce
}

# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

#' Generate a clean R variable name from FCS filenames
make_sce_name <- function(file_paths) {
  base  <- tools::file_path_sans_ext(basename(file_paths[1]))
  clean <- gsub("[^A-Za-z0-9_]", "_", base)
  clean <- gsub("_+", "_", clean)
  clean <- sub("^_", "", clean)
  if (length(file_paths) > 1) clean <- paste0(clean, "_merged")
  paste0("sce_", clean)
}
