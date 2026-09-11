# sce_catalogue.R — the SingleCellExperiment objects a session can switch between.
#
# GateLabR binds to one object at launch. The previous GateLabR-specific Shiny interface let a
# user move between the SCEs already in their session, and that went missing when the React
# interface replaced it in 1.4.0. The host contract never lost the ability: its `datasets` field
# is a list and GateLabHostDatasetPort.listDatasets() returns an array. Only the launcher and the
# app collapsed it to one.
#
# The catalogue below is deliberately CHEAP. It reads dimensions and class, never assay data, so
# listing twenty objects costs nothing; the expensive part -- registering per-sample binary
# resources -- still happens for one object at a time, when it is activated.

#' Names of the SingleCellExperiment objects visible in an environment
#'
#' @param env Environment to scan. Defaults to the global environment, which is where a user's
#'   objects live when they call \code{launchGatingApp()} from the console.
#' @return Character vector of object names, sorted.
#' @keywords internal
.gatelabr_sce_names <- function(env = globalenv()) {
  if (!is.environment(env)) return(character(0))
  names <- ls(envir = env, all.names = FALSE)
  keep <- vapply(names, function(nm) {
    # get0 with inherits = FALSE: a name in an attached package must not masquerade as a
    # session object, or activating it would write results somewhere the user cannot see.
    value <- tryCatch(get0(nm, envir = env, inherits = FALSE), error = function(e) NULL)
    !is.null(value) && methods::is(value, "SingleCellExperiment")
  }, logical(1))
  sort(names[keep])
}

#' Why an object could not be switched to, or NULL
#'
#' The cheap half of what the dataset descriptor checks: no assay data is read. An object the
#' descriptor would refuse is still listed, marked, so the picker says why rather than failing
#' the switch afterwards.
#'
#' @param sce The object.
#' @param sample_column The launch's sample column, which the object must carry if one was given.
#' @return A one-line reason, or NULL when the object can be activated.
#' @keywords internal
.gatelabr_sce_switch_problem <- function(sce, sample_column = NULL) {
  assays <- tryCatch(SummarizedExperiment::assayNames(sce), error = function(e) character(0))
  if (length(assays) == 0L) return("no assays")
  n <- tryCatch(ncol(sce), error = function(e) 0L)
  if (!isTRUE(n > 0L)) return("no events")
  if (!is.null(sample_column)) {
    cols <- tryCatch(colnames(SummarizedExperiment::colData(sce)), error = function(e) character(0))
    if (!(sample_column %in% cols)) return(sprintf("no colData column '%s'", sample_column))
  }
  NULL
}

#' A light catalogue entry for one SingleCellExperiment
#'
#' @param sce The object.
#' @param name Its name in the environment, which is also its dataset id.
#' @param active Whether it is the object currently loaded.
#' @param sample_column The launch's sample column; see \code{.gatelabr_sce_switch_problem}.
#' @return A named list matching the `availableDatasets` entries of the host manifest.
#' @keywords internal
.gatelabr_sce_catalogue_entry <- function(sce, name, active = FALSE, sample_column = NULL) {
  assays <- tryCatch(SummarizedExperiment::assayNames(sce), error = function(e) character(0))
  problem <- .gatelabr_sce_switch_problem(sce, sample_column)
  entry <- list(
    id = name,
    label = name,
    eventCount = tryCatch(ncol(sce), error = function(e) NA_integer_),
    channelCount = tryCatch(nrow(sce), error = function(e) NA_integer_),
    assays = as.character(assays),
    # A workspace already stored in metadata() means gates would come back with the object,
    # which is worth showing in the picker so a switch is not a surprise. Read through the
    # canonical reader so a workspace saved in the older, plain-JSON form counts too.
    hasWorkspace = !is.null(tryCatch(.gatelabr_canonical_workspace_record(sce), error = function(e) NULL)),
    loadable = is.null(problem),
    active = isTRUE(active)
  )
  if (!is.null(problem)) entry$problem <- problem
  entry
}

#' The catalogue of switchable SingleCellExperiments
#'
#' @param env Environment to scan.
#' @param active_name Name of the object currently loaded, marked \code{active}.
#' @param sample_column The launch's sample column; an object lacking it is listed as not loadable.
#' @return An unnamed list of catalogue entries, suitable for the host manifest.
#' @keywords internal
.gatelabr_sce_catalogue <- function(env = globalenv(), active_name = NULL, sample_column = NULL) {
  names <- .gatelabr_sce_names(env)
  # The active object is listed even when it does not live in `env` -- launchGatingApp(sce = f())
  # is legitimate, and a picker that omitted the object on screen would be wrong.
  if (!is.null(active_name) && nzchar(active_name) && !(active_name %in% names)) {
    names <- c(active_name, names)
  }
  entries <- lapply(names, function(nm) {
    value <- tryCatch(get0(nm, envir = env, inherits = FALSE), error = function(e) NULL)
    if (is.null(value) || !methods::is(value, "SingleCellExperiment")) return(NULL)
    .gatelabr_sce_catalogue_entry(value, nm, active = identical(nm, active_name), sample_column = sample_column)
  })
  entries <- Filter(Negate(is.null), entries)
  unname(entries)
}

#' Fetch a named SingleCellExperiment for activation
#'
#' Refuses anything that is not an SCE rather than returning it, so a mistyped or shadowed name
#' cannot replace the loaded object with something the host cannot describe.
#'
#' @param name Object name.
#' @param env Environment to read from.
#' @return The object.
#' @keywords internal
.gatelabr_sce_by_name <- function(name, env = globalenv()) {
  if (!is.character(name) || length(name) != 1L || !nzchar(name)) {
    stop("A dataset id must be a single non-empty name.", call. = FALSE)
  }
  value <- tryCatch(get0(name, envir = env, inherits = FALSE), error = function(e) NULL)
  if (is.null(value)) {
    stop(sprintf("No object named '%s' in the session.", name), call. = FALSE)
  }
  if (!methods::is(value, "SingleCellExperiment")) {
    stop(sprintf("'%s' is a %s, not a SingleCellExperiment.", name, class(value)[1]),
         call. = FALSE)
  }
  value
}
