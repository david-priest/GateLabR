# import_gate.R -- put a gate that already exists into a workspace, without redrawing it.
#
# Every other way into a workspace is the app: you draw a gate and it is yours. That is fine
# while every gate is new. It stops being fine when a gate already exists and must not change
# -- a gate behind a published figure, drawn before this package did, or one arriving from a
# FlowJo workspace. Those have coordinates and nothing to put them in.
#
# The one thing this deliberately does NOT do is decide which events fall inside the gate.
# memberships.R says why: that is settled in the browser, per gate space and transform, and a
# second engine in R could silently disagree. So an import writes geometry, bumps the workspace
# revision, and leaves the stored memberships alone. The revisions then disagree, which is a
# state the package already handles loudly -- gatelabPopulations() refuses and says to press
# "Save to SCE". Opening the app once computes membership with the only engine there is.

#' @title Import an existing gate into a workspace
#' @description Insert a gate whose geometry is already known into the GateLab workspace stored
#'   on an SCE, creating a population for it under `parent`. Nothing is redrawn and no event
#'   membership is computed.
#'
#'   The gate's **channels are recorded with it**, which is the point. Coordinates on their own
#'   can be replotted against any pair of channels and will still look like a gate; a workspace
#'   gate carries `x_channel` and `y_channel` and is checked against the SCE.
#'
#'   Membership is computed in the browser, never here. After importing, the workspace revision
#'   is ahead of the memberships revision and [gatelabPopulations()] will refuse to return a
#'   stale mask. Open the app and press **Save to SCE** to bring them back in step.
#'
#' @param sce A `SingleCellExperiment` carrying a GateLab workspace. Draw and save one gate in
#'   the app first if it has none; synthesising an empty workspace is not supported here,
#'   because the sample identities and assay bindings it must agree with are the app's to write.
#' @param name Name for the gate, and for the population created from it.
#' @param x_channel,y_channel Channels the gate was drawn on. Both must exist in the SCE.
#' @param vertices Coordinates, as a two-column matrix or data frame, or a list of pairs.
#'   A `polygon` needs at least three; a `rectangle` needs exactly two, opposite corners.
#'   Ignored for `quadrant`, which takes `center` instead.
#' @param gate_type `"polygon"` (default) or `"rectangle"`. `"quadrant"` and `"ellipse"` are
#'   not importable yet: a quadrant needs one population per quadrant to be useful, and an
#'   ellipse is stored as Gating-ML parameters rather than as vertices.
#' @param parent Population to gate inside, by id or by name. Defaults to the root.
#' @param color Gate colour in the app. Defaults to GateLab's first palette entry.
#' @param overwrite Replace a gate of the same name. Default `FALSE`: a gate is the record of a
#'   decision, and silently replacing one is how a decision disappears.
#' @return The `sce`, with the gate added to `metadata(sce)$gatelab_workspace`.
#' @seealso [gatelabHierarchy()], [gatelabPopulations()]
#' @export
#' @examples
#' \dontrun{
#' poly <- read.csv("data/gates/CD40L_ICOS_positive.csv", check.names = FALSE)
#' meta <- yaml::read_yaml("data/gates/CD40L_ICOS_positive.yaml")
#' sce <- gatelabImportGate(sce, name = meta$gate,
#'                          x_channel = meta$x_channel, y_channel = meta$y_channel,
#'                          vertices = poly)
#' # then: launchGatingApp(sce) -> Save to SCE -> gatelabPopulations(sce)
#' }
gatelabImportGate <- function(sce,
                              name,
                              x_channel,
                              y_channel,
                              vertices = NULL,
                              gate_type = c("polygon", "rectangle"),
                              parent = NULL,
                              color = "#4C7DF0",
                              overwrite = FALSE) {
  gate_type <- match.arg(gate_type)
  .gatelabr_import_string(name, "name")
  .gatelabr_import_string(x_channel, "x_channel")
  .gatelabr_import_string(y_channel, "y_channel")
  if (!methods::is(sce, "SingleCellExperiment")) {
    stop("sce must be a SingleCellExperiment.", call. = FALSE)
  }

  stored <- S4Vectors::metadata(sce)$gatelab_workspace
  if (!is.list(stored) || !is.character(stored$workspace_json) ||
      length(stored$workspace_json) != 1L || !nzchar(stored$workspace_json)) {
    stop("This SCE carries no GateLab workspace to import into.\n",
         "  Open it with launchGatingApp(), draw any gate, and press \"Save to SCE\" once.\n",
         "  The sample identities and assay bindings a workspace must agree with are written\n",
         "  by the app, so they are not synthesised here.", call. = FALSE)
  }

  # Channels are checked against the SCE up front. A gate on a channel this object does not
  # have is unrecoverable later, and the near-miss list is what makes a typo obvious.
  channels <- rownames(sce)
  for (nm in c(x_channel, y_channel)) {
    if (!nm %in% channels) {
      near <- channels[tolower(channels) == tolower(nm)]
      if (!length(near)) near <- base::agrep(nm, channels, max.distance = 0.3, value = TRUE)
      stop("channel '", nm, "' is not in this SCE.",
           if (length(near)) paste0("\n  did you mean: ", paste(near, collapse = ", ")) else "",
           call. = FALSE)
    }
  }

  parsed <- jsonlite::fromJSON(stored$workspace_json, simplifyVector = FALSE)
  gating <- parsed$gating
  if (!is.list(gating) || !is.list(gating$populations)) {
    stop("The stored workspace has no gating graph to add to.", call. = FALSE)
  }

  existing <- vapply(gating$gates, function(g) as.character(g$name), character(1),
                     USE.NAMES = FALSE)
  if (name %in% existing) {
    if (!isTRUE(overwrite)) {
      stop("a gate called '", name, "' is already in this workspace.\n",
           "  Pass overwrite = TRUE to replace it, or pick another name. A gate is the record\n",
           "  of a decision, so this never replaces one by default.", call. = FALSE)
    }
    parsed <- .gatelabr_import_drop_gate(parsed, names(gating$gates)[existing == name])
    gating <- parsed$gating
  }

  parent_id <- .gatelabr_import_resolve_parent(gating, parent)
  gate_id <- .gatelabr_import_id("gate")
  population_id <- .gatelabr_import_id("pop")

  gate <- list(gate_id = gate_id, name = name, gate_type = gate_type,
               x_channel = x_channel, y_channel = y_channel, color = as.character(color),
               vertices = .gatelabr_import_vertices(vertices, gate_type, name))

  population <- list(population_id = population_id, name = name,
                     gate_refs = list(list(gate_id = gate_id, include = TRUE)),
                     gate_logic = "and", parent_id = parent_id, children = list())

  parsed$gating$gates[[gate_id]] <- gate
  parsed$gating$gate_order <- c(as.list(parsed$gating$gate_order), gate_id)
  parsed$gating$populations[[population_id]] <- population
  parsed$gating$populations[[parent_id]]$children <-
    c(as.list(parsed$gating$populations[[parent_id]]$children), population_id)

  workspace_json <- jsonlite::toJSON(parsed, auto_unbox = TRUE, null = "null", digits = NA)

  # Validate through the app's own door rather than a second set of rules: this re-checks the
  # format, the sample identities against the SCE, the compensation bindings, the whole gating
  # graph and every channel. If it throws, the object is untouched.
  .gatelabr_validate_canonical_workspace_json(
    sce, as.character(workspace_json),
    dataset_id = .gatelabr_or(stored$dataset_id, "gatelabr-sce"),
    sample_column = stored$sample_column)

  stored$workspace_json <- as.character(workspace_json)
  stored$revision <- as.integer(.gatelabr_or(stored$revision, 0L)) + 1L
  stored$saved_at <- as.character(Sys.time())
  stored$reason <- "gate imported from R"
  S4Vectors::metadata(sce)$gatelab_workspace <- stored

  memb <- stored$memberships$revision
  message(sprintf(
    paste0("Imported '%s' (%s on %s x %s) under '%s'. Workspace is now revision %d.\n",
           "  Memberships are%s stale: which events fall inside a gate is decided in the app.\n",
           "  Open this SCE with launchGatingApp() and press \"Save to SCE\" to compute them."),
    name, gate_type, x_channel, y_channel,
    gating$populations[[parent_id]]$name, stored$revision,
    if (is.null(memb)) " absent, not" else ""))
  sce
}


# -- helpers ------------------------------------------------------------------------------

# Package-local rather than base R's %||%, which only exists from R 4.4: a shadowed
# operator is a confusing thing to debug and this buys nothing.
.gatelabr_or <- function(x, y) if (is.null(x)) y else x

.gatelabr_import_string <- function(value, what) {
  if (!is.character(value) || length(value) != 1L || is.na(value) || !nzchar(trimws(value))) {
    stop(what, " must be a single non-empty string.", call. = FALSE)
  }
  invisible(TRUE)
}

# Ids only have to be unique within the workspace and stable once written; the app never
# parses them. The prefix makes a hand-inspected workspace readable.
.gatelabr_import_id <- function(prefix) {
  paste0(prefix, "-import-", format(Sys.time(), "%Y%m%d%H%M%S"), "-",
         paste(sample(c(letters, 0:9), 6L, replace = TRUE), collapse = ""))
}

.gatelabr_import_resolve_parent <- function(gating, parent) {
  ids <- names(gating$populations)
  if (is.null(parent)) return(as.character(gating$root_population_id))
  .gatelabr_import_string(parent, "parent")
  if (parent %in% ids) return(parent)
  names_here <- vapply(gating$populations, function(p) as.character(p$name), character(1),
                       USE.NAMES = FALSE)
  hit <- which(names_here == parent)
  if (length(hit) == 1L) return(ids[[hit]])
  if (length(hit) > 1L) {
    stop("'", parent, "' names ", length(hit), " populations; pass a population id instead.",
         call. = FALSE)
  }
  stop("no population called '", parent, "' in this workspace.\n  populations: ",
       paste(names_here, collapse = ", "), call. = FALSE)
}

.gatelabr_import_vertices <- function(vertices, gate_type, name) {
  if (is.null(vertices)) {
    stop("gate '", name, "' needs vertices.", call. = FALSE)
  }
  if (is.list(vertices) && !is.data.frame(vertices) &&
      all(vapply(vertices, length, integer(1)) == 2L)) {
    vertices <- do.call(rbind, lapply(vertices, function(p) as.numeric(unlist(p))))
  }
  vertices <- as.matrix(vertices)
  if (ncol(vertices) != 2L) {
    stop("gate '", name, "' needs exactly two coordinate columns, got ", ncol(vertices), ".",
         call. = FALSE)
  }
  storage.mode(vertices) <- "double"
  if (anyNA(vertices) || any(!is.finite(vertices))) {
    stop("gate '", name, "' has non-finite vertices.", call. = FALSE)
  }
  need <- if (identical(gate_type, "rectangle")) 2L else 3L
  if (nrow(vertices) < need) {
    stop("a ", gate_type, " needs at least ", need, " vertices; gate '", name, "' has ",
         nrow(vertices), ".", call. = FALSE)
  }
  if (identical(gate_type, "rectangle") && nrow(vertices) != 2L) {
    stop("a rectangle takes exactly two opposite corners; gate '", name, "' has ",
         nrow(vertices), ".", call. = FALSE)
  }
  lapply(seq_len(nrow(vertices)), function(i) as.list(unname(vertices[i, ])))
}

.gatelabr_import_drop_gate <- function(parsed, gate_id) {
  parsed$gating$gates[[gate_id]] <- NULL
  parsed$gating$gate_order <- Filter(function(x) !identical(as.character(x), gate_id),
                                     as.list(parsed$gating$gate_order))
  keep <- vapply(parsed$gating$populations, function(p) {
    refs <- p$gate_refs
    !length(refs) || !any(vapply(refs, function(r) identical(as.character(r$gate_id), gate_id),
                                 logical(1)))
  }, logical(1))
  dropped <- names(parsed$gating$populations)[!keep]
  for (pid in dropped) {
    par <- parsed$gating$populations[[pid]]$parent_id
    if (!is.null(par) && !is.null(parsed$gating$populations[[par]])) {
      parsed$gating$populations[[par]]$children <- Filter(
        function(x) !identical(as.character(x), pid),
        as.list(parsed$gating$populations[[par]]$children))
    }
    parsed$gating$populations[[pid]] <- NULL
  }
  parsed
}
