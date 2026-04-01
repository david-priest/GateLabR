# fcs_import.R — Import FCS files into SingleCellExperiment objects
#
# Uses CATALYST::prepData if available, otherwise builds SCE manually
# from flowCore::read.FCS / read.flowSet.

#' Identify CyTOF metal channels that should receive arcsinh transformation
#' Returns a logical vector, TRUE = metal channel to transform
.is_metal_channel <- function(channel_names) {
  # Known non-metal channels present in CyTOF FCS files
  non_metal_exact <- c("Time", "Event_length", "Cell_length",
                       "Center", "Offset", "Width", "Residual",
                       "file_number", "Beads", "Dead", "Live", "Viability")
  non_metal_prefix <- c("^FSC", "^SSC", "^Viab", "^Scatter")

  is_non_metal <- tolower(channel_names) %in% tolower(non_metal_exact) |
    Reduce(`|`, lapply(non_metal_prefix,
                       function(p) grepl(p, channel_names, ignore.case = TRUE)))

  # Metal channels: contain a metal element + mass number pattern
  # e.g. "Ir191Di", "Y89Di", "Eu153Di", "89Y", "153Eu"
  looks_metal <- grepl("Di$", channel_names, ignore.case = TRUE) |
    grepl("[0-9]{2,3}[A-Z][a-z]", channel_names) |
    grepl("[A-Z][a-z]?[0-9]{2,3}", channel_names)

  looks_metal & !is_non_metal
}

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

  # Apply arcsinh transform to metal channels only; leave Time, Event_length etc. as-is
  metal_mask <- .is_metal_channel(rownames(counts_mat))
  exprs_mat  <- counts_mat
  if (any(metal_mask)) {
    exprs_mat[metal_mask, ] <- asinh(counts_mat[metal_mask, ] / cofactor)
  }
  if (!any(metal_mask)) {
    # No metal channels detected — transform everything as fallback
    warning("No metal channels detected by name pattern; applying arcsinh to all channels.")
    exprs_mat <- asinh(counts_mat / cofactor)
  }

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
