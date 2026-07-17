# pdf_export.R — Server-side vector SVG export for Strategy and Illustration tabs
#
# Uses R's grid graphics system + gridSVG to produce SVG files with proper
# <g> group hierarchy that Adobe Illustrator recognizes as editable groups.
# Data points are rasterized at target DPI; axes, gates, labels are vector.
#
# Grouping hierarchy in the SVG (each gTree → <g id="...">):
#   panel_<x>_<y>
#     ├─ background        (white rect)
#     ├─ title             (text)
#     ├─ data_clip         (viewport with clip, contains data_raster)
#     ├─ x_axis
#     │    ├─ major_ticks   (single segmentsGrob)
#     │    ├─ minor_ticks   (single segmentsGrob)
#     │    ├─ tick_labels   (<g> of <text> elements)
#     │    └─ axis_title    (text)
#     ├─ y_axis
#     │    ├─ major_ticks   (single segmentsGrob)
#     │    ├─ minor_ticks   (single segmentsGrob)
#     │    ├─ tick_labels   (<g> of <text> elements)
#     │    └─ axis_title    (text)
#     ├─ gate_<id>
#     │    ├─ polygon       (single polygon path)
#     │    └─ label         (<g> sub-group)
#     │         ├─ label_bg  (rect)
#     │         └─ label_text (text)
#     └─ border            (rect)

library(grid)

# ── Constants ─────────────────────────────────────────────────────────────────
GAP_PT <- 6  # gap between cells in points

# Margins matching JS: {top: 22, right: 8, bottom: 38, left: 42} in CSS px
MARGIN <- list(top = 22, right = 8, bottom = 38, left = 42)

POP_COLORS <- c('#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
                '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf')

# ── Jet colormap (256 entries, matching JS _jetLUT) ───────────────────────────
.jet_lut <- local({
  lut <- character(256)
  for (i in seq_len(256)) {
    t <- (i - 1) / 255
    if (t < 0.125) {
      r <- 0; g <- 0; b <- 0.5 + t * 4
    } else if (t < 0.375) {
      r <- 0; g <- (t - 0.125) * 4; b <- 1
    } else if (t < 0.625) {
      r <- (t - 0.375) * 4; g <- 1; b <- 1 - (t - 0.375) * 4
    } else if (t < 0.875) {
      r <- 1; g <- 1 - (t - 0.625) * 4; b <- 0
    } else {
      r <- 1 - (t - 0.875) * 4; g <- 0; b <- 0
    }
    r <- max(0, min(1, r))
    g <- max(0, min(1, g))
    b <- max(0, min(1, b))
    lut[i] <- rgb(r, g, b)
  }
  lut
})


# ══════════════════════════════════════════════════════════════════════════════
# SVG EXPORT HELPERS
# ══════════════════════════════════════════════════════════════════════════════

#' Open a dummy PDF device as a canvas, draw grid graphics, then export via gridSVG.
#' This produces an SVG with proper <g> grouping from every gTree.
.export_svg <- function(file_path, width_pt, height_pt, draw_fn) {
  if (!requireNamespace("gridSVG", quietly = TRUE)) {
    stop("gridSVG package is required for SVG export. Install with: install.packages('gridSVG')")
  }
  w_in <- width_pt / 72
  h_in <- height_pt / 72

  # Use a null PDF as canvas — gridSVG reads the grid display list, not the device output
  tmp_pdf <- tempfile(fileext = ".pdf")
  on.exit(unlink(tmp_pdf), add = TRUE)
  pdf(tmp_pdf, width = w_in, height = h_in)
  on.exit(dev.off(), add = TRUE)

  grid.newpage()
  draw_fn()  # caller draws all grid content

  gridSVG::grid.export(file_path, strict = FALSE)

  # Post-process: replace Linux system font aliases that R/gridSVG resolves
  # "Helvetica" to on Linux (FreeSans, Liberation Sans, Nimbus Sans L, DejaVu Sans).
  # These cause "unknown problem" errors when opening in Adobe Illustrator.
  # Replace them with cross-platform safe names Illustrator already knows.
  .fix_svg_fonts(file_path)

  # Post-process: remove duplicate white-halo text elements that gridSVG
  # (older versions) inserts before every text grob for legibility.
  .fix_svg_text_halo(file_path)

  invisible(file_path)
}

#' Replace Linux-only font names embedded by gridSVG with Illustrator-safe equivalents.
.fix_svg_fonts <- function(svg_path) {
  if (!file.exists(svg_path)) return(invisible(svg_path))
  lines <- readLines(svg_path, warn = FALSE, encoding = "UTF-8")

  # Ordered: most-specific multi-word names first to avoid partial replacements.
  linux_fonts <- c(
    "Nimbus Sans L",
    "Liberation Sans",
    "FreeSans",
    "DejaVu Sans",
    "DejaVu Serif",
    "Nimbus Mono L",
    "Liberation Mono",
    "FreeMono",
    "DejaVu Sans Mono",
    "Nimbus Roman No9 L",
    "Liberation Serif",
    "FreeSerif"
  )
  safe_font <- "Helvetica, Arial, sans-serif"

  for (lf in linux_fonts) {
    lines <- gsub(lf, safe_font, lines, fixed = TRUE)
  }

  writeLines(lines, svg_path, useBytes = FALSE)
  invisible(svg_path)
}

#' Strip duplicate/stroked text elements so Illustrator sees one text object per label.
#'
#' Two distinct sources of "duplicate text" exist in gridSVG output:
#'
#'  1. OLD halo: gridSVG (pre-1.7) renders each text grob twice — first as a
#'     white-stroked halo copy for legibility, then as the actual filled element.
#'     In Illustrator this appears as a stroked outline behind every label.
#'     We delete the halo copy (any <text> with a white stroke attribute).
#'
#'  2. MODERN stroke-on-text: gridSVG (1.7+) writes a single <text> element but
#'     with BOTH stroke="rgb(R,G,B)" AND fill="rgb(R,G,B)" set to the same colour.
#'     When Adobe Illustrator imports such SVG, it splits the text into two
#'     stacked text objects — one with the stroke appearance and one with the
#'     fill appearance — making the labels impossible to edit cleanly.
#'     We strip the stroke (and stroke-opacity / stroke-width) from every <text>
#'     element so Illustrator sees a single, fill-only text object.
#'
#'  Both passes are safe for white gate labels: those have fill="white" with no
#'  parent stroke contribution after this rewrite, so they continue to render
#'  as plain white filled text on top of their dark backgrounds.
.fix_svg_text_halo <- function(svg_path) {
  if (!file.exists(svg_path)) return(invisible(svg_path))
  lines <- readLines(svg_path, warn = FALSE, encoding = "UTF-8")

  # ── Pass 1: delete legacy white-halo <text> lines (pre-1.7 gridSVG) ────────
  white_col_re <- paste0(
    'white',
    '|#[Ff]{3,6}',
    '|rgb\\(\\s*2(?:5[0-5]|[0-4][0-9])\\s*,\\s*2(?:5[0-5]|[0-4][0-9])\\s*,\\s*2(?:5[0-5]|[0-4][0-9])[^)]*\\)'
  )
  halo_pat <- paste0('<text\\b[^>]*\\bstroke\\s*=\\s*"(?:', white_col_re, ')"')
  lines <- lines[!grepl(halo_pat, lines, perl = TRUE)]

  # ── Pass 2: strip stroke from any remaining <text> element ────────────────
  # gridSVG 1.7+ writes <text ... stroke="rgb(R,G,B)" fill="rgb(R,G,B)" ...>.
  # Illustrator interprets that as text-with-stroke and duplicates the object
  # into two stacked frames (one outlined, one filled).  Force stroke="none"
  # so only the filled appearance survives.  We do the substitution inside any
  # line that contains "<text" (gridSVG writes one element per line for the
  # ones we care about; titles, tick labels, axis titles, gate labels).
  is_text_line <- grepl("<text\\b", lines, perl = TRUE)
  if (any(is_text_line)) {
    fix_one <- function(s) {
      s <- gsub(' stroke="[^"]*"',         ' stroke="none"', s, perl = TRUE)
      s <- gsub(' stroke-opacity="[^"]*"', ' stroke-opacity="0"', s, perl = TRUE)
      s <- gsub(' stroke-width="[^"]*"',   ' stroke-width="0"', s, perl = TRUE)
      s
    }
    lines[is_text_line] <- vapply(lines[is_text_line], fix_one,
                                   character(1), USE.NAMES = FALSE)
  }

  writeLines(lines, svg_path, useBytes = FALSE)
  invisible(svg_path)
}


# ══════════════════════════════════════════════════════════════════════════════
# STRATEGY SVG EXPORT
# ══════════════════════════════════════════════════════════════════════════════

#' Export single-population gating strategy as SVG
export_strategy_pdf <- function(file_path, steps, opts) {
  if (length(steps) == 0) return(invisible(NULL))

  plot_size <- max(120, min(800, as.integer(opts$plot_size %||% 200)))
  n_cols    <- max(1L, min(24L, as.integer(opts$n_columns %||% length(steps))))
  n_rows    <- ceiling(length(steps) / n_cols)
  display_mode <- .normalize_display_mode(opts$display_mode)
  font_sizes <- opts$font_sizes %||% list()
  pdf_dpi <- as.integer(opts$pdf_dpi %||% 300)
  pdf_point_size <- as.numeric(opts$pdf_point_size %||% 0.6)
  pdf_point_alpha <- as.numeric(opts$pdf_point_alpha %||% 0.35)
  hist_line_width <- as.numeric(opts$hist_line_width %||% 1.8)
  if (!is.finite(hist_line_width)) hist_line_width <- 1.8
  hist_line_width <- max(0.5, min(6, hist_line_width))
  hist_fill <- isTRUE(opts$hist_fill)
  hist_fill_alpha <- as.numeric(opts$hist_fill_alpha %||% 0.22)
  if (!is.finite(hist_fill_alpha)) hist_fill_alpha <- 0.22
  hist_fill_alpha <- max(0, min(1, hist_fill_alpha))
  hist_overlay_mode <- as.character(opts$hist_overlay_mode %||% "front_opaque")
  if (!hist_overlay_mode %in% c("blend", "front_opaque")) hist_overlay_mode <- "front_opaque"

  gate_view <- opts$gate_view %||% "forward"
  if (!is.character(gate_view)) gate_view <- as.character(gate_view)
  show_forward <- "forward" %in% gate_view
  show_back    <- "back" %in% gate_view
  if (!show_forward && !show_back) show_forward <- TRUE
  if (show_forward && show_back && display_mode == "pseudocolor") display_mode <- "scatter"

  strategy_context_title <- trimws(as.character(opts$strategy_context_title %||% ""))
  strategy_context_title_fs <- suppressWarnings(as.numeric(
    opts$strategy_context_title_font %||% ((font_sizes$title %||% 10) + 1)
  ))
  if (!is.finite(strategy_context_title_fs)) strategy_context_title_fs <- 11
  strategy_context_title_fs <- max(8, min(24, strategy_context_title_fs))

  context_h <- if (nzchar(strategy_context_title)) strategy_context_title_fs + 8 else 0
  legend_h <- if (show_back) 18 else 0
  top_h <- context_h + legend_h

  page_w <- n_cols * plot_size + (n_cols - 1) * GAP_PT + 20
  page_h <- top_h + n_rows * plot_size + (n_rows - 1) * GAP_PT + 20

  .export_svg(file_path, page_w, page_h, function() {
    top_cursor <- page_h - 8

    if (nzchar(strategy_context_title)) {
      grid.text(strategy_context_title,
        x = unit(10, "points"), y = unit(top_cursor, "points"),
        just = c("left", "top"),
        gp = gpar(fontsize = strategy_context_title_fs, fontfamily = "Helvetica", col = "#334155"))
      top_cursor <- top_cursor - context_h
    }

    if (show_back) {
      ly <- top_cursor - (legend_h / 2)
      lx <- 10
      draw_leg <- function(col, label) {
        grid.rect(
          x = unit(lx + 4, "points"), y = unit(ly, "points"),
          width = unit(8, "points"), height = unit(8, "points"),
          just = c("centre", "centre"),
          gp = gpar(fill = col, col = "#00000033", lwd = 0.5)
        )
        grid.text(label,
          x = unit(lx + 11, "points"), y = unit(ly, "points"),
          just = c("left", "centre"),
          gp = gpar(fontsize = 9, fontfamily = "Helvetica", col = "#334155"))
        lx <<- lx + 11 + nchar(label) * 5.6 + 10
      }
      if (show_forward) draw_leg("#3182ce", "Forward-gated")
      if (show_back) draw_leg("#d95f02", "Back-gated")
    }

    for (i in seq_along(steps)) {
      step <- steps[[i]]
      col_idx <- (i - 1L) %% n_cols
      row_idx <- (i - 1L) %/% n_cols

      x_origin <- 10 + col_idx * (plot_size + GAP_PT)
      y_origin <- page_h - top_h - 10 - (row_idx + 1) * plot_size - row_idx * GAP_PT

      sign <- if (isTRUE(step$include)) "" else "NOT "
      mode_tag <- if (show_forward && show_back) " (F+B)" else if (show_back) " (Back)" else ""
      pct_total_str <- if (!is.null(step$pct_total)) paste0(" [", step$pct_total, "% total]") else ""
      title <- paste0(sign, step$gate_name, ": ", step$pct_pass, "%", pct_total_str, mode_tag)

      gate_overlay <- list(list(
        gate_id = step$gate_id,
        name = step$gate_name,
        percent_of_parent = step$pct_pass,
        gate_type = step$gate_type,
        vertices = step$vertices,
        color = step$color,
        label_offset = step$label_offset
      ))

      .render_panel(
        x = step$x, y = step$y,
        x_back = step$x_back, y_back = step$y_back,
        x_range = step$x_range, y_range = step$y_range,
        x_label = step$x_channel, y_label = step$y_channel,
        x_logicle_ticks = step$x_logicle_ticks,
        y_logicle_ticks = step$y_logicle_ticks,
        x_is_logicle = isTRUE(step$x_is_logicle),
        y_is_logicle = isTRUE(step$y_is_logicle),
        gates = gate_overlay, title = title,
        display_mode = display_mode, plot_size = plot_size,
        font_sizes = font_sizes, pop_color = "#3182ce", back_color = "#d95f02",
        x_origin = x_origin, y_origin = y_origin,
        contour_threshold = opts$contour_threshold,
        point_alpha = pdf_point_alpha,
        kde_bandwidth = opts$kde_bandwidth,
        pdf_dpi = pdf_dpi, pdf_point_size = pdf_point_size,
        hist_line_width = hist_line_width,
        hist_fill = hist_fill,
        hist_fill_alpha = hist_fill_alpha,
        hist_overlay_mode = hist_overlay_mode,
        gate_style = opts$gate_style
      )
    }
  })
  invisible(file_path)
}

#' Export multi-population gating strategy as SVG
export_multi_strategy_pdf <- function(file_path, nodes, opts) {
  if (length(nodes) == 0) return(invisible(NULL))

  plot_size <- max(120, min(800, as.integer(opts$plot_size %||% 200)))
  display_mode <- .normalize_display_mode(opts$display_mode)
  font_sizes <- opts$font_sizes %||% list()
  pdf_dpi <- as.integer(opts$pdf_dpi %||% 300)
  pdf_point_size <- as.numeric(opts$pdf_point_size %||% 0.6)
  pdf_point_alpha <- as.numeric(opts$pdf_point_alpha %||% 0.35)
  hist_line_width <- as.numeric(opts$hist_line_width %||% 1.8)
  if (!is.finite(hist_line_width)) hist_line_width <- 1.8
  hist_line_width <- max(0.5, min(6, hist_line_width))
  hist_fill <- isTRUE(opts$hist_fill)
  hist_fill_alpha <- as.numeric(opts$hist_fill_alpha %||% 0.22)
  if (!is.finite(hist_fill_alpha)) hist_fill_alpha <- 0.22
  hist_fill_alpha <- max(0, min(1, hist_fill_alpha))
  hist_overlay_mode <- as.character(opts$hist_overlay_mode %||% "front_opaque")
  if (!hist_overlay_mode %in% c("blend", "front_opaque")) hist_overlay_mode <- "front_opaque"

  strategy_context_title <- trimws(as.character(opts$strategy_context_title %||% ""))
  strategy_context_title_fs <- suppressWarnings(as.numeric(
    opts$strategy_context_title_font %||% ((font_sizes$title %||% 10) + 1)
  ))
  if (!is.finite(strategy_context_title_fs)) strategy_context_title_fs <- 11
  strategy_context_title_fs <- max(8, min(24, strategy_context_title_fs))
  context_h <- if (nzchar(strategy_context_title)) strategy_context_title_fs + 8 else 0

  max_col <- max(vapply(nodes, function(n) as.integer(n$col %||% 0), integer(1)))
  max_row <- max(vapply(nodes, function(n) as.integer(n$row %||% 0), integer(1)))
  n_cols <- max_col + 1L
  n_rows <- max_row + 1L

  page_w <- n_cols * plot_size + (n_cols - 1) * GAP_PT + 20
  page_h <- context_h + n_rows * plot_size + (n_rows - 1) * GAP_PT + 20

  .export_svg(file_path, page_w, page_h, function() {
    if (nzchar(strategy_context_title)) {
      grid.text(strategy_context_title,
        x = unit(10, "points"), y = unit(page_h - 8, "points"),
        just = c("left", "top"),
        gp = gpar(fontsize = strategy_context_title_fs, fontfamily = "Helvetica", col = "#334155"))
    }

    for (nd in nodes) {
      col_idx <- as.integer(nd$col %||% 0)
      row_idx <- as.integer(nd$row %||% 0)
      x_origin <- 10 + col_idx * (plot_size + GAP_PT)
      y_origin <- page_h - context_h - 10 - (row_idx + 1) * plot_size - row_idx * GAP_PT
      title <- paste0(nd$parent_pop_name %||% "", " (", nd$n_events %||% 0, ")")

      .render_panel(
        x = nd$x, y = nd$y, x_back = NULL, y_back = NULL,
        x_range = nd$x_range, y_range = nd$y_range,
        x_label = nd$x_channel, y_label = nd$y_channel,
        x_logicle_ticks = nd$x_logicle_ticks, y_logicle_ticks = nd$y_logicle_ticks,
        x_is_logicle = isTRUE(nd$x_is_logicle), y_is_logicle = isTRUE(nd$y_is_logicle),
        gates = nd$gates %||% list(), title = title,
        display_mode = display_mode, plot_size = plot_size,
        font_sizes = font_sizes, pop_color = "#3182ce", back_color = "#d95f02",
        x_origin = x_origin, y_origin = y_origin,
        contour_threshold = opts$contour_threshold,
        point_alpha = pdf_point_alpha,
        kde_bandwidth = opts$kde_bandwidth,
        pdf_dpi = pdf_dpi, pdf_point_size = pdf_point_size,
        hist_line_width = hist_line_width,
        hist_fill = hist_fill,
        hist_fill_alpha = hist_fill_alpha,
        hist_overlay_mode = hist_overlay_mode,
        gate_style = opts$gate_style
      )
    }
  })
  invisible(file_path)
}


# ══════════════════════════════════════════════════════════════════════════════
# ILLUSTRATION SVG EXPORT
# ══════════════════════════════════════════════════════════════════════════════

#' Export an Illustration population-by-channel heatmap as vector SVG.
export_heatmap_svg <- function(file_path, payload, opts) {
  hm <- payload$heatmap %||% list()
  rows <- hm$rows %||% list()
  channels <- hm$channels %||% list()
  if (length(rows) == 0 || length(channels) == 0) return(invisible(NULL))

  fs <- opts$font_sizes %||% list()
  label_fs <- max(6, min(28, as.numeric(fs$axis_label %||% 10)))
  value_fs <- max(6, min(24, as.numeric(fs$tick %||% 8)))
  cell_size <- max(16, min(72, as.numeric(hm$cell_size %||% opts$heatmap_cell_size %||% 30)))
  show_values <- isTRUE(hm$show_values %||% opts$heatmap_show_values)
  palette_name <- as.character(hm$palette %||% opts$heatmap_palette %||% "blue_white_yellow_red")
  anchors <- switch(
    palette_name,
    heat = c("#000000", "#5A0000", "#C41200", "#FF7B00", "#FFD000", "#FFFF3A"),
    viridis = c("#440154", "#472D7B", "#3B528B", "#2C728E", "#21918C",
                "#28AE80", "#5EC962", "#ADDC30", "#FDE725"),
    c("#2166AC", "#F7F7F7", "#FFFF66", "#D73027")
  )
  palette <- grDevices::colorRampPalette(anchors, space = "Lab")(256)

  row_names <- vapply(rows, function(row) as.character(row$name %||% row$id %||% ""), character(1))
  channel_labels <- vapply(channels, function(ch) as.character(ch$label %||% ch$id %||% ""), character(1))
  max_row_chars <- max(nchar(row_names), 0)
  max_channel_chars <- max(nchar(channel_labels), 0)
  left <- max(46, max_row_chars * label_fs * 0.58 + 18)
  top <- max(38, max_channel_chars * label_fs * 0.52 + 28)
  bottom <- 14
  matrix_w <- length(channels) * cell_size
  matrix_h <- length(rows) * cell_size
  legend_gap <- 34
  legend_bar_w <- 14
  legend_text_w <- 96
  right_label_pad <- max_channel_chars * label_fs * 0.52
  page_w <- left + matrix_w + max(right_label_pad, legend_gap + legend_bar_w + legend_text_w) + 12
  page_h <- bottom + matrix_h + top

  legend_min <- suppressWarnings(as.numeric(hm$legend_min %||% 0))
  legend_max <- suppressWarnings(as.numeric(hm$legend_max %||% 1))
  if (!is.finite(legend_min)) legend_min <- 0
  if (!is.finite(legend_max) || legend_max <= legend_min) legend_max <- legend_min + 1
  map_color <- function(value) {
    value <- suppressWarnings(as.numeric(value))
    if (!is.finite(value)) return("#E5E7EB")
    t <- max(0, min(1, (value - legend_min) / (legend_max - legend_min)))
    palette[[1L + round(t * 255)]]
  }
  text_color <- function(fill) {
    rgb <- grDevices::col2rgb(fill)
    lum <- (0.2126 * rgb[1, 1] + 0.7152 * rgb[2, 1] + 0.0722 * rgb[3, 1]) / 255
    if (lum < 0.52) "#FFFFFF" else "#111827"
  }
  format_value <- function(value) {
    value <- suppressWarnings(as.numeric(value))
    if (!is.finite(value)) return("NA")
    av <- abs(value)
    if (av >= 1000 || (av > 0 && av < 0.01)) return(formatC(value, format = "e", digits = 2))
    if (av >= 100) return(formatC(value, format = "f", digits = 0))
    if (av >= 10) return(formatC(value, format = "f", digits = 1))
    formatC(value, format = "f", digits = 2)
  }

  .export_svg(file_path, page_w, page_h, function() {
    grid.rect(gp = gpar(fill = "#FFFFFF", col = NA), name = "background")
    matrix_bottom <- bottom

    cell_grobs <- list(); gi <- 0L
    for (i in seq_along(rows)) {
      row <- rows[[i]]
      vals <- as.numeric(unlist(row$values %||% rep(NA_real_, length(channels))))
      if (length(vals) < length(channels)) length(vals) <- length(channels)
      y <- matrix_bottom + (length(rows) - i) * cell_size
      for (j in seq_along(channels)) {
        value <- vals[[j]]
        fill <- map_color(value)
        x <- left + (j - 1L) * cell_size
        children <- gList(rectGrob(
          x = unit(x, "points"), y = unit(y, "points"),
          width = unit(cell_size, "points"), height = unit(cell_size, "points"),
          just = c("left", "bottom"),
          gp = gpar(fill = fill, col = "#FFFFFF", lwd = 0.7), name = "fill"
        ))
        if (show_values && cell_size >= 24) {
          children <- gList(children[[1]], textGrob(
            format_value(value),
            x = unit(x + cell_size / 2, "points"),
            y = unit(y + cell_size / 2, "points"),
            gp = gpar(fontsize = min(value_fs, max(6, cell_size * 0.28)),
                      fontfamily = "Helvetica", col = text_color(fill)),
            name = "value"
          ))
        }
        gi <- gi + 1L
        cell_grobs[[gi]] <- gTree(
          children = children,
          name = paste0("cell_", i, "_", j)
        )
      }
    }
    grid.draw(gTree(children = do.call(gList, cell_grobs), name = "heatmap_cells"))

    row_grobs <- lapply(seq_along(rows), function(i) {
      textGrob(
        row_names[[i]], x = unit(left - 8, "points"),
        y = unit(matrix_bottom + (length(rows) - i + 0.5) * cell_size, "points"),
        just = c("right", "centre"),
        gp = gpar(fontsize = label_fs, fontfamily = "Helvetica", col = "#1F2937"),
        name = paste0("row_", i)
      )
    })
    grid.draw(gTree(children = do.call(gList, row_grobs), name = "row_labels"))

    col_grobs <- lapply(seq_along(channels), function(j) {
      textGrob(
        channel_labels[[j]],
        x = unit(left + (j - 0.5) * cell_size, "points"),
        y = unit(matrix_bottom + matrix_h + 7, "points"),
        just = c("left", "centre"), rot = 45,
        gp = gpar(fontsize = label_fs, fontfamily = "Helvetica", col = "#1F2937"),
        name = paste0("channel_", j)
      )
    })
    grid.draw(gTree(children = do.call(gList, col_grobs), name = "channel_labels"))
    grid.rect(
      x = unit(left, "points"), y = unit(matrix_bottom, "points"),
      width = unit(matrix_w, "points"), height = unit(matrix_h, "points"),
      just = c("left", "bottom"), gp = gpar(fill = NA, col = "#94A3B8", lwd = 0.8),
      name = "matrix_border"
    )

    legend_h <- max(90, min(200, matrix_h))
    legend_x <- left + matrix_w + legend_gap
    legend_y <- matrix_bottom + max(0, (matrix_h - legend_h) / 2)
    n_steps <- 80L
    step_h <- legend_h / n_steps
    legend_grobs <- lapply(seq_len(n_steps), function(k) {
      rectGrob(
        x = unit(legend_x, "points"), y = unit(legend_y + (k - 1L) * step_h, "points"),
        width = unit(legend_bar_w, "points"), height = unit(step_h + 0.2, "points"),
        just = c("left", "bottom"), gp = gpar(fill = palette[[1L + round((k - 1L) / (n_steps - 1L) * 255)]], col = NA),
        name = paste0("step_", k)
      )
    })
    grid.draw(gTree(children = do.call(gList, legend_grobs), name = "legend_gradient"))
    grid.rect(
      x = unit(legend_x, "points"), y = unit(legend_y, "points"),
      width = unit(legend_bar_w, "points"), height = unit(legend_h, "points"),
      just = c("left", "bottom"), gp = gpar(fill = NA, col = "#64748B", lwd = 0.6),
      name = "legend_border"
    )
    tick_values <- seq(legend_min, legend_max, length.out = 5)
    for (k in seq_along(tick_values)) {
      y <- legend_y + (k - 1L) / 4 * legend_h
      grid.segments(
        x0 = unit(legend_x + legend_bar_w, "points"), x1 = unit(legend_x + legend_bar_w + 4, "points"),
        y0 = unit(y, "points"), y1 = unit(y, "points"), gp = gpar(col = "#64748B", lwd = 0.6)
      )
      grid.text(
        format_value(tick_values[[k]]),
        x = unit(legend_x + legend_bar_w + 7, "points"), y = unit(y, "points"),
        just = c("left", "centre"),
        gp = gpar(fontsize = value_fs, fontfamily = "Helvetica", col = "#334155")
      )
    }
    stat_label <- tools::toTitleCase(as.character(hm$summary_stat %||% "median"))
    scale_label <- switch(
      as.character(hm$scale_mode %||% "none"),
      column_minmax = "Per channel (0-1)",
      row_minmax = "Per population (0-1)",
      column_zscore = "Per-channel z-score",
      "Transformed expression"
    )
    grid.text(
      stat_label, x = unit(legend_x, "points"), y = unit(legend_y + legend_h + value_fs + 8, "points"),
      just = c("left", "bottom"), gp = gpar(fontsize = label_fs, fontfamily = "Helvetica", fontface = "bold", col = "#334155")
    )
    grid.text(
      scale_label, x = unit(legend_x, "points"), y = unit(legend_y + legend_h + 2, "points"),
      just = c("left", "bottom"), gp = gpar(fontsize = value_fs, fontfamily = "Helvetica", col = "#334155")
    )
  })
  invisible(file_path)
}

export_illustration_pdf <- function(file_path, payload, opts) {
  if (identical(as.character(payload$plot_type %||% ""), "heatmap")) {
    return(export_heatmap_svg(file_path, payload, opts))
  }
  plots       <- payload$plots %||% list()
  pop_ids     <- as.character(payload$pop_ids %||% character(0))
  pop_names   <- payload$pop_names %||% list()
  pop_counts  <- payload$pop_counts %||% list()
  x_channels  <- as.character(payload$x_channels %||% character(0))
  y_channel   <- payload$y_channel
  gate_overlays <- payload$gate_overlays %||% list()

  if (length(plots) == 0 || length(x_channels) == 0) return(invisible(NULL))

  plot_size <- max(120, min(800, as.integer(opts$plot_size %||% 200)))
  n_cols    <- max(1L, min(24L, as.integer(opts$n_columns %||% length(x_channels))))
  display_mode <- .normalize_display_mode(opts$display_mode)
  font_sizes   <- opts$font_sizes %||% list()
  overlay_pops <- isTRUE(opts$overlay_populations)
  color_by_pop <- isTRUE(opts$color_by_population)
  if (overlay_pops) color_by_pop <- TRUE
  pdf_dpi <- as.integer(opts$pdf_dpi %||% 300)
  pdf_point_size <- as.numeric(opts$pdf_point_size %||% 0.6)
  pdf_point_alpha <- as.numeric(opts$pdf_point_alpha %||% 0.35)
  hist_line_width <- as.numeric(opts$hist_line_width %||% 1.8)
  if (!is.finite(hist_line_width)) hist_line_width <- 1.8
  hist_line_width <- max(0.5, min(6, hist_line_width))
  hist_fill <- isTRUE(opts$hist_fill)
  hist_fill_alpha <- as.numeric(opts$hist_fill_alpha %||% 0.22)
  if (!is.finite(hist_fill_alpha)) hist_fill_alpha <- 0.22
  hist_fill_alpha <- max(0, min(1, hist_fill_alpha))
  hist_overlay_mode <- as.character(opts$hist_overlay_mode %||% "front_opaque")
  if (!hist_overlay_mode %in% c("blend", "front_opaque")) hist_overlay_mode <- "front_opaque"

  normalize_hex_color <- function(x, fallback = NULL) {
    raw <- toupper(trimws(as.character(x %||% "")))
    if (!nzchar(raw)) return(fallback)
    if (grepl("^#[0-9A-F]{6}$", raw)) return(raw)
    if (grepl("^[0-9A-F]{6}$", raw)) return(paste0("#", raw))
    fallback
  }

  provided_pop_colors <- opts$population_colors %||% payload$population_colors %||% list()

  pop_color_map <- list()
  for (i in seq_along(pop_ids)) {
    pid <- pop_ids[i]
    fallback_col <- POP_COLORS[((i - 1L) %% length(POP_COLORS)) + 1L]
    custom_col <- normalize_hex_color(provided_pop_colors[[pid]], fallback = fallback_col)
    pop_color_map[[pid]] <- if (color_by_pop) {
      custom_col
    } else "#444444"
  }

  row_header_h <- 16

  # Shared args for .render_panel
  common <- list(
    display_mode = display_mode, plot_size = plot_size, font_sizes = font_sizes,
    back_color = NULL, contour_threshold = opts$contour_threshold,
    point_alpha = pdf_point_alpha, kde_bandwidth = opts$kde_bandwidth,
    pdf_dpi = pdf_dpi, pdf_point_size = pdf_point_size,
    hist_line_width = hist_line_width, hist_fill = hist_fill,
    hist_fill_alpha = hist_fill_alpha, hist_overlay_mode = hist_overlay_mode,
    gate_style = opts$gate_style
  )

  if (overlay_pops) {
    legend_h <- 20
    n_plot_cols <- min(n_cols, length(x_channels))
    n_plot_rows <- ceiling(length(x_channels) / n_cols)
    page_w <- n_plot_cols * plot_size + (n_plot_cols - 1) * GAP_PT + 20
    page_h <- legend_h + n_plot_rows * plot_size + (n_plot_rows - 1) * GAP_PT + 20

    .export_svg(file_path, page_w, page_h, function() {
      .draw_illustration_legend(pop_ids, pop_names, pop_color_map, page_w, page_h, legend_h)

      for (ci in seq_along(x_channels)) {
        x_ch <- x_channels[ci]
        col_idx <- (ci - 1L) %% n_cols
        row_idx <- (ci - 1L) %/% n_cols
        main_pid <- NULL; main_data <- NULL; overlay_traces <- list()
        for (pid in pop_ids) {
          key <- paste0(pid, "|", x_ch)
          pd <- plots[[key]]
          if (is.null(pd)) next
          if (is.null(main_pid)) { main_pid <- pid; main_data <- pd
          } else {
            overlay_traces[[length(overlay_traces) + 1L]] <- list(
              x = pd$x, y = pd$y, color = pop_color_map[[pid]])
          }
        }
        if (is.null(main_data)) next
        dm <- display_mode; if (dm == "pseudocolor") dm <- "scatter"
        x_origin <- 10 + col_idx * (plot_size + GAP_PT)
        y_origin <- page_h - legend_h - 10 - (row_idx + 1) * plot_size - row_idx * GAP_PT
        do.call(.render_panel, c(list(
          x = main_data$x, y = main_data$y, x_back = NULL, y_back = NULL,
          x_range = main_data$x_range, y_range = main_data$y_range,
          x_label = main_data$x_label %||% x_ch, y_label = main_data$y_label %||% y_channel,
          x_logicle_ticks = main_data$x_logicle_ticks, y_logicle_ticks = main_data$y_logicle_ticks,
          x_is_logicle = isTRUE(main_data$x_is_logicle), y_is_logicle = isTRUE(main_data$y_is_logicle),
          gates = list(), title = x_ch,
          pop_color = pop_color_map[[main_pid]],
          x_origin = x_origin, y_origin = y_origin,
          overlay_traces = overlay_traces
        ), common[setdiff(names(common), "display_mode")], list(display_mode = dm)))
      }
    })
  } else {
    n_plot_cols <- min(n_cols, length(x_channels))
    n_pop_rows  <- length(pop_ids)
    page_w <- n_plot_cols * plot_size + (n_plot_cols - 1) * GAP_PT + 20
    page_h <- n_pop_rows * (row_header_h + plot_size + GAP_PT) + 20

    .export_svg(file_path, page_w, page_h, function() {
      for (pi in seq_along(pop_ids)) {
        pop_id <- pop_ids[pi]
        pop_name <- pop_names[[pop_id]] %||% "Unknown"
        n_events <- pop_counts[[pop_id]] %||% 0
        pop_color <- pop_color_map[[pop_id]]
        row_top <- page_h - 10 - (pi - 1L) * (row_header_h + plot_size + GAP_PT)

        grid.text(
          paste0(pop_name, " \u2014 ", format(n_events, big.mark = ","), " events"),
          x = unit(10, "points"), y = unit(row_top - 2, "points"),
          just = c("left", "top"),
          gp = gpar(fontsize = 11, fontfamily = "Helvetica", fontface = "bold", col = "#334155"))

        for (ci in seq_along(x_channels)) {
          x_ch <- x_channels[ci]
          key <- paste0(pop_id, "|", x_ch)
          pd <- plots[[key]]
          if (is.null(pd)) next
          col_idx <- ci - 1L
          x_origin <- 10 + col_idx * (plot_size + GAP_PT)
          y_origin <- row_top - row_header_h - plot_size

          do.call(.render_panel, c(list(
            x = pd$x, y = pd$y, x_back = NULL, y_back = NULL,
            x_range = pd$x_range, y_range = pd$y_range,
            x_label = pd$x_label %||% x_ch, y_label = pd$y_label %||% y_channel,
            x_logicle_ticks = pd$x_logicle_ticks, y_logicle_ticks = pd$y_logicle_ticks,
            x_is_logicle = isTRUE(pd$x_is_logicle), y_is_logicle = isTRUE(pd$y_is_logicle),
            gates = gate_overlays[[key]] %||% list(), title = NULL,
            pop_color = pop_color,
            x_origin = x_origin, y_origin = y_origin
          ), common))
        }
      }
    })
  }
  invisible(file_path)
}


# ══════════════════════════════════════════════════════════════════════════════
# INTERNAL RENDERING FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════

.normalize_display_mode <- function(mode) {
  m <- tolower(as.character(mode %||% "scatter"))
  if (m %in% c("pseudo", "pseudocolor", "pseudocolour")) return("pseudocolor")
  if (m %in% c("contour", "contours")) return("contour")
  "scatter"
}

#' Render a single plot panel at the given origin.
#' All sub-elements are drawn as named gTree groups → SVG <g> elements.
.render_panel <- function(x, y, x_back, y_back,
                          x_range, y_range,
                          x_label, y_label,
                          x_logicle_ticks, y_logicle_ticks,
                          x_is_logicle, y_is_logicle,
                          gates, title,
                          display_mode, plot_size, font_sizes,
                          pop_color, back_color,
                          x_origin, y_origin,
                          overlay_traces = NULL,
                          contour_threshold = NULL,
                          point_alpha = NULL,
                          kde_bandwidth = NULL,
                          pdf_dpi = 300L,
                          pdf_point_size = 0.6,
                          hist_line_width = 1.8,
                          hist_fill = FALSE,
                          hist_fill_alpha = 0.22,
                          hist_overlay_mode = "front_opaque",
                          gate_style = NULL) {

  M <- MARGIN
  W <- plot_size - M$left - M$right
  H <- plot_size - M$top - M$bottom

  xr <- x_range %||% c(0, 1)
  yr <- y_range %||% c(0, 1)

  fs <- font_sizes %||% list()
  tick_fs  <- fs$tick %||% 9
  axis_fs  <- fs$axis_label %||% 11
  gate_fs  <- fs$gate_label %||% 9
  title_fs <- fs$title %||% 11

  has_y <- !is.null(y) && length(y) > 0
  has_back <- !is.null(x_back) && length(x_back) > 0 && !is.null(y_back) && length(y_back) > 0
  has_overlay <- !is.null(overlay_traces) && length(overlay_traces) > 0

  # ── Panel group viewport ──
  pushViewport(viewport(
    x = unit(x_origin, "points"), y = unit(y_origin, "points"),
    width = unit(plot_size, "points"), height = unit(plot_size, "points"),
    just = c("left", "bottom"), clip = "off",
    name = paste0("panel_", x_origin, "_", y_origin)
  ))

  # Background
  grid.rect(gp = gpar(fill = "white", col = NA), name = "background")

  # ── Title ──
  if (!is.null(title) && nzchar(title)) {
    grid.text(title,
      x = unit(0.5, "npc"), y = unit(plot_size - 6, "points"),
      just = c("centre", "top"),
      gp = gpar(fontsize = title_fs, fontfamily = "Helvetica", fontface = "bold", col = "#000000"),
      name = "title")
  }

  # ── Data layer (rasterized) ──
  pushViewport(viewport(
    x = unit(M$left, "points"), y = unit(M$bottom, "points"),
    width = unit(W, "points"), height = unit(H, "points"),
    just = c("left", "bottom"), xscale = xr, yscale = yr, clip = "on",
    name = "data_clip"))

  if (!is.null(x) && length(x) > 0) {
    if (has_y) {
      .draw_data_biplot(x, y, x_back, y_back, xr, yr, W, H,
                        display_mode, pop_color, back_color,
                        has_back, has_overlay, overlay_traces,
                        contour_threshold, point_alpha, kde_bandwidth,
                        pdf_dpi, pdf_point_size)
    } else {
      .draw_data_histogram(x, xr, W, H, pop_color, overlay_traces,
                           point_alpha, pdf_dpi,
                           hist_line_width, hist_fill,
                           hist_fill_alpha, hist_overlay_mode)
    }
  }
  popViewport()  # data_clip

  # ── Axes (grouped) ──
  .draw_axes_grouped(xr, yr, has_y,
                     x_logicle_ticks, y_logicle_ticks,
                     x_is_logicle, y_is_logicle,
                     x_label, y_label,
                     M, W, H, tick_fs, axis_fs)

  # ── Gate overlays (each gate is a group) ──
  if (length(gates) > 0) {
    for (gi in seq_along(gates)) {
      .draw_gate_grouped(gates[[gi]], xr, yr, M, W, H, gate_fs, gi, gate_style)
    }
  }

  # ── Plot border ──
  grid.rect(
    x = unit(M$left, "points"), y = unit(M$bottom, "points"),
    width = unit(W, "points"), height = unit(H, "points"),
    just = c("left", "bottom"),
    gp = gpar(fill = NA, col = "#333333", lwd = 1.0),
    name = "border")

  popViewport()  # panel
}


# ── Data drawing: biplot ──────────────────────────────────────────────────────
.draw_data_biplot <- function(x, y, x_back, y_back, xr, yr, W, H,
                              display_mode, pop_color, back_color,
                              has_back, has_overlay, overlay_traces,
                              contour_threshold, point_alpha, kde_bandwidth,
                              pdf_dpi, pdf_point_size) {

  raster_w <- as.integer(ceiling(W * pdf_dpi / 72))
  raster_h <- as.integer(ceiling(H * pdf_dpi / 72))

  png_file <- tempfile(fileext = ".png")
  on.exit(unlink(png_file), add = TRUE)

  grDevices::png(png_file, width = raster_w, height = raster_h,
                 bg = "transparent", type = "cairo")
  par(mar = c(0, 0, 0, 0), xaxs = "i", yaxs = "i")
  plot.new()
  plot.window(xlim = xr, ylim = yr)

  alpha_val <- if (!is.null(point_alpha) && is.finite(point_alpha)) {
    max(0.05, min(1, point_alpha))
  } else {
    if (has_overlay) 0.28 else if (has_back) 0.42 else 0.35
  }

  # Scale dot_cex from user's point size (in pt) to device cex
  dot_cex <- max(0.1, pdf_point_size * (raster_w / 200))

  if (display_mode == "pseudocolor" && !has_overlay && !has_back) {
    .draw_pseudocolor_raster(x, y, xr, yr, W, H, dot_cex)
  } else if (display_mode == "contour" && !has_overlay) {
    .draw_contour_raster(x, y, xr, yr, pop_color, alpha_val, dot_cex,
                         contour_threshold, kde_bandwidth,
                         panel_w = W, panel_h = H)
    if (has_back) {
      .draw_contour_raster(x_back, y_back, xr, yr, back_color %||% "#d95f02",
                           alpha_val, dot_cex, contour_threshold, kde_bandwidth,
                           panel_w = W, panel_h = H)
    }
  } else {
    if (has_overlay) {
      for (tr in overlay_traces) {
        if (!is.null(tr$x) && !is.null(tr$y) && length(tr$x) > 0) {
          points(tr$x, tr$y, pch = 16, cex = dot_cex,
                 col = adjustcolor(tr$color %||% "#444444", alpha.f = alpha_val))
        }
      }
    }
    points(x, y, pch = 16, cex = dot_cex,
           col = adjustcolor(pop_color %||% "#444444", alpha.f = alpha_val))
    if (has_back && !has_overlay) {
      points(x_back, y_back, pch = 16, cex = dot_cex,
             col = adjustcolor(back_color %||% "#d95f02", alpha.f = 0.42))
    }
  }
  dev.off()

  img <- png::readPNG(png_file, native = TRUE)
  grid.raster(img, width = unit(1, "npc"), height = unit(1, "npc"),
              interpolate = TRUE, name = "data_raster")
}

.draw_pseudocolor_raster <- function(x, y, xr, yr, W, H, dot_cex) {
  n <- length(x)
  if (n == 0) return()

  grid_n <- 128L
  x_norm <- (x - xr[1]) / (xr[2] - xr[1])
  y_norm <- (y - yr[1]) / (yr[2] - yr[1])
  gx <- pmax(1L, pmin(grid_n, as.integer(floor(x_norm * grid_n)) + 1L))
  gy <- pmax(1L, pmin(grid_n, as.integer(floor(y_norm * grid_n)) + 1L))

  dens_grid <- matrix(0, nrow = grid_n, ncol = grid_n)
  for (i in seq_len(n)) dens_grid[gy[i], gx[i]] <- dens_grid[gy[i], gx[i]] + 1

  for (pass in 1:2) {
    new_grid <- dens_grid
    for (ry in 2:(grid_n - 1))
      for (rx in 2:(grid_n - 1))
        new_grid[ry, rx] <- mean(dens_grid[(ry-1):(ry+1), (rx-1):(rx+1)])
    dens_grid <- new_grid
  }

  densities <- numeric(n)
  for (i in seq_len(n)) densities[i] <- dens_grid[gy[i], gx[i]]
  max_dens <- max(densities)
  if (max_dens == 0) return()

  ord <- order(densities)
  lut_idx <- pmax(1L, pmin(256L, as.integer(floor(densities / max_dens * 255)) + 1L))
  cols <- .jet_lut[lut_idx]
  points(x[ord], y[ord], pch = 16, cex = dot_cex,
         col = adjustcolor(cols[ord], alpha.f = 0.85))
}

.draw_contour_raster <- function(x, y, xr, yr, line_color, alpha_val, dot_cex,
                                 contour_threshold, kde_bandwidth,
                                 panel_w = 1, panel_h = 1) {
  n <- length(x)
  if (n < 10) {
    points(x, y, pch = 16, cex = dot_cex,
           col = adjustcolor(line_color, alpha.f = alpha_val))
    return()
  }
  if (!requireNamespace("MASS", quietly = TRUE)) {
    points(x, y, pch = 16, cex = dot_cex,
           col = adjustcolor(line_color, alpha.f = alpha_val))
    return()
  }

  threshold_pct <- if (!is.null(contour_threshold) && is.finite(contour_threshold)) {
    max(0, min(100, contour_threshold))
  } else 5

  kde_h <- NULL
  kb <- suppressWarnings(as.numeric(kde_bandwidth %||% NA_real_))
  if (is.finite(kb) && kb > 0) {
    # Match JS semantics: user bandwidth is in screen pixels.
    xr_span <- abs(xr[2] - xr[1])
    yr_span <- abs(yr[2] - yr[1])
    sx <- xr_span / max(1, panel_w)
    sy <- yr_span / max(1, panel_h)
    hx <- max(.Machine$double.eps, kb * sx)
    hy <- max(.Machine$double.eps, kb * sy)
    kde_h <- c(hx, hy)
  }

  kde <- tryCatch(
    if (is.null(kde_h)) {
      MASS::kde2d(x, y, n = 128, lims = c(xr, yr))
    } else {
      MASS::kde2d(x, y, n = 128, lims = c(xr, yr), h = kde_h)
    },
    error = function(e) NULL
  )
  if (is.null(kde)) {
    points(x, y, pch = 16, cex = dot_cex, col = adjustcolor(line_color, alpha.f = alpha_val))
    return()
  }

  peak <- max(kde$z)
  if (peak <= 0) {
    points(x, y, pch = 16, cex = dot_cex, col = adjustcolor(line_color, alpha.f = alpha_val))
    return()
  }
  outer_dens <- max(peak * (threshold_pct / 100), peak * 0.005)

  x_idx <- pmax(1L, pmin(length(kde$x), findInterval(x, kde$x, all.inside = TRUE)))
  y_idx <- pmax(1L, pmin(length(kde$y), findInterval(y, kde$y, all.inside = TRUE)))
  pt_dens <- numeric(n)
  for (i in seq_len(n)) pt_dens[i] <- kde$z[x_idx[i], y_idx[i]]
  outliers <- !is.na(pt_dens) & pt_dens < outer_dens
  if (any(outliers)) {
    points(x[outliers], y[outliers], pch = 16, cex = dot_cex * 0.75,
           col = adjustcolor(line_color, alpha.f = alpha_val))
  }

  n_levels <- 18L
  levels <- exp(seq(log(outer_dens), log(peak), length.out = n_levels))
  contour(kde$x, kde$y, kde$z, levels = levels, add = TRUE, drawlabels = FALSE,
          col = adjustcolor(line_color, alpha.f = min(1, alpha_val + 0.15)), lwd = 0.8)
}

# ── Data drawing: histogram ──────────────────────────────────────────────────
.draw_data_histogram <- function(x, xr, W, H, pop_color, overlay_traces,
                                 point_alpha, pdf_dpi,
                                 hist_line_width = 1.8,
                                 hist_fill = FALSE,
                                 hist_fill_alpha = 0.22,
                                 hist_overlay_mode = "front_opaque") {
  raster_w <- as.integer(ceiling(W * pdf_dpi / 72))
  raster_h <- as.integer(ceiling(H * pdf_dpi / 72))

  png_file <- tempfile(fileext = ".png")
  on.exit(unlink(png_file), add = TRUE)

  grDevices::png(png_file, width = raster_w, height = raster_h,
                 bg = "transparent", type = "cairo")
  par(mar = c(0, 0, 0, 0), xaxs = "i", yaxs = "i")
  plot.new()
  plot.window(xlim = xr, ylim = c(0, 1))

  alpha_val <- if (!is.null(hist_fill_alpha) && is.finite(hist_fill_alpha)) {
    max(0, min(1, hist_fill_alpha))
  } else if (!is.null(point_alpha) && is.finite(point_alpha)) {
    max(0, min(1, point_alpha))
  } else 0.22
  line_w <- if (!is.null(hist_line_width) && is.finite(hist_line_width)) {
    max(0.5, min(6, hist_line_width))
  } else 1.8
  # UI line width is in CSS px (96 DPI). Convert to device-space width so
  # exported rasterized histogram lines match on-screen thickness.
  line_w_device <- line_w * (pdf_dpi / 96)
  line_w_device <- max(0.5, line_w_device)
  hm <- as.character(hist_overlay_mode %||% "front_opaque")
  if (!hm %in% c("blend", "front_opaque")) hm <- "front_opaque"
  has_overlay <- !is.null(overlay_traces) && length(overlay_traces) > 0

  draw_kde <- function(vals, color, alpha, fill_enabled = FALSE) {
    if (length(vals) < 2) return()
    bw <- tryCatch(bw.SJ(vals), error = function(e) bw.nrd0(vals))
    bw <- max(bw, (xr[2] - xr[1]) / 200)
    d <- density(vals, bw = bw, from = xr[1], to = xr[2], n = 300)
    max_d <- max(d$y); if (max_d <= 0) return()
    y_scaled <- d$y / max_d * 0.92
    if (isTRUE(fill_enabled) && alpha > 0) {
      polygon(c(d$x[1], d$x, d$x[length(d$x)]), c(0, y_scaled, 0),
              col = adjustcolor(color, alpha.f = alpha), border = NA)
    }
    line_alpha <- if (isTRUE(fill_enabled)) min(1, alpha + 0.45) else 1
    lines(d$x, y_scaled, col = adjustcolor(color, alpha.f = line_alpha), lwd = line_w_device)
  }

  if (has_overlay) {
    for (tr in overlay_traces) {
      if (!is.null(tr$x) && length(tr$x) > 0) {
        draw_kde(tr$x, tr$color %||% "#444444", alpha_val, fill_enabled = isTRUE(hist_fill))
      }
    }
  }
  main_alpha <- if (has_overlay && isTRUE(hist_fill) && identical(hm, "front_opaque")) 1 else alpha_val
  draw_kde(x, pop_color %||% "#444444", main_alpha, fill_enabled = isTRUE(hist_fill))
  dev.off()

  img <- png::readPNG(png_file, native = TRUE)
  grid.raster(img, width = unit(1, "npc"), height = unit(1, "npc"),
              interpolate = TRUE, name = "data_raster")
}


# ══════════════════════════════════════════════════════════════════════════════
# GROUPED AXIS DRAWING
# Each axis (X, Y) is a gTree → SVG <g> with sub-groups:
#   x_axis / y_axis
#     ├─ major_ticks   (single segmentsGrob)
#     ├─ minor_ticks   (single segmentsGrob)
#     ├─ tick_labels   (<g> of <text> elements)
#     └─ axis_title    (text)
# ══════════════════════════════════════════════════════════════════════════════

.draw_axes_grouped <- function(xr, yr, has_y,
                               x_logicle_ticks, y_logicle_ticks,
                               x_is_logicle, y_is_logicle,
                               x_label, y_label,
                               M, W, H, tick_fs, axis_fs) {

  x_to_pt <- function(v) M$left + (v - xr[1]) / (xr[2] - xr[1]) * W
  y_to_pt <- function(v) M$bottom + (v - yr[1]) / (yr[2] - yr[1]) * H
  tick_len_major <- 5
  tick_len_minor <- 2.5
  gp_tick  <- gpar(col = "#333333", lwd = 0.5)
  gp_minor <- gpar(col = "#333333", lwd = 0.3)
  gp_label <- gpar(fontsize = tick_fs, fontfamily = "Helvetica", col = "#333333")
  gp_axis  <- gpar(fontsize = axis_fs, fontfamily = "Helvetica", col = "#000000")

  # ── X axis group ──
  x_children <- list()
  major_x0 <- numeric(0); major_x1 <- numeric(0)
  major_y0 <- numeric(0); major_y1 <- numeric(0)
  minor_x0 <- numeric(0); minor_x1 <- numeric(0)
  minor_y0 <- numeric(0); minor_y1 <- numeric(0)
  label_grobs <- list(); li <- 0L

  .fmt_linear_lbl <- function(v) {
    a <- abs(v); s <- if (v < 0) "-" else ""
    if (a == 0)        "0"
    else if (a >= 1e6) paste0(s, round(a / 1e6, 3), "M")
    else if (a >= 1e3) paste0(s, round(a / 1e3, 3), "K")
    else               format(v, scientific = FALSE, trim = TRUE)
  }

  .is_zero_tick <- function(v, lbl = NULL) {
    if (!is.null(lbl)) {
      ls <- trimws(as.character(lbl))
      if (identical(ls, "0") || identical(ls, "-0") || identical(ls, "+0")) return(TRUE)
    }
    vv <- suppressWarnings(as.numeric(v))
    is.finite(vv) && abs(vv) < 1e-9
  }

  if (x_is_logicle && !is.null(x_logicle_ticks)) {
    major_pos    <- as.numeric(x_logicle_ticks$major_pos %||% numeric(0))
    major_labels <- as.character(x_logicle_ticks$major_labels %||% character(0))
    minor_pos    <- as.numeric(x_logicle_ticks$minor_pos %||% numeric(0))
    x_tick_mode  <- as.character(x_logicle_ticks$tick_mode %||% "")
    x_is_scatter_log10 <- identical(x_tick_mode, "scatter_log10")

    # Pre-compute which labels to show (zero takes priority over neighbours)
    zero_idx_x <- if (!x_is_scatter_log10) {
      zi <- which(vapply(seq_along(major_pos), function(i) {
        lbl <- if (i <= length(major_labels)) major_labels[i] else NULL
        .is_zero_tick(major_pos[i], lbl)
      }, logical(1)))
      if (length(zi) > 0) zi[[1]] else NA_integer_
    } else NA_integer_
    zero_xp_x <- if (is.finite(zero_idx_x)) x_to_pt(major_pos[zero_idx_x]) else NA_real_
    x_show_lbl <- logical(length(major_pos))
    last_lx <- -Inf
    last_was_zero <- FALSE
    x_adj_spacing <- max(8, 28 * 0.55)
    x_zero_protect <- max(5, 28 * 0.38)
    for (i in seq_along(major_pos)) {
      lbl <- if (i <= length(major_labels)) major_labels[i] else ""
      if (!nzchar(lbl)) next
      xp  <- x_to_pt(major_pos[i])
      is_zero <- !x_is_scatter_log10 && is.finite(zero_idx_x) && i == zero_idx_x
      req_spacing <- if (is_zero || last_was_zero) x_adj_spacing else 28
      if ((xp - last_lx) >= req_spacing || is_zero) {
        x_show_lbl[i] <- TRUE
        last_lx <- xp
        last_was_zero <- is_zero
      }
    }
    if (!is.na(zero_xp_x)) {
      for (i in seq_along(major_pos)) {
        is_zero <- is.finite(zero_idx_x) && i == zero_idx_x
        if (x_show_lbl[i] && !is_zero && abs(x_to_pt(major_pos[i]) - zero_xp_x) < x_zero_protect)
          x_show_lbl[i] <- FALSE
      }
    }

    for (i in seq_along(major_pos)) {
      xp <- x_to_pt(major_pos[i])
      major_x0 <- c(major_x0, xp); major_x1 <- c(major_x1, xp)
      major_y0 <- c(major_y0, M$bottom); major_y1 <- c(major_y1, M$bottom - tick_len_major)
      if (!x_show_lbl[i]) next
      lbl <- if (i <= length(major_labels)) major_labels[i] else ""
      if (!nzchar(lbl)) next
      li <- li + 1L
      label_grobs[[li]] <- textGrob(lbl, x = unit(xp, "points"),
                     y = unit(M$bottom - tick_len_major - 2, "points"),
                     just = c("centre", "top"), gp = gp_label)
    }
    for (mp in minor_pos) {
      xp <- x_to_pt(mp)
      minor_x0 <- c(minor_x0, xp); minor_x1 <- c(minor_x1, xp)
      minor_y0 <- c(minor_y0, M$bottom); minor_y1 <- c(minor_y1, M$bottom - tick_len_minor)
    }
  } else {
    tks <- pretty(xr, n = 4)
    tks <- tks[tks >= xr[1] & tks <= xr[2]]
    zero_idx_x_lin <- {
      zi <- which(vapply(tks, .is_zero_tick, logical(1)))
      if (length(zi) > 0) zi[[1]] else NA_integer_
    }
    zero_xp_x_lin <- if (is.finite(zero_idx_x_lin)) x_to_pt(tks[zero_idx_x_lin]) else NA_real_
    for (i in seq_along(tks)) {
      tv <- tks[i]
      xp <- x_to_pt(tv)
      major_x0 <- c(major_x0, xp); major_x1 <- c(major_x1, xp)
      major_y0 <- c(major_y0, M$bottom); major_y1 <- c(major_y1, M$bottom - tick_len_major)
      is_zero <- is.finite(zero_idx_x_lin) && i == zero_idx_x_lin
      too_close_to_zero <- !is.na(zero_xp_x_lin) && !is_zero && abs(xp - zero_xp_x_lin) < max(5, 28 * 0.38)
      if (!too_close_to_zero) {
        li <- li + 1L
        label_grobs[[li]] <- textGrob(.fmt_linear_lbl(tv),
                       x = unit(xp, "points"),
                       y = unit(M$bottom - tick_len_major - 2, "points"),
                       just = c("centre", "top"), gp = gp_label)
      }
    }
  }

  if (length(major_x0) > 0) {
    x_children[[length(x_children) + 1L]] <- segmentsGrob(
      x0 = unit(major_x0, "points"), x1 = unit(major_x1, "points"),
      y0 = unit(major_y0, "points"), y1 = unit(major_y1, "points"),
      gp = gp_tick, name = "major_ticks")
  }
  if (length(minor_x0) > 0) {
    x_children[[length(x_children) + 1L]] <- segmentsGrob(
      x0 = unit(minor_x0, "points"), x1 = unit(minor_x1, "points"),
      y0 = unit(minor_y0, "points"), y1 = unit(minor_y1, "points"),
      gp = gp_minor, name = "minor_ticks")
  }
  if (length(label_grobs) > 0) {
    x_children[[length(x_children) + 1L]] <- gTree(
      children = do.call(gList, label_grobs), name = "tick_labels")
  }
  if (!is.null(x_label) && nzchar(x_label)) {
    x_children[[length(x_children) + 1L]] <- textGrob(x_label,
                   x = unit(M$left + W / 2, "points"),
                   y = unit(M$bottom - 26, "points"),
                   just = c("centre", "top"), gp = gp_axis, name = "axis_title")
  }
  if (length(x_children) > 0) {
    grid.draw(gTree(children = do.call(gList, x_children), name = "x_axis"))
  }

  # ── Y axis group ──
  if (has_y) {
    y_children <- list()
    major_x0 <- numeric(0); major_x1 <- numeric(0)
    major_y0 <- numeric(0); major_y1 <- numeric(0)
    minor_x0 <- numeric(0); minor_x1 <- numeric(0)
    minor_y0 <- numeric(0); minor_y1 <- numeric(0)
    label_grobs <- list(); li <- 0L

    if (y_is_logicle && !is.null(y_logicle_ticks)) {
      major_pos    <- as.numeric(y_logicle_ticks$major_pos %||% numeric(0))
      major_labels <- as.character(y_logicle_ticks$major_labels %||% character(0))
      minor_pos    <- as.numeric(y_logicle_ticks$minor_pos %||% numeric(0))
      y_tick_mode  <- as.character(y_logicle_ticks$tick_mode %||% "")
      y_is_scatter_log10 <- identical(y_tick_mode, "scatter_log10")

      zero_idx_y <- if (!y_is_scatter_log10) {
        zi <- which(vapply(seq_along(major_pos), function(i) {
          lbl <- if (i <= length(major_labels)) major_labels[i] else NULL
          .is_zero_tick(major_pos[i], lbl)
        }, logical(1)))
        if (length(zi) > 0) zi[[1]] else NA_integer_
      } else NA_integer_
      zero_xp_y <- if (is.finite(zero_idx_y)) y_to_pt(major_pos[zero_idx_y]) else NA_real_
      y_show_lbl <- logical(length(major_pos))
      last_ly <- -Inf
      last_was_zero <- FALSE
      y_adj_spacing <- max(8, 18 * 0.55)
      y_zero_protect <- max(5, 18 * 0.38)
      for (i in seq_along(major_pos)) {
        lbl <- if (i <= length(major_labels)) major_labels[i] else ""
        if (!nzchar(lbl)) next
        yp <- y_to_pt(major_pos[i])
        is_zero <- !y_is_scatter_log10 && is.finite(zero_idx_y) && i == zero_idx_y
        req_spacing <- if (is_zero || last_was_zero) y_adj_spacing else 18
        if ((yp - last_ly) >= req_spacing || is_zero) {
          y_show_lbl[i] <- TRUE
          last_ly <- yp
          last_was_zero <- is_zero
        }
      }
      if (!is.na(zero_xp_y)) {
        for (i in seq_along(major_pos)) {
          is_zero <- is.finite(zero_idx_y) && i == zero_idx_y
          if (y_show_lbl[i] && !is_zero && abs(y_to_pt(major_pos[i]) - zero_xp_y) < y_zero_protect)
            y_show_lbl[i] <- FALSE
        }
      }

      for (i in seq_along(major_pos)) {
        yp <- y_to_pt(major_pos[i])
        major_x0 <- c(major_x0, M$left); major_x1 <- c(major_x1, M$left - tick_len_major)
        major_y0 <- c(major_y0, yp); major_y1 <- c(major_y1, yp)
        if (!y_show_lbl[i]) next
        lbl <- if (i <= length(major_labels)) major_labels[i] else ""
        if (!nzchar(lbl)) next
        li <- li + 1L
        label_grobs[[li]] <- textGrob(lbl, x = unit(M$left - tick_len_major - 2, "points"),
                        y = unit(yp, "points"),
                        just = c("right", "centre"), gp = gp_label)
      }
      for (mp in minor_pos) {
        yp <- y_to_pt(mp)
        minor_x0 <- c(minor_x0, M$left); minor_x1 <- c(minor_x1, M$left - tick_len_minor)
        minor_y0 <- c(minor_y0, yp); minor_y1 <- c(minor_y1, yp)
      }
    } else {
      tks <- pretty(yr, n = 4)
      tks <- tks[tks >= yr[1] & tks <= yr[2]]
      zero_idx_y_lin <- {
        zi <- which(vapply(tks, .is_zero_tick, logical(1)))
        if (length(zi) > 0) zi[[1]] else NA_integer_
      }
      zero_xp_y_lin <- if (is.finite(zero_idx_y_lin)) y_to_pt(tks[zero_idx_y_lin]) else NA_real_
      for (i in seq_along(tks)) {
        tv <- tks[i]
        yp <- y_to_pt(tv)
        major_x0 <- c(major_x0, M$left); major_x1 <- c(major_x1, M$left - tick_len_major)
        major_y0 <- c(major_y0, yp); major_y1 <- c(major_y1, yp)
        is_zero <- is.finite(zero_idx_y_lin) && i == zero_idx_y_lin
        too_close_to_zero <- !is.na(zero_xp_y_lin) && !is_zero && abs(yp - zero_xp_y_lin) < max(5, 18 * 0.38)
        if (!too_close_to_zero) {
          li <- li + 1L
          label_grobs[[li]] <- textGrob(.fmt_linear_lbl(tv),
                          x = unit(M$left - tick_len_major - 2, "points"),
                          y = unit(yp, "points"),
                          just = c("right", "centre"), gp = gp_label)
        }
      }
    }

    if (length(major_x0) > 0) {
      y_children[[length(y_children) + 1L]] <- segmentsGrob(
        x0 = unit(major_x0, "points"), x1 = unit(major_x1, "points"),
        y0 = unit(major_y0, "points"), y1 = unit(major_y1, "points"),
        gp = gp_tick, name = "major_ticks")
    }
    if (length(minor_x0) > 0) {
      y_children[[length(y_children) + 1L]] <- segmentsGrob(
        x0 = unit(minor_x0, "points"), x1 = unit(minor_x1, "points"),
        y0 = unit(minor_y0, "points"), y1 = unit(minor_y1, "points"),
        gp = gp_minor, name = "minor_ticks")
    }
    if (length(label_grobs) > 0) {
      y_children[[length(y_children) + 1L]] <- gTree(
        children = do.call(gList, label_grobs), name = "tick_labels")
    }
    if (!is.null(y_label) && nzchar(y_label)) {
      y_children[[length(y_children) + 1L]] <- textGrob(y_label,
                      x = unit(M$left - 32, "points"),
                      y = unit(M$bottom + H / 2, "points"),
                      just = c("centre", "bottom"), rot = 90, gp = gp_axis,
                      name = "axis_title")
    }
    if (length(y_children) > 0) {
      grid.draw(gTree(children = do.call(gList, y_children), name = "y_axis"))
    }
  }
}


# ══════════════════════════════════════════════════════════════════════════════
# GROUPED GATE OVERLAY DRAWING
# Each gate is a gTree → SVG <g> with sub-groups:
#   gate_<id>
#     ├─ polygon       (single polygon path)
#     └─ label         (<g> sub-group)
#         ├─ label_bg   (rect)
#         └─ label_text (text)
# ══════════════════════════════════════════════════════════════════════════════

.draw_gate_grouped <- function(gate, xr, yr, M, W, H, gate_fs, gate_idx, gate_style = NULL) {
  verts <- gate$vertices
  if (is.null(verts) || length(verts) < 2) return()

  pub_style  <- isTRUE(gate_style$pub_style)
  line_width <- {
    lw <- suppressWarnings(as.numeric(gate_style$line_width %||% NA))
    if (is.finite(lw) && lw > 0) lw else 1.2
  }

  x_to_pt <- function(v) M$left + (v - xr[1]) / (xr[2] - xr[1]) * W
  y_to_pt <- function(v) M$bottom + (v - yr[1]) / (yr[2] - yr[1]) * H

  gate_type  <- gate$gate_type %||% "polygon"
  gate_color <- gate$color %||% "#377eb8"
  stroke_col <- if (pub_style) "#000000" else gate_color

  if (gate_type == "rectangle" && length(verts) == 2) {
    v0 <- verts[[1]]; v1 <- verts[[2]]
    x0 <- .vertex_coord(v0, 1); y0 <- .vertex_coord(v0, 2)
    x1 <- .vertex_coord(v1, 1); y1 <- .vertex_coord(v1, 2)
    pts_x <- c(x0, x1, x1, x0)
    pts_y <- c(y0, y0, y1, y1)
  } else {
    pts_x <- vapply(verts, .vertex_coord, numeric(1), idx = 1L)
    pts_y <- vapply(verts, .vertex_coord, numeric(1), idx = 2L)
  }

  screen_x <- x_to_pt(pts_x)
  screen_y <- y_to_pt(pts_y)

  gate_children <- list()

  # Polygon fill + stroke (single path)
  gate_children[[1L]] <- polygonGrob(
    x = unit(screen_x, "points"), y = unit(screen_y, "points"),
    gp = gpar(fill = NA,
              col = stroke_col, lwd = line_width),
    name = "polygon")

  # Label sub-group: name on line 1, percentage on line 2 (matching gating editor)
  gate_name <- gate$name %||% ""
  if (nzchar(gate_name)) {
    cx <- mean(screen_x); cy <- mean(screen_y)
    lo <- gate$label_offset %||% c(0, 0)
    if (is.list(lo)) lo <- c(lo[[1]] %||% 0, lo[[2]] %||% 0)
    ox <- if (lo[1] != 0) (x_to_pt(lo[1]) - x_to_pt(0)) else 0
    oy <- if (lo[2] != 0) (y_to_pt(lo[2]) - y_to_pt(0)) else 0

    pct_val <- gate$percent_of_parent
    has_pct <- !is.null(pct_val) && is.finite(as.numeric(pct_val))
    pct_line <- if (has_pct) paste0(round(as.numeric(pct_val), 1), "%") else NULL

    # Estimate width from the longer of name vs percentage
    longer_text <- if (!is.null(pct_line) && nchar(pct_line) > nchar(gate_name)) pct_line else gate_name
    est_half_w <- nchar(longer_text) * gate_fs * 0.32 + 4
    est_h <- if (has_pct) gate_fs * 2.2 + 2 else gate_fs * 1.1 + 2

    # Clamp so label doesn't exceed plot area
    lx <- max(M$left + est_half_w, min(M$left + W - est_half_w, cx + ox))
    ly <- max(M$bottom + 5, min(M$bottom + H - 5, cy + oy))

    label_col <- if (pub_style) "#000000" else "#ffffff"

    if (pub_style) {
      # Publication style: plain text, no background rectangle
      label_children <- gList()
    } else {
      label_children <- gList(
        rectGrob(
          x = unit(lx, "points"), y = unit(ly, "points"),
          width = unit(est_half_w * 2, "points"), height = unit(est_h, "points"),
          gp = gpar(fill = adjustcolor(gate_color, alpha.f = 0.85), col = NA),
          name = "label_bg"))
    }

    if (has_pct) {
      # Two lines: name above, percentage below
      label_children <- gList(label_children,
        textGrob(gate_name,
          x = unit(lx, "points"), y = unit(ly + gate_fs * 0.45, "points"),
          just = c("centre", "centre"),
          gp = gpar(fontsize = gate_fs, fontfamily = "Helvetica", col = label_col),
          name = "label_name"),
        textGrob(pct_line,
          x = unit(lx, "points"), y = unit(ly - gate_fs * 0.55, "points"),
          just = c("centre", "centre"),
          gp = gpar(fontsize = gate_fs - 1, fontfamily = "Helvetica", col = label_col),
          name = "label_pct"))
    } else {
      label_children <- gList(label_children,
        textGrob(gate_name,
          x = unit(lx, "points"), y = unit(ly, "points"),
          just = c("centre", "centre"),
          gp = gpar(fontsize = gate_fs, fontfamily = "Helvetica", col = label_col),
          name = "label_text"))
    }
    gate_children[[length(gate_children) + 1L]] <- gTree(
      children = label_children, name = "label")
  }

  gate_name_safe <- gsub("[^A-Za-z0-9_]", "_", gate$gate_id %||% paste0("gate_", gate_idx))
  grid.draw(gTree(children = do.call(gList, gate_children), name = paste0("gate_", gate_name_safe)))
}

.vertex_coord <- function(v, idx) {
  if (is.list(v)) as.numeric(v[[idx]]) else as.numeric(v[idx])
}


# ── Illustration legend ───────────────────────────────────────────────────────
# legend <g>
#   ├─ entry_<pop_id> <g> (per population)
#   │    ├─ swatch (rect)
#   │    └─ name   (text)
.draw_illustration_legend <- function(pop_ids, pop_names, pop_color_map,
                                      page_w, page_h, legend_h) {
  swatch_sz <- 8; gap <- 12; x_pos <- 14
  entry_grobs <- list(); ei <- 0L

  for (pid in pop_ids) {
    name <- pop_names[[pid]] %||% pid
    color <- pop_color_map[[pid]] %||% "#444444"
    entry_children <- gList(
      rectGrob(
        x = unit(x_pos, "points"), y = unit(page_h - legend_h / 2, "points"),
        width = unit(swatch_sz, "points"), height = unit(swatch_sz, "points"),
        just = c("left", "centre"), gp = gpar(fill = color, col = NA),
        name = "swatch"),
      textGrob(name,
        x = unit(x_pos + swatch_sz + 3, "points"),
        y = unit(page_h - legend_h / 2, "points"),
        just = c("left", "centre"),
        gp = gpar(fontsize = 9, fontfamily = "Helvetica", col = "#222222"),
        name = "name")
    )
    ei <- ei + 1L
    safe_pid <- gsub("[^A-Za-z0-9_]", "_", pid)
    entry_grobs[[ei]] <- gTree(children = entry_children, name = paste0("entry_", safe_pid))
    x_pos <- x_pos + swatch_sz + 3 + nchar(name) * 5.5 + gap
  }

  if (length(entry_grobs) > 0) {
    grid.draw(gTree(children = do.call(gList, entry_grobs), name = "legend"))
  }
}

# ── Stacked ridgeline histogram export (direct SVG) ──────────────────────────
# The grid/overlay paths above use grid + gridSVG. Ridgelines instead build the
# SVG string directly: this gives a true <linearGradient> heat fill and full
# control over the stacked layout, mirroring renderRidgelinePanel() in
# www/mini_plot.js so the export matches the on-screen preview.
#
# payload$plots is keyed "pop_id|channel"; each entry has $x (full-res values),
# $x_range, and optional $x_logicle_ticks. opts carries style/layout (font_sizes,
# hist_line_width, ridge_overlap, ridge_gradient, population_colors, plot_size,
# n_columns, color_by_population).
export_ridgeline_svg <- function(file_path, payload, opts) {
  plots      <- payload$plots %||% list()
  pop_ids    <- as.character(payload$pop_ids %||% character(0))
  pop_names  <- payload$pop_names %||% list()
  x_channels <- as.character(payload$x_channels %||% character(0))
  if (length(plots) == 0 || length(x_channels) == 0 || length(pop_ids) == 0) {
    return(invisible(NULL))
  }

  fs        <- opts$font_sizes %||% list()
  tick_fs   <- as.numeric(fs$tick %||% 9)
  axis_fs   <- as.numeric(fs$axis_label %||% 11)
  label_fs  <- tick_fs + 1
  line_w    <- max(0.5, min(6, as.numeric(opts$hist_line_width %||% 1)))
  overlap   <- max(0, min(0.95, as.numeric(opts$ridge_overlap %||% 0.7)))
  gradient  <- isTRUE(opts$ridge_gradient)
  color_by  <- isTRUE(opts$color_by_population)
  plot_size <- max(120, min(900, as.integer(opts$plot_size %||% 300)))
  n_cols    <- max(1L, min(24L, as.integer(opts$n_columns %||% length(x_channels))))

  # Geometry — mirrors www/mini_plot.js renderRidgelinePanel.
  plot_w   <- max(150, plot_size - 40)
  # Population labels are identical across channels, so only the first column of
  # each panel row carries the label gutter; the rest drop it to pack tightly.
  label_w_full <- 112; label_w_none <- 8
  right_pad <- 10; top_pad <- 8; axis_h <- 36
  ridge_h  <- 44
  row_step <- max(6, round(ridge_h * (1 - overlap)))
  n_pop    <- length(pop_ids)

  first_baseline <- top_pad + ridge_h
  last_baseline  <- first_baseline + (n_pop - 1) * row_step
  panel_h  <- last_baseline + axis_h

  gap <- max(0, as.numeric(opts$ridge_col_gap %||% 8)); margin <- 10
  full_panel_w   <- label_w_full + plot_w + right_pad
  narrow_panel_w <- label_w_none + plot_w + right_pad
  n_plot_cols <- min(n_cols, length(x_channels))
  n_plot_rows <- ceiling(length(x_channels) / n_cols)
  page_w <- full_panel_w + (n_plot_cols - 1) * (narrow_panel_w + gap) + 2 * margin
  page_h <- n_plot_rows * panel_h + (n_plot_rows - 1) * gap + 2 * margin

  POP_COLS <- c("#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd",
                "#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf")
  prov_cols <- opts$population_colors %||% payload$population_colors %||% list()
  norm_hex <- function(x, fb) {
    raw <- toupper(trimws(as.character(x %||% "")))
    if (grepl("^#[0-9A-F]{6}$", raw)) return(raw)
    if (grepl("^[0-9A-F]{6}$", raw)) return(paste0("#", raw))
    fb
  }
  pop_color <- function(i) {
    pid <- pop_ids[i]; fb <- POP_COLS[((i - 1L) %% length(POP_COLS)) + 1L]
    if (color_by) norm_hex(prov_cols[[pid]], fb) else "#888888"
  }

  HEAT <- list(c(0,"#000000"), c(0.32,"#5a0000"), c(0.52,"#c41200"),
               c(0.72,"#ff7b00"), c(0.90,"#ffd000"), c(1,"#ffff3a"))
  esc <- function(s) { s <- gsub("&","&amp;",s,fixed=TRUE); s <- gsub("<","&lt;",s,fixed=TRUE); gsub(">","&gt;",s,fixed=TRUE) }
  nf  <- function(v) sprintf("%.2f", v)

  kde_eval <- function(xv, d0, d1, npts) {
    xv <- xv[is.finite(xv)]
    if (length(xv) < 2 || !is.finite(d0) || !is.finite(d1) || d1 <= d0) return(NULL)
    d <- tryCatch(stats::density(xv, from = d0, to = d1, n = npts), error = function(e) NULL)
    if (is.null(d)) return(NULL)
    md <- max(d$y); if (!is.finite(md) || md <= 0) return(NULL)
    list(x = d$x, y = d$y, maxD = md)
  }

  lines <- c(
    '<?xml version="1.0" encoding="UTF-8"?>',
    sprintf('<svg xmlns="http://www.w3.org/2000/svg" width="%dpx" height="%dpx" viewBox="0 0 %d %d" version="1.1" font-family="Arial, Helvetica, sans-serif">',
            round(page_w), round(page_h), round(page_w), round(page_h)),
    '<rect x="0" y="0" width="100%" height="100%" fill="#ffffff"/>'
  )
  defs <- character(0)
  npts <- 200

  for (ci in seq_along(x_channels)) {
    x_ch <- x_channels[ci]
    col_idx <- (ci - 1L) %% n_cols
    row_idx <- (ci - 1L) %/% n_cols
    show_labels <- (col_idx == 0L)
    this_label_w <- if (show_labels) label_w_full else label_w_none
    panel_x <- if (col_idx == 0L) margin
               else margin + full_panel_w + (col_idx - 1L) * narrow_panel_w + col_idx * gap
    panel_y <- margin + row_idx * (panel_h + gap)
    plot_left <- panel_x + this_label_w

    # x-range + logicle ticks from the first available population for this channel
    dom <- NULL; lticks <- NULL
    for (pid in pop_ids) {
      pd <- plots[[paste0(pid, "|", x_ch)]]
      if (!is.null(pd) && length(pd$x_range) == 2) { dom <- as.numeric(pd$x_range); lticks <- pd$x_logicle_ticks; break }
    }
    if (is.null(dom)) next
    d0 <- dom[1]; d1 <- dom[2]; if (!(d1 > d0)) next
    xsc <- function(xv) plot_left + (xv - d0) / (d1 - d0) * plot_w

    grad_id <- paste0("heat", ci)
    if (gradient) {
      stops <- vapply(HEAT, function(s) sprintf('<stop offset="%s" stop-color="%s"/>', s[[1]], s[[2]]), character(1))
      defs <- c(defs, sprintf('<linearGradient id="%s" gradientUnits="userSpaceOnUse" x1="%s" y1="0" x2="%s" y2="0">',
                              grad_id, nf(plot_left), nf(plot_left + plot_w)),
                stops, '</linearGradient>')
    }

    for (r in seq_len(n_pop)) {
      pid <- pop_ids[r]
      pd  <- plots[[paste0(pid, "|", x_ch)]]
      if (is.null(pd) || is.null(pd$x) || length(pd$x) == 0) next
      cur <- kde_eval(as.numeric(pd$x), d0, d1, npts)
      if (is.null(cur)) next
      baseline <- panel_y + first_baseline + (r - 1L) * row_step
      yof <- function(dv) baseline - (dv / cur$maxD) * ridge_h

      px <- xsc(cur$x); py <- yof(cur$y)
      # filled polygon
      fillpts <- paste0(nf(px), ",", nf(py), collapse = " ")
      dstr <- paste0("M", nf(px[1]), ",", nf(baseline),
                     " L", paste0(nf(px), ",", nf(py), collapse = " L"),
                     " L", nf(px[length(px)]), ",", nf(baseline), " Z")
      fill <- if (gradient) paste0("url(#", grad_id, ")") else pop_color(r)
      fillop <- if (gradient) "1" else "0.85"
      lines <- c(lines, sprintf('<path d="%s" fill="%s" fill-opacity="%s" stroke="none"/>', dstr, fill, fillop))
      # outline
      ostr <- paste0("M", paste0(nf(px), ",", nf(py), collapse = " L"))
      ostroke <- if (gradient) "#1a1a1a" else pop_color(r)
      lines <- c(lines, sprintf('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linejoin="round"/>',
                                ostr, ostroke, nf(line_w)))
      # row label (first column only)
      if (show_labels) {
        full <- as.character(pop_names[[pid]] %||% pid)
        maxch <- max(3L, floor((label_w_full - 8) / (0.58 * label_fs)))
        lab <- if (nchar(full) > maxch) paste0(substr(full, 1, maxch - 1), "…") else full
        lines <- c(lines, sprintf('<text x="%s" y="%s" text-anchor="end" font-size="%s" fill="#222222">%s</text>',
                                  nf(plot_left - 6), nf(baseline - 2), nf(label_fs), esc(lab)))
      }
    }

    # x-axis line + ticks
    ax_y <- panel_y + last_baseline
    lines <- c(lines, sprintf('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#333333" stroke-width="0.8"/>',
                              nf(plot_left), nf(ax_y), nf(plot_left + plot_w), nf(ax_y)))
    tick_pos <- NULL; tick_lab <- NULL
    if (!is.null(lticks) && length(lticks$major_pos) > 0) {
      tick_pos <- as.numeric(lticks$major_pos); tick_lab <- as.character(lticks$major_labels %||% tick_pos)
    } else {
      pp <- pretty(c(d0, d1), n = 5); pp <- pp[pp >= d0 & pp <= d1]
      tick_pos <- pp; tick_lab <- as.character(pp)
    }
    for (ti in seq_along(tick_pos)) {
      tx <- xsc(tick_pos[ti])
      if (!is.finite(tx) || tx < plot_left - 1 || tx > plot_left + plot_w + 1) next
      lines <- c(lines,
        sprintf('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#333333" stroke-width="0.8"/>', nf(tx), nf(ax_y), nf(tx), nf(ax_y + 4)),
        sprintf('<text x="%s" y="%s" text-anchor="middle" font-size="%s" fill="#333333">%s</text>', nf(tx), nf(ax_y + 4 + tick_fs), nf(tick_fs), esc(tick_lab[ti])))
    }
    # channel name (x-axis label)
    lines <- c(lines, sprintf('<text x="%s" y="%s" text-anchor="middle" font-size="%s" fill="#222222">%s</text>',
                              nf(plot_left + plot_w / 2), nf(panel_y + panel_h - 4), nf(axis_fs), esc(x_ch)))
  }

  if (length(defs) > 0) lines <- append(lines, c("<defs>", defs, "</defs>"), after = 3L)
  lines <- c(lines, '</svg>')
  writeLines(lines, con = file_path, useBytes = TRUE)
  message("Ridgeline SVG exported: ", length(x_channels), " channel(s) × ", n_pop, " population(s) → ", file_path)
  invisible(file_path)
}
