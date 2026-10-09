# strategy_panel.R -- one gating panel as a grid drawing, with the app's sizes and rules.
#
# gatelabPanelGrob() draws what the app's Strategy and Illustration tabs draw for one plot: the
# contours and outlier dots (strategy_contour.R), d3's axes, the title, and each gate with its
# label. Lengths are the app's CSS pixels, 96 to the inch, so the panel is the same picture at any
# scale. gatelabStrategyPlot() (strategy_plot.R) lays several of these out with arrows.

#' One gating panel, drawn as GateLab draws it
#'
#' Draws a biaxial contour plot with its gates the way GateLab's Strategy and Illustration tabs
#' do: density contours with the events outside the lowest contour as dots, d3's axes and ticks,
#' the title above, each gate's outline with its name and share, and a quadrant gate as a
#' crosshair with the four shares. Sizes are the app's, in CSS pixels (96 to the inch), so a
#' panel is the same picture as in the app at any \code{scale}.
#'
#' @details Ported from GateLab's \code{renderMiniPlot} with the margin, label and quadrant
#'   rules GateLab applies to it. Contour mode only: the app's other plot modes are not drawn.
#'   A quadrant's shares are written in the corners of the plot unless
#'   \code{quadrant_labels = "centre"}, which is where the app writes them.
#'
#'   The panel is a grid \code{gTree} of a fixed size. \code{print()} and \code{plot()} draw it
#'   on a new page of the current device; \code{grid::grid.draw()} adds it to the page as it
#'   is.
#'
#' @param x,y The events to draw, in display units; see \code{\link{gatelabDisplayEvents}}.
#' @param xlim,ylim The axis ranges, each \code{c(low, high)}.
#' @param xlab,ylab Axis titles.
#' @param title The panel's title (the app writes the parent population and its count).
#' @param gates The gates to draw: a list, each a list with \code{type}, \code{name},
#'   \code{color}, and \code{vertices} (two-column matrix, display units), \code{percent},
#'   \code{label_offset} and \code{label_placed} for an outlined gate, or \code{center},
#'   \code{quadrant_pcts} (four values, in the order top left, top right, bottom right, bottom
#'   left) and \code{quadrant_label_offsets} for a quadrant gate. A \code{gate_id} is
#'   optional: it names the gate's entry in the \code{anchors} attribute.
#' @param plot_size Side of the panel in pixels, margins included.
#' @param contour_levels,contour_threshold,bandwidth Passed to \code{\link{gatelabContour}}.
#' @param point_alpha Opacity of the outlier dots; the contour lines take 0.15 more.
#' @param point_size Radius of the outlier dots in pixels (the app's "Point size").
#' @param pub_style Publication style: black gates and labels. \code{FALSE} draws each gate in
#'   its own colour with a white label on a box of that colour.
#' @param gate_line_width Gate line width in pixels.
#' @param label_background Under publication style, opacity of the white backing behind a gate
#'   label and behind each quadrant's share, so they read over the events; 0 draws none.
#' @param quadrant_labels Where a quadrant gate's four shares are written: \code{"corner"}, in
#'   the corners of the plot as quadrant statistics usually are, or \code{"centre"}, in the
#'   middle of each quadrant as the app places them. A share whose label was moved in the app
#'   is drawn where it was moved to.
#' @param bold_labels Gate labels in bold.
#' @param font_sizes Font sizes in pixels, named \code{tick}, \code{axis}, \code{title} and
#'   \code{gate}.
#' @param scale Multiplies every size, for a larger or smaller panel of the same proportions.
#' @param family Font family; \code{""} takes the device's sans-serif face.
#' @param true_hyphen R's \code{pdf()} and \code{postscript()} devices draw a hyphen as a minus
#'   sign, so a population named \code{CD4-} would end in a longer dash than in the app.
#'   \code{TRUE} draws the hyphen glyph on those devices in titles, axis titles and gate labels;
#'   tick labels keep the minus sign.
#' @return A grid \code{gTree} of class \code{gatelab_panel}, \code{plot_size * scale / 96}
#'   inches square. Its attribute \code{anchors} holds, by gate id, how far down the panel each
#'   gate's label sits (pixels), which is where a strategy's arrows leave from, and its
#'   attribute \code{geometry} the margins, ticks and axis-title offsets the panel was drawn
#'   with.
#' @seealso \code{\link{gatelabStrategyPlot}}, which lays out one panel per gating step.
#' @examples
#' set.seed(1)
#' x <- c(rnorm(3000, 1, 0.5), rnorm(3000, 4, 0.6))
#' y <- c(rnorm(3000, 4, 0.6), rnorm(3000, 1, 0.5))
#' gate <- list(type = "polygon", gate_id = "g1", name = "CD4_positive", color = "#e41a1c",
#'              percent = 50, vertices = cbind(c(2.5, 6, 6, 2.5), c(-0.5, -0.5, 2.5, 2.5)))
#' panel <- gatelabPanelGrob(x, y, xlim = c(-1, 7), ylim = c(-1, 7), xlab = "CD4", ylab = "CD8",
#'                           title = "All Events (6,000)", gates = list(gate))
#' plot(panel)
#' @export
gatelabPanelGrob <- function(x, y, xlim, ylim, xlab = NULL, ylab = NULL, title = NULL, gates = list(),
                             plot_size = 300, contour_levels = 10L, contour_threshold = 5, bandwidth = NULL,
                             point_alpha = 0.35, point_size = 1.2, pub_style = TRUE, gate_line_width = 1.5,
                             label_background = 0.6, quadrant_labels = c("corner", "centre"), bold_labels = FALSE,
                             font_sizes = c(tick = 12, axis = 12, title = 12, gate = 12),
                             scale = 1, family = "", true_hyphen = TRUE) {
  quadrant_labels <- match.arg(quadrant_labels)
  fs <- .gatelabr_panel_font_sizes(font_sizes)
  has_ylab <- !is.null(ylab) && nzchar(ylab)
  geo <- .gatelabr_panel_geometry(xlim, ylim, plot_size, fs, has_ylab)
  S <- plot_size; M <- geo$margin; W <- geo$W; H <- geo$H
  left <- M[["left"]]; top <- M[["top"]]; bottom <- top + H
  inch <- function(px) grid::unit(px * scale / 96, "inches")
  nat <- function(v) grid::unit(v, "native")
  X <- function(v) left + (v - xlim[1]) / diff(xlim) * W
  Y <- function(v) top + (ylim[2] - v) / diff(ylim) * H
  n_text <- 0L
  # `named` marks a population or channel name, as against a number: see
  # .gatelabr_panel_true_hyphens().
  text <- function(label, px, py, size, hjust = 0.5, rot = 0, col = "black", face = "plain", named = FALSE) {
    n_text <<- n_text + 1L
    grid::textGrob(label, nat(px), nat(py), hjust = hjust, vjust = 0, rot = rot,
                   name = sprintf("%s.%d", if (named) "glname" else "gltext", n_text),
                   gp = grid::gpar(fontsize = size * 0.75 * scale, col = col, fontface = face, fontfamily = family))
  }
  line <- function(px, py, col = "black", width = 1, id = NULL)
    grid::polylineGrob(nat(px), nat(py), id = id,
                       gp = grid::gpar(col = col, lwd = width * scale, lineend = "butt", linejoin = "mitre"))
  kids <- list(grid::rectGrob(nat(0), nat(0), inch(S), inch(S), just = c("left", "top"),
                              gp = grid::gpar(fill = "white", col = NA)))
  add <- function(grob) kids[[length(kids) + 1L]] <<- grob

  # The data: outlier dots under the contour lines, clipped to the axes.
  ct <- gatelabContour(x, y, xlim, ylim, levels = contour_levels, threshold = contour_threshold, bandwidth = bandwidth)
  alpha <- max(0.05, min(1, point_alpha))
  data <- list()
  if (nrow(ct$outliers))
    # pch 16 is a disc of radius 0.375 times its size.
    data[[1]] <- grid::pointsGrob(nat(X(ct$outliers$x)), nat(Y(ct$outliers$y)), pch = 16, size = inch(point_size / 0.375),
                                  gp = grid::gpar(col = grDevices::adjustcolor("#111111", alpha)))
  if (nrow(ct$paths))
    data[[length(data) + 1L]] <- line(X(ct$paths$x), Y(ct$paths$y), id = ct$paths$group,
                                      col = grDevices::adjustcolor("#111111", min(1, alpha + 0.15)),
                                      width = max(0.5, min(1, min(W, H) / 270)))
  add(grid::gTree(children = do.call(grid::gList, data),
                  vp = grid::viewport(nat(left), nat(top), inch(W), inch(H), just = c("left", "top"),
                                      xscale = c(left, left + W), yscale = c(bottom, top), clip = "on")))

  # d3's axes: the line with a tick at each end, 6 px ticks, labels 3 px beyond them.
  add(line(c(left, left, left + W, left + W), c(bottom + 6, bottom, bottom, bottom + 6)))
  add(line(c(left - 6, left, left, left - 6), c(top, top, bottom, bottom)))
  for (tick in geo$x_ticks) add(line(rep(X(tick), 2), c(bottom, bottom + 6)))
  for (tick in geo$y_ticks) add(line(c(left, left - 6), rep(Y(tick), 2)))
  shown <- .gatelabr_panel_spaced(X(geo$x_ticks), 28)
  for (i in which(shown)) add(text(geo$x_labels[i], X(geo$x_ticks[i]), bottom + 9 + 0.71 * fs$tick, fs$tick))
  shown <- .gatelabr_panel_spaced(Y(geo$y_ticks), 18)
  for (i in which(shown)) add(text(geo$y_labels[i], left - 9, Y(geo$y_ticks[i]) + 0.32 * fs$tick, fs$tick, hjust = 1))
  if (!is.null(xlab) && nzchar(xlab)) add(text(xlab, left + W / 2, bottom + geo$x_title_offset, fs$axis, named = TRUE))
  if (has_ylab) add(text(ylab, left - geo$y_title_offset, top + H / 2, fs$axis, rot = 90, named = TRUE))
  if (!is.null(title) && nzchar(title)) add(text(title, S / 2, 14, fs$title, face = "bold", named = TRUE))

  # Gates: every outline, then the plot's border, then the labels on top of both.
  labels <- list(); anchors <- list()
  face <- if (bold_labels) "bold" else "plain"
  for (gate in gates) {
    stroke <- if (pub_style) "#000000" else gate$color
    if (identical(gate$type, "quadrant")) {
      qx <- X(gate$center[1]); qy <- Y(gate$center[2])
      if (!is.finite(qx) || !is.finite(qy)) next
      add(line(c(left, left + W), c(qy, qy), col = stroke, width = gate_line_width))
      add(line(c(qx, qx), c(bottom, top), col = stroke, width = gate_line_width))
      mids <- list(c((left + qx) / 2, (top + qy) / 2), c((qx + left + W) / 2, (top + qy) / 2),
                   c((qx + left + W) / 2, (qy + bottom) / 2), c((left + qx) / 2, (qy + bottom) / 2))
      # The plot's four corners, 6 px in, as baselines: the text's box touches the inset line.
      inset <- 6
      corners <- list(c(left + inset, top + inset + 0.905 * fs$gate), c(left + W - inset, top + inset + 0.905 * fs$gate),
                      c(left + W - inset, bottom - inset - 0.212 * fs$gate), c(left + inset, bottom - inset - 0.212 * fs$gate))
      for (q in 1:4) {
        pct <- gate$quadrant_pcts[q]
        if (is.null(pct) || is.na(pct)) next
        moved <- if (length(gate$quadrant_label_offsets) >= q) gate$quadrant_label_offsets[[q]] else NULL
        # A label moved in the app keeps its place; otherwise the corner or the quadrant's centre.
        if (!is.null(moved)) {
          at <- mids[[q]] + c(moved[1] / diff(xlim) * W, -moved[2] / diff(ylim) * H); hjust <- 0.5
        } else if (identical(quadrant_labels, "corner")) {
          at <- corners[[q]]; hjust <- c(0, 1, 1, 0)[q]
        } else {
          at <- mids[[q]]; hjust <- 0.5
        }
        label <- text(sprintf("%.1f%%", pct), at[1], at[2], fs$gate, hjust = hjust, col = stroke, face = "bold")
        backing <- if (pub_style) max(0, min(1, label_background)) else 0.78
        if (backing > 0)
          labels[[length(labels) + 1L]] <- grid::roundrectGrob(
            nat(at[1]) + (0.5 - hjust) * grid::grobWidth(label), nat(at[2] - 0.3465 * fs$gate),
            grid::grobWidth(label) + inch(6), inch(1.117 * fs$gate + 2),
            r = inch(2), gp = grid::gpar(fill = grDevices::adjustcolor("#ffffff", backing), col = NA))
        labels[[length(labels) + 1L]] <- label
        if (!is.null(gate$gate_id)) anchors[[paste0(gate$gate_id, "#", q)]] <- at[2] - 0.3465 * fs$gate
      }
      next
    }
    v <- gate$vertices
    if (is.null(v) || nrow(v) < 2L) next
    add(grid::polygonGrob(nat(X(v[, 1])), nat(Y(v[, 2])),
                          gp = grid::gpar(fill = NA, col = stroke, lwd = gate_line_width * scale, linejoin = "mitre")))
    if (is.null(gate$name) || !nzchar(gate$name)) next
    pct <- if (!is.null(gate$percent) && is.finite(gate$percent)) sprintf("%.1f%%", gate$percent) else NULL
    offset <- if (is.null(gate$label_offset)) c(0, 0) else gate$label_offset
    placed <- isTRUE(gate$label_placed)
    half <- max(nchar(gate$name), nchar(pct), 0L) * fs$gate * (if (bold_labels) 0.35 else 0.32) + 4
    room <- if (placed) M else c(top = 0, right = 0, bottom = 0, left = 0)
    inset <- if (!placed && !is.null(pct)) c(max(10, ceiling(fs$gate * 1.46 + 2)), max(5, ceiling(fs$gate * 0.96 + 1))) else c(10, 5)
    # Measured from the plot's corner, as the app holds a label inside the axes.
    lx <- max(half - room[["left"]], min(W + room[["right"]] - half, mean(X(v[, 1])) - left + offset[1] / diff(xlim) * W))
    ly <- max(inset[1] - room[["top"]], min(H + room[["bottom"]] - inset[2], mean(Y(v[, 2])) - top - offset[2] / diff(ylim) * H))
    name_base <- ly + (if (is.null(pct)) 0.35 else -0.55) * fs$gate
    pct_base <- name_base + 1.3 * (fs$gate - 1)
    fill <- if (pub_style) "#000000" else "#ffffff"
    name_grob <- text(gate$name, left + lx, top + name_base, fs$gate, col = fill, face = face, named = TRUE)
    pct_grob <- if (is.null(pct)) NULL else text(pct, left + lx, top + pct_base, fs$gate - 1, col = fill, face = face)
    box_top <- name_base - 0.905 * fs$gate
    box_bottom <- if (is.null(pct)) name_base + 0.212 * fs$gate else pct_base + 0.212 * (fs$gate - 1)
    backing <- if (pub_style) max(0, min(1, label_background)) else 0.85
    if (backing > 0) {
      width <- if (is.null(pct_grob)) grid::grobWidth(name_grob) else grid::unit.pmax(grid::grobWidth(name_grob), grid::grobWidth(pct_grob))
      labels[[length(labels) + 1L]] <- grid::roundrectGrob(
        nat(left + lx), nat(top + (box_top + box_bottom) / 2), width + inch(4), inch(box_bottom - box_top + 2),
        r = inch(2), gp = grid::gpar(fill = grDevices::adjustcolor(if (pub_style) "#ffffff" else gate$color, backing), col = NA))
    }
    labels[[length(labels) + 1L]] <- name_grob
    if (!is.null(pct_grob)) labels[[length(labels) + 1L]] <- pct_grob
    if (!is.null(gate$gate_id)) anchors[[gate$gate_id]] <- top + (box_top + box_bottom) / 2
  }
  add(grid::rectGrob(nat(left), nat(top), inch(W), inch(H), just = c("left", "top"),
                     gp = grid::gpar(fill = NA, col = "#333333", lwd = scale)))
  kids <- c(kids, labels)

  panel <- grid::gTree(children = do.call(grid::gList, kids), cl = "gatelab_panel", true_hyphen = isTRUE(true_hyphen),
                       vp = grid::viewport(width = inch(S), height = inch(S), xscale = c(0, S), yscale = c(S, 0)))
  attr(panel, "anchors") <- unlist(anchors)
  attr(panel, "geometry") <- geo
  panel
}

# grid calls makeContent() on a gTree as it draws it, which is when the device is known.
#' @exportS3Method grid::makeContent
makeContent.gatelab_panel <- function(x) .gatelabr_panel_true_hyphens(x)

# A panel as it is drawn on R's pdf() and postscript() devices. Their encodings set a hyphen as
# the minus glyph and keep the hyphen glyph at the soft hyphen's code, so names take that code
# there and read as in the app. Elsewhere, and for numbers, the panel is left as it is.
.gatelabr_panel_true_hyphens <- function(x) {
  if (!isTRUE(x$true_hyphen) || !names(grDevices::dev.cur())[1] %in% c("pdf", "postscript")) return(x)
  for (name in grep("^glname", grid::childNames(x), value = TRUE)) {
    child <- grid::getGrob(x, name)
    child$label <- gsub("-", "\u00ad", child$label, fixed = TRUE)
    x <- grid::setGrob(x, name, child)
  }
  x
}

# Font sizes as a list, the app's 12 px where one is not given.
.gatelabr_panel_font_sizes <- function(font_sizes) {
  sizes <- list(tick = 12, axis = 12, title = 12, gate = 12)
  for (name in intersect(names(font_sizes), names(sizes))) sizes[[name]] <- as.numeric(font_sizes[[name]])
  sizes
}

# A panel's margins, ticks and axis-title offsets, by the app's rules: the y title clears the
# widest tick label, the x title clears the tick labels, and the margins grow to hold them.
.gatelabr_panel_geometry <- function(xlim, ylim, plot_size, fs, has_ylab = TRUE) {
  x_ticks <- .gatelabr_d3_ticks(xlim[1], xlim[2], 4); y_ticks <- .gatelabr_d3_ticks(ylim[1], ylim[2], 4)
  x_labels <- vapply(x_ticks, .gatelabr_panel_format_linear, character(1))
  y_labels <- vapply(y_ticks, .gatelabr_panel_format_linear, character(1))
  widest <- if (length(y_labels)) max(nchar(y_labels)) else 3
  y_offset <- ceiling(widest * fs$tick * 0.62 + 14 + 0.25 * fs$axis)
  x_offset <- ceiling(13 + 0.93 * fs$tick + 0.75 * fs$axis)
  margin <- c(top = 22, right = 8, bottom = 50, left = 54)
  if (has_ylab) margin[["left"]] <- max(margin[["left"]], min(140, ceiling(y_offset + fs$axis + 4)))
  margin[["bottom"]] <- max(margin[["bottom"]], min(100, ceiling(x_offset + fs$axis + 4)))
  list(margin = margin, W = plot_size - margin[["left"]] - margin[["right"]],
       H = plot_size - margin[["top"]] - margin[["bottom"]],
       x_ticks = x_ticks, y_ticks = y_ticks, x_labels = x_labels, y_labels = y_labels,
       x_title_offset = x_offset, y_title_offset = y_offset)
}

# The app's tick label for a linear value: K and M above a thousand, one decimal above one.
.gatelabr_panel_format_linear <- function(v) {
  if (!is.finite(v) || abs(v) < 1e-9) return("0")
  size <- abs(v); sign <- if (v < 0) "-" else ""
  plain <- function(n) format(n, scientific = FALSE, trim = TRUE, drop0trailing = TRUE)
  if (size >= 1e6) return(paste0(sign, plain(signif(size / 1e6, 3)), "M"))
  if (size >= 1e3) return(paste0(sign, plain(signif(size / 1e3, 3)), "K"))
  if (size >= 100) return(paste0(sign, format(.gatelabr_js_round(size), big.mark = ",", scientific = FALSE, trim = TRUE)))
  if (size >= 1) return(paste0(sign, plain(.gatelabr_js_round(size * 10) / 10)))
  paste0(sign, plain(signif(size, 2)))
}

# Which tick labels are drawn: going along the axis, one closer than `spacing` px to the last
# one drawn is left out.
.gatelabr_panel_spaced <- function(px, spacing) {
  shown <- logical(length(px)); last <- -Inf
  for (i in order(px)) if (abs(px[i] - last) >= spacing) { shown[i] <- TRUE; last <- px[i] }
  shown
}
