# Binary dataset bridge for the shared GateLab TypeScript UI.
#
# The browser must not receive multi-million-event SCE assays as Shiny JSON.
# GateLabR instead supplies a compact JSON descriptor plus channel-major binary
# payloads that become Float32Array views in GateLab.

.gatelabr_dataset_contract_version <- 1L

.gatelabr_first_rowdata_field <- function(sce, candidates) {
  rd <- as.data.frame(SummarizedExperiment::rowData(sce))
  if (ncol(rd) == 0L) return(NULL)
  lowered <- tolower(colnames(rd))
  for (candidate in candidates) {
    hit <- match(tolower(candidate), lowered)
    if (!is.na(hit)) return(as.character(rd[[hit]]))
  }
  NULL
}

.gatelabr_channel_descriptors <- function(sce) {
  labels <- rownames(sce)
  if (is.null(labels)) labels <- rep("", nrow(sce))
  labels <- as.character(labels)
  missing_label <- is.na(labels) | !nzchar(labels)
  labels[missing_label] <- paste0("Channel ", which(missing_label))

  ids <- make.unique(labels, sep = "__")
  pnn <- .gatelabr_first_rowdata_field(
    sce,
    c("gatelabr_pnn", "pnn", "$pnn", "fcs_pnn", "channel_name", "channel")
  )
  pns <- .gatelabr_first_rowdata_field(
    sce,
    c("gatelabr_pns", "pns", "$pns", "fcs_pns", "marker", "desc", "description")
  )

  lapply(seq_along(ids), function(index) {
    channel <- list(id = ids[[index]], label = labels[[index]])
    if (!is.null(pnn) && length(pnn) >= index &&
        !is.na(pnn[[index]]) && nzchar(pnn[[index]])) {
      channel$pnn <- pnn[[index]]
    }
    if (!is.null(pns) && length(pns) >= index &&
        !is.na(pns[[index]]) && nzchar(pns[[index]])) {
      channel$pns <- pns[[index]]
    }
    channel
  })
}

.gatelabr_assay_role <- function(assay_name) {
  key <- tolower(as.character(assay_name))
  if (identical(key, "counts") || identical(key, "original")) return("counts")
  if (grepl("comp", key, fixed = TRUE)) return("compensated")
  if (key %in% c("exprs", "expression", "transformed")) return("transformed")
  "other"
}

.gatelabr_assay_revision <- function(sce, assay_name) {
  md <- S4Vectors::metadata(sce)
  revisions <- md$gatelabr_assay_revisions
  revision <- if (is.list(revisions)) revisions[[assay_name]] else NULL
  revision <- suppressWarnings(as.numeric(revision))
  if (length(revision) != 1L || !is.finite(revision) || revision < 0) 0 else revision
}

.gatelabr_host_scalar <- function(value) {
  if (length(value) == 0L || is.na(value[[1]])) return(NULL)
  value <- value[[1]]
  if (is.factor(value)) value <- as.character(value)
  if (inherits(value, c("Date", "POSIXt"))) value <- as.character(value)
  if (is.logical(value)) return(as.logical(value))
  if (is.numeric(value)) return(as.numeric(value))
  as.character(value)
}

.gatelabr_sample_partition <- function(sce, sample_column = NULL) {
  cd <- as.data.frame(SummarizedExperiment::colData(sce))
  candidates <- c("sample_id", "sample", "file_name", "filename", "fcs_file")

  if (!is.null(sample_column)) {
    if (length(sample_column) != 1L || !sample_column %in% colnames(cd)) {
      stop("sample_column must name a colData column.", call. = FALSE)
    }
  } else {
    sample_column <- candidates[candidates %in% colnames(cd)][1]
  }

  if (is.na(sample_column) || is.null(sample_column) || !nzchar(sample_column)) {
    sample_values <- rep("All Events", ncol(sce))
    sample_column <- NULL
  } else {
    sample_values <- as.character(cd[[sample_column]])
    sample_values[is.na(sample_values) | !nzchar(sample_values)] <- "(missing)"
  }

  levels <- unique(sample_values)
  samples <- lapply(seq_along(levels), function(level_index) {
    level <- levels[[level_index]]
    rows <- which(sample_values == level)
    metadata <- list()
    if (ncol(cd) > 0L) {
      for (field in colnames(cd)) {
        values <- cd[[field]][rows]
        comparable <- as.character(values)
        comparable <- comparable[!is.na(comparable)]
        if (length(comparable) == 0L || length(unique(comparable)) != 1L) next
        metadata[[field]] <- .gatelabr_host_scalar(values[which(!is.na(values))[1]])
      }
    }
    list(
      id = paste0("sample-", level_index - 1L),
      label = level,
      eventCount = length(rows),
      metadata = metadata,
      assayByteLength = as.double(nrow(sce)) * as.double(length(rows)) * 4,
      eventIndexEncoding = "uint32-le",
      eventIndexByteLength = as.double(length(rows)) * 4
    )
  })

  list(
    column = sample_column,
    levels = levels,
    event_indices = lapply(levels, function(level) which(sample_values == level)),
    samples = samples
  )
}

.gatelabr_sce_instrument <- function(sce) {
  instrument <- tolower(as.character(S4Vectors::metadata(sce)$instrument_type))
  if (length(instrument) == 1L && instrument %in% c("flow", "cytof")) {
    instrument
  } else {
    "unknown"
  }
}

.gatelabr_sce_dataset_descriptor <- function(
    sce,
    dataset_id = "gatelabr-sce",
    label = dataset_id,
    sample_column = NULL) {
  if (!methods::is(sce, "SingleCellExperiment")) {
    stop("sce must be a SingleCellExperiment.", call. = FALSE)
  }
  if (length(dataset_id) != 1L || is.na(dataset_id) || !nzchar(dataset_id)) {
    stop("dataset_id must be a non-empty string.", call. = FALSE)
  }

  assay_names <- SummarizedExperiment::assayNames(sce)
  if (length(assay_names) == 0L) {
    stop("The SCE has no assays.", call. = FALSE)
  }
  default_assay <- if ("exprs" %in% assay_names) "exprs" else assay_names[[1]]
  event_count <- ncol(sce)
  sample_partition <- .gatelabr_sample_partition(sce, sample_column)

  assays <- lapply(assay_names, function(assay_name) {
    list(
      id = assay_name,
      label = assay_name,
      role = .gatelabr_assay_role(assay_name),
      revision = .gatelabr_assay_revision(sce, assay_name),
      encoding = "channel-major-float32-le"
    )
  })

  list(
    contractVersion = .gatelabr_dataset_contract_version,
    id = dataset_id,
    label = as.character(label),
    instrument = .gatelabr_sce_instrument(sce),
    eventCount = event_count,
    channels = .gatelabr_channel_descriptors(sce),
    assays = assays,
    defaultAssayId = default_assay,
    samples = sample_partition$samples
  )
}

.gatelabr_write_assay_payload <- function(
    sce,
    assay_name,
    path,
    event_indices = seq_len(ncol(sce))) {
  assay_names <- SummarizedExperiment::assayNames(sce)
  if (length(assay_name) != 1L || !assay_name %in% assay_names) {
    stop("assay_name must identify an assay in the SCE.", call. = FALSE)
  }
  event_indices <- as.integer(event_indices)
  if (anyNA(event_indices) || any(event_indices < 1L | event_indices > ncol(sce))) {
    stop("event_indices must identify SCE columns.", call. = FALSE)
  }

  assay_data <- SummarizedExperiment::assay(sce, assay_name)
  connection <- file(path, open = "wb")
  on.exit(close(connection), add = TRUE)
  for (channel_index in seq_len(nrow(assay_data))) {
    writeBin(
      as.numeric(assay_data[channel_index, event_indices]),
      connection,
      size = 4L,
      endian = "little"
    )
  }
  close(connection)
  on.exit(NULL, add = FALSE)

  expected_size <- as.double(nrow(assay_data)) * as.double(length(event_indices)) * 4
  actual_size <- as.double(file.info(path)$size)
  if (!identical(actual_size, expected_size)) {
    stop(
      sprintf("Assay payload has %.0f bytes; expected %.0f.", actual_size, expected_size),
      call. = FALSE
    )
  }
  invisible(path)
}

.gatelabr_write_event_index_payload <- function(event_indices, path) {
  event_indices <- as.integer(event_indices)
  if (anyNA(event_indices) || any(event_indices < 1L)) {
    stop("event_indices must contain positive one-based SCE column indices.", call. = FALSE)
  }
  connection <- file(path, open = "wb")
  on.exit(close(connection), add = TRUE)
  writeBin(event_indices - 1L, connection, size = 4L, endian = "little")
  close(connection)
  on.exit(NULL, add = FALSE)

  expected_size <- as.double(length(event_indices)) * 4
  actual_size <- as.double(file.info(path)$size)
  if (!identical(actual_size, expected_size)) {
    stop(
      sprintf("Event-index payload has %.0f bytes; expected %.0f.", actual_size, expected_size),
      call. = FALSE
    )
  }
  invisible(path)
}
