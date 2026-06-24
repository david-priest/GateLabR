# GateLabR — clone + source convenience launcher.
#
# Keeps the original workflow working unchanged:
#   source("path/to/GateLabR/launch.R")
#   launchGatingApp()
#
# (If you installed GateLabR as a package instead, use:
#   library(GateLabR); launchGatingApp() )
#
# This shim just locates the clone and sources the real launcher in R/launch.R,
# which also resolves the bundled app under inst/app/.
local({
  ofile <- NULL
  for (i in seq_len(sys.nframe())) {
    f <- sys.frame(i)
    if (!is.null(f$ofile)) ofile <- f$ofile
  }
  root <- if (!is.null(ofile)) dirname(normalizePath(ofile)) else getwd()
  source(file.path(root, "R", "launch.R"))
})
