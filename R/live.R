# live.R -- the running app as something the console can reach: stop it, hand it the console's
# object, and know whether the console's object was replaced behind its back.
#
# With Shiny 1.14 the launcher starts the app without blocking (shiny::startApp()), so the prompt
# comes back while the app runs and the user can change the object in the console. The app holds
# its own copy of the object in a reactive value and, after every request it handles, assigns that
# copy to the global name it was launched on. Left alone, that assignment would overwrite whatever
# the console had done to the object meanwhile, silently. So the app remembers the address of the
# object it last assigned and, before writing, checks that the global binding is still that object:
# if it is not, a write is refused with a message naming the way out, and a read goes ahead without
# assigning. gatelabSync() is the way out: it hands the console's object to the app.

.gatelabr_live <- new.env(parent = emptyenv())

.gatelabr_object_address <- function(object) {
  if (is.null(object)) NA_character_ else rlang::obj_address(object)
}

#' Whether the global binding named `sce_name` is no longer the object at `address`.
#'
#' The record keeps a reference to the object it last wrote (`live$written`), so that object
#' stays allocated and its address cannot be handed to a newer object while the comparison is
#' in use. NA means nothing was written yet, and nothing is reported replaced.
#' @noRd
.gatelabr_object_replaced <- function(sce_name, address) {
  if (is.null(address) || is.na(address)) return(FALSE)
  current <- get0(sce_name, envir = .GlobalEnv, inherits = FALSE)
  if (is.null(current)) return(TRUE)
  !identical(.gatelabr_object_address(current), address)
}

.gatelabr_replaced_message <- function(sce_name) {
  paste0(
    "The object `", sce_name, "` in your console was replaced after GateLabR last wrote to it, ",
    "so this save was not written: it would have overwritten your change. Run ",
    "GateLabR::gatelabSync(\"", sce_name, "\") to hand the console's object to the app and save ",
    "again, or stop the app and relaunch on the object."
  )
}

#' The function that starts a Shiny app without blocking, when the installed Shiny has one.
#'
#' Shiny 1.14 exports startApp(), which returns a handle while the later event loop services the
#' app whenever R is idle. Older Shiny has an internal function of the same name with a different
#' job, so the export list is what is checked, not the namespace.
#' @noRd
.gatelabr_start_app_fn <- function() {
  if (!"startApp" %in% getNamespaceExports("shiny")) return(NULL)
  get("startApp", envir = asNamespace("shiny"))
}

#' Whether a write to the global object may go ahead, and the message when it may not.
#'
#' Called before every write the app makes to the global object. The compensation job calls it
#' from a later callback and the request handler from a Shiny observer; both refuse the write
#' when the console replaced the object, so a change made at the prompt is never overwritten by
#' the app's next save. The message is said once per replacement at the console, where the user
#' is, and travels to the browser with every refused request.
#' @noRd
.gatelabr_check_write_back <- function(live, sce_name) {
  if (!.gatelabr_object_replaced(sce_name, live$address)) return(NULL)
  text <- .gatelabr_replaced_message(sce_name)
  current <- .gatelabr_object_address(get0(sce_name, envir = .GlobalEnv, inherits = FALSE))
  if (!identical(live$refused_address, current)) {
    live$refused_address <- current
    message("GateLabR: ", text)
  }
  text
}

#' Assign the app's object to the global name after a write, and remember which object that is.
#' @noRd
.gatelabr_write_back <- function(live, sce_name, sce) {
  assign(sce_name, sce, envir = .GlobalEnv)
  live$written <- sce
  live$address <- .gatelabr_object_address(sce)
  live$refused_address <- NULL
  invisible(sce)
}

#' Stop the running GateLabR app
#'
#' The app started by \code{\link{launchGatingApp}} without blocking keeps running after the
#' prompt returns. This stops it, which also removes its resource path, stops its compensation
#' backend and says whether population memberships are stored (see
#' \code{\link{launchReactGateLab}}). Nothing happens when no app is running.
#'
#' @return Invisibly \code{TRUE} when an app was stopped, \code{FALSE} when none was running.
#' @export
gatelabStop <- function() {
  handle <- .gatelabr_live$handle
  if (is.null(handle)) {
    message("GateLabR: no app is running.")
    return(invisible(FALSE))
  }
  handle$stop()
  invisible(TRUE)
}

#' Hand the console's object to the running app
#'
#' While the app runs without blocking, the console can change the object it was launched on
#' (\code{sce <- ...}, a new \code{colData} column, a subset). The app notices that the global
#' binding is no longer the object it last wrote and refuses to save until told which object to
#' work on. This tells it: the app takes the console's object as its own, and its next save
#' writes back to that.
#'
#' @param sce_name The global name the app was launched on; the running app's name when omitted.
#' @return Invisibly the object handed over.
#' @export
gatelabSync <- function(sce_name = NULL) {
  live <- .gatelabr_live
  if (is.null(live$set_sce)) stop("GateLabR: no app is running.", call. = FALSE)
  if (is.null(sce_name)) sce_name <- live$sce_name
  if (!identical(sce_name, live$sce_name)) {
    stop("The running app was launched on `", live$sce_name, "`, not `", sce_name, "`.", call. = FALSE)
  }
  object <- get0(sce_name, envir = .GlobalEnv, inherits = FALSE)
  if (!methods::is(object, "SingleCellExperiment")) {
    stop("`", sce_name, "` in the global environment is not a SingleCellExperiment.", call. = FALSE)
  }
  # The browser keeps the events it loaded at launch, so the object handed over must hold the
  # same cells in the same order; anything else needs a relaunch, not a sync.
  current <- live$get_sce()
  if (ncol(object) != ncol(current) || !identical(colnames(object), colnames(current))) {
    stop(
      "`", sce_name, "` holds ", ncol(object), " cells and the app was launched with ",
      ncol(current), ": the browser keeps the cells it loaded. Stop the app (gatelabStop()) ",
      "and relaunch on the object.",
      call. = FALSE
    )
  }
  live$set_sce(object)
  live$written <- object
  live$address <- .gatelabr_object_address(object)
  live$refused_address <- NULL
  message("GateLabR: the app now works on `", sce_name, "` as it is in your console.")
  invisible(object)
}
