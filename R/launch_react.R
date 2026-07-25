#' Launch GateLabR with the canonical GateLab React interface
#'
#' Starts the shared GateLab TypeScript/React application with a thin Shiny
#' adapter for a \code{SingleCellExperiment}. This is the migration interface;
#' the established R/Shiny interface remains available through
#' \code{\link{launchGatingApp}} until feature-parity validation is complete.
#'
#' @param sce A \code{SingleCellExperiment}. If \code{NULL}, the first SCE in
#'   the global environment is used.
#' @param sample_column Optional \code{colData} column defining samples. When
#'   omitted, common sample columns such as \code{sample_id} are detected.
#' @param port Port for Shiny (default: auto-select).
#' @param launch.browser Whether to open a browser window (default: \code{TRUE}).
#' @return Invisibly \code{NULL}; runs the Shiny app (blocking).
#' @export
launchReactGateLab <- function(
    sce = NULL,
    sample_column = NULL,
    port = NULL,
    launch.browser = TRUE) {
  sce_name <- deparse(substitute(sce))
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
  server <- function(input, output, session) {
    shiny::observeEvent(input$gatelabr_react_ready, {
      .gatelabr_register_host_manifest(
        session,
        sce,
        dataset_id = dataset_id,
        label = sce_name,
        sample_column = sample_column
      )
    }, once = TRUE, ignoreInit = TRUE)
  }

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

.gatelabr_react_asset_dir <- function() {
  if (exists(".gatelabr_src_dir", inherits = TRUE) &&
      !is.null(.gatelabr_src_dir)) {
    candidate <- file.path(.gatelabr_src_dir, "..", "inst", "react-app")
    if (file.exists(file.path(candidate, "gatelab-embed.js"))) {
      return(normalizePath(candidate))
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
