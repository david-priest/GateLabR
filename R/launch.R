#' Launch the GateLabR interactive gating app
#'
#' Opens the GateLabR Shiny application in a browser. Works both from an
#' installed package (\code{library(GateLabR); launchGatingApp()}) and from a
#' source clone (\code{source("launch.R"); launchGatingApp()}).
#'
#' @param sce Optional \code{SingleCellExperiment}. If \code{NULL}, the app scans
#'   the global environment for any \code{SingleCellExperiment} objects and lets
#'   you pick one (or import FCS files directly).
#' @param port Port for Shiny (default: auto-select).
#' @param launch.browser Whether to open a browser window (default: \code{TRUE}).
#' @return Invisibly \code{NULL}; runs the Shiny app (blocking).
#' @export
launchGatingApp <- function(sce = NULL, port = NULL, launch.browser = TRUE) {
  app_dir <- .gatelabr_app_dir()

  # Discover SingleCellExperiment objects already in the global environment.
  sce_names <- character(0)
  for (nm in ls(envir = .GlobalEnv)) {
    ok <- tryCatch(methods::is(get(nm, envir = .GlobalEnv), "SingleCellExperiment"),
                   error = function(e) FALSE)
    if (isTRUE(ok)) sce_names <- c(sce_names, nm)
  }

  default_sce <- NULL
  if (!is.null(sce)) {
    sce_var_name <- deparse(substitute(sce))
    if (!sce_var_name %in% sce_names) {
      assign(sce_var_name, sce, envir = .GlobalEnv)
      sce_names <- c(sce_var_name, sce_names)
    }
    default_sce <- sce_var_name
  } else if (length(sce_names) > 0) {
    default_sce <- sce_names[1]
  }

  # The app is sourced into a fresh environment whose parent is the global
  # environment, so it reads `.cytof_gate_env` from there via lexical scoping.
  # Publish (or update) it in the global environment before launching.
  env <- if (exists(".cytof_gate_env", envir = .GlobalEnv, inherits = FALSE)) {
    get(".cytof_gate_env", envir = .GlobalEnv)
  } else {
    new.env(parent = emptyenv())
  }
  env$sce_names   <- sce_names
  env$default_sce <- default_sce
  assign(".cytof_gate_env", env, envir = .GlobalEnv)

  if (length(sce_names) == 0) {
    message("No SingleCellExperiment objects found. Launching GateLabR in blank mode; use Import FCS to load data.")
  } else {
    message("Found SCE objects: ", paste(sce_names, collapse = ", "))
  }

  shiny::runApp(appDir = app_dir, port = port, launch.browser = launch.browser)
}

#' Locate the bundled Shiny app directory.
#' Installed package -> system.file("app"); source clone -> ../inst/app relative
#' to this file (captured at source time in .gatelabr_src_dir).
#' @keywords internal
#' @noRd
.gatelabr_app_dir <- function() {
  d <- system.file("app", package = "GateLabR")
  if (nzchar(d) && file.exists(file.path(d, "app.R"))) return(d)
  if (!is.null(.gatelabr_src_dir)) {
    dev <- file.path(.gatelabr_src_dir, "..", "inst", "app")
    if (file.exists(file.path(dev, "app.R"))) return(normalizePath(dev))
  }
  stop("Could not locate the GateLabR app directory (looked in the installed ",
       "package and ../inst/app). When using source(), source R/launch.R from a ",
       "GateLabR clone.")
}

# Directory of this file, captured when it is source()d from a clone (a frame
# carries $ofile then). NULL when the installed package is loaded, in which case
# system.file() is used instead.
.gatelabr_src_dir <- local({
  d <- NULL
  for (i in seq_len(sys.nframe())) {
    f <- sys.frame(i)
    if (!is.null(f$ofile)) d <- f$ofile
  }
  if (!is.null(d)) dirname(normalizePath(d)) else NULL
})
