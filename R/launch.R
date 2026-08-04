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
#' @param uncompensated Optional read-only \code{SingleCellExperiment} holding the
#'   pre-compensation values for the same cells, for workflows that compensate in
#'   place and keep the original in a separate object. It is served as the
#'   Original layer for comparison and is never modified or written back; only
#'   \code{sce} is saved to. Cell count, cell order and channels must match
#'   exactly or the launch is refused.
#' @return Invisibly \code{NULL}; runs the Shiny app (blocking).
#' @export
launchGatingApp <- function(
    sce = NULL,
    sample_column = NULL,
    port = NULL,
    launch.browser = TRUE,
    uncompensated = NULL) {
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
    sce_name = if (is.symbol(supplied)) deparse(supplied) else "",
    uncompensated = uncompensated
  )
}

#' Launch the previous GateLabR Shiny interface (defunct)
#'
#' The GateLabR-specific Shiny interface was retired in GateLabR 2.0.0.
#' GateLabR now has a single entry point, \code{\link{launchGatingApp}}, which
#' starts the shared GateLab React interface.
#'
#' The entry point is kept only so that existing scripts fail with an
#' explanation instead of \dQuote{could not find function}. It never starts an
#' application.
#'
#' @param ... Ignored.
#' @return Never returns; always signals an error.
#' @export
launchLegacyGateLabR <- function(...) {
  .Defunct(
    new = "launchGatingApp",
    msg = paste0(
      "launchLegacyGateLabR() is defunct. The previous GateLabR-specific ",
      "Shiny interface was retired in GateLabR 2.0.0. Use launchGatingApp(), ",
      "which starts the shared GateLab React interface."
    )
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
