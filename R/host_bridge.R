# Binary dataset bridge for the shared GateLab TypeScript UI.
#
# The browser must not receive multi-million-event SCE assays as Shiny JSON.
# GateLabR instead supplies a compact JSON descriptor plus channel-major binary
# payloads that become Float32Array views in GateLab.

.gatelabr_dataset_contract_version <- 1L
.gatelabr_workspace_contract_version <- 1L
.gatelabr_coldata_contract_version <- 1L

.gatelabr_canonical_workspace_record <- function(sce) {
  canonical <- S4Vectors::metadata(sce)$gatelab_workspace
  if (is.null(canonical)) return(NULL)

  if (is.list(canonical) &&
      identical(canonical$format, "gatelab-sce-workspace") &&
      identical(as.integer(canonical$version), 1L) &&
      is.character(canonical$workspace_json) &&
      length(canonical$workspace_json) == 1L &&
      !is.na(canonical$workspace_json) &&
      nzchar(canonical$workspace_json)) {
    revision <- suppressWarnings(as.integer(canonical$revision))
    if (length(revision) != 1L || is.na(revision) || revision < 0L) revision <- 0L
    return(list(
      workspace_json = canonical$workspace_json,
      revision = revision
    ))
  }

  workspace_json <- if (is.character(canonical) &&
      length(canonical) == 1L && !is.na(canonical) && nzchar(canonical)) {
    canonical
  } else {
    jsonlite::toJSON(
      canonical,
      auto_unbox = TRUE,
      null = "null",
      na = "null",
      dataframe = "rows",
      matrix = "rowmajor",
      POSIXt = "ISO8601",
      digits = NA
    )
  }
  list(workspace_json = as.character(workspace_json), revision = 0L)
}

.gatelabr_host_workspace_envelope <- function(
    sce,
    dataset_id = "gatelabr-sce") {
  md <- S4Vectors::metadata(sce)
  canonical <- .gatelabr_canonical_workspace_record(sce)
  legacy <- md$gating_workspace

  if (!is.null(canonical)) {
    source_format <- "gatelab-workspace"
    workspace_json <- canonical$workspace_json
    revision <- canonical$revision
  } else if (!is.null(legacy)) {
    source_format <- "gatelabr-legacy"
    workspace <- tryCatch(
      {
        normalized <- .gatelabr_normalize_workspace_graph(legacy)
        .gatelabr_validate_workspace_graph(normalized)
        normalized
      },
      error = function(cause) {
        warning(
          conditionMessage(cause),
          "; loading the SCE data without its saved GateLabR workspace.",
          call. = FALSE
        )
        NULL
      }
    )
    revision <- 0L
  } else {
    return(NULL)
  }

  if (is.null(canonical)) {
    if (is.null(workspace)) return(NULL)
    workspace_json <- jsonlite::toJSON(
        workspace,
        auto_unbox = TRUE,
        null = "null",
        na = "null",
        dataframe = "rows",
        matrix = "rowmajor",
        POSIXt = "ISO8601",
        digits = NA
      )
  }

  list(
    contractVersion = .gatelabr_workspace_contract_version,
    datasetId = dataset_id,
    sourceFormat = source_format,
    revision = revision,
    workspaceJson = as.character(workspace_json)
  )
}

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

.gatelabr_assay_name_traits <- function(assay_name) {
  key <- tolower(trimws(as.character(assay_name)))
  normalized <- gsub("[^a-z0-9]+", "_", key)
  tokens <- strsplit(normalized, "_", fixed = TRUE)[[1]]
  tokens <- tokens[nzchar(tokens)]
  uncompensated <- any(tokens %in% c("uncomp", "uncompensated"))
  transformed <- any(tokens %in% c(
    "expr", "exprs", "expression", "transformed", "asinh", "logicle", "display"
  )) || grepl("exprs|expression", normalized)
  counts <- any(tokens %in% c("count", "counts", "raw")) ||
    normalized %in% c("original", "uncomp", "uncompensated")
  compensated <- !uncompensated && (
    any(tokens %in% c("comp", "compensated")) ||
      grepl("^comp(count|counts|expr|exprs|expression)$", normalized) ||
      grepl("^(count|counts|expr|exprs|expression)comp$", normalized)
  )
  list(
    key = key,
    counts = counts,
    transformed = transformed,
    compensated = compensated
  )
}

.gatelabr_assay_role <- function(assay_name, sce = NULL) {
  if (!is.null(sce)) {
    overrides <- S4Vectors::metadata(sce)$gatelabr_assay_roles
    override <- if (is.list(overrides)) overrides[[assay_name]] else NULL
    if (!is.null(override)) {
      if (length(override) != 1L || is.na(override) ||
          !override %in% c("counts", "transformed", "compensated", "other")) {
        stop("Assay role override for '", assay_name, "' is invalid.",
             call. = FALSE)
      }
      return(as.character(override))
    }
  }
  traits <- .gatelabr_assay_name_traits(assay_name)
  if (traits$compensated) return("compensated")
  if (traits$transformed) return("transformed")
  if (traits$counts) return("counts")
  "other"
}

.gatelabr_assay_coordinate_space <- function(sce, assay_name) {
  md <- S4Vectors::metadata(sce)
  overrides <- md$gatelabr_assay_coordinate_spaces
  override <- if (is.list(overrides)) overrides[[assay_name]] else NULL
  if (length(override) == 1L && !is.na(override) &&
      override %in% c("linear", "display")) {
    return(as.character(override))
  }
  traits <- .gatelabr_assay_name_traits(assay_name)
  if (traits$transformed) return("display")
  role <- .gatelabr_assay_role(assay_name, sce)
  if (role %in% c("counts", "compensated")) "linear" else "display"
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
  assay_spaces <- vapply(
    assay_names,
    function(assay_name) .gatelabr_assay_coordinate_space(sce, assay_name),
    character(1)
  )
  default_assay <- if ("counts" %in% assay_names) {
    "counts"
  } else if (any(assay_spaces == "linear")) {
    assay_names[[which(assay_spaces == "linear")[[1]]]]
  } else if ("exprs" %in% assay_names) {
    "exprs"
  } else {
    assay_names[[1]]
  }
  event_count <- ncol(sce)
  sample_partition <- .gatelabr_sample_partition(sce, sample_column)

  assays <- lapply(assay_names, function(assay_name) {
    list(
      id = assay_name,
      label = assay_name,
      role = .gatelabr_assay_role(assay_name, sce),
      coordinateSpace = .gatelabr_assay_coordinate_space(sce, assay_name),
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
    samples = sample_partition$samples,
    colDataColumns = colnames(SummarizedExperiment::colData(sce))
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

.gatelabr_binary_file_response <- function(path) {
  shiny::httpResponse(
    status = 200L,
    content_type = "application/octet-stream",
    content = list(file = path, owned = TRUE),
    headers = list(
      `Cache-Control` = "no-store",
      `X-Content-Type-Options` = "nosniff"
    )
  )
}

.gatelabr_register_assay_resource <- function(
    session,
    resource_name,
    sce,
    assay_name,
    event_indices) {
  session$registerDataObj(
    resource_name,
    data = list(
      sce = sce,
      assay_name = assay_name,
      event_indices = event_indices
    ),
    filterFunc = function(data, request) {
      if (!identical(request$REQUEST_METHOD, "GET")) {
        return(shiny::httpResponse(
          status = 405L,
          content_type = "text/plain",
          content = "Method not allowed",
          headers = list(Allow = "GET")
        ))
      }
      path <- tempfile(fileext = ".f32")
      tryCatch(
        {
          .gatelabr_write_assay_payload(
            data$sce,
            data$assay_name,
            path,
            data$event_indices
          )
          .gatelabr_binary_file_response(path)
        },
        error = function(cause) {
          if (file.exists(path)) unlink(path)
          shiny::httpResponse(
            status = 500L,
            content_type = "text/plain",
            content = conditionMessage(cause),
            headers = list(`Cache-Control` = "no-store")
          )
        }
      )
    }
  )
}

.gatelabr_register_event_index_resource <- function(
    session,
    resource_name,
    event_indices) {
  session$registerDataObj(
    resource_name,
    data = list(event_indices = event_indices),
    filterFunc = function(data, request) {
      if (!identical(request$REQUEST_METHOD, "GET")) {
        return(shiny::httpResponse(
          status = 405L,
          content_type = "text/plain",
          content = "Method not allowed",
          headers = list(Allow = "GET")
        ))
      }
      path <- tempfile(fileext = ".u32")
      tryCatch(
        {
          .gatelabr_write_event_index_payload(data$event_indices, path)
          .gatelabr_binary_file_response(path)
        },
        error = function(cause) {
          if (file.exists(path)) unlink(path)
          shiny::httpResponse(
            status = 500L,
            content_type = "text/plain",
            content = conditionMessage(cause),
            headers = list(`Cache-Control` = "no-store")
          )
        }
      )
    }
  )
}

.gatelabr_json_character_vector <- function(value, label) {
  if (is.null(value)) return(character(0))
  if (is.character(value)) return(as.character(value))
  if (is.list(value) &&
      all(vapply(value, function(entry) {
        is.character(entry) && length(entry) == 1L && !is.na(entry)
      }, logical(1)))) {
    return(vapply(value, as.character, character(1)))
  }
  stop("Invalid GateLab workspace: ", label, " must be a string array.", call. = FALSE)
}

.gatelabr_json_numeric_pair <- function(value, label) {
  pair <- suppressWarnings(as.numeric(unlist(value, use.names = FALSE)))
  if (length(pair) != 2L || any(!is.finite(pair))) {
    stop("Invalid GateLab workspace: ", label, " must contain two finite numbers.", call. = FALSE)
  }
  pair
}

.gatelabr_json_vertices <- function(value, gate_name) {
  if (!is.list(value)) {
    stop("Invalid GateLab workspace: gate '", gate_name, "' has invalid vertices.", call. = FALSE)
  }
  if (length(value) == 0L) return(matrix(numeric(0), ncol = 2L))
  vertices <- do.call(rbind, lapply(
    value,
    .gatelabr_json_numeric_pair,
    label = paste0("vertices for gate '", gate_name, "'")
  ))
  storage.mode(vertices) <- "double"
  vertices
}

.gatelabr_legacy_workspace_from_canonical <- function(parsed, sce) {
  gating <- parsed$gating
  if (!is.list(gating)) {
    stop("Invalid GateLab workspace: gating is missing.", call. = FALSE)
  }

  gates <- gating$gates
  if (!is.list(gates)) {
    stop("Invalid GateLab workspace: gates must be an object.", call. = FALSE)
  }
  gate_ids <- names(gates)
  if (length(gates) > 0L &&
      (is.null(gate_ids) || any(!nzchar(gate_ids)) || anyDuplicated(gate_ids))) {
    stop("Invalid GateLab workspace: gates must have unique object keys.", call. = FALSE)
  }
  normalized_gates <- lapply(seq_along(gates), function(index) {
    gate <- gates[[index]]
    gate_id <- gate_ids[[index]]
    if (!is.list(gate)) {
      stop("Invalid GateLab workspace: gate '", gate_id, "' is malformed.", call. = FALSE)
    }
    normalized <- list(
      gate_id = as.character(gate$gate_id),
      name = as.character(gate$name),
      gate_type = as.character(gate$gate_type),
      x_channel = as.character(gate$x_channel),
      y_channel = as.character(gate$y_channel),
      color = as.character(gate$color),
      label_offset = if (is.null(gate$label_offset)) NULL else
        .gatelabr_json_numeric_pair(
          gate$label_offset,
          paste0("label offset for gate '", gate_id, "'")
        )
    )
    if (identical(normalized$gate_type, "quadrant")) {
      normalized$center <- .gatelabr_json_numeric_pair(
        gate$center,
        paste0("centre for gate '", gate_id, "'")
      )
    } else {
      normalized$vertices <- .gatelabr_json_vertices(gate$vertices, gate_id)
    }
    normalized
  })
  names(normalized_gates) <- gate_ids

  populations <- gating$populations
  if (!is.list(populations) || length(populations) == 0L) {
    stop("Invalid GateLab workspace: populations must be a non-empty object.", call. = FALSE)
  }
  population_ids <- names(populations)
  if (is.null(population_ids) || any(!nzchar(population_ids)) ||
      anyDuplicated(population_ids)) {
    stop("Invalid GateLab workspace: populations must have unique object keys.", call. = FALSE)
  }
  normalized_populations <- lapply(seq_along(populations), function(index) {
    population <- populations[[index]]
    population_id <- population_ids[[index]]
    if (!is.list(population)) {
      stop(
        "Invalid GateLab workspace: population '", population_id, "' is malformed.",
        call. = FALSE
      )
    }
    refs <- population$gate_refs
    if (is.null(refs)) refs <- list()
    if (!is.list(refs)) {
      stop(
        "Invalid GateLab workspace: population '", population_id,
        "' has invalid gate references.",
        call. = FALSE
      )
    }
    normalized_refs <- lapply(refs, function(ref) {
      if (!is.list(ref)) {
        stop(
          "Invalid GateLab workspace: population '", population_id,
          "' has a malformed gate reference.",
          call. = FALSE
        )
      }
      result <- list(
        gate_id = as.character(ref$gate_id),
        include = as.logical(ref$include)
      )
      if (!is.null(ref$quadrant)) result$quadrant <- as.numeric(ref$quadrant)
      result
    })
    list(
      population_id = as.character(population$population_id),
      name = as.character(population$name),
      gate_refs = normalized_refs,
      gate_logic = as.character(population$gate_logic),
      parent_id = if (is.null(population$parent_id)) NULL else
        as.character(population$parent_id),
      children = .gatelabr_json_character_vector(
        population$children,
        paste0("children for population '", population_id, "'")
      ),
      event_count = if (is.null(population$event_count)) NULL else
        as.numeric(population$event_count),
      percent_of_parent = if (is.null(population$percent_of_parent)) NULL else
        as.numeric(population$percent_of_parent)
    )
  })
  names(normalized_populations) <- population_ids

  global_scales <- list()
  if (is.list(parsed$scales) && is.list(parsed$scales$globalScales)) {
    global_scales <- lapply(
      parsed$scales$globalScales,
      .gatelabr_json_numeric_pair,
      label = "global scale range"
    )
  }
  gate_value_space <- if (identical(.gatelabr_sce_instrument(sce), "flow")) {
    "raw"
  } else {
    "display"
  }
  workspace <- list(
    gates = normalized_gates,
    gate_order = .gatelabr_json_character_vector(gating$gate_order, "gate_order"),
    populations = normalized_populations,
    root_population_id = as.character(gating$root_population_id),
    active_population_id = if (is.null(gating$active_population_id)) NULL else
      as.character(gating$active_population_id),
    selected_gate_id = if (is.null(gating$selected_gate_id)) NULL else
      as.character(gating$selected_gate_id),
    gate_value_space = gate_value_space,
    global_scale_ranges = global_scales,
    version = 4L,
    saved_at = as.character(Sys.time())
  )
  .gatelabr_validate_workspace_graph(workspace)
  workspace
}

.gatelabr_validate_canonical_workspace_json <- function(
    sce,
    workspace_json,
    dataset_id,
    sample_column = NULL) {
  if (!is.character(workspace_json) || length(workspace_json) != 1L ||
      is.na(workspace_json) || !nzchar(workspace_json)) {
    stop("workspaceJson must be one non-empty JSON string.", call. = FALSE)
  }
  parsed <- tryCatch(
    jsonlite::fromJSON(workspace_json, simplifyVector = FALSE),
    error = function(cause) {
      stop("GateLab supplied unreadable workspace JSON: ", conditionMessage(cause), call. = FALSE)
    }
  )
  if (!is.list(parsed) || !identical(parsed$format, "gatelab-workspace")) {
    stop("GateLab supplied an unsupported workspace format.", call. = FALSE)
  }
  version <- suppressWarnings(as.integer(parsed$version))
  if (length(version) != 1L || is.na(version) ||
      !version %in% c(2L, 3L)) {
    stop(
      "GateLabR can store GateLab workspace versions 2 and 3 only.",
      call. = FALSE
    )
  }

  partition <- .gatelabr_sample_partition(sce, sample_column)
  expected_sample_ids <- paste0(
    dataset_id,
    ":",
    vapply(partition$samples, `[[`, character(1), "id")
  )
  samples <- parsed$samples
  if (!is.list(samples) || length(samples) != length(expected_sample_ids)) {
    stop("The workspace sample list no longer matches this SCE.", call. = FALSE)
  }
  actual_sample_ids <- vapply(samples, function(sample) {
    if (!is.list(sample) || !is.character(sample$sampleId) ||
        length(sample$sampleId) != 1L) return("")
    sample$sampleId
  }, character(1))
  if (!identical(actual_sample_ids, expected_sample_ids)) {
    stop("The workspace sample identities no longer match this SCE.", call. = FALSE)
  }
  if (identical(version, 3L)) {
    if (!is.list(parsed$compensation) ||
        !is.list(parsed$compensation$lineages)) {
      stop("The version 3 workspace has invalid compensation state.",
           call. = FALSE)
    }
    state <- .gatelabr_compensation_state(sce)
    for (sample_index in seq_along(samples)) {
      assay <- samples[[sample_index]]$assay
      if (!is.list(assay) ||
          !identical(assay$schema, "gatelab.sample-assay-binding.v1")) {
        stop("The version 3 workspace has an invalid sample assay binding.",
             call. = FALSE)
      }
      binding <- assay$compensatedLayer
      if (is.null(binding)) next
      if (!is.list(binding) || !is.character(binding$profileId) ||
          length(binding$profileId) != 1L) {
        stop("The version 3 workspace has an invalid compensated layer.",
             call. = FALSE)
      }
      sample_id <- substring(
        actual_sample_ids[[sample_index]],
        nchar(dataset_id) + 2L
      )
      application <- Filter(
        function(candidate) {
          identical(candidate$profile_id, binding$profileId) &&
            sample_id %in% candidate$target_sample_ids &&
            candidate$output_assay_id %in%
              SummarizedExperiment::assayNames(sce)
        },
        state$applications
      )
      if (length(application) != 1L) {
        stop(
          "The workspace refers to a compensated assay that is not current in this SCE.",
          call. = FALSE
        )
      }
      stored_profile <- jsonlite::fromJSON(
        application[[1]]$profile_json,
        simplifyVector = FALSE
      )
      if (!identical(stored_profile$profileHash, binding$profileHash)) {
        stop("The workspace compensation profile does not match the SCE assay.",
             call. = FALSE)
      }
    }
  }

  legacy <- .gatelabr_legacy_workspace_from_canonical(parsed, sce)
  channel_ids <- vapply(
    .gatelabr_channel_descriptors(sce),
    `[[`,
    character(1),
    "id"
  )
  invalid_gates <- .gatelabr_validate_workspace_channels(legacy, channel_ids)
  if (length(invalid_gates)) {
    stop(
      "The workspace refers to channels that are absent from this SCE: ",
      paste(invalid_gates, collapse = ", "),
      ".",
      call. = FALSE
    )
  }
  list(parsed = parsed, legacy = legacy, channel_ids = channel_ids)
}

.gatelabr_store_host_workspace <- function(
    sce,
    dataset_id,
    expected_revision,
    client_revision,
    reason,
    workspace_json,
    sample_column = NULL) {
  expected_revision <- suppressWarnings(as.integer(expected_revision))
  client_revision <- suppressWarnings(as.integer(client_revision))
  if (length(expected_revision) != 1L || is.na(expected_revision) ||
      expected_revision < 0L) {
    stop("expectedRevision must be a non-negative integer.", call. = FALSE)
  }
  if (length(client_revision) != 1L || is.na(client_revision) ||
      client_revision < 0L) {
    stop("clientRevision must be a non-negative integer.", call. = FALSE)
  }
  if (!identical(reason, "autosave") && !identical(reason, "explicit")) {
    stop("Workspace write reason must be 'autosave' or 'explicit'.", call. = FALSE)
  }
  current <- .gatelabr_canonical_workspace_record(sce)
  current_revision <- if (is.null(current)) 0L else current$revision
  if (!identical(expected_revision, current_revision)) {
    stop(
      "Workspace revision conflict: the browser expected revision ",
      expected_revision,
      " but the SCE is at revision ",
      current_revision,
      ". Reload GateLabR before saving again.",
      call. = FALSE
    )
  }

  validated <- .gatelabr_validate_canonical_workspace_json(
    sce,
    workspace_json,
    dataset_id = dataset_id,
    sample_column = sample_column
  )
  revision <- current_revision + 1L
  saved_at <- format(
    Sys.time(),
    "%Y-%m-%dT%H:%M:%OS3%z",
    tz = "UTC"
  )
  md <- S4Vectors::metadata(sce)
  md$gatelab_workspace <- list(
    format = "gatelab-sce-workspace",
    version = 1L,
    revision = revision,
    client_revision = client_revision,
    saved_at = saved_at,
    reason = reason,
    dataset_id = dataset_id,
    sample_column = sample_column,
    channel_ids = validated$channel_ids,
    event_count = ncol(sce),
    workspace_json = workspace_json
  )
  # Keep the established R/Shiny interface usable while the React migration is
  # in progress. The canonical JSON above remains authoritative.
  md$gating_workspace <- validated$legacy
  S4Vectors::metadata(sce) <- md
  list(
    sce = sce,
    result = list(
      revision = revision,
      clientRevision = client_revision,
      savedAt = saved_at
    )
  )
}

.gatelabr_decode_membership_bits <- function(encoded, event_count) {
  if (!is.character(encoded) || length(encoded) != 1L || is.na(encoded)) {
    stop("Population membership payload must be base64 text.", call. = FALSE)
  }
  event_count <- suppressWarnings(as.integer(event_count))
  if (length(event_count) != 1L || is.na(event_count) || event_count < 0L) {
    stop("Population membership eventCount must be non-negative.", call. = FALSE)
  }
  raw <- tryCatch(
    base64enc::base64decode(encoded),
    error = function(cause) {
      stop("Population membership payload is not valid base64.", call. = FALSE)
    }
  )
  expected_bytes <- as.integer(ceiling(event_count / 8))
  if (length(raw) != expected_bytes) {
    stop(
      "Population membership payload has ",
      length(raw),
      " bytes; expected ",
      expected_bytes,
      ".",
      call. = FALSE
    )
  }
  if (event_count == 0L) return(logical(0))
  as.logical(as.integer(rawToBits(raw)[seq_len(event_count)]))
}

.gatelabr_write_host_coldata <- function(
    sce,
    dataset_id,
    workspace_revision,
    columns,
    overwrite = FALSE,
    sample_column = NULL) {
  current <- .gatelabr_canonical_workspace_record(sce)
  current_revision <- if (is.null(current)) 0L else current$revision
  workspace_revision <- suppressWarnings(as.integer(workspace_revision))
  if (length(workspace_revision) != 1L || is.na(workspace_revision) ||
      !identical(workspace_revision, current_revision)) {
    stop(
      "Population memberships do not match the workspace revision stored in the SCE.",
      call. = FALSE
    )
  }
  if (!is.list(columns) || length(columns) == 0L) {
    stop("Select at least one population to export.", call. = FALSE)
  }
  overwrite <- isTRUE(overwrite)
  partition <- .gatelabr_sample_partition(sce, sample_column)
  expected_sample_ids <- vapply(partition$samples, `[[`, character(1), "id")
  existing_columns <- colnames(SummarizedExperiment::colData(sce))

  prepared <- lapply(columns, function(column) {
    if (!is.list(column)) stop("A colData export entry is malformed.", call. = FALSE)
    column_name <- as.character(column$columnName)
    population_id <- as.character(column$populationId)
    population_name <- as.character(column$populationName)
    in_label <- as.character(column$inLabel)
    out_label <- as.character(column$outLabel)
    scalar_values <- list(
      columnName = column_name,
      populationId = population_id,
      populationName = population_name,
      inLabel = in_label,
      outLabel = out_label
    )
    if (any(vapply(
      scalar_values,
      function(value) length(value) != 1L || is.na(value) || !nzchar(trimws(value)),
      logical(1)
    ))) {
      stop("Population export names and labels must be non-empty strings.", call. = FALSE)
    }
    if (identical(in_label, out_label)) {
      stop("Inside and outside labels must differ.", call. = FALSE)
    }
    if (column_name %in% existing_columns && !overwrite) {
      stop(
        "colData already contains '", column_name,
        "'. Enable overwrite or choose another name.",
        call. = FALSE
      )
    }

    sample_masks <- column$sampleMasks
    if (!is.list(sample_masks) || length(sample_masks) != length(expected_sample_ids)) {
      stop(
        "Population '", population_name,
        "' does not contain one membership mask per SCE sample.",
        call. = FALSE
      )
    }
    sample_ids <- vapply(sample_masks, function(mask) {
      if (!is.list(mask) || !is.character(mask$sampleId) ||
          length(mask$sampleId) != 1L) return("")
      mask$sampleId
    }, character(1))
    if (anyDuplicated(sample_ids) || !setequal(sample_ids, expected_sample_ids)) {
      stop(
        "Population '", population_name,
        "' has mismatched SCE sample identities.",
        call. = FALSE
      )
    }
    membership <- logical(ncol(sce))
    for (sample_index in seq_along(expected_sample_ids)) {
      sample_id <- expected_sample_ids[[sample_index]]
      mask <- sample_masks[[match(sample_id, sample_ids)]]
      expected_events <- length(partition$event_indices[[sample_index]])
      supplied_events <- suppressWarnings(as.integer(mask$eventCount))
      if (length(supplied_events) != 1L || is.na(supplied_events) ||
          supplied_events != expected_events) {
        stop(
          "Population '", population_name,
          "' has the wrong event count for sample '", sample_id, "'.",
          call. = FALSE
        )
      }
      membership[partition$event_indices[[sample_index]]] <-
        .gatelabr_decode_membership_bits(
          mask$membershipBitsBase64,
          expected_events
        )
    }
    list(
      column_name = column_name,
      population_id = population_id,
      membership = membership,
      in_label = in_label,
      out_label = out_label
    )
  })
  column_names <- vapply(prepared, `[[`, character(1), "column_name")
  if (anyDuplicated(column_names)) {
    stop("Each exported population needs a unique colData column name.", call. = FALSE)
  }

  cd <- SummarizedExperiment::colData(sce)
  for (entry in prepared) {
    cd[[entry$column_name]] <- factor(
      entry$membership,
      levels = c(TRUE, FALSE),
      labels = c(entry$in_label, entry$out_label)
    )
  }
  SummarizedExperiment::colData(sce) <- cd
  list(
    sce = sce,
    result = list(columns = lapply(prepared, function(entry) {
      list(
        columnName = entry$column_name,
        populationId = entry$population_id,
        memberCount = sum(entry$membership)
      )
    }))
  )
}

.gatelabr_handle_host_request <- function(
    sce,
    request,
    dataset_id,
    sample_column = NULL,
    session = NULL) {
  if (!is.list(request) || !is.character(request$operation) ||
      length(request$operation) != 1L || !is.list(request$payload)) {
    stop("GateLab supplied a malformed host request.", call. = FALSE)
  }
  payload <- request$payload
  if (!is.character(payload$datasetId) || length(payload$datasetId) != 1L ||
      !identical(payload$datasetId, dataset_id)) {
    stop("The host request targets a different SCE dataset.", call. = FALSE)
  }

  if (identical(request$operation, "write-workspace")) {
    return(.gatelabr_store_host_workspace(
      sce,
      dataset_id = dataset_id,
      expected_revision = payload$expectedRevision,
      client_revision = payload$clientRevision,
      reason = payload$reason,
      workspace_json = payload$workspaceJson,
      sample_column = sample_column
    ))
  }
  if (identical(request$operation, "write-coldata")) {
    contract_version <- suppressWarnings(as.integer(payload$contractVersion))
    if (length(contract_version) != 1L || is.na(contract_version) ||
        !identical(contract_version, .gatelabr_coldata_contract_version)) {
      stop("GateLab supplied an incompatible colData contract.", call. = FALSE)
    }
    return(.gatelabr_write_host_coldata(
      sce,
      dataset_id = dataset_id,
      workspace_revision = payload$workspaceRevision,
      columns = payload$columns,
      overwrite = payload$overwrite,
      sample_column = sample_column
    ))
  }
  if (identical(request$operation, "apply-compensation")) {
    contract_version <- suppressWarnings(as.integer(payload$contractVersion))
    if (length(contract_version) != 1L || is.na(contract_version) ||
        !identical(
          contract_version,
          .gatelabr_host_compensation_contract_version
        )) {
      stop("GateLab supplied an incompatible compensation contract.",
           call. = FALSE)
    }
    applied <- .gatelabr_apply_host_compensation(
      sce,
      dataset_id = dataset_id,
      profile_json = payload$profileJson,
      targets = payload$targets,
      worker_count = payload$workerCount,
      sample_column = sample_column
    )
    if (!is.null(session)) {
      applied$result$targets <- .gatelabr_register_host_compensation_targets(
        session,
        applied$sce,
        applied$result,
        dataset_id = dataset_id,
        sample_column = sample_column
      )
    }
    return(applied)
  }
  if (identical(request$operation, "adopt-compensated-assay")) {
    contract_version <- suppressWarnings(as.integer(payload$contractVersion))
    if (length(contract_version) != 1L || is.na(contract_version) ||
        !identical(
          contract_version,
          .gatelabr_host_compensation_contract_version
        )) {
      stop("GateLab supplied an incompatible compensation contract.",
           call. = FALSE)
    }
    adopted <- .gatelabr_adopt_host_compensation(
      sce,
      dataset_id = dataset_id,
      profile_json = payload$profileJson,
      output_assay_id = payload$outputAssayId,
      expected_output_assay_revision =
        payload$expectedOutputAssayRevision,
      targets = payload$targets,
      sample_column = sample_column
    )
    if (!is.null(session)) {
      adopted$result$targets <- .gatelabr_register_host_compensation_targets(
        session,
        adopted$sce,
        adopted$result,
        dataset_id = dataset_id,
        sample_column = sample_column
      )
    }
    return(adopted)
  }
  stop("Unsupported GateLab host operation '", request$operation, "'.", call. = FALSE)
}

# Register session-scoped, lazy binary resources and send the compact manifest
# consumed by createShinySceHost() in the canonical GateLab React bundle.
.gatelabr_register_host_manifest <- function(
    session,
    sce,
    dataset_id = "gatelabr-sce",
    label = dataset_id,
    sample_column = NULL,
    message_type = "gatelabr-host-manifest") {
  if (is.null(session) ||
      !is.function(session$registerDataObj) ||
      !is.function(session$sendCustomMessage)) {
    stop("session must provide registerDataObj() and sendCustomMessage().", call. = FALSE)
  }
  descriptor <- .gatelabr_sce_dataset_descriptor(
    sce,
    dataset_id = dataset_id,
    label = label,
    sample_column = sample_column
  )
  partition <- .gatelabr_sample_partition(sce, sample_column)
  assay_names <- SummarizedExperiment::assayNames(sce)

  resources <- lapply(seq_along(descriptor$samples), function(sample_index) {
    sample_descriptor <- descriptor$samples[[sample_index]]
    event_indices <- partition$event_indices[[sample_index]]
    prefix <- paste0(
      "gatelabr-",
      sample_index,
      "-",
      substr(gsub("[^A-Za-z0-9]", "", dataset_id), 1L, 24L)
    )
    assay_urls <- stats::setNames(
      lapply(seq_along(assay_names), function(assay_index) {
        .gatelabr_register_assay_resource(
          session,
          paste0(prefix, "-assay-", assay_index),
          sce,
          assay_names[[assay_index]],
          event_indices
        )
      }),
      assay_names
    )
    event_url <- .gatelabr_register_event_index_resource(
      session,
      paste0(prefix, "-events"),
      event_indices
    )
    list(
      datasetId = dataset_id,
      sampleId = sample_descriptor$id,
      eventIndexUrl = event_url,
      assayUrls = assay_urls
    )
  })

  manifest <- list(
    contractVersion = .gatelabr_dataset_contract_version,
    datasets = list(descriptor),
    resources = resources,
    workspace = .gatelabr_host_workspace_envelope(
      sce,
      dataset_id = dataset_id
    ),
    compensationApplications =
      .gatelabr_host_compensation_applications(sce, dataset_id)
  )
  session$sendCustomMessage(message_type, manifest)
  invisible(manifest)
}
