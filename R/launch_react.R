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
#' @return Invisibly \code{NULL}; runs the Shiny app (blocking).
#' @export
launchReactGateLab <- function(
    sce = NULL,
    sample_column = NULL,
    port = NULL,
    launch.browser = TRUE,
    sce_name = NULL) {
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
  # Likewise for an inferred assay role: the user must know what was assumed
  # about their data before they gate on it.
  precompensation <- tryCatch(
    .gatelabr_precompensation_note(sce),
    error = function(cause) {
      # Never fail a launch over an advisory note, but never swallow it either:
      # a silent NULL is indistinguishable from "nothing detected", which sends
      # anyone debugging an assay-role question down the wrong path.
      warning(
        "GateLabR could not check whether this SCE is already compensated: ",
        conditionMessage(cause),
        call. = FALSE
      )
      NULL
    }
  )
  if (!is.null(precompensation)) message(precompensation)

  assets <- .gatelabr_react_asset_dir()
  prefix <- paste0(
    "gatelabr-core-",
    Sys.getpid(),
    "-",
    paste(sample(c(letters, 0:9), 8L, replace = TRUE), collapse = "")
  )
  shiny::addResourcePath(prefix, assets)
  on.exit(shiny::removeResourcePath(prefix), add = TRUE)

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
  on.exit(
    .gatelabr_stop_compensation_backend(compensation_backend),
    add = TRUE
  )
  server <- .gatelabr_react_server(
    sce_state = sce_state,
    sce_name = sce_name,
    dataset_id = dataset_id,
    sample_column = sample_column
  )

  message(
    "GateLabR: launching the shared GateLab React interface\n",
    "  SCE: ", sce_name, "\n",
    "  Core assets: ", assets
  )
  shiny::runApp(
    shiny::shinyApp(ui = ui, server = server),
    port = port,
    launch.browser = launch.browser
  )
}

.gatelabr_react_server <- function(
    sce_state,
    sce_name,
    dataset_id,
    sample_column = NULL) {
  force(sce_state)
  force(sce_name)
  force(dataset_id)
  force(sample_column)
  compensation_jobs <- .gatelabr_new_host_compensation_jobs()

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
          handled <- .gatelabr_handle_host_request(
            sce_state(),
            request,
            dataset_id = dataset_id,
            sample_column = sample_column,
            session = session
          )
          sce_state(handled$sce)
          assign(sce_name, handled$sce, envir = .GlobalEnv)
          list(
            requestId = request_id,
            ok = TRUE,
            result = handled$result
          )
        },
        error = function(cause) {
          list(
            requestId = request_id,
            ok = FALSE,
            error = conditionMessage(cause)
          )
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
