job_compensation_sce <- function() {
  counts <- rbind(
    A = c(10, 4, 8, 20),
    B = c(3, 7, 2, 12),
    pass = c(100, 101, 200, 201)
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts)
  )
  SummarizedExperiment::rowData(sce)$pnn <- rownames(counts)
  sce
}

job_compensation_profile <- function() {
  scientific <- list(
    schema = "gatelab.compensation-profile.v1",
    kind = "cytof-spillover",
    method = "nnls",
    solverVersion = "r-nnls-v1",
    solverSettings = list(
      list(key = "adaptationVersion", value = "identity-backed-v1"),
      list(key = "kktTolerance", value = 1e-9),
      list(key = "maxIterations", value = 1000),
      list(key = "tolerance", value = 1e-10)
    ),
    matrix = list(
      schema = "gatelab.compensation-matrix.v1",
      orientation = "source-rows-receiver-columns",
      sourceChannels = c("A", "B"),
      receiverChannels = c("A", "B"),
      matrix = list(c(1, 0.1), c(0.2, 1))
    ),
    includedChannels = c("A", "B")
  )
  matrix_record <- GateLabR:::.gatelabr_comp_matrix_record(scientific)
  matrix_hash <- GateLabR:::.gatelabr_comp_matrix_hash(matrix_record)
  profile_hash <- GateLabR:::.gatelabr_comp_profile_hash(
    scientific,
    matrix_hash
  )
  jsonlite::toJSON(
    list(
      schema = "gatelab.compensation-profile-record.v1",
      recordType = "baseline",
      profileId = "job-profile",
      name = "Job matrix",
      createdAt = "2026-07-26T00:00:00.000Z",
      note = NULL,
      scientific = scientific,
      matrixHash = matrix_hash,
      profileHash = profile_hash,
      origin = list(
        type = "uploaded",
        fileName = "job.csv",
        format = "csv",
        sourceColumnHeader = ""
      ),
      provenance = NULL,
      baselineProfileId = "job-profile",
      baselineMatrixHash = matrix_hash,
      baselineProfileHash = profile_hash,
      parentProfileId = NULL,
      revisionReason = NULL
    ),
    auto_unbox = TRUE,
    digits = NA,
    null = "null",
    na = "null"
  )
}

job_compensation_request <- function() {
  list(
    requestId = "request-1",
    operation = "apply-compensation",
    payload = list(
      contractVersion = 1L,
      datasetId = "sce",
      profileJson = job_compensation_profile(),
      targets = list(list(
        sampleId = "sample-0",
        sourceAssayId = "counts",
        expectedAssayRevision = 0,
        activeLayer = "compensated"
      )),
      workerCount = 1L
    )
  )
}

job_reactive_state <- function(value) {
  force(value)
  function(next_value) {
    if (missing(next_value)) return(value)
    value <<- next_value
    invisible(value)
  }
}

job_test_session <- function() {
  messages <- list()
  session <- new.env(parent = emptyenv())
  session$isClosed <- function() FALSE
  session$sendCustomMessage <- function(type, message) {
    messages[[length(messages) + 1L]] <<- list(
      type = type,
      message = message
    )
  }
  session$registerDataObj <- function(name, data, filterFunc) {
    paste0("/session/", name)
  }
  session$messages <- function() messages
  session
}

run_job_loop <- function(manager, timeout = 3) {
  deadline <- Sys.time() + timeout
  while (!is.null(manager$active) && Sys.time() < deadline) {
    later::run_now(0.05)
  }
  expect_null(manager$active)
}

test_that("host compensation jobs stream bounded progress and commit atomically", {
  submitted_widths <- integer(0)
  submit <- function(measured, kind, solve_design, worker_count) {
    submitted_widths <<- c(submitted_widths, ncol(measured))
    solved <- GateLabR:::.gatelabr_solve_host_compensation_chunk(
      measured,
      kind,
      solve_design,
      worker_count
    )
    list(
      task = NULL,
      promise = promises::promise_resolve(solved),
      cancel = function() invisible(NULL)
    )
  }
  manager <- GateLabR:::.gatelabr_new_host_compensation_jobs(
    submit = submit,
    chunk_size = 2L
  )
  state <- job_reactive_state(job_compensation_sce())
  session <- job_test_session()

  expect_true(GateLabR:::.gatelabr_start_host_compensation_job(
    manager,
    state,
    "job_sce",
    job_compensation_request(),
    "sce",
    NULL,
    session
  ))
  run_job_loop(manager)

  updated <- state()
  expect_identical(submitted_widths, c(2L, 2L))
  expect_true(
    "gatelab_compensated" %in%
      SummarizedExperiment::assayNames(updated)
  )
  messages <- session$messages()
  progress <- Filter(
    function(entry) identical(
      entry$type,
      "gatelabr-host-compensation-progress"
    ),
    messages
  )
  expect_gte(length(progress), 3L)
  fractions <- vapply(
    progress,
    function(entry) entry$message$fraction,
    numeric(1)
  )
  expect_equal(fractions[[1]], 0)
  expect_equal(tail(fractions, 1), 1)
  expect_true(all(diff(fractions) >= 0))
  responses <- Filter(
    function(entry) identical(entry$type, "gatelabr-host-response"),
    messages
  )
  final_response <- tail(responses, 1)[[1]]$message
  expect_true(
    isTRUE(final_response$ok),
    info = as.character(final_response$error)
  )
})

test_that("cancelled host compensation never installs its staged assay", {
  reject_task <- NULL
  cancelled <- FALSE
  submit <- function(measured, kind, solve_design, worker_count) {
    pending <- promises::promise(function(resolve, reject) {
      reject_task <<- reject
    })
    list(
      task = NULL,
      promise = pending,
      cancel = function() {
        cancelled <<- TRUE
        reject_task(simpleError("cancelled"))
      }
    )
  }
  manager <- GateLabR:::.gatelabr_new_host_compensation_jobs(
    submit = submit,
    chunk_size = 2L
  )
  original <- job_compensation_sce()
  state <- job_reactive_state(original)
  session <- job_test_session()
  GateLabR:::.gatelabr_start_host_compensation_job(
    manager,
    state,
    "job_sce",
    job_compensation_request(),
    "sce",
    NULL,
    session
  )
  later::run_now(0.1)
  expect_true(GateLabR:::.gatelabr_cancel_host_compensation_job(
    manager,
    "request-1"
  ))
  run_job_loop(manager)

  expect_true(cancelled)
  expect_identical(
    SummarizedExperiment::assayNames(state()),
    SummarizedExperiment::assayNames(original)
  )
})

test_that("stale source revisions discard a complete staged result", {
  sce <- job_compensation_sce()
  request <- job_compensation_request()
  prepared <- GateLabR:::.gatelabr_prepare_host_compensation(
    sce,
    dataset_id = "sce",
    profile_json = request$payload$profileJson,
    targets = request$payload$targets,
    worker_count = 1L
  )
  events <- prepared$target_event_indices[[1]]
  solved <- GateLabR:::.gatelabr_solve_host_compensation_chunk(
    prepared$source[
      prepared$channel_positions,
      events,
      drop = FALSE
    ],
    prepared$scientific$kind,
    prepared$solve_design,
    1L
  )
  prepared$output[prepared$channel_positions, events] <- solved
  prepared$completed_events <- prepared$total_events

  metadata <- S4Vectors::metadata(sce)
  metadata$gatelabr_assay_revisions <- list(counts = 1)
  S4Vectors::metadata(sce) <- metadata
  expect_error(
    GateLabR:::.gatelabr_commit_host_compensation(sce, prepared),
    "source assay changed"
  )
  expect_false(
    "gatelab_compensated" %in%
      SummarizedExperiment::assayNames(sce)
  )
})
