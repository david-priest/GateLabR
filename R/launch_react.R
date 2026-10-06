#' Launch GateLabR with the canonical GateLab React interface
#'
#' Starts the shared GateLab TypeScript/React application with a thin Shiny
#' adapter for a \code{SingleCellExperiment}. This is the interface started by
#' \code{\link{launchGatingApp}}, which is the single supported entry point.
#'
#' @param sce A \code{SingleCellExperiment}. If \code{NULL}, the first SCE in
#'   the global environment is used.
#' @param sample_column Optional \code{colData} column defining samples. When
#'   omitted, common sample columns such as \code{sample_id} are detected.
#' @param port Port for Shiny (default: auto-select).
#' @param launch.browser Whether to open a browser window (default: \code{TRUE}).
#' @param sce_name Optional name of the global-environment variable that gates,
#'   populations and \code{colData} are written back to. Defaults to the symbol
#'   the caller passed as \code{sce}. Delegating wrappers must forward the user's
#'   symbol explicitly, because \code{substitute()} would otherwise resolve to
#'   the wrapper's own parameter name.
#' @param agent Open the tab connected to an agent's relay: \code{TRUE} reads the
#'   address the relay recorded in \code{~/.gatelab/agent-relay.json}, or give the
#'   \code{ws://} address itself. The agent then reads the gating as you see it
#'   and proposes gates, which appear in the tab with a badge; saving stays yours.
#'   \code{NULL} (the default) opens the tab as usual; the Agent menu in the
#'   header can connect it later.
#' @param blocking Whether the call returns only when the app stops. \code{NULL}
#'   (the default) returns at once when the installed Shiny can run an app in the
#'   background (\code{shiny::startApp()}, Shiny 1.14 and later) and otherwise
#'   blocks as before, saying so. \code{FALSE} insists on returning at once and
#'   is an error with an older Shiny; \code{TRUE} blocks.
#' @return Invisibly the running app's handle when the call returns at once (its
#'   \code{$stop()} stops the app, as does \code{\link{gatelabStop}}), otherwise
#'   invisibly \code{NULL} once the app has stopped. The app is serviced while R
#'   is idle at the prompt, so a long computation pauses it until the prompt
#'   returns. While it runs, the console may change the object it was launched
#'   on: the app then refuses to save over that change until
#'   \code{\link{gatelabSync}} hands it the console's object. When the app
#'   stops with no population memberships stored in the object, or with
#'   memberships older than the workspace, a warning says so: the readers
#'   (\code{\link{gatelabPopulations}}, \code{\link{gatelabHierarchy}}) need an
#'   explicit "Save to SCE", which autosaves do not replace.
#' @export
launchReactGateLab <- function(
    sce = NULL,
    sample_column = NULL,
    port = NULL,
    launch.browser = TRUE,
    sce_name = NULL,
    agent = NULL,
    blocking = NULL) {
  # Resolved before anything else: a bad address should fail the launch, not the browser.
  relay_url <- .gatelabr_agent_relay_url(agent)
  start_app <- .gatelabr_start_app_fn()
  if (!is.null(blocking) && !isTRUE(blocking) && !isFALSE(blocking)) {
    stop("`blocking` must be NULL, TRUE or FALSE.", call. = FALSE)
  }
  if (isFALSE(blocking) && is.null(start_app)) {
    stop(
      "blocking = FALSE needs shiny 1.14.0 or later, which can run an app in the background ",
      "(shiny::startApp()); shiny ", as.character(utils::packageVersion("shiny")), " is installed. ",
      "Update it with install.packages(\"shiny\"), or launch with blocking = TRUE.",
      call. = FALSE
    )
  }
  blocking <- if (is.null(blocking)) is.null(start_app) else blocking
  # One app at a time: a second launch stops the first, whose stop callbacks then run before the
  # new app claims the live record below.
  previous <- .gatelabr_live$handle
  if (!is.null(previous)) {
    message("GateLabR: stopping the app running on `", .gatelabr_live$sce_name, "`.")
    previous$stop()
  }
  # Resolve the global-environment name that gates, populations and colData are
  # written back to. substitute() only sees the CALLER's argument expression, so
  # a delegating wrapper (launchGatingApp) must forward the user's own symbol —
  # otherwise every write lands on a variable literally named "sce". Only a bare
  # symbol is a usable target: an inline call such as launchGatingApp(readRDS(f))
  # has no name to write back to and falls through to the explicit default.
  if (is.null(sce_name)) {
    supplied <- substitute(sce)
    sce_name <- if (is.symbol(supplied)) deparse(supplied) else ""
  }
  if (is.null(sce)) {
    candidates <- ls(envir = .GlobalEnv)
    candidates <- candidates[vapply(candidates, function(name) {
      tryCatch(
        methods::is(get(name, envir = .GlobalEnv), "SingleCellExperiment"),
        error = function(...) FALSE
      )
    }, logical(1))]
    if (length(candidates) == 0L) {
      stop(
        "No SingleCellExperiment was supplied or found in the global environment.",
        call. = FALSE
      )
    }
    sce_name <- candidates[[1]]
    sce <- get(sce_name, envir = .GlobalEnv)
  } else {
    if (!methods::is(sce, "SingleCellExperiment")) {
      stop("sce must be a SingleCellExperiment.", call. = FALSE)
    }
    if (!nzchar(sce_name) || identical(sce_name, "NULL")) sce_name <- "gatelabr_sce"
    assign(sce_name, sce, envir = .GlobalEnv)
  }
  # Say it out loud: silent writeback to a guessed name is how work goes missing.
  message(
    "GateLabR will save gates, populations and colData back to `", sce_name,
    "` in your global environment."
  )
  # Likewise for the assays: the user must know what the app draws, and from which assay,
  # before they gate on it.
  assay_note <- tryCatch(
    .gatelabr_assay_note(sce),
    error = function(cause) {
      # Never fail a launch over an advisory note, but never swallow it either: a silent NULL
      # is indistinguishable from "nothing to say".
      warning(
        "GateLabR could not describe this SCE's assays: ",
        conditionMessage(cause),
        call. = FALSE
      )
      NULL
    }
  )
  if (!is.null(assay_note)) message(assay_note)
  # Gates that name rows renamed since the workspace was saved are restated under the new names
  # where the channel list the save recorded shows the renames, and gates on channels the object
  # lacks are named (workspace_channels.R). Neither is a reason to stop the launch. The object in
  # the global environment changes only when the app next saves.
  absent_gates <- NULL
  reconciled <- tryCatch(
    .gatelabr_reconcile_workspace_channels(sce),
    error = function(cause) {
      warning(
        "GateLabR could not check the saved workspace's channels against this SCE: ",
        conditionMessage(cause),
        call. = FALSE
      )
      NULL
    }
  )
  if (!is.null(reconciled)) {
    sce <- reconciled$sce
    absent_gates <- reconciled$absent
    report <- .gatelabr_workspace_channel_report(reconciled, sce_name)
    if (!is.null(report)) message(report)
  }

  assets <- .gatelabr_react_asset_dir()
  prefix <- paste0(
    "gatelabr-core-",
    Sys.getpid(),
    "-",
    paste(sample(c(letters, 0:9), 8L, replace = TRUE), collapse = "")
  )
  shiny::addResourcePath(prefix, assets)

  dataset_id <- paste0(
    "sce-",
    substr(gsub("[^A-Za-z0-9_-]", "-", sce_name), 1L, 48L)
  )
  ui <- .gatelabr_react_ui(prefix)
  # This state belongs to the running app, not to an individual browser
  # connection. A page reload creates a new Shiny session; keeping the state
  # outside the session closure ensures that saved workspace/colData changes
  # are served back to the reconnecting browser.
  sce_state <- shiny::reactiveVal(sce)
  compensation_backend <- .gatelabr_start_compensation_backend()
  # The live record: what the console's gatelabStop() and gatelabSync() reach, and the address
  # of the object the app last wrote to the global name, which the write-back guard compares
  # against the binding before every save (live.R). The global object is still the one the
  # caller launched on; the reconciled copy above reaches it at the first save.
  live <- .gatelabr_live
  live$token <- prefix
  live$handle <- NULL
  live$sce_name <- sce_name
  live$set_sce <- function(object) sce_state(object)
  live$get_sce <- function() shiny::isolate(sce_state())
  live$written <- get0(sce_name, envir = .GlobalEnv, inherits = FALSE)
  live$address <- .gatelabr_object_address(live$written)
  live$refused_address <- NULL
  server <- .gatelabr_react_server(
    sce_state = sce_state,
    sce_name = sce_name,
    dataset_id = dataset_id,
    sample_column = sample_column,
    absent_gates = absent_gates,
    live = live
  )
  # Everything that must happen when the app stops, whichever way it stops and whether or not
  # this call is still on the stack: the app registers it as its own stop callback. The
  # memberships warning comes last, once the record is cleared: the memberships the readers
  # need come only from an explicit save, and nothing in the app's closing says whether one
  # happened.
  cleaned <- FALSE
  cleanup <- function() {
    if (cleaned) return(invisible(NULL))
    cleaned <<- TRUE
    shiny::removeResourcePath(prefix)
    .gatelabr_stop_compensation_backend(compensation_backend)
    if (identical(live$token, prefix)) {
      for (field in c("token", "handle", "sce_name", "set_sce", "get_sce", "written", "address", "refused_address")) {
        live[[field]] <- NULL
      }
    }
    .gatelabr_warn_memberships_at_stop(sce_name)
  }
  app <- shiny::shinyApp(
    ui = ui,
    server = server,
    onStart = function() shiny::onStop(cleanup)
  )

  message(
    "GateLabR: launching the shared GateLab React interface\n",
    "  SCE: ", sce_name, "\n",
    "  Core assets: ", assets,
    if (is.null(relay_url)) "" else paste0("\n  Agent relay: ", relay_url)
  )
  if (!is.null(relay_url) && isTRUE(launch.browser)) {
    launch.browser <- .gatelabr_agent_browser(relay_url)
  }
  if (blocking) {
    if (!is.null(start_app)) {
      message("GateLabR: blocking = TRUE, so the prompt returns when the app stops.")
    } else {
      message(
        "GateLabR: the prompt returns when the app stops (press Escape or Ctrl-C). ",
        "shiny 1.14.0 or later runs the app in the background instead: install.packages(\"shiny\")."
      )
    }
    # A start that fails before onStart never registers the stop callback, so the resource path
    # and backend are cleared here; after a normal stop the callback has already run it.
    on.exit(cleanup(), add = TRUE)
    shiny::runApp(app, port = port, launch.browser = launch.browser)
    return(invisible(NULL))
  }
  handle <- tryCatch(
    start_app(app, port = port, launch.browser = launch.browser),
    error = function(cause) {
      cleanup()
      stop(cause)
    }
  )
  live$handle <- handle
  message(
    "GateLabR: the app is running at ", handle$url(), " and the prompt is yours. ",
    "It is serviced while R is idle; gatelabStop() stops it, gatelabSync(\"", sce_name,
    "\") hands it the object after you change it in the console."
  )
  invisible(handle)
}

.gatelabr_react_server <- function(
    sce_state,
    sce_name,
    dataset_id,
    sample_column = NULL,
    absent_gates = NULL,
    live = NULL) {
  force(sce_state)
  force(sce_name)
  force(dataset_id)
  force(sample_column)
  # Without a live record (a server built on its own, as the tests do) every write goes
  # straight to the global name, as it did before the console could change the object.
  if (is.null(live)) {
    live <- new.env(parent = emptyenv())
    live$address <- NA_character_
  }
  compensation_jobs <- .gatelabr_new_host_compensation_jobs()
  compensation_jobs$live <- live
  # The gates on channels the SCE lacks that the console last named, at launch or at a save, so
  # that an autosave names them again only when they change.
  reported <- new.env(parent = emptyenv())
  reported$signature <- .gatelabr_absent_channel_signature(absent_gates)

  function(input, output, session) {
    session$onSessionEnded(function() {
      active <- compensation_jobs$active
      if (!is.null(active) && identical(active$session, session)) {
        .gatelabr_cancel_host_compensation_job(
          compensation_jobs,
          active$request_id
        )
      }
    })
    shiny::observeEvent(input$gatelabr_react_ready, {
      .gatelabr_register_host_manifest(
        session,
        sce_state(),
        dataset_id = dataset_id,
        label = sce_name,
        sample_column = sample_column
      )
    }, once = TRUE, ignoreInit = TRUE)
    shiny::observeEvent(input$gatelabr_host_request, {
      request <- input$gatelabr_host_request
      request_id <- if (is.list(request) &&
          is.character(request$requestId) &&
          length(request$requestId) == 1L) {
        request$requestId
      } else {
        ""
      }
      if (is.list(request) &&
          identical(request$operation, "cancel-compensation") &&
          is.list(request$payload) &&
          is.character(request$payload$requestId) &&
          length(request$payload$requestId) == 1L) {
        .gatelabr_cancel_host_compensation_job(
          compensation_jobs,
          request$payload$requestId
        )
        return(invisible(NULL))
      }
      if (is.list(request) &&
          identical(request$operation, "apply-compensation")) {
        validation_error <- tryCatch(
          {
            if (!is.character(request_id) || length(request_id) != 1L ||
                !nzchar(request_id) || !is.list(request$payload) ||
                !identical(request$payload$datasetId, dataset_id)) {
              stop(
                "GateLab supplied a malformed host compensation request.",
                call. = FALSE
              )
            }
            contract_version <- suppressWarnings(
              as.integer(request$payload$contractVersion)
            )
            if (length(contract_version) != 1L ||
                is.na(contract_version) ||
                !identical(
                  contract_version,
                  .gatelabr_host_compensation_contract_version
                )) {
              stop(
                "GateLab supplied an incompatible compensation contract.",
                call. = FALSE
              )
            }
            NULL
          },
          error = identity
        )
        if (inherits(validation_error, "error")) {
          .gatelabr_send_host_response(
            session,
            request_id,
            FALSE,
            error = conditionMessage(validation_error)
          )
        } else {
          .gatelabr_start_host_compensation_job(
            compensation_jobs,
            sce_state,
            sce_name,
            request,
            dataset_id,
            sample_column,
            session
          )
        }
        return(invisible(NULL))
      }
      response <- tryCatch(
        {
          # A read leaves the global object alone. A write is refused before it is applied when
          # the console replaced the object since the app last wrote it (live.R), so the app's
          # copy never lands on top of a change made at the prompt.
          writes <- is.character(request$operation) && !startsWith(request$operation, "read-")
          if (writes) {
            refused <- .gatelabr_check_write_back(live, sce_name)
            if (!is.null(refused)) stop(refused, call. = FALSE)
          }
          handled <- .gatelabr_handle_host_request(
            sce_state(),
            request,
            dataset_id = dataset_id,
            sample_column = sample_column,
            session = session
          )
          sce_state(handled$sce)
          if (writes) .gatelabr_write_back(live, sce_name, handled$sce)
          if (identical(request$operation, "write-workspace")) {
            signature <- .gatelabr_absent_channel_signature(handled$absent_gates)
            if (!identical(signature, reported$signature)) {
              reported$signature <- signature
              if (nzchar(signature)) {
                message(
                  "GateLabR saved the workspace to `", sce_name, "`. ",
                  .gatelabr_absent_channel_gates_text(handled$absent_gates)
                )
              }
            }
          }
          list(
            requestId = request_id,
            ok = TRUE,
            result = handled$result
          )
        },
        error = function(cause) {
          response <- list(
            requestId = request_id,
            ok = FALSE,
            error = conditionMessage(cause)
          )
          # A revision conflict travels with its numbers so the browser can resync from its
          # own lost write rather than dead-ending until the user reloads.
          if (inherits(cause, "gatelabr_revision_conflict")) {
            response$errorCode <- "workspace-revision-conflict"
            response$errorData <- list(
              expectedRevision = cause$expected_revision,
              currentRevision = cause$current_revision,
              writerId = if (is.na(cause$writer_id)) NULL else cause$writer_id
            )
          }
          response
        }
      )
      session$sendCustomMessage("gatelabr-host-response", response)
    }, ignoreInit = TRUE)
  }
}

.gatelabr_react_asset_dir <- function() {
  if (exists(".gatelabr_src_dir", inherits = TRUE) &&
      !is.null(.gatelabr_src_dir)) {
    for (candidate in c(
      file.path(.gatelabr_src_dir, "inst", "react-app"),
      file.path(.gatelabr_src_dir, "..", "inst", "react-app")
    )) {
      if (file.exists(file.path(candidate, "gatelab-embed.js"))) {
        return(normalizePath(candidate))
      }
    }
  }
  installed <- system.file("react-app", package = "GateLabR")
  if (nzchar(installed) &&
      file.exists(file.path(installed, "gatelab-embed.js"))) {
    return(installed)
  }
  stop(
    "GateLabR's shared React assets are missing. Reinstall GateLabR from a complete source tree.",
    call. = FALSE
  )
}

.gatelabr_react_ui <- function(resource_prefix) {
  module <- sprintf(
    paste0(
      "import { mountGateLab, createShinySceHost } from '/%s/gatelab-embed.js';\n",
      "let mounted = false;\n",
      "const start = () => {\n",
      "  if (mounted) return;\n",
      "  mounted = true;\n",
      "  const root = document.getElementById('gatelabr-react-root');\n",
      "  try {\n",
      "    mountGateLab(root, { host: createShinySceHost() });\n",
      "  } catch (error) {\n",
      "    root.textContent = error instanceof Error ? error.message : String(error);\n",
      "    root.className = 'gatelabr-react-start-error';\n",
      "  }\n",
      "};\n",
      "start();"
    ),
    resource_prefix
  )
  shiny::bootstrapPage(
    title = "GateLabR",
    shiny::tags$head(
      shiny::tags$meta(
        name = "viewport",
        content = "width=device-width, initial-scale=1"
      ),
      shiny::tags$link(
        rel = "stylesheet",
        href = sprintf("/%s/gatelab-embed.css", resource_prefix)
      ),
      shiny::tags$style(shiny::HTML(
        paste0(
          "html, body, #gatelabr-react-root { width:100%; height:100%; ",
          "margin:0; padding:0; overflow:hidden; } ",
          ".gatelabr-react-start-error { padding:24px; color:#b42318; ",
          "font:14px system-ui,sans-serif; }"
        )
      ))
    ),
    shiny::tags$div(
      id = "gatelabr-react-root",
      `data-gatelabr-interface` = "react"
    ),
    shiny::tags$script(type = "module", shiny::HTML(module))
  )
}
