#' Launch GateLabR
#'
#' Opens the canonical GateLab React interface with a thin
#' \code{SingleCellExperiment} host. Works both from an installed package
#' (\code{library(GateLabR); launchGatingApp()}) and from a source clone
#' (\code{source("launch.R"); launchGatingApp()}).
#'
#' @param sce Optional \code{SingleCellExperiment}. If \code{NULL}, the first
#'   SCE in the global environment is used.
#' @param sample_column Optional \code{colData} column defining samples. When
#'   omitted, common sample columns such as \code{sample_id} are detected.
#' @param port Port for Shiny (default: auto-select).
#' @param launch.browser Whether to open a browser window (default: \code{TRUE}).
#' @return Invisibly \code{NULL}; runs the Shiny app (blocking).
#' @export
launchGatingApp <- function(
    sce = NULL,
    sample_column = NULL,
    port = NULL,
    launch.browser = TRUE) {
  # Forward the caller's own symbol. substitute() resolves in THIS frame, so
  # without this the callee would only ever see the local parameter name `sce`
  # and would write every result back to a global called "sce" instead of the
  # object the user launched on.
  supplied <- substitute(sce)
  launchReactGateLab(
    sce = sce,
    sample_column = sample_column,
    port = port,
    launch.browser = launch.browser,
    sce_name = if (is.symbol(supplied)) deparse(supplied) else ""
  )
}

#' Launch the previous GateLabR Shiny interface
#'
#' Opens the original GateLabR-specific Shiny application. This transition
#' launcher remains available for workflows that have not yet moved to the
#' shared React interface, including the former Shiny-only UMAP view.
#'
#' @inheritParams launchGatingApp
#' @return Invisibly \code{NULL}; runs the Shiny app (blocking).
#' @export
launchLegacyGateLabR <- function(
    sce = NULL,
    port = NULL,
    launch.browser = TRUE) {
  app_dir <- .gatelabr_app_dir()

  # Say which copy is running. When sourced, the launcher lives in the global
  # environment and shadows the installed package's, so this disambiguates.
  installed <- system.file("app", package = "GateLabR")
  is_installed <- nzchar(installed) &&
    identical(normalizePath(installed, mustWork = FALSE),
              normalizePath(app_dir,   mustWork = FALSE))
  message("GateLabR: launching the ", if (is_installed) "installed package" else "source clone",
          " app\n  ", app_dir)

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
  # When launched via source() from a clone, prefer THAT clone's app so local
  # edits take effect — even if an installed copy also exists. Fall back to the
  # installed package when loaded as a library (no source dir captured).
  if (!is.null(.gatelabr_src_dir)) {
    for (dev in c(
      file.path(.gatelabr_src_dir, "inst", "app"),
      file.path(.gatelabr_src_dir, "..", "inst", "app")
    )) {
      if (file.exists(file.path(dev, "app.R"))) return(normalizePath(dev))
    }
  }
  d <- system.file("app", package = "GateLabR")
  if (nzchar(d) && file.exists(file.path(d, "app.R"))) return(d)
  stop("Could not locate the GateLabR app directory (looked in ../inst/app and ",
       "the installed package). When using source(), source launch.R from a ",
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
