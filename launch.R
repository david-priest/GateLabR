#' Launch the CyTOF Gating App
#'
#' @param sce Optional SingleCellExperiment object. If NULL, the app will scan
#'   the global environment for available SCE objects.
#' @param port Port number for Shiny (default: auto-select)
#' @param launch.browser Whether to open in browser (default: TRUE)
#' @export
launchGatingApp <- function(sce = NULL, port = NULL, launch.browser = TRUE) {
  # Resolve app directory: use the captured path from when this file was sourced
  app_dir <- .cytof_gate_env$app_dir
  if (is.null(app_dir) || !file.exists(file.path(app_dir, "app.R"))) {
    stop("Cannot find app.R. Source launch.R from the cytof-gate-app directory first:\n",
         "  source('path/to/cytof-gate-app/launch.R')")
  }

  # Find all SCE objects in the global environment
  sce_names <- character(0)
  for (nm in ls(envir = .GlobalEnv)) {
    tryCatch({
      obj <- get(nm, envir = .GlobalEnv)
      if (methods::is(obj, "SingleCellExperiment")) {
        sce_names <- c(sce_names, nm)
      }
    }, error = function(e) NULL)
  }

  if (!is.null(sce)) {
    # Store the provided SCE with a known name
    sce_var_name <- deparse(substitute(sce))
    if (!sce_var_name %in% sce_names) {
      assign(sce_var_name, sce, envir = .GlobalEnv)
      sce_names <- c(sce_var_name, sce_names)
    }
    .cytof_gate_env$default_sce <- sce_var_name
  } else {
    .cytof_gate_env$default_sce <- if (length(sce_names) > 0) sce_names[1] else NULL
  }

  .cytof_gate_env$sce_names <- sce_names

  if (length(sce_names) == 0) {
    stop("No SingleCellExperiment objects found in the global environment.\n",
         "Load an SCE first, then call launchGatingApp().")
  }

  message("Found SCE objects: ", paste(sce_names, collapse = ", "))

  shiny::runApp(
    appDir = app_dir,
    port = port,
    launch.browser = launch.browser
  )
}

# Internal environment for passing state to the app
.cytof_gate_env <- new.env(parent = emptyenv())
.cytof_gate_env$sce_names <- character(0)
.cytof_gate_env$default_sce <- NULL

# Capture the directory of this script at source time.
# source() pushes a frame with $ofile; iterate all frames to find it.
.cytof_gate_env$app_dir <- tryCatch({
  ofile <- NULL
  for (i in seq_len(sys.nframe())) {
    f <- sys.frame(i)
    if (!is.null(f$ofile)) ofile <- f$ofile
  }
  if (!is.null(ofile)) dirname(normalizePath(ofile)) else stop("ofile not found")
}, error = function(e) getwd())
