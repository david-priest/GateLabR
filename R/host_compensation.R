# Authoritative compensation persistence for the shared GateLab React host.
#
# Browser workers remain responsible for transient previews and coefficient
# sweeps. Only this host path may install a compensated assay in an SCE.

.gatelabr_host_compensation_contract_version <- 1L
.gatelabr_host_compensation_state_version <- 1L
.gatelabr_host_compensation_matrix_schema <-
  "gatelab.compensation-matrix.v1"
.gatelabr_host_compensation_matrix_orientation <-
  "source-rows-receiver-columns"
.gatelabr_host_compensation_profile_schema <-
  "gatelab.compensation-profile.v1"
.gatelabr_host_compensation_record_schema <-
  "gatelab.compensation-profile-record.v1"
.gatelabr_r_cytof_solver <- "r-nnls-v1"
.gatelabr_r_flow_solver <- "r-matrix-inverse-v1"
.gatelabr_r_adopted_solver <- "r-external-precomputed-v1"

.gatelabr_comp_json_array <- function(values) {
  unname(lapply(values, jsonlite::unbox))
}

.gatelabr_comp_sha256 <- function(value) {
  paste0(
    "sha256:",
    digest::digest(
      charToRaw(enc2utf8(as.character(value))),
      algo = "sha256",
      serialize = FALSE
    )
  )
}

.gatelabr_comp_float64_hex <- function(value) {
  value <- as.double(value)
  if (length(value) != 1L || !is.finite(value)) {
    stop("Compensation coefficients must be finite numbers.", call. = FALSE)
  }
  if (value == 0) value <- 0
  bytes <- writeBin(value, raw(), size = 8L, endian = "big")
  paste(sprintf("%02x", as.integer(bytes)), collapse = "")
}

.gatelabr_comp_channel <- function(value) {
  if (!is.character(value) || length(value) != 1L || is.na(value)) {
    return(NA_character_)
  }
  stringi::stri_trans_nfc(trimws(value))
}

.gatelabr_comp_compare_codepoints <- function(left, right) {
  left_points <- utf8ToInt(enc2utf8(left))
  right_points <- utf8ToInt(enc2utf8(right))
  shared <- min(length(left_points), length(right_points))
  if (shared > 0L) {
    difference <- left_points[seq_len(shared)] -
      right_points[seq_len(shared)]
    first <- which(difference != 0L)[1]
    if (!is.na(first)) return(sign(difference[[first]]))
  }
  sign(length(left_points) - length(right_points))
}

.gatelabr_comp_codepoint_order <- function(values) {
  indices <- seq_along(values)
  if (length(indices) < 2L) return(indices)
  for (position in 2:length(indices)) {
    candidate <- indices[[position]]
    cursor <- position - 1L
    while (cursor >= 1L &&
        .gatelabr_comp_compare_codepoints(
          values[[candidate]],
          values[[indices[[cursor]]]]
        ) < 0L) {
      indices[[cursor + 1L]] <- indices[[cursor]]
      cursor <- cursor - 1L
    }
    indices[[cursor + 1L]] <- candidate
  }
  indices
}

.gatelabr_comp_axis <- function(value, label) {
  if (!is.list(value) && !is.character(value)) {
    stop(label, " channels must be an array.", call. = FALSE)
  }
  values <- as.character(unlist(value, use.names = FALSE))
  values <- vapply(
    values,
    .gatelabr_comp_channel,
    character(1),
    USE.NAMES = FALSE
  )
  if (length(values) == 0L || anyNA(values) || any(!nzchar(values)) ||
      anyDuplicated(values)) {
    stop(label, " channels must be non-empty and unique.", call. = FALSE)
  }
  if (!identical(.gatelabr_comp_codepoint_order(values), seq_along(values))) {
    stop(label, " channels are not in canonical code-point order.", call. = FALSE)
  }
  values
}

.gatelabr_comp_matrix_record <- function(scientific) {
  record <- scientific$matrix
  if (!is.list(record) ||
      !identical(record$schema, .gatelabr_host_compensation_matrix_schema) ||
      !identical(
        record$orientation,
        .gatelabr_host_compensation_matrix_orientation
      )) {
    stop("The compensation matrix schema or orientation is invalid.",
         call. = FALSE)
  }
  sources <- .gatelabr_comp_axis(record$sourceChannels, "Source")
  receivers <- .gatelabr_comp_axis(record$receiverChannels, "Receiver")
  rows <- record$matrix
  if (!is.list(rows) || length(rows) != length(sources)) {
    stop("The compensation matrix row count is invalid.", call. = FALSE)
  }
  matrix <- do.call(rbind, lapply(rows, function(row) {
    values <- as.double(unlist(row, use.names = FALSE))
    if (length(values) != length(receivers) || any(!is.finite(values)) ||
        any(values < 0)) {
      stop("The compensation matrix contains an invalid row.", call. = FALSE)
    }
    values[values == 0] <- 0
    values
  }))
  dimnames(matrix) <- list(sources, receivers)
  diagonal <- match(sources, receivers)
  if (anyNA(diagonal) ||
      any(abs(matrix[cbind(seq_along(sources), diagonal)] - 1) > 1e-8)) {
    stop("Every compensation source requires a unit receiver diagonal.",
         call. = FALSE)
  }
  kind <- scientific$kind
  if (identical(kind, "cytof-spillover") && any(matrix > 1)) {
    stop("CyTOF spill coefficients must lie between zero and one.",
         call. = FALSE)
  }
  if (identical(kind, "flow-spillover") &&
      (nrow(matrix) != ncol(matrix) ||
       !setequal(sources, receivers))) {
    stop("Flow compensation requires matching square matrix axes.",
         call. = FALSE)
  }
  list(
    schema = record$schema,
    orientation = record$orientation,
    sourceChannels = sources,
    receiverChannels = receivers,
    matrix = matrix
  )
}

.gatelabr_comp_matrix_serialized <- function(record) {
  matrix_hex <- lapply(seq_len(nrow(record$matrix)), function(row) {
    .gatelabr_comp_json_array(vapply(
      record$matrix[row, ],
      .gatelabr_comp_float64_hex,
      character(1)
    ))
  })
  as.character(jsonlite::toJSON(
    list(
      schema = jsonlite::unbox(record$schema),
      orientation = jsonlite::unbox(record$orientation),
      sourceChannels =
        .gatelabr_comp_json_array(record$sourceChannels),
      receiverChannels =
        .gatelabr_comp_json_array(record$receiverChannels),
      matrixHex = matrix_hex
    ),
    auto_unbox = TRUE,
    digits = NA,
    null = "null",
    na = "null",
    pretty = FALSE
  ))
}

.gatelabr_comp_matrix_hash <- function(record) {
  .gatelabr_comp_sha256(.gatelabr_comp_matrix_serialized(record))
}

.gatelabr_comp_solver_settings <- function(scientific) {
  settings <- scientific$solverSettings
  if (!is.list(settings) || length(settings) == 0L) {
    stop("Compensation solver settings are missing.", call. = FALSE)
  }
  normalized <- lapply(settings, function(setting) {
    if (!is.list(setting) || !is.character(setting$key) ||
        length(setting$key) != 1L || is.null(setting$value)) {
      stop("A compensation solver setting is malformed.", call. = FALSE)
    }
    key <- .gatelabr_comp_channel(setting$key)
    value <- setting$value
    if (is.numeric(value)) {
      value <- as.double(value)
      if (length(value) != 1L || !is.finite(value)) {
        stop("A numerical solver setting is invalid.", call. = FALSE)
      }
      if (value == 0) value <- 0
    } else if (is.logical(value)) {
      if (length(value) != 1L || is.na(value)) {
        stop("A logical solver setting is invalid.", call. = FALSE)
      }
    } else if (is.character(value)) {
      value <- .gatelabr_comp_channel(value)
    } else {
      stop("A solver setting has an unsupported value.", call. = FALSE)
    }
    list(key = key, value = value)
  })
  keys <- vapply(normalized, `[[`, character(1), "key")
  if (anyNA(keys) || any(!nzchar(keys)) || anyDuplicated(keys) ||
      !identical(.gatelabr_comp_codepoint_order(keys), seq_along(keys))) {
    stop("Compensation solver setting keys are not canonical.",
         call. = FALSE)
  }
  normalized
}

.gatelabr_comp_profile_hash <- function(scientific, matrix_hash) {
  settings <- .gatelabr_comp_solver_settings(scientific)
  serialized_settings <- lapply(settings, function(setting) {
    value <- setting$value
    if (is.numeric(value)) {
      list(
        jsonlite::unbox(setting$key),
        jsonlite::unbox("number"),
        jsonlite::unbox(.gatelabr_comp_float64_hex(value))
      )
    } else if (is.logical(value)) {
      list(
        jsonlite::unbox(setting$key),
        jsonlite::unbox("boolean"),
        jsonlite::unbox(value)
      )
    } else {
      list(
        jsonlite::unbox(setting$key),
        jsonlite::unbox("string"),
        jsonlite::unbox(value)
      )
    }
  })
  included <- if (identical(scientific$kind, "cytof-spillover")) {
    .gatelabr_comp_axis(scientific$includedChannels, "Included")
  } else {
    character(0)
  }
  payload <- as.character(jsonlite::toJSON(
    list(
      schema = jsonlite::unbox(scientific$schema),
      kind = jsonlite::unbox(scientific$kind),
      method = jsonlite::unbox(scientific$method),
      solverVersion = jsonlite::unbox(scientific$solverVersion),
      solverSettings = serialized_settings,
      matrixHash = jsonlite::unbox(matrix_hash),
      includedChannels = .gatelabr_comp_json_array(included)
    ),
    auto_unbox = TRUE,
    digits = NA,
    null = "null",
    na = "null",
    pretty = FALSE
  ))
  .gatelabr_comp_sha256(payload)
}

.gatelabr_validate_host_compensation_profile <- function(
    profile_json,
    purpose = c("apply", "adopt")) {
  purpose <- match.arg(purpose)
  if (!is.character(profile_json) || length(profile_json) != 1L ||
      is.na(profile_json) || !nzchar(profile_json)) {
    stop("profileJson must contain one compensation profile.", call. = FALSE)
  }
  profile <- tryCatch(
    jsonlite::fromJSON(profile_json, simplifyVector = FALSE),
    error = function(cause) {
      stop("The compensation profile JSON is unreadable: ",
           conditionMessage(cause), call. = FALSE)
    }
  )
  if (!is.list(profile) ||
      !identical(profile$schema, .gatelabr_host_compensation_record_schema) ||
      !profile$recordType %in% c("baseline", "revision") ||
      !is.list(profile$scientific)) {
    stop("The compensation profile record is unsupported.", call. = FALSE)
  }
  scientific <- profile$scientific
  if (!identical(scientific$schema,
                 .gatelabr_host_compensation_profile_schema)) {
    stop("The scientific compensation profile schema is unsupported.",
         call. = FALSE)
  }
  if (identical(scientific$kind, "cytof-spillover")) {
    allowed_solver <- if (identical(purpose, "apply")) {
      .gatelabr_r_cytof_solver
    } else {
      .gatelabr_r_adopted_solver
    }
    if (!identical(scientific$method, "nnls") ||
        !identical(scientific$solverVersion, allowed_solver)) {
      stop(
        if (identical(purpose, "apply")) {
          "CyTOF SCE Apply requires the R NNLS solver identity."
        } else {
          "CyTOF assay adoption requires the external precomputed solver identity."
        },
        call. = FALSE
      )
    }
  } else if (identical(scientific$kind, "flow-spillover")) {
    allowed_solver <- if (identical(purpose, "apply")) {
      .gatelabr_r_flow_solver
    } else {
      .gatelabr_r_adopted_solver
    }
    if (!identical(scientific$method, "matrix-inverse") ||
        !identical(scientific$solverVersion, allowed_solver)) {
      stop(
        if (identical(purpose, "apply")) {
          "Flow SCE Apply requires the R matrix solver identity."
        } else {
          "Flow assay adoption requires the external precomputed solver identity."
        },
        call. = FALSE
      )
    }
  } else {
    stop("The compensation kind is unsupported.", call. = FALSE)
  }
  matrix_record <- .gatelabr_comp_matrix_record(scientific)
  matrix_hash <- .gatelabr_comp_matrix_hash(matrix_record)
  profile_hash <- .gatelabr_comp_profile_hash(scientific, matrix_hash)
  if (!identical(profile$matrixHash, matrix_hash) ||
      !identical(profile$profileHash, profile_hash)) {
    stop("The compensation profile hash does not match its numerical state.",
         call. = FALSE)
  }
  list(
    profile = profile,
    profile_json = profile_json,
    matrix = matrix_record
  )
}

.gatelabr_adapt_cytof_matrix <- function(matrix_record, included) {
  included <- .gatelabr_comp_axis(included, "Included")
  missing <- setdiff(included, matrix_record$receiverChannels)
  if (length(missing) > 0L) {
    stop("Compensation channels are absent from the receiver axis: ",
         paste(missing, collapse = ", "), ".", call. = FALSE)
  }
  adapted <- diag(length(included))
  dimnames(adapted) <- list(included, included)
  source_positions <- match(included, matrix_record$sourceChannels)
  receiver_positions <- match(included, matrix_record$receiverChannels)
  for (source_index in seq_along(included)) {
    imported_source <- source_positions[[source_index]]
    if (is.na(imported_source)) next
    adapted[source_index, ] <-
      matrix_record$matrix[
        imported_source,
        receiver_positions,
        drop = TRUE
      ]
    adapted[source_index, source_index] <- 1
  }
  adapted
}

.gatelabr_host_channel_pnns <- function(sce) {
  descriptors <- .gatelabr_channel_descriptors(sce)
  vapply(descriptors, function(channel) {
    if (!is.null(channel$pnn) && nzchar(channel$pnn)) {
      channel$pnn
    } else {
      channel$id
    }
  }, character(1))
}

.gatelabr_solve_cytof_events <- function(
    measured,
    design,
    worker_count = 1L) {
  channel_count <- nrow(measured)
  event_count <- ncol(measured)
  if (event_count == 0L) {
    return(matrix(numeric(0), nrow = channel_count, ncol = 0L))
  }
  solve_indices <- function(indices) {
    vapply(indices, function(event_index) {
      solution <- as.double(
        nnls::nnls(design, as.double(measured[, event_index]))$x
      )
      if (length(solution) != channel_count ||
          any(!is.finite(solution)) || any(solution < -1e-8)) {
        stop("R NNLS returned an invalid compensation solution.",
             call. = FALSE)
      }
      solution[solution < 0] <- 0
      solution
    }, numeric(channel_count))
  }
  worker_count <- suppressWarnings(as.integer(worker_count))
  if (length(worker_count) != 1L || is.na(worker_count) ||
      worker_count < 1L) worker_count <- 1L
  worker_count <- min(worker_count, event_count)
  if (worker_count == 1L || .Platform$OS.type == "windows") {
    return(solve_indices(seq_len(event_count)))
  }
  groups <- split(
    seq_len(event_count),
    cut(seq_len(event_count), breaks = worker_count, labels = FALSE)
  )
  chunks <- parallel::mclapply(
    groups,
    solve_indices,
    mc.cores = worker_count,
    mc.preschedule = TRUE
  )
  do.call(cbind, chunks)
}

.gatelabr_compensation_state <- function(sce) {
  state <- S4Vectors::metadata(sce)$gatelabr_compensation
  if (!is.list(state) ||
      !identical(state$format, "gatelabr-compensation") ||
      !identical(as.integer(state$version),
                 .gatelabr_host_compensation_state_version) ||
      !is.list(state$applications)) {
    return(list(
      format = "gatelabr-compensation",
      version = .gatelabr_host_compensation_state_version,
      applications = list()
    ))
  }
  state
}

.gatelabr_compensation_output_assay <- function(sce, state) {
  managed <- unique(vapply(
    Filter(
      function(application) !identical(application$managed_output, FALSE),
      state$applications
    ),
    function(application) as.character(application$output_assay_id),
    character(1)
  ))
  managed <- managed[nzchar(managed)]
  if (length(managed) > 0L) return(managed[[1]])
  candidate <- "gatelab_compensated"
  existing <- SummarizedExperiment::assayNames(sce)
  if (!candidate %in% existing) return(candidate)
  suffix <- 2L
  while (paste0(candidate, "_", suffix) %in% existing) suffix <- suffix + 1L
  paste0(candidate, "_", suffix)
}

.gatelabr_host_compensation_application_descriptor <- function(
    application,
    sce,
    dataset_id) {
  output_assay <- application$output_assay_id
  execution <- if (identical(
    application$execution,
    "adopted-existing-assay"
  )) {
    "adopted-existing-assay"
  } else {
    "computed"
  }
  list(
    contractVersion = .gatelabr_host_compensation_contract_version,
    datasetId = dataset_id,
    profileJson = application$profile_json,
    sourceAssayId = application$source_assay_id,
    execution = execution,
    outputAssay = list(
      id = output_assay,
      label = output_assay,
      role = "compensated",
      coordinateSpace = .gatelabr_assay_coordinate_space(sce, output_assay),
      revision = .gatelabr_assay_revision(sce, output_assay),
      encoding = "channel-major-float32-le"
    ),
    targetSampleIds = unname(application$target_sample_ids),
    activeSampleIds = unname(application$active_sample_ids),
    appliedAt = application$applied_at
  )
}

.gatelabr_apply_host_compensation <- function(
    sce,
    dataset_id,
    profile_json,
    targets,
    worker_count = 1L,
    sample_column = NULL) {
  validated <- .gatelabr_validate_host_compensation_profile(profile_json)
  profile <- validated$profile
  scientific <- profile$scientific
  if (!is.list(targets) || length(targets) == 0L) {
    stop("Compensation Apply requires at least one SCE sample.",
         call. = FALSE)
  }
  source_assays <- unique(vapply(targets, function(target) {
    as.character(target$sourceAssayId)
  }, character(1)))
  if (length(source_assays) != 1L ||
      !source_assays[[1]] %in% SummarizedExperiment::assayNames(sce)) {
    stop("Compensation targets must use one current SCE source assay.",
         call. = FALSE)
  }
  source_assay <- source_assays[[1]]
  expected_revision <- .gatelabr_assay_revision(sce, source_assay)
  for (target in targets) {
    supplied_revision <- suppressWarnings(
      as.numeric(target$expectedAssayRevision)
    )
    if (length(supplied_revision) != 1L ||
        !is.finite(supplied_revision) ||
        supplied_revision != expected_revision) {
      stop("The SCE source assay changed before compensation Apply.",
           call. = FALSE)
    }
  }

  partition <- .gatelabr_sample_partition(sce, sample_column)
  sample_ids <- vapply(partition$samples, `[[`, character(1), "id")
  target_ids <- unique(vapply(
    targets,
    function(target) as.character(target$sampleId),
    character(1)
  ))
  target_positions <- match(target_ids, sample_ids)
  if (anyNA(target_positions)) {
    stop("A compensation target no longer exists in the SCE.",
         call. = FALSE)
  }
  active_ids <- unique(vapply(targets, function(target) {
    if (identical(target$activeLayer, "compensated")) {
      as.character(target$sampleId)
    } else {
      ""
    }
  }, character(1)))
  active_ids <- active_ids[nzchar(active_ids)]

  source <- SummarizedExperiment::assay(sce, source_assay)
  if (!is.matrix(source) && !methods::is(source, "Matrix")) {
    source <- as.matrix(source)
  }
  if (!is.numeric(source)) {
    stop("The SCE source assay must be numerical.", call. = FALSE)
  }
  pnns <- .gatelabr_host_channel_pnns(sce)
  if (anyDuplicated(pnns)) {
    stop("The SCE has duplicate exact channel identities.", call. = FALSE)
  }
  included <- if (identical(scientific$kind, "cytof-spillover")) {
    .gatelabr_comp_axis(scientific$includedChannels, "Included")
  } else {
    validated$matrix$receiverChannels
  }
  channel_positions <- match(included, pnns)
  if (anyNA(channel_positions)) {
    stop("Compensation channels are absent from the SCE: ",
         paste(included[is.na(channel_positions)], collapse = ", "),
         ".", call. = FALSE)
  }

  state <- .gatelabr_compensation_state(sce)
  output_assay <- .gatelabr_compensation_output_assay(sce, state)
  if (output_assay %in% SummarizedExperiment::assayNames(sce)) {
    output <- SummarizedExperiment::assay(sce, output_assay) + 0
  } else {
    output <- source + 0
  }
  for (target_position in target_positions) {
    event_indices <- partition$event_indices[[target_position]]
    measured <- as.matrix(source[channel_positions, event_indices, drop = FALSE])
    storage.mode(measured) <- "double"
    if (any(!is.finite(measured))) {
      stop("The SCE source assay contains non-finite compensation values.",
           call. = FALSE)
    }
    if (identical(scientific$kind, "cytof-spillover")) {
      solve_matrix <- .gatelabr_adapt_cytof_matrix(
        validated$matrix,
        scientific$includedChannels
      )
      solved <- .gatelabr_solve_cytof_events(
        measured,
        t(solve_matrix),
        worker_count = worker_count
      )
    } else {
      spill <- validated$matrix$matrix[
        included,
        included,
        drop = FALSE
      ]
      inverse <- tryCatch(
        solve(spill),
        error = function(cause) {
          stop("The flow spillover matrix is singular: ",
               conditionMessage(cause), call. = FALSE)
        }
      )
      solved <- t(t(measured) %*% inverse)
    }
    output[channel_positions, event_indices] <- solved
  }

  SummarizedExperiment::assay(sce, output_assay) <- output
  md <- S4Vectors::metadata(sce)
  spaces <- md$gatelabr_assay_coordinate_spaces
  if (!is.list(spaces)) spaces <- list()
  spaces[[output_assay]] <- "linear"
  roles <- md$gatelabr_assay_roles
  if (!is.list(roles)) roles <- list()
  roles[[output_assay]] <- "compensated"
  revisions <- md$gatelabr_assay_revisions
  if (!is.list(revisions)) revisions <- list()
  previous_revision <- suppressWarnings(as.numeric(revisions[[output_assay]]))
  if (length(previous_revision) != 1L || !is.finite(previous_revision)) {
    previous_revision <- 0
  }
  revisions[[output_assay]] <- previous_revision + 1

  previous_same_targets <- character(0)
  previous_same_active <- character(0)
  retained <- list()
  for (application in state$applications) {
    unaffected <- setdiff(application$target_sample_ids, target_ids)
    if (identical(application$profile_id, profile$profileId)) {
      previous_same_targets <- unaffected
      previous_same_active <- intersect(
        application$active_sample_ids,
        unaffected
      )
    }
    if (length(unaffected) > 0L) {
      application$target_sample_ids <- unaffected
      application$active_sample_ids <- intersect(
        application$active_sample_ids,
        unaffected
      )
      retained[[length(retained) + 1L]] <- application
    }
  }
  merged_targets <- unique(c(
    previous_same_targets,
    target_ids
  ))
  merged_active <- unique(c(
    previous_same_active,
    active_ids
  ))
  application <- list(
    profile_id = profile$profileId,
    profile_json = profile_json,
    source_assay_id = source_assay,
    output_assay_id = output_assay,
    output_assay_revision = revisions[[output_assay]],
    execution = "computed",
    managed_output = TRUE,
    target_sample_ids = merged_targets,
    active_sample_ids = merged_active,
    applied_at = format(
      as.POSIXct(Sys.time(), tz = "UTC"),
      "%Y-%m-%dT%H:%M:%OS3Z",
      tz = "UTC"
    )
  )
  state$applications <- c(retained, list(application))
  md$gatelabr_assay_coordinate_spaces <- spaces
  md$gatelabr_assay_roles <- roles
  md$gatelabr_assay_revisions <- revisions
  md$gatelabr_compensation <- state
  S4Vectors::metadata(sce) <- md

  list(
    sce = sce,
    result = list(
      application = .gatelabr_host_compensation_application_descriptor(
        application,
        sce,
        dataset_id
      ),
      target_sample_ids = target_ids,
      output_assay_id = output_assay
    )
  )
}

.gatelabr_adopt_host_compensation <- function(
    sce,
    dataset_id,
    profile_json,
    output_assay_id,
    expected_output_assay_revision,
    targets,
    sample_column = NULL) {
  validated <- .gatelabr_validate_host_compensation_profile(
    profile_json,
    purpose = "adopt"
  )
  profile <- validated$profile
  scientific <- profile$scientific
  assay_names <- SummarizedExperiment::assayNames(sce)
  if (!is.character(output_assay_id) || length(output_assay_id) != 1L ||
      is.na(output_assay_id) || !output_assay_id %in% assay_names) {
    stop("The existing compensated assay is not present in the SCE.",
         call. = FALSE)
  }
  if (!identical(
    .gatelabr_assay_coordinate_space(sce, output_assay_id),
    "linear"
  )) {
    stop(
      "Only a linear existing SCE assay can be adopted as compensated data.",
      call. = FALSE
    )
  }
  output_revision <- .gatelabr_assay_revision(sce, output_assay_id)
  supplied_output_revision <- suppressWarnings(
    as.numeric(expected_output_assay_revision)
  )
  if (length(supplied_output_revision) != 1L ||
      !is.finite(supplied_output_revision) ||
      supplied_output_revision != output_revision) {
    stop("The existing compensated assay changed before adoption.",
         call. = FALSE)
  }
  if (!is.list(targets) || length(targets) == 0L) {
    stop("Assay adoption requires at least one SCE sample.", call. = FALSE)
  }
  source_assays <- unique(vapply(targets, function(target) {
    as.character(target$sourceAssayId)
  }, character(1)))
  if (length(source_assays) != 1L ||
      !source_assays[[1]] %in% assay_names) {
    stop("Assay adoption targets must use one current SCE source assay.",
         call. = FALSE)
  }
  source_assay <- source_assays[[1]]
  if (identical(source_assay, output_assay_id)) {
    stop("The original and compensated assays must be different.",
         call. = FALSE)
  }
  if (!identical(
    .gatelabr_assay_coordinate_space(sce, source_assay),
    "linear"
  )) {
    stop("The source assay must use linear coordinates.", call. = FALSE)
  }
  source_revision <- .gatelabr_assay_revision(sce, source_assay)
  for (target in targets) {
    supplied_revision <- suppressWarnings(
      as.numeric(target$expectedAssayRevision)
    )
    if (length(supplied_revision) != 1L ||
        !is.finite(supplied_revision) ||
        supplied_revision != source_revision) {
      stop("The SCE source assay changed before adoption.", call. = FALSE)
    }
  }

  source <- SummarizedExperiment::assay(sce, source_assay)
  output <- SummarizedExperiment::assay(sce, output_assay_id)
  if (!identical(dim(source), dim(output))) {
    stop(
      "The existing compensated assay must have the same dimensions as the source assay.",
      call. = FALSE
    )
  }
  if (!is.numeric(output)) {
    stop("The existing compensated assay must be numerical.", call. = FALSE)
  }

  partition <- .gatelabr_sample_partition(sce, sample_column)
  sample_ids <- vapply(partition$samples, `[[`, character(1), "id")
  target_ids <- unique(vapply(
    targets,
    function(target) as.character(target$sampleId),
    character(1)
  ))
  target_positions <- match(target_ids, sample_ids)
  if (anyNA(target_positions)) {
    stop("An assay-adoption target no longer exists in the SCE.",
         call. = FALSE)
  }
  active_ids <- unique(vapply(targets, function(target) {
    if (identical(target$activeLayer, "compensated")) {
      as.character(target$sampleId)
    } else {
      ""
    }
  }, character(1)))
  active_ids <- active_ids[nzchar(active_ids)]

  pnns <- .gatelabr_host_channel_pnns(sce)
  if (anyDuplicated(pnns)) {
    stop("The SCE has duplicate exact channel identities.", call. = FALSE)
  }
  included <- if (identical(scientific$kind, "cytof-spillover")) {
    .gatelabr_comp_axis(scientific$includedChannels, "Included")
  } else {
    validated$matrix$receiverChannels
  }
  channel_positions <- match(included, pnns)
  if (anyNA(channel_positions)) {
    stop(
      "Compensation channels are absent from the SCE: ",
      paste(included[is.na(channel_positions)], collapse = ", "),
      ".",
      call. = FALSE
    )
  }
  event_indices <- unlist(
    partition$event_indices[target_positions],
    use.names = FALSE
  )
  adopted_values <- output[
    channel_positions,
    event_indices,
    drop = FALSE
  ]
  if (any(!is.finite(adopted_values))) {
    stop(
      "The existing compensated assay contains non-finite values in the adopted samples.",
      call. = FALSE
    )
  }

  md <- S4Vectors::metadata(sce)
  spaces <- md$gatelabr_assay_coordinate_spaces
  if (!is.list(spaces)) spaces <- list()
  spaces[[output_assay_id]] <- "linear"
  roles <- md$gatelabr_assay_roles
  if (!is.list(roles)) roles <- list()
  roles[[output_assay_id]] <- "compensated"
  revisions <- md$gatelabr_assay_revisions
  if (!is.list(revisions)) revisions <- list()
  if (is.null(revisions[[output_assay_id]])) {
    revisions[[output_assay_id]] <- output_revision
  }

  state <- .gatelabr_compensation_state(sce)
  retained <- list()
  for (application in state$applications) {
    same_output <- identical(
      as.character(application$output_assay_id),
      output_assay_id
    )
    unaffected <- if (same_output) {
      setdiff(application$target_sample_ids, target_ids)
    } else {
      application$target_sample_ids
    }
    if (length(unaffected) > 0L) {
      application$target_sample_ids <- unaffected
      application$active_sample_ids <- intersect(
        application$active_sample_ids,
        unaffected
      )
      retained[[length(retained) + 1L]] <- application
    }
  }
  application <- list(
    profile_id = profile$profileId,
    profile_json = profile_json,
    source_assay_id = source_assay,
    output_assay_id = output_assay_id,
    output_assay_revision = output_revision,
    execution = "adopted-existing-assay",
    managed_output = FALSE,
    target_sample_ids = target_ids,
    active_sample_ids = active_ids,
    applied_at = format(
      as.POSIXct(Sys.time(), tz = "UTC"),
      "%Y-%m-%dT%H:%M:%OS3Z",
      tz = "UTC"
    )
  )
  state$applications <- c(retained, list(application))
  md$gatelabr_assay_coordinate_spaces <- spaces
  md$gatelabr_assay_roles <- roles
  md$gatelabr_assay_revisions <- revisions
  md$gatelabr_compensation <- state
  S4Vectors::metadata(sce) <- md

  list(
    sce = sce,
    result = list(
      application = .gatelabr_host_compensation_application_descriptor(
        application,
        sce,
        dataset_id
      ),
      target_sample_ids = target_ids,
      output_assay_id = output_assay_id
    )
  )
}

.gatelabr_host_compensation_applications <- function(
    sce,
    dataset_id = "gatelabr-sce") {
  state <- .gatelabr_compensation_state(sce)
  existing <- SummarizedExperiment::assayNames(sce)
  lapply(
    Filter(
      function(application) application$output_assay_id %in% existing,
      state$applications
    ),
    .gatelabr_host_compensation_application_descriptor,
    sce = sce,
    dataset_id = dataset_id
  )
}

.gatelabr_register_host_compensation_targets <- function(
    session,
    sce,
    result,
    dataset_id,
    sample_column = NULL) {
  partition <- .gatelabr_sample_partition(sce, sample_column)
  sample_ids <- vapply(partition$samples, `[[`, character(1), "id")
  output_assay <- result$output_assay_id
  revision <- .gatelabr_assay_revision(sce, output_assay)
  profile_id <- tryCatch(
    jsonlite::fromJSON(
      result$application$profileJson,
      simplifyVector = FALSE
    )$profileId,
    error = function(...) "profile"
  )
  lapply(result$target_sample_ids, function(sample_id) {
    sample_position <- match(sample_id, sample_ids)
    event_indices <- partition$event_indices[[sample_position]]
    resource_name <- paste0(
      "gatelabr-comp-",
      sample_position,
      "-",
      revision,
      "-",
      substr(gsub("[^A-Za-z0-9]", "", profile_id), 1L, 16L)
    )
    list(
      sampleId = sample_id,
      eventCount = length(event_indices),
      assayUrl = .gatelabr_register_assay_resource(
        session,
        resource_name,
        sce,
        output_assay,
        event_indices
      )
    )
  })
}
