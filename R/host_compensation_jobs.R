# Non-blocking compensation jobs for the shared GateLab React host.

.gatelabr_compensation_chunk_size <- 25000L

.gatelabr_start_compensation_backend <- function() {
  backend <- new.env(parent = emptyenv())
  backend$cluster <- parallel::makePSOCKcluster(1L)
  backend$previous_plan <- future::plan()
  backend$closed <- FALSE
  future::plan(future::cluster, workers = backend$cluster)
  backend
}

.gatelabr_stop_compensation_backend <- function(backend) {
  if (!is.environment(backend) || isTRUE(backend$closed)) {
    return(invisible(NULL))
  }
  future::plan(backend$previous_plan)
  parallel::stopCluster(backend$cluster)
  backend$closed <- TRUE
  invisible(NULL)
}

.gatelabr_submit_compensation_chunk <- function(
    measured,
    kind,
    solve_design,
    worker_count) {
  cytof_solver <- .gatelabr_solve_cytof_events
  task <- future::future(
    {
      if (identical(kind, "cytof-spillover")) {
        cytof_solver(
          measured,
          solve_design,
          worker_count = worker_count
        )
      } else {
        t(t(measured) %*% solve_design)
      }
    },
    globals = list(
      cytof_solver = cytof_solver,
      measured = measured,
      kind = kind,
      solve_design = solve_design,
      worker_count = worker_count
    ),
    packages = "nnls"
  )
  list(
    task = task,
    promise = promises::as.promise(task),
    cancel = function() future::cancel(task)
  )
}

.gatelabr_host_session_open <- function(session) {
  if (is.null(session)) return(FALSE)
  closed <- tryCatch(
    is.function(session$isClosed) && isTRUE(session$isClosed()),
    error = function(...) FALSE
  )
  !closed
}

.gatelabr_send_host_response <- function(
    session,
    request_id,
    ok,
    result = NULL,
    error = NULL) {
  if (!.gatelabr_host_session_open(session)) return(invisible(FALSE))
  session$sendCustomMessage(
    "gatelabr-host-response",
    list(
      requestId = request_id,
      ok = isTRUE(ok),
      result = result,
      error = error
    )
  )
  invisible(TRUE)
}

.gatelabr_send_compensation_progress <- function(job) {
  if (!.gatelabr_host_session_open(job$session) ||
      is.null(job$prepared)) return(invisible(FALSE))
  prepared <- job$prepared
  sample_index <- job$target_index
  sample_count <- length(prepared$target_event_indices)
  sample_total <- if (sample_index <= sample_count) {
    prepared$target_event_counts[[sample_index]]
  } else if (sample_count > 0L) {
    prepared$target_event_counts[[sample_count]]
  } else {
    0L
  }
  sample_processed <- if (sample_index <= sample_count) {
    min(job$sample_offset, sample_total)
  } else {
    sample_total
  }
  total <- prepared$total_events
  fraction <- if (total > 0) {
    min(1, prepared$completed_events / total)
  } else {
    1
  }
  job$session$sendCustomMessage(
    "gatelabr-host-compensation-progress",
    list(
      requestId = job$request_id,
      jobId = job$job_id,
      sampleIndex = max(0L, min(sample_count, sample_index) - 1L),
      sampleCount = sample_count,
      sampleProcessedEvents = sample_processed,
      sampleTotalEvents = sample_total,
      processedEvents = prepared$completed_events,
      totalEvents = total,
      fraction = fraction
    )
  )
  invisible(TRUE)
}

.gatelabr_new_host_compensation_jobs <- function(
    submit = .gatelabr_submit_compensation_chunk,
    chunk_size = .gatelabr_compensation_chunk_size) {
  manager <- new.env(parent = emptyenv())
  manager$active <- NULL
  manager$submit <- submit
  manager$chunk_size <- max(1L, as.integer(chunk_size))
  manager
}

.gatelabr_finish_host_compensation_job <- function(
    manager,
    job,
    sce_state,
    sce_name,
    dataset_id,
    sample_column) {
  if (!identical(manager$active, job) || isTRUE(job$cancelled)) {
    return(invisible(NULL))
  }
  committed <- tryCatch(
    .gatelabr_commit_host_compensation(sce_state(), job$prepared),
    error = identity
  )
  if (inherits(committed, "error")) {
    manager$active <- NULL
    .gatelabr_send_host_response(
      job$session,
      job$request_id,
      FALSE,
      error = conditionMessage(committed)
    )
    return(invisible(NULL))
  }
  sce_state(committed$sce)
  assign(sce_name, committed$sce, envir = .GlobalEnv)
  if (.gatelabr_host_session_open(job$session)) {
    committed$result$targets <-
      .gatelabr_register_host_compensation_targets(
        job$session,
        committed$sce,
        committed$result,
        dataset_id = dataset_id,
        sample_column = sample_column
      )
  }
  manager$active <- NULL
  .gatelabr_send_host_response(
    job$session,
    job$request_id,
    TRUE,
    result = committed$result
  )
  invisible(NULL)
}

.gatelabr_fail_host_compensation_job <- function(
    manager,
    job,
    cause) {
  if (!identical(manager$active, job)) return(invisible(NULL))
  manager$active <- NULL
  message <- if (isTRUE(job$cancelled)) {
    "Compensation cancelled; the previous SCE assay remains unchanged."
  } else if (inherits(cause, "condition")) {
    conditionMessage(cause)
  } else {
    as.character(cause)
  }
  .gatelabr_send_host_response(
    job$session,
    job$request_id,
    FALSE,
    error = message
  )
  invisible(NULL)
}

.gatelabr_run_next_compensation_chunk <- function(
    manager,
    job,
    sce_state,
    sce_name,
    dataset_id,
    sample_column) {
  if (!identical(manager$active, job) || isTRUE(job$cancelled)) {
    return(.gatelabr_fail_host_compensation_job(
      manager,
      job,
      simpleError("Compensation cancelled.")
    ))
  }
  prepared <- job$prepared
  sample_count <- length(prepared$target_event_indices)
  while (job$target_index <= sample_count &&
         job$sample_offset >=
           length(prepared$target_event_indices[[job$target_index]])) {
    job$target_index <- job$target_index + 1L
    job$sample_offset <- 0L
  }
  if (job$target_index > sample_count) {
    .gatelabr_send_compensation_progress(job)
    return(.gatelabr_finish_host_compensation_job(
      manager,
      job,
      sce_state,
      sce_name,
      dataset_id,
      sample_column
    ))
  }

  all_events <- prepared$target_event_indices[[job$target_index]]
  start <- job$sample_offset + 1L
  end <- min(length(all_events), start + manager$chunk_size - 1L)
  event_indices <- all_events[start:end]
  measured <- as.matrix(prepared$source[
    prepared$channel_positions,
    event_indices,
    drop = FALSE
  ])
  submitted <- tryCatch(
    manager$submit(
      measured,
      kind = prepared$scientific$kind,
      solve_design = prepared$solve_design,
      worker_count = prepared$worker_count
    ),
    error = identity
  )
  if (inherits(submitted, "error")) {
    return(.gatelabr_fail_host_compensation_job(
      manager,
      job,
      submitted
    ))
  }
  job$task <- submitted$task
  job$cancel_task <- submitted$cancel

  promises::then(
    submitted$promise,
    onFulfilled = function(solved) {
      if (!identical(manager$active, job) || isTRUE(job$cancelled)) {
        return(NULL)
      }
      solved <- as.matrix(solved)
      if (!identical(dim(solved), dim(measured)) ||
          any(!is.finite(solved))) {
        return(.gatelabr_fail_host_compensation_job(
          manager,
          job,
          simpleError(
            "The background compensation worker returned an invalid chunk."
          )
        ))
      }
      prepared$output[
        prepared$channel_positions,
        event_indices
      ] <- solved
      prepared$completed_events <-
        prepared$completed_events + length(event_indices)
      job$prepared <- prepared
      job$sample_offset <- end
      job$task <- NULL
      job$cancel_task <- NULL
      .gatelabr_send_compensation_progress(job)
      later::later(function() {
        .gatelabr_run_next_compensation_chunk(
          manager,
          job,
          sce_state,
          sce_name,
          dataset_id,
          sample_column
        )
      }, delay = 0)
      NULL
    },
    onRejected = function(cause) {
      .gatelabr_fail_host_compensation_job(manager, job, cause)
      NULL
    }
  )
  invisible(NULL)
}

.gatelabr_start_host_compensation_job <- function(
    manager,
    sce_state,
    sce_name,
    request,
    dataset_id,
    sample_column,
    session) {
  request_id <- as.character(request$requestId)
  if (!is.null(manager$active)) {
    .gatelabr_send_host_response(
      session,
      request_id,
      FALSE,
      error = paste0(
        "Another compensation Apply is already running. ",
        "Follow or cancel it before starting a new Apply."
      )
    )
    return(invisible(FALSE))
  }
  job <- new.env(parent = emptyenv())
  job$request_id <- request_id
  job$job_id <- paste0(
    "r-host-",
    Sys.getpid(),
    "-",
    substr(gsub("[^A-Za-z0-9]", "", request_id), 1L, 18L)
  )
  job$session <- session
  job$cancelled <- FALSE
  job$prepared <- NULL
  job$target_index <- 1L
  job$sample_offset <- 0L
  job$task <- NULL
  job$cancel_task <- NULL
  manager$active <- job

  later::later(function() {
    if (!identical(manager$active, job) || isTRUE(job$cancelled)) return(NULL)
    payload <- request$payload
    prepared <- tryCatch(
      .gatelabr_prepare_host_compensation(
        sce_state(),
        dataset_id = dataset_id,
        profile_json = payload$profileJson,
        targets = payload$targets,
        worker_count = payload$workerCount,
        sample_column = sample_column
      ),
      error = identity
    )
    if (inherits(prepared, "error")) {
      return(.gatelabr_fail_host_compensation_job(
        manager,
        job,
        prepared
      ))
    }
    job$prepared <- prepared
    .gatelabr_send_compensation_progress(job)
    .gatelabr_run_next_compensation_chunk(
      manager,
      job,
      sce_state,
      sce_name,
      dataset_id,
      sample_column
    )
  }, delay = 0)
  invisible(TRUE)
}

.gatelabr_cancel_host_compensation_job <- function(
    manager,
    request_id) {
  job <- manager$active
  if (is.null(job) || !identical(job$request_id, request_id)) {
    return(invisible(FALSE))
  }
  job$cancelled <- TRUE
  if (is.function(job$cancel_task)) {
    try(job$cancel_task(), silent = TRUE)
  } else {
    .gatelabr_fail_host_compensation_job(
      manager,
      job,
      simpleError("Compensation cancelled.")
    )
  }
  invisible(TRUE)
}
