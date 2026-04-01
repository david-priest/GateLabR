# fcs_import.R — Import FCS files into SingleCellExperiment objects
#
# Uses CATALYST::prepData if available, otherwise builds SCE manually
# from flowCore::read.FCS / read.flowSet.

#' Import one or more FCS files and return a SingleCellExperiment
#'
#' @param file_paths Character vector of FCS file paths
#' @param sample_names Optional character vector of sample names
#' @param cofactor Numeric cofactor for arcsinh transform (default 5)
#' @return A SingleCellExperiment with "counts" (raw) and "exprs" (transformed)
import_fcs_files <- function(file_paths, sample_names = NULL, cofactor = 5) {

  if (!requireNamespace("flowCore", quietly = TRUE)) {
    stop("Package 'flowCore' is required.\n",
         "Install with: BiocManager::install('flowCore')")
  }

  if (length(file_paths) == 0) stop("No FCS file paths provided")

  # Assign sample names from filenames if not provided
  if (is.null(sample_names)) {
    sample_names <- tools::file_path_sans_ext(basename(file_paths))
  }
  if (length(sample_names) != length(file_paths)) {
    stop("sample_names length must match file_paths length")
  }

  # ── Try CATALYST::prepData first (preferred) ──────────────────────────────
  if (requireNamespace("CATALYST", quietly = TRUE)) {
    message("Using CATALYST::prepData to build SCE from FCS files...")

    tryCatch({
      # Read into flowSet first; sampleNames become the join key for md
      fs <- flowCore::read.flowSet(file_paths, transformation = FALSE,
                                    truncate_max_range = FALSE)
      flowCore::sampleNames(fs) <- sample_names

      # md$file_name must match sampleNames(fs)
      md <- data.frame(
        file_name = sample_names,
        sample_id = sample_names,
        stringsAsFactors = FALSE
      )

      sce <- CATALYST::prepData(fs, md = md, transform = TRUE,
                                 cofactor = cofactor, FACS = FALSE)

      message("Created SCE via CATALYST: ", ncol(sce), " events, ",
              nrow(sce), " channels, ", length(unique(sce$sample_id)), " samples")
      return(sce)
    }, error = function(e) {
      warning("CATALYST::prepData failed: ", e$message,
              "\nFalling back to manual SCE construction.")
    })
  }

  # ── Fallback: manual SCE construction ──────────────────────────────────────
  message("Building SCE manually from flowCore...")

  all_exprs <- list()
  all_sample_ids <- character(0)
  channel_names <- NULL

  for (i in seq_along(file_paths)) {
    ff <- flowCore::read.FCS(file_paths[i], transformation = FALSE,
                              truncate_max_range = FALSE)
    expr_mat <- flowCore::exprs(ff)

    # Use description names ($PnS) if available, fall back to $PnN
    params <- flowCore::parameters(ff)
    pdata <- flowCore::pData(params)

    if ("desc" %in% colnames(pdata)) {
      desc <- pdata$desc
      names_pn <- pdata$name
      display_names <- ifelse(is.na(desc) | desc == "", names_pn, desc)
    } else {
      display_names <- pdata$name
    }
    colnames(expr_mat) <- display_names

    # Check channel consistency
    if (is.null(channel_names)) {
      channel_names <- display_names
    } else {
      if (!identical(sort(display_names), sort(channel_names))) {
        warning("File '", basename(file_paths[i]),
                "' has different channels. Keeping common channels only.")
        common <- intersect(channel_names, display_names)
        if (length(common) == 0) {
          stop("No common channels between files")
        }
        channel_names <- common
      }
    }

    all_exprs[[i]] <- expr_mat[, channel_names, drop = FALSE]
    all_sample_ids <- c(all_sample_ids, rep(sample_names[i], nrow(expr_mat)))
  }

  # Concatenate all events
  combined <- do.call(rbind, all_exprs)

  # Build SCE: channels = rows, events = columns
  counts_mat <- t(combined)  # channels × events

  # Apply arcsinh transform
  exprs_mat <- asinh(counts_mat / cofactor)

  # Create SCE
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(
      counts = counts_mat,
      exprs = exprs_mat
    )
  )

  # Add sample_id to colData
  SummarizedExperiment::colData(sce)$sample_id <- factor(all_sample_ids)

  # Store experiment_info in metadata (CATALYST convention)
  exp_info <- data.frame(
    sample_id = sample_names,
    n_cells = vapply(all_exprs, nrow, integer(1)),
    file_name = basename(file_paths),
    stringsAsFactors = FALSE
  )
  S4Vectors::metadata(sce)$experiment_info <- exp_info

  message("Created SCE manually: ", ncol(sce), " events, ",
          nrow(sce), " channels, ", length(sample_names), " samples")
  sce
}

#' Generate a clean R variable name from FCS filenames
make_sce_name <- function(file_paths) {
  base <- tools::file_path_sans_ext(basename(file_paths[1]))
  # Clean to valid R name
  clean <- gsub("[^A-Za-z0-9_]", "_", base)
  clean <- gsub("_+", "_", clean)
  clean <- sub("^_", "", clean)
  if (length(file_paths) > 1) {
    clean <- paste0(clean, "_merged")
  }
  paste0("sce_", clean)
}
