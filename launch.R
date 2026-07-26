# GateLabR — clone + source convenience launcher.
#
# Keeps the original workflow working unchanged:
#   source("path/to/GateLabR/launch.R")
#   launchGatingApp()
#
# (If you installed GateLabR as a package instead, use:
#   library(GateLabR); launchGatingApp() )
#
# This shim sources the small R/SCE host and both launchers from the clone.
local({
  target <- parent.env(environment())
  candidates <- character(0)
  for (i in seq_len(sys.nframe())) {
    f <- sys.frame(i)
    if (is.null(f$ofile)) next
    candidates <- c(
      candidates,
      dirname(normalizePath(f$ofile, mustWork = FALSE))
    )
  }
  candidate <- normalizePath(getwd(), mustWork = FALSE)
  repeat {
    candidates <- c(candidates, candidate)
    parent <- dirname(candidate)
    if (identical(parent, candidate)) break
    candidate <- parent
  }
  candidates <- unique(candidates)
  roots <- candidates[file.exists(file.path(
    candidates,
    "R",
    "host_bridge.R"
  ))]
  if (length(roots) == 0L) {
    stop("Could not locate the GateLabR source clone.", call. = FALSE)
  }
  root <- roots[[1]]
  for (file in c(
    "workspace_validation.R",
    "host_compensation.R",
    "host_bridge.R",
    "host_compensation_jobs.R",
    "launch_react.R",
    "launch.R"
  )) {
    sys.source(file.path(root, "R", file), envir = target)
  }
})
