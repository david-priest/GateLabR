# gatingset_export.R -- a SingleCellExperiment's gating as a flowWorkspace GatingSet.
#
# What a GatingSet has that an SCE does not is a gating the rest of the ecosystem can read and
# run: flowWorkspace recomputes it, ggcyto draws it, openCyto builds on it, CytoML exports it.
# An SCE gated in the app holds its gates as GateLab's record and its memberships as bitsets.
# This builds a GatingSet from the two: the drawn assay as each sample's events, one
# transformerList from the transforms the object states (rowData(sce)$gatelab_transform, or the
# gates' own), and every population of one hierarchy written as the Save to GatingSet writes
# them -- a flowWorkspace gate where the space allows, the exact membership otherwise, each gate
# recomputed and checked against the stored membership. The GateLab record travels as the
# keyword the GatingSet host reads, so the result opens in GateLabR with its whole workspace.

#' Build a flowWorkspace GatingSet from a gated SingleCellExperiment
#'
#' The samples and events of \code{sce} as a \code{GatingSet}, with the populations the app
#' stored at the last "Save to SCE" written to its hierarchy: a rectangle, polygon or ellipse
#' drawn in the space the object's transforms give becomes that flowWorkspace gate, a negated
#' gate a negated node, and any other population its exact per-sample membership. Each gate
#' written is recomputed by flowWorkspace and replaced by the membership if it selected other
#' events, so every node holds the events the app showed. The channels are transformed as the
#' object states (\code{\link{gatelabTransforms}}), and the GateLab workspace is carried as a
#' keyword, so \code{launchGatingApp()} on the result opens the same workspace.
#'
#' @param sce A \code{SingleCellExperiment} saved from the app with "Save to SCE".
#' @param assay The assay to take the events from: by default the one the workspace was drawn
#'   from, which for an assay in arcsinh units is put back to nominal linear values through the
#'   cofactor the app used, as the app does.
#' @param hierarchy Which hierarchy to write (\code{NULL} means the active one).
#' @param sample_column The colData column that defines samples, as for
#'   \code{\link{launchGatingApp}}.
#' @param allow_stale Write memberships whose workspace revision is behind the stored workspace.
#' @return A \code{GatingSet}, invisibly; a message says which populations went as gates and
#'   which as memberships. flowWorkspace is required.
#' @export
gatelabGatingSet <- function(sce, assay = NULL, hierarchy = NULL, sample_column = NULL, allow_stale = FALSE) {
  .gatelabr_require_gatingset_support()
  if (!methods::is(sce, "SingleCellExperiment")) {
    stop("sce must be a SingleCellExperiment saved from the app.", call. = FALSE)
  }
  record <- .gatelabr_memberships_record(sce, allow_stale)
  hierarchy_id <- .gatelabr_resolve_hierarchy(record, hierarchy)
  workspace <- .gatelabr_canonical_workspace_record(sce)
  parsed <- tryCatch(jsonlite::fromJSON(workspace$workspace_json, simplifyVector = FALSE),
                     error = function(cause) stop("The stored workspace is unreadable: ", conditionMessage(cause), call. = FALSE))
  tree <- .gatelabr_workspace_tree(parsed, hierarchy_id)

  # The events: the drawn assay, as linear values.
  assay_names <- SummarizedExperiment::assayNames(sce)
  if (is.null(assay)) {
    drawn <- parsed$hostedAssayId
    assay <- if (is.character(drawn) && length(drawn) == 1L && drawn %in% assay_names) drawn else
      if ("counts" %in% assay_names) "counts" else assay_names[[1]]
  }
  if (!assay %in% assay_names) stop("The SCE has no assay '", assay, "'.", call. = FALSE)
  values <- as.matrix(SummarizedExperiment::assay(sce, assay))
  storage.mode(values) <- "double"
  if (identical(.gatelabr_assay_coordinate_space(sce, assay), "display")) {
    cofactor <- .gatelabr_display_cofactor(sce)$cofactor
    values <- cofactor * sinh(values)
    message("Assay `", assay, "` is in arcsinh units; the GatingSet holds cofactor * sinh of it, as the app drew it.")
  }
  descriptors <- .gatelabr_channel_descriptors(sce)
  ids <- vapply(descriptors, `[[`, character(1), "id")
  pns <- vapply(descriptors, function(channel) if (is.null(channel$pns)) "" else channel$pns, character(1))
  rownames(values) <- ids

  # The samples, as the app saw them.
  partition <- .gatelabr_sample_partition(sce, sample_column)
  labels <- partition$levels
  frames <- lapply(seq_along(labels), function(index) {
    frame <- flowCore::flowFrame(t(values[, partition$event_indices[[index]], drop = FALSE]))
    marker <- pns[nzchar(pns)]
    names(marker) <- ids[nzchar(pns)]
    if (length(marker)) flowCore::markernames(frame) <- marker
    frame
  })
  names(frames) <- labels
  gs <- flowWorkspace::GatingSet(flowCore::flowSet(frames))
  pd <- flowWorkspace::pData(gs)
  for (index in seq_along(labels)) {
    for (field in names(partition$samples[[index]]$metadata)) {
      pd[[field]] <- if (field %in% colnames(pd)) pd[[field]] else rep(NA_character_, nrow(pd))
      pd[[field]][[index]] <- as.character(partition$samples[[index]]$metadata[[field]])
    }
  }
  flowWorkspace::pData(gs) <- pd

  # The transforms, in one call: a second transform() call replaces the first.
  specs <- gatelabTransforms(sce)
  if (length(specs) == 0L) specs <- .gatelabr_gate_transform_specs(tree)
  transformer <- .gatelabr_transformer_list(specs, ids)
  if (!is.null(transformer)) flowWorkspace::transform(gs, transformer)

  # The populations of the hierarchy, parents before children, with the stored masks per sample.
  rows <- record$populations[record$populations$hierarchy_id == hierarchy_id, ]
  rows <- rows[order(rows$depth), ]
  populations <- lapply(seq_len(nrow(rows)), function(index) {
    key <- paste0(hierarchy_id, "/", rows$population_id[[index]])
    membership <- .gatelabr_population_membership(record, key)
    list(
      population_id = rows$population_id[[index]],
      name = rows$population[[index]],
      parent_id = if (is.na(rows$parent_id[[index]])) NA_character_ else rows$parent_id[[index]],
      masks = stats::setNames(lapply(partition$event_indices, function(cells) membership[cells] %in% TRUE), labels)
    )
  })
  prepared <- list(active = hierarchy_id, hierarchies = nrow(record$hierarchies), populations = populations)
  # Each sample's gates from the tree it is gated under, so a file tailored in the app keeps
  # its own gate on its own sample.
  report <- .gatelabr_gatingset_write_prepared(gs, parsed, prepared)

  # The record, so GateLabR opens the result on the same workspace.
  carried <- workspace[setdiff(names(workspace), "memberships")]
  carried$format <- "gatelab-gatingset-workspace"
  carried$hierarchy_written <- TRUE
  carried$hierarchy_revision <- as.integer(workspace$revision)
  .gatelabr_gatingset_store_record(gs, carried)
  message(.gatelabr_gatingset_write_report(report, "the GatingSet"))
  invisible(gs)
}

# The transforms the gates of a tree state, one per channel; a channel whose gates disagree is
# left untransformed, and its gates then go to the hierarchy as memberships.
.gatelabr_gate_transform_specs <- function(tree) {
  specs <- list()
  conflicting <- character(0)
  gates <- if (is.list(tree)) tree$gates else list()
  for (gate in gates) {
    if (!is.list(gate) || !identical(gate$space, "display") || !is.list(gate$transforms)) next
    for (channel in names(gate$transforms)) {
      spec <- gate$transforms[[channel]]
      if (!is.list(spec) || !is.character(spec$kind)) next
      if (is.null(specs[[channel]])) specs[[channel]] <- spec
      else if (!isTRUE(all.equal(specs[[channel]], spec))) conflicting <- c(conflicting, channel)
    }
  }
  specs[setdiff(names(specs), unique(conflicting))]
}

# A flowWorkspace transformerList from GateLab transform specs, by channel: a logicle as is, an
# arcsinh at cofactor c as flowjo_fasinh with m = log10 e and t = c sinh 1 (the same function:
# asinh(x sinh(m ln10) / t) / (m ln10) = asinh(x / c)), a biexponential by its parameters,
# FlowJo's log and Gating-ML's log by theirs. NULL when no channel takes one.
.gatelabr_transformer_list <- function(specs, channels) {
  transforms <- list()
  for (channel in intersect(names(specs), channels)) {
    spec <- specs[[channel]]
    number <- function(name) { value <- suppressWarnings(as.numeric(spec[[name]])); if (length(value) == 1L && is.finite(value)) value else NULL }
    built <- switch(
      as.character(spec$kind),
      logicle = { p <- list(number("T"), number("W"), number("M"), number("A")); if (any(vapply(p, is.null, logical(1)))) NULL else
        flowWorkspace::logicle_trans(w = p[[2]], t = p[[1]], m = p[[3]], a = p[[4]]) },
      asinh = { c <- number("cofactor"); if (is.null(c) || c <= 0) NULL else
        flowWorkspace::flowjo_fasinh_trans(m = log10(exp(1)), t = c * sinh(1), a = 0, length = 1) },
      biex = { p <- list(number("maxValue"), number("pos"), number("neg"), number("widthBasis"), number("channelRange")); if (any(vapply(p, is.null, logical(1)))) NULL else
        flowWorkspace::flowjo_biexp_trans(channelRange = p[[5]], maxValue = p[[1]], pos = p[[2]], neg = p[[3]], widthBasis = p[[4]]) },
      wsplog = { p <- list(number("offset"), number("decades")); if (any(vapply(p, is.null, logical(1)))) NULL else
        flowWorkspace::flowjo_log_trans(decade = p[[2]], offset = p[[1]]) },
      flog = { p <- list(number("T"), number("M")); if (any(vapply(p, is.null, logical(1)))) NULL else
        flowWorkspace::logtGml2_trans(t = p[[1]], m = p[[2]]) },
      NULL
    )
    if (!is.null(built)) transforms[[channel]] <- built
  }
  if (length(transforms) == 0L) return(NULL)
  flowWorkspace::transformerList(names(transforms), unname(transforms))
}
