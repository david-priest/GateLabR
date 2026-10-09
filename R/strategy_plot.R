# strategy_plot.R -- the gating strategy of a saved object, drawn in R as the Strategy tab draws it.
#
# gatelabStrategyPlot() reads the gates and the population tree from the workspace JSON stored in
# the object, takes which events each population holds from the memberships stored beside it
# (memberships.R), and lays out one panel (strategy_panel.R) per parent population and pair of
# channels, with an arrow from each gate to the panel of the population it makes. R decides no
# membership of a population made by one gate: those counts are the app's own.

#' A gating strategy, drawn as GateLab's Strategy tab draws it
#'
#' Lays out the gating path to the populations asked for as GateLab's Strategy tab does in its
#' "Multiple pops" mode with the samples pooled: one panel per parent population and pair of
#' channels, showing the parent's events with every gate its children draw there, a column per
#' gating depth, and an arrow from each gate to the panel of the population it makes. Each panel
#' is a \code{\link{gatelabPanelGrob}}.
#'
#' @details Counts and percentages are of the pooled samples. A population made by one gate
#'   takes its count from the stored memberships (\code{\link{gatelabPopulations}}), so it is
#'   the app's own; a gate of a population made by several is counted from the gate's geometry,
#'   as are quadrants no population was made for. That is exact where gates are stored in
#'   display units, as on a \code{SingleCellExperiment} hosted on its transformed assay. An
#'   event a population was not evaluated for, which \code{gatelabPopulations()} returns as
#'   \code{NA} with a warning, is counted as outside it.
#'
#'   Events are drawn as the assay holds them and gates as the workspace holds them, with no
#'   transform applied. A workspace drawn on a linear assay, which the app shows through a
#'   transform, is not reproduced. The gates drawn are those of the hierarchy that was active
#'   when the workspace was saved: a file gated under a copy of the tree with coordinates of
#'   its own keeps its counts, which come from the memberships, but its own outlines are not
#'   drawn.
#'
#'   Axis ranges follow the app: a channel's global scale when the workspace sets one, else 5
#'   percent of the drawn events' span below them and 20 percent above, widened to keep every
#'   gate in view. The tree layout is the app's "Tree"; rows are not packed as tightly as the app
#'   packs them when a branch has several children. A quadrant's shares are written in the
#'   corners of its panel, and an arrow from a quadrant leaves from that corner;
#'   \code{quadrant_labels = "centre"} writes them in the middle of each quadrant, as the app
#'   does.
#'
#'   The strategy is a grid \code{gTree} of a fixed size. \code{print()} and \code{plot()} draw
#'   it on a new page of the current device; open the device with the \code{width} and
#'   \code{height} attributes to hold all of it.
#'
#' @param sce A \code{SingleCellExperiment} gated in GateLabR and saved with
#'   \dQuote{Save to SCE}.
#' @param populations Names (or ids) of the populations to trace. Their ancestors are drawn
#'   too. A name shared by several populations must be given as its id.
#' @param hierarchy A hierarchy name or id, as in \code{\link{gatelabPopulations}}. The saved
#'   workspace holds the gates of the hierarchy that was active when it was saved, so only that
#'   one can be drawn: \code{NULL} draws it, and naming another hierarchy is an error.
#' @param sample_column The \code{colData} column that names each event's sample, or a vector
#'   with one value per event.
#' @param samples Samples to pool; \code{NULL} pools every sample.
#' @param max_events Events drawn per panel, shared between the samples by
#'   \code{\link{gatelabDisplayEvents}} (the app's "Max events/panel").
#' @param global_scales Use the workspace's global axis scales where it has them, as the app
#'   does. \code{FALSE} fits every panel to its own events and gates.
#' @param arrows Draw the arrows between panels.
#' @param arrow_width Arrow line width in pixels; the heads grow with it.
#' @param plot_size,pub_style,font_sizes,scale,... Passed to \code{\link{gatelabPanelGrob}},
#'   with any of its other appearance arguments (\code{point_size}, \code{bold_labels},
#'   \code{quadrant_labels}, \code{contour_levels} and the rest).
#' @param allow_stale Read memberships whose workspace revision is behind the stored workspace,
#'   as in \code{\link{gatelabPopulations}}. The gates drawn are then those of the workspace as
#'   it is now, and the counts those of the earlier save.
#' @param membership Population memberships to use in place of the stored ones: a logical matrix
#'   of events by population with the population names (or ids) as column names. \code{NULL}
#'   reads the stored memberships with \code{gatelabPopulations()}.
#' @param assay The assay the gates were drawn on; \code{NULL} takes the one the workspace
#'   names, or \code{exprs} when it names none.
#' @return A grid \code{gTree} of class \code{gatelab_strategy}. Attributes: \code{width} and
#'   \code{height}, the figure's size in inches; \code{panels}, a data frame with one row per
#'   gate or quadrant drawn (\code{panel}, \code{x_channel}, \code{y_channel},
#'   \code{parent_events}, \code{events_drawn}, \code{population}, \code{events},
#'   \code{percent_of_parent}).
#' @seealso \code{\link{gatelabHierarchy}} for the populations of the stored hierarchy.
#' @examples
#' # A gated object comes from the app. This one is put together by hand, with the memberships
#' # of its two populations worked out here, so that the example runs without the app.
#' set.seed(1)
#' n <- 3000
#' cd4 <- rep(c(TRUE, FALSE), each = n / 2)
#' values <- rbind(
#'   CD4 = ifelse(cd4, rnorm(n, 4, 0.5), rnorm(n, 1, 0.4)),
#'   CD8 = ifelse(cd4, rnorm(n, 1, 0.4), rnorm(n, 4, 0.5)),
#'   CD45RA = rnorm(n, rep(c(1, 3), n / 2), 0.4),
#'   CCR7 = rnorm(n, rep(c(1, 3), n / 2), 0.4)
#' )
#' sce <- SingleCellExperiment::SingleCellExperiment(
#'   assays = list(exprs = values),
#'   colData = S4Vectors::DataFrame(sample_id = rep(c("D1", "D2", "D3"), length.out = n))
#' )
#' workspace <- list(
#'   hostedAssayId = "exprs",
#'   gating = list(
#'     root_population_id = "root",
#'     gates = list(
#'       g1 = list(gate_id = "g1", name = "CD4 gate", gate_type = "rectangle",
#'                 x_channel = "CD4", y_channel = "CD8", color = "#e41a1c", label_offset = NULL,
#'                 vertices = list(list(2.5, -0.5), list(6, 2.5))),
#'       g2 = list(gate_id = "g2", name = "naive gate", gate_type = "rectangle",
#'                 x_channel = "CD45RA", y_channel = "CCR7", color = "#377eb8", label_offset = NULL,
#'                 vertices = list(list(2, 2), list(5, 5)))
#'     ),
#'     populations = list(
#'       root = list(population_id = "root", name = "All Events", parent_id = NULL,
#'                   children = list("p1"), gate_refs = list()),
#'       p1 = list(population_id = "p1", name = "CD4_positive", parent_id = "root",
#'                 children = list("p2"), gate_refs = list(list(gate_id = "g1", include = TRUE))),
#'       p2 = list(population_id = "p2", name = "naive", parent_id = "p1",
#'                 children = list(), gate_refs = list(list(gate_id = "g2", include = TRUE)))
#'     )
#'   ),
#'   scales = list(globalScales = list()),
#'   display = list()
#' )
#' S4Vectors::metadata(sce)$gatelab_workspace <- list(
#'   workspace_json = as.character(jsonlite::toJSON(workspace, auto_unbox = TRUE, null = "null"))
#' )
#' between <- function(channel, low, high) values[channel, ] >= low & values[channel, ] <= high
#' in_cd4 <- between("CD4", 2.5, 6) & between("CD8", -0.5, 2.5)
#' in_naive <- in_cd4 & between("CD45RA", 2, 5) & between("CCR7", 2, 5)
#'
#' strategy <- gatelabStrategyPlot(
#'   sce, "naive",
#'   membership = cbind(CD4_positive = in_cd4, naive = in_naive),
#'   max_events = 2000
#' )
#' attr(strategy, "panels")
#' plot(strategy)
#'
#' \dontrun{
#' # On an object gated in the app and saved with "Save to SCE", the memberships are the stored
#' # ones, and the figure is saved at its own size:
#' strategy <- gatelabStrategyPlot(sce, c("naive", "effector_memory"))
#' grDevices::pdf("strategy.pdf", width = attr(strategy, "width"), height = attr(strategy, "height"))
#' plot(strategy)
#' grDevices::dev.off()
#' }
#' @export
gatelabStrategyPlot <- function(sce, populations, hierarchy = NULL, sample_column = "sample_id", samples = NULL,
                                max_events = 10000, global_scales = TRUE, arrows = TRUE, arrow_width = 1.5,
                                plot_size = 300, pub_style = TRUE,
                                font_sizes = c(tick = 12, axis = 12, title = 12, gate = 12), scale = 1,
                                allow_stale = FALSE, membership = NULL, assay = NULL, ...) {
  if (!methods::is(sce, "SingleCellExperiment")) stop("sce must be a SingleCellExperiment.", call. = FALSE)
  gating <- .gatelabr_strategy_gating(sce)
  # Before any population is looked up: a name from another hierarchy would otherwise be reported
  # as a missing population of this one.
  if (is.null(membership) || !is.null(hierarchy))
    .gatelabr_strategy_check_hierarchy(sce, gating, hierarchy, allow_stale)
  pops <- gating$populations
  root <- gating$root
  ids <- vapply(populations, function(wanted) {
    by_name <- names(pops)[vapply(pops, function(p) identical(p$name, wanted), logical(1))]
    if (length(by_name) > 1L)
      stop("Population name '", wanted, "' is shared by ", length(by_name), " populations; give its id: ",
           paste(by_name, collapse = ", "), call. = FALSE)
    if (length(by_name) == 1L) return(by_name)
    if (wanted %in% names(pops)) return(wanted)
    stop("No population called '", wanted, "'. Populations: ",
         paste(vapply(pops, function(p) p$name, character(1)), collapse = ", "), call. = FALSE)
  }, character(1), USE.NAMES = FALSE)

  # The populations drawn: those asked for and their ancestors.
  relevant <- character(0)
  for (id in ids) {
    cur <- id
    while (!is.na(cur) && !cur %in% relevant) { relevant <- c(relevant, cur); cur <- pops[[cur]]$parent_id }
  }
  relevant <- union(relevant, root)

  # One node per parent population and channel pair, holding the gates its children draw there.
  nodes <- list()
  for (id in setdiff(relevant, root)) {
    pop <- pops[[id]]
    if (is.na(pop$parent_id) || !pop$parent_id %in% relevant) next
    for (r in seq_len(nrow(pop$gate_refs))) {
      gate <- gating$gates[[pop$gate_refs$gate_id[r]]]
      if (is.null(gate)) next
      key <- paste(pop$parent_id, gate$x_channel, gate$y_channel, sep = "|")
      if (is.null(nodes[[key]]))
        nodes[[key]] <- list(key = key, parent_id = pop$parent_id, x_channel = gate$x_channel,
                             y_channel = gate$y_channel, entries = list())
      if (gate$gate_id %in% vapply(nodes[[key]]$entries, function(e) e$gate$gate_id, character(1))) next
      nodes[[key]]$entries[[length(nodes[[key]]$entries) + 1L]] <-
        list(gate = gate, population = id, include = pop$gate_refs$include[r])
    }
  }
  if (!length(nodes)) stop("None of these populations has a gate to draw.", call. = FALSE)

  # The events: values on the gated assay, the sample of each, and who is in which population.
  if (is.null(assay)) assay <- if (is.null(gating$assay)) "exprs" else gating$assay
  values <- SummarizedExperiment::assay(sce, assay)
  channel <- function(name) {
    if (!name %in% rownames(values)) stop("Channel '", name, "' is not a row of assay '", assay, "'.", call. = FALSE)
    as.numeric(values[name, ])
  }
  sample_of <- if (length(sample_column) == 1L) SummarizedExperiment::colData(sce)[[sample_column]] else sample_column
  if (is.null(sample_of) || length(sample_of) != ncol(sce))
    stop("sample_column must name a colData column of `sce`, or give one sample per event.", call. = FALSE)
  pooled <- if (is.null(samples)) rep(TRUE, ncol(sce)) else as.character(sample_of) %in% samples
  if (!any(pooled)) stop("None of `samples` is in the object.", call. = FALSE)
  needed <- setdiff(unique(c(vapply(nodes, function(n) n$parent_id, character(1)),
                            unlist(lapply(nodes, function(n) vapply(n$entries, function(e) e$population, character(1)))))), root)
  quadrant_siblings <- function(node, gate)
    Filter(function(p) identical(p$parent_id, node$parent_id) && gate$gate_id %in% p$gate_refs$gate_id, pops)
  for (node in nodes) for (entry in node$entries) if (identical(entry$gate$type, "quadrant"))
    needed <- union(needed, names(quadrant_siblings(node, entry$gate)))
  if (is.null(membership)) {
    membership <- gatelabPopulations(sce, populations = needed, hierarchy = hierarchy, allow_stale = allow_stale)
    colnames(membership) <- needed
  } else if (NROW(membership) != ncol(sce)) {
    stop("`membership` must have one row per event of `sce`.", call. = FALSE)
  }
  member <- function(id) {
    if (identical(id, root)) return(pooled)
    column <- if (id %in% colnames(membership)) id else pops[[id]]$name
    if (!column %in% colnames(membership))
      stop("`membership` has no column for population '", pops[[id]]$name, "'.", call. = FALSE)
    hit <- which(colnames(membership) == column)
    if (length(hit) > 1L) stop("`membership` has several columns called '", column, "'; name them by id.", call. = FALSE)
    out <- as.logical(membership[, hit]); out[is.na(out)] <- FALSE
    out & pooled
  }

  round1 <- function(v) .gatelabr_js_round(v * 10) / 10
  rows <- list()
  drawn <- lapply(nodes, function(node) {
    parent <- member(node$parent_id)
    n_parent <- sum(parent)
    gx <- channel(node$x_channel); gy <- channel(node$y_channel)
    keep <- gatelabDisplayEvents(parent, sample_of, max_events)
    range_of <- function(ch, shown) {
      if (global_scales && !is.null(gating$scales[[ch]])) return(gating$scales[[ch]])
      shown <- shown[is.finite(shown)]
      if (!length(shown)) return(c(0, 1))
      span <- diff(range(shown)); if (!is.finite(span) || span < 1e-10) span <- 1
      low <- min(shown) - span * 0.05
      c(if (min(shown) >= 0) min(0, low) else low, max(shown) + span * 0.2)
    }
    xlim <- range_of(node$x_channel, gx[keep]); ylim <- range_of(node$y_channel, gy[keep])
    widen <- function(lim, at) range(c(lim, at[is.finite(at)]))
    overlays <- lapply(node$entries, function(entry) {
      gate <- entry$gate
      pop <- pops[[entry$population]]
      if (identical(gate$type, "quadrant")) {
        made <- quadrant_siblings(node, gate)
        counts <- vapply(1:4, function(q) {
          own <- Filter(function(p) any(p$gate_refs$gate_id == gate$gate_id & p$gate_refs$quadrant %in% q) &&
                          nrow(p$gate_refs) == 1L, made)
          if (length(own)) sum(member(own[[1]]$id)) else sum(parent & .gatelabr_strategy_in_gate(gate, gx, gy, q))
        }, numeric(1))
        names_q <- vapply(1:4, function(q) {
          own <- Filter(function(p) any(p$gate_refs$gate_id == gate$gate_id & p$gate_refs$quadrant %in% q), made)
          if (length(own)) own[[1]]$name else paste0("quadrant ", q)
        }, character(1))
        pcts <- if (n_parent > 0) round1(counts / n_parent * 100) else rep(0, 4)
        rows[[length(rows) + 1L]] <<- data.frame(population = names_q, events = counts, percent_of_parent = pcts,
                                                 key = node$key, stringsAsFactors = FALSE)
        xlim <<- widen(xlim, gate$center[1]); ylim <<- widen(ylim, gate$center[2])
        return(list(type = "quadrant", gate_id = gate$gate_id, name = gate$name, color = gate$color,
                    center = gate$center, quadrant_pcts = pcts, quadrant_label_offsets = gate$quadrant_label_offsets))
      }
      inside <- if (nrow(pop$gate_refs) == 1L) member(pop$id) else {
        hit <- .gatelabr_strategy_in_gate(gate, gx, gy); parent & (if (entry$include) hit else !hit)
      }
      n_child <- sum(inside)
      pct <- if (n_parent > 0) round1(n_child / n_parent * 100) else NA_real_
      rows[[length(rows) + 1L]] <<- data.frame(population = pop$name, events = n_child, percent_of_parent = pct,
                                               key = node$key, stringsAsFactors = FALSE)
      v <- gate$vertices
      xlim <<- widen(xlim, v[, 1]); ylim <<- widen(ylim, v[, 2])
      if (!is.null(gate$label_offset)) {
        xlim <<- widen(xlim, mean(v[, 1]) + gate$label_offset[1]); ylim <<- widen(ylim, mean(v[, 2]) + gate$label_offset[2])
      }
      # Where the label goes by itself: above the gate, by 8 percent of its height.
      auto <- c(0, max(v[, 2]) - mean(v[, 2]) + max(0.15, diff(range(v[, 2])) * 0.08))
      list(type = gate$type, gate_id = gate$gate_id, name = pop$name, color = gate$color, vertices = v, percent = pct,
           label_offset = if (is.null(gate$label_offset)) auto else gate$label_offset,
           label_placed = !is.null(gate$label_offset))
    })
    title <- sprintf("%s (%s)", if (identical(node$parent_id, root)) pops[[root]]$name else pops[[node$parent_id]]$name,
                     format(n_parent, big.mark = ",", scientific = FALSE, trim = TRUE))
    panel <- gatelabPanelGrob(gx[keep], gy[keep], xlim, ylim, xlab = node$x_channel, ylab = node$y_channel, title = title,
                              gates = overlays, plot_size = plot_size, pub_style = pub_style, font_sizes = font_sizes,
                              scale = scale, ...)
    c(node, list(panel = panel, n_parent = n_parent, n_drawn = length(keep), title = title))
  })

  # The tree: a panel's children are the panels of the populations its gates make.
  made_by <- function(node) unlist(lapply(node$entries, function(entry) {
    gate_id <- entry$gate$gate_id
    names(Filter(function(p) identical(p$parent_id, node$parent_id) && gate_id %in% p$gate_refs$gate_id, pops))
  }))
  children <- lapply(drawn, function(node) {
    made <- made_by(node)
    names(drawn)[vapply(drawn, function(other) other$parent_id %in% made, logical(1))]
  })
  claimed <- character(0); own <- list(); place <- list(); row_used <- -1
  claim <- function(key) {
    mine <- character(0)
    for (child in children[[key]]) if (!child %in% claimed) { claimed <<- c(claimed, child); mine <- c(mine, child) }
    own[[key]] <<- mine
    for (child in mine) claim(child)
  }
  settle <- function(key, row, col) {
    place[[key]] <<- c(row = row, col = col)
    deepest <- row
    for (child in own[[key]]) deepest <- settle(child, if (identical(child, own[[key]][1])) row else deepest + 1, col + 1)
    deepest
  }
  is_child <- unique(unlist(children))
  for (key in c(setdiff(names(drawn), is_child), names(drawn))) {
    if (key %in% claimed) next
    claimed <- c(claimed, key); claim(key)
    row_used <- settle(key, row_used + 1, 0)
  }

  # Arrows, from the gate's label to the panel of the population the gate makes.
  links <- list()
  if (arrows) for (key in names(drawn)) for (child in own[[key]]) {
    target <- drawn[[child]]$parent_id
    for (entry in drawn[[key]]$entries) {
      ref <- pops[[target]]$gate_refs
      hit <- which(ref$gate_id == entry$gate$gate_id)
      if (!length(hit)) next
      anchor <- if (identical(entry$gate$type, "quadrant")) paste0(entry$gate$gate_id, "#", ref$quadrant[hit[1]]) else entry$gate$gate_id
      links[[length(links) + 1L]] <- list(from = key, to = child, anchor = anchor, color = entry$gate$color)
      break
    }
  }
  across_rows <- any(vapply(links, function(l) place[[l$from]][["row"]] != place[[l$to]][["row"]], logical(1)))
  gap <- if (length(links)) 28 else 8
  row_gap <- if (across_rows) 28 else 8
  S <- plot_size
  n_cols <- max(vapply(place, function(p) p[["col"]], numeric(1))) + 1
  n_rows <- max(vapply(place, function(p) p[["row"]], numeric(1))) + 1
  # 4 px round the grid; with arrows the app keeps a gutter free at the right and the bottom too.
  width <- 4 + n_cols * S + (n_cols - 1) * gap + (if (length(links)) gap else 4)
  height <- 4 + n_rows * S + (n_rows - 1) * row_gap + (if (length(links)) row_gap else 4)
  cell_left <- function(key) 4 + place[[key]][["col"]] * (S + gap)
  cell_top <- function(key) 4 + place[[key]][["row"]] * (S + row_gap)
  inch <- function(px) grid::unit(px * scale / 96, "inches")
  nat <- function(v) grid::unit(v, "native")

  kids <- lapply(names(drawn), function(key)
    grid::gTree(children = grid::gList(drawn[[key]]$panel),
                vp = grid::viewport(nat(cell_left(key)), nat(cell_top(key)), inch(S), inch(S), just = c("left", "top"))))
  for (link in links) {
    from <- drawn[[link$from]]; to <- drawn[[link$to]]
    level <- attr(from$panel, "anchors")[link$anchor]
    y <- cell_top(link$from) + if (length(level) && is.finite(level)) level else S / 2
    start <- c(cell_left(link$from) + S, y)
    if (place[[link$from]][["row"]] == place[[link$to]][["row"]]) {
      points <- rbind(start, c(cell_left(link$to), y))
    } else {
      geo <- attr(to$panel, "geometry")
      into <- cell_top(link$to) + geo$margin[["top"]] + geo$H / 2
      points <- rbind(start, c(start[1] + 6, y), c(start[1] + 6, into), c(cell_left(link$to), into))
    }
    kids <- c(kids, .gatelabr_strategy_arrow(points, if (pub_style) "#444444" else link$color, arrow_width, scale))
  }

  strategy <- grid::gTree(children = do.call(grid::gList, kids), cl = "gatelab_strategy",
                          vp = grid::viewport(width = inch(width), height = inch(height),
                                              xscale = c(0, width), yscale = c(height, 0)))
  summary <- do.call(rbind, rows)
  # Panel by panel in reading order: by column, then by row.
  where <- do.call(rbind, place[summary$key])
  summary <- summary[order(where[, "col"], where[, "row"], seq_len(nrow(summary))), ]
  at <- match(summary$key, names(drawn))
  attr(strategy, "panels") <- data.frame(
    panel = vapply(drawn[at], function(node) pops[[node$parent_id]]$name, character(1)),
    x_channel = vapply(drawn[at], function(node) node$x_channel, character(1)),
    y_channel = vapply(drawn[at], function(node) node$y_channel, character(1)),
    parent_events = vapply(drawn[at], function(node) node$n_parent, numeric(1)),
    events_drawn = vapply(drawn[at], function(node) node$n_drawn, numeric(1)),
    population = summary$population, events = summary$events, percent_of_parent = summary$percent_of_parent,
    stringsAsFactors = FALSE, row.names = NULL)
  attr(strategy, "width") <- width * scale / 96
  attr(strategy, "height") <- height * scale / 96
  strategy
}

# An arrow along `points` (pixels): the line at 85 percent opacity and a solid head whose tip
# stops 3 px short of the last point. The head is 7 + 2 * width long and 3.5 + width to a side.
.gatelabr_strategy_arrow <- function(points, color, width, scale) {
  n <- nrow(points)
  last <- points[n, ] - points[n - 1L, ]
  along <- last / sqrt(sum(last^2))
  tip <- points[n, ] - along * 3
  base <- tip - along * (7 + 2 * width)
  side <- c(-along[2], along[1]) * (3.5 + width)
  points[n, ] <- base + along
  nat <- function(v) grid::unit(v, "native")
  list(grid::polylineGrob(nat(points[, 1]), nat(points[, 2]),
                          gp = grid::gpar(col = grDevices::adjustcolor(color, 0.85), lwd = width * scale,
                                          lineend = "round", linejoin = "round")),
       grid::polygonGrob(nat(c(tip[1], base[1] + side[1], base[1] - side[1])),
                         nat(c(tip[2], base[2] + side[2], base[2] - side[2])),
                         gp = grid::gpar(fill = color, col = NA)))
}

#' Draw a gating strategy or a panel on the current device
#'
#' A strategy from \code{\link{gatelabStrategyPlot}} and a panel from
#' \code{\link{gatelabPanelGrob}} are grid drawings of a fixed size. \code{print()} and
#' \code{plot()} start a new page on the current graphics device and draw the figure at its
#' centre, so one shows when it is returned at the console.
#'
#' The figure keeps its own size whatever the device's, and a device smaller than the figure
#' cuts it off. To save a strategy at its size, open the device with the strategy's
#' \code{width} and \code{height} attributes (inches); a panel is \code{plot_size * scale / 96}
#' inches square.
#'
#' @param x A \code{gatelab_strategy} or a \code{gatelab_panel}.
#' @param ... Ignored.
#' @return \code{x}, invisibly.
#' @examples
#' set.seed(1)
#' panel <- gatelabPanelGrob(rnorm(2000, 3), rnorm(2000, 3), xlim = c(-1, 7), ylim = c(-1, 7),
#'                           xlab = "CD4", ylab = "CD8", title = "All Events (2,000)")
#' file <- tempfile(fileext = ".pdf")
#' grDevices::pdf(file, width = 300 / 96, height = 300 / 96)
#' print(panel)
#' grDevices::dev.off()
#' @export
print.gatelab_strategy <- function(x, ...) .gatelabr_draw_on_new_page(x)

#' @rdname print.gatelab_strategy
#' @export
plot.gatelab_strategy <- function(x, ...) .gatelabr_draw_on_new_page(x)

#' @rdname print.gatelab_strategy
#' @export
print.gatelab_panel <- function(x, ...) .gatelabr_draw_on_new_page(x)

#' @rdname print.gatelab_strategy
#' @export
plot.gatelab_panel <- function(x, ...) .gatelabr_draw_on_new_page(x)

.gatelabr_draw_on_new_page <- function(x) {
  grid::grid.newpage()
  grid::grid.draw(x)
  invisible(x)
}

# Stops unless the stored memberships that would be read belong to the tree the workspace holds.
# The workspace is read for the gates of the hierarchy that was active when it was saved, and the
# memberships record marks the hierarchy that was active at its own save, which is the one
# gatelabPopulations() reads when no hierarchy is named. `hierarchy` may only name that one:
# another hierarchy's gates are not in the parsed tree, so it is refused rather than drawn with
# outlines that are not its own. Under allow_stale the workspace can have been saved since with
# another hierarchy active, which it then names (`active_hierarchy_id`), and that is refused too.
.gatelabr_strategy_check_hierarchy <- function(sce, gating, hierarchy = NULL, allow_stale = FALSE) {
  record <- .gatelabr_memberships_record(sce, allow_stale)
  stored <- record$hierarchies
  label <- function(id) {
    at <- match(id, stored$hierarchy_id)
    if (is.na(at)) id else stored$hierarchy[[at]]
  }
  active <- .gatelabr_resolve_hierarchy(record, NULL)
  if (!is.null(hierarchy)) {
    wanted <- .gatelabr_resolve_hierarchy(record, hierarchy)
    if (!identical(wanted, active)) {
      stop(
        "Only the hierarchy that was active when the workspace was saved can be drawn, which is '",
        label(active), "', not '", label(wanted), "': the saved workspace is read for the gates of ",
        "the active hierarchy alone. In GateLabR make '", label(wanted), "' the active hierarchy and ",
        "press \"Save to SCE\", or leave `hierarchy` NULL.",
        call. = FALSE
      )
    }
  }
  if (!is.null(gating$hierarchy_id) && !identical(gating$hierarchy_id, active)) {
    stop(
      "The saved workspace holds the gates of hierarchy '", label(gating$hierarchy_id),
      "', and the stored memberships were saved with '", label(active), "' active, so they are ",
      "not the memberships of the gates that would be drawn. Press \"Save to SCE\" in GateLabR to ",
      "store them again.",
      call. = FALSE
    )
  }
  invisible(active)
}

# The gates and populations of the workspace stored on a gated object, as plain R lists: the gates
# with their geometry, the populations with their parents and gate references, the root
# population, the global axis scales, the display settings, the assay the workspace was drawn on
# and the id of the hierarchy it holds. Reads the hierarchy that was active when the workspace was
# saved. `x` is a SingleCellExperiment saved from GateLabR, the workspace as a JSON string, or the
# workspace parsed with jsonlite::fromJSON(simplifyVector = FALSE).
#
# Each gate has `gate_id`, `name`, `type` ("polygon", "rectangle", "ellipse" or "quadrant"),
# `x_channel`, `y_channel`, `vertices` (a two-column matrix; the four corners for a rectangle, the
# sampled outline for an ellipse, NULL for a quadrant), `center` (quadrant), `color`,
# `label_offset` (NULL when the label was never moved) and `quadrant_label_offsets`. Each
# population has `id`, `name`, `parent_id`, `children` and `gate_refs` (a data frame of `gate_id`,
# `include`, `quadrant`).
#
# Coordinates are returned as stored. On an object hosted on its transformed assay, as GateLabR
# hosts a SingleCellExperiment, the stored and the displayed coordinates are the same values.
.gatelabr_strategy_gating <- function(x) {
  ws <- .gatelabr_strategy_workspace(x)
  tree <- ws$gating
  if (is.null(tree) || is.null(tree$gates) || is.null(tree$populations))
    stop("The workspace holds no gating tree.", call. = FALSE)
  pair <- function(v) if (is.null(v) || length(v) != 2L) NULL else as.numeric(unlist(v))
  gates <- lapply(tree$gates, function(g) {
    type <- as.character(g$gate_type)
    vertices <- if (!is.null(g$vertices) && length(g$vertices))
      matrix(as.numeric(unlist(g$vertices)), ncol = 2, byrow = TRUE) else NULL
    if (identical(type, "rectangle") && !is.null(vertices))
      vertices <- cbind(range(vertices[, 1])[c(1, 2, 2, 1)], range(vertices[, 2])[c(1, 1, 2, 2)])
    ellipse <- NULL
    if (identical(type, "ellipse")) {
      ellipse <- list(mean = as.numeric(unlist(g$mean)),
                      covariance = matrix(as.numeric(unlist(g$covariance)), 2, 2, byrow = TRUE),
                      distance_square = as.numeric(g$distance_square))
      vertices <- .gatelabr_strategy_ellipse_outline(ellipse)
    }
    list(gate_id = as.character(g$gate_id), name = as.character(g$name), type = type,
         x_channel = as.character(g$x_channel), y_channel = as.character(g$y_channel),
         vertices = vertices, center = pair(g$center), ellipse = ellipse,
         color = if (is.null(g$color)) "#e41a1c" else as.character(g$color),
         label_offset = pair(g$label_offset),
         quadrant_label_offsets = if (is.null(g$quadrant_label_offsets)) NULL else
           lapply(g$quadrant_label_offsets, pair))
  })
  populations <- lapply(tree$populations, function(p) {
    refs <- p$gate_refs
    list(id = as.character(p$population_id), name = as.character(p$name),
         parent_id = if (is.null(p$parent_id)) NA_character_ else as.character(p$parent_id),
         children = as.character(unlist(p$children)),
         gate_refs = data.frame(
           gate_id = vapply(refs, function(r) as.character(r$gate_id), character(1)),
           include = vapply(refs, function(r) !identical(r$include, FALSE), logical(1)),
           quadrant = vapply(refs, function(r) if (is.null(r$quadrant)) NA_integer_ else as.integer(r$quadrant), integer(1)),
           stringsAsFactors = FALSE))
  })
  names(populations) <- vapply(populations, function(p) p$id, character(1))
  names(gates) <- vapply(gates, function(g) g$gate_id, character(1))
  active <- tree$active_hierarchy_id
  list(gates = gates, populations = populations,
       root = as.character(tree$root_population_id),
       scales = lapply(ws$scales$globalScales, function(r) as.numeric(unlist(r))),
       display = ws$display,
       assay = if (is.null(ws$hostedAssayId)) NULL else as.character(ws$hostedAssayId),
       hierarchy_id = if (is.character(active) && length(active) == 1L && !is.na(active) && nzchar(active)) active else NULL)
}

# The workspace as a parsed list, from an object GateLabR saved, a JSON string or a list. cbind()
# keeps every object's metadata, so a combined object can carry several workspaces, and which of
# them its events were gated under is not something to pick by position: it is refused.
.gatelabr_strategy_workspace <- function(x) {
  if (is.list(x) && !is.null(x$gating)) return(x)
  if (methods::is(x, "SummarizedExperiment")) {
    md <- S4Vectors::metadata(x)
    if (sum(names(md) %in% "gatelab_workspace") > 1L)
      stop("This object carries the workspaces of several saved objects (cbind() keeps each object's ",
           "metadata), and a strategy is drawn from one. Draw it from the object as it was before it ",
           "was combined, or press \"Save to SCE\" in GateLabR on this object.", call. = FALSE)
    x <- md$gatelab_workspace$workspace_json
    if (is.null(x)) stop("This object holds no GateLab workspace (metadata(sce)$gatelab_workspace).\n",
                         "  Gate it in GateLabR and press \"Save to SCE\" first.", call. = FALSE)
  }
  if (!is.character(x) || length(x) != 1L)
    stop("x must be a gated SingleCellExperiment, a workspace JSON string or a parsed workspace.", call. = FALSE)
  jsonlite::fromJSON(x, simplifyVector = FALSE)
}

# The outline of an ellipse gate (mean, covariance, squared Mahalanobis distance), as points.
.gatelabr_strategy_ellipse_outline <- function(ellipse, n = 64L) {
  angle <- seq(0, 2 * pi, length.out = n + 1L)[-(n + 1L)]
  half <- t(chol(ellipse$covariance)) * sqrt(ellipse$distance_square)
  t(ellipse$mean + half %*% rbind(cos(angle), sin(angle)))
}

# Which events fall inside a gate, from its geometry. Quadrants are numbered as GateLab numbers
# them (1 x- y+, 2 x+ y+, 3 x+ y-, 4 x- y-), an event on the crosshair counting as positive.
.gatelabr_strategy_in_gate <- function(gate, gx, gy, quadrant = NA_integer_) {
  if (identical(gate$type, "quadrant")) {
    right <- gx >= gate$center[1]; up <- gy >= gate$center[2]
    return(switch(as.character(quadrant), "1" = !right & up, "2" = right & up, "3" = right & !up,
                  "4" = !right & !up, stop("A quadrant gate needs a quadrant from 1 to 4.", call. = FALSE)))
  }
  if (identical(gate$type, "ellipse")) {
    d <- rbind(gx - gate$ellipse$mean[1], gy - gate$ellipse$mean[2])
    return(colSums(d * (solve(gate$ellipse$covariance) %*% d)) <= gate$ellipse$distance_square)
  }
  if (identical(gate$type, "rectangle"))
    return(gx >= min(gate$vertices[, 1]) & gx <= max(gate$vertices[, 1]) &
           gy >= min(gate$vertices[, 2]) & gy <= max(gate$vertices[, 2]))
  .gatelabr_in_ring(gx, gy, gate$vertices[, 1], gate$vertices[, 2])
}
