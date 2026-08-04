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
  launchReactGateLab(
    sce = sce,
    sample_column = sample_column,
    port = port,
    launch.browser = launch.browser
  )
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
