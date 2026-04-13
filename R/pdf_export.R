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

  gate_view <- opts$gate_view %||% "forward"
  if (!is.character(gate_view)) gate_view <- as.character(gate_view)
  show_forward <- "forward" %in% gate_view
  show_back    <- "back" %in% gate_view
  if (!show_forward && !show_back) show_forward <- TRUE
  if (show_forward && show_back && display_mode == "pseudocolor") display_mode <- "scatter"

  page_w <- n_cols * plot_size + (n_cols - 1) * GAP_PT + 20
  page_h <- n_rows * plot_size + (n_rows - 1) * GAP_PT + 20

  .export_svg(file_path, page_w, page_h, function() {
    for (i in seq_along(steps)) {
      step <- steps[[i]]
      col_idx <- (i - 1L) %% n_cols
      row_idx <- (i - 1L) %/% n_cols

      x_origin <- 10 + col_idx * (plot_size + GAP_PT)
      y_origin <- page_h - 10 - (row_idx + 1) * plot_size - row_idx * GAP_PT

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
        pdf_dpi = pdf_dpi, pdf_point_size = pdf_point_size
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

  max_col <- max(vapply(nodes, function(n) as.integer(n$col %||% 0), integer(1)))
  max_row <- max(vapply(nodes, function(n) as.integer(n$row %||% 0), integer(1)))
  n_cols <- max_col + 1L
  n_rows <- max_row + 1L

  page_w <- n_cols * plot_size + (n_cols - 1) * GAP_PT + 20
  page_h <- n_rows * plot_size + (n_rows - 1) * GAP_PT + 20

  .export_svg(file_path, page_w, page_h, function() {
    for (nd in nodes) {
      col_idx <- as.integer(nd$col %||% 0)
      row_idx <- as.integer(nd$row %||% 0)
      x_origin <- 10 + col_idx * (plot_size + GAP_PT)
      y_origin <- page_h - 10 - (row_idx + 1) * plot_size - row_idx * GAP_PT
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
        pdf_dpi = pdf_dpi, pdf_point_size = pdf_point_size
      )
    }
  })
  invisible(file_path)
}


# ══════════════════════════════════════════════════════════════════════════════
# ILLUSTRATION SVG EXPORT
# ══════════════════════════════════════════════════════════════════════════════

export_illustration_pdf <- function(file_path, payload, opts) {
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

  pop_color_map <- list()
  for (i in seq_along(pop_ids)) {
    pid <- pop_ids[i]
    pop_color_map[[pid]] <- if (color_by_pop) {
      POP_COLORS[((i - 1L) %% length(POP_COLORS)) + 1L]
    } else "#444444"
  }

  row_header_h <- 16

  # Shared args for .render_panel
  common <- list(
    display_mode = display_mode, plot_size = plot_size, font_sizes = font_sizes,
    back_color = NULL, contour_threshold = opts$contour_threshold,
    point_alpha = pdf_point_alpha, kde_bandwidth = opts$kde_bandwidth,
    pdf_dpi = pdf_dpi, pdf_point_size = pdf_point_size
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
                          pdf_point_size = 0.6) {

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
                           point_alpha, pdf_dpi)
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
      .draw_gate_grouped(gates[[gi]], xr, yr, M, W, H, gate_fs, gi)
    }
  }

  # ── Plot border ──
  grid.rect(
    x = unit(M$left, "points"), y = unit(M$bottom, "points"),
    width = unit(W, "points"), height = unit(H, "points"),
    just = c("left", "bottom"),
    gp = gpar(fill = NA, col = "#333333", lwd = 0.75),
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
                         contour_threshold, kde_bandwidth)
    if (has_back) {
      .draw_contour_raster(x_back, y_back, xr, yr, back_color %||% "#d95f02",
                           alpha_val, dot_cex, contour_threshold, kde_bandwidth)
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
                                 contour_threshold, kde_bandwidth) {
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

  kde <- tryCatch(MASS::kde2d(x, y, n = 128, lims = c(xr, yr)), error = function(e) NULL)
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
                                 point_alpha, pdf_dpi) {
  raster_w <- as.integer(ceiling(W * pdf_dpi / 72))
  raster_h <- as.integer(ceiling(H * pdf_dpi / 72))

  png_file <- tempfile(fileext = ".png")
  on.exit(unlink(png_file), add = TRUE)

  grDevices::png(png_file, width = raster_w, height = raster_h,
                 bg = "transparent", type = "cairo")
  par(mar = c(0, 0, 0, 0), xaxs = "i", yaxs = "i")
  plot.new()
  plot.window(xlim = xr, ylim = c(0, 1))

  alpha_val <- if (!is.null(point_alpha) && is.finite(point_alpha)) {
    max(0.05, min(1, point_alpha))
  } else 0.35
  has_overlay <- !is.null(overlay_traces) && length(overlay_traces) > 0
  if (has_overlay) alpha_val <- min(alpha_val, 0.22)

  draw_kde <- function(vals, color, alpha) {
    if (length(vals) < 2) return()
    bw <- tryCatch(bw.SJ(vals), error = function(e) bw.nrd0(vals))
    bw <- max(bw, (xr[2] - xr[1]) / 200)
    d <- density(vals, bw = bw, from = xr[1], to = xr[2], n = 300)
    max_d <- max(d$y); if (max_d <= 0) return()
    y_scaled <- d$y / max_d * 0.92
    polygon(c(d$x[1], d$x, d$x[length(d$x)]), c(0, y_scaled, 0),
            col = adjustcolor(color, alpha.f = alpha), border = NA)
    lines(d$x, y_scaled, col = adjustcolor(color, alpha.f = min(1, alpha + 0.45)), lwd = 1.5)
  }

  if (has_overlay) {
    for (tr in overlay_traces) {
      if (!is.null(tr$x) && length(tr$x) > 0) draw_kde(tr$x, tr$color %||% "#444444", alpha_val)
    }
  }
  draw_kde(x, pop_color %||% "#444444", alpha_val)
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

  if (x_is_logicle && !is.null(x_logicle_ticks)) {
    major_pos    <- as.numeric(x_logicle_ticks$major_pos %||% numeric(0))
    major_labels <- as.character(x_logicle_ticks$major_labels %||% character(0))
    minor_pos    <- as.numeric(x_logicle_ticks$minor_pos %||% numeric(0))
    last_lx <- -Inf
    for (i in seq_along(major_pos)) {
      xp <- x_to_pt(major_pos[i])
      major_x0 <- c(major_x0, xp); major_x1 <- c(major_x1, xp)
      major_y0 <- c(major_y0, M$bottom); major_y1 <- c(major_y1, M$bottom - tick_len_major)
      lbl <- if (i <= length(major_labels)) major_labels[i] else ""
      if (nzchar(lbl) && (xp - last_lx) >= 28) {
        li <- li + 1L
        label_grobs[[li]] <- textGrob(lbl, x = unit(xp, "points"),
                       y = unit(M$bottom - tick_len_major - 2, "points"),
                       just = c("centre", "top"), gp = gp_label)
        last_lx <- xp
      }
    }
    for (mp in minor_pos) {
      xp <- x_to_pt(mp)
      minor_x0 <- c(minor_x0, xp); minor_x1 <- c(minor_x1, xp)
      minor_y0 <- c(minor_y0, M$bottom); minor_y1 <- c(minor_y1, M$bottom - tick_len_minor)
    }
  } else {
    tks <- pretty(xr, n = 4)
    tks <- tks[tks >= xr[1] & tks <= xr[2]]
    for (tv in tks) {
      xp <- x_to_pt(tv)
      major_x0 <- c(major_x0, xp); major_x1 <- c(major_x1, xp)
      major_y0 <- c(major_y0, M$bottom); major_y1 <- c(major_y1, M$bottom - tick_len_major)
      li <- li + 1L
      label_grobs[[li]] <- textGrob(format(tv, scientific = FALSE, trim = TRUE),
                     x = unit(xp, "points"),
                     y = unit(M$bottom - tick_len_major - 2, "points"),
                     just = c("centre", "top"), gp = gp_label)
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
      last_ly <- -Inf
      for (i in seq_along(major_pos)) {
        yp <- y_to_pt(major_pos[i])
        major_x0 <- c(major_x0, M$left); major_x1 <- c(major_x1, M$left - tick_len_major)
        major_y0 <- c(major_y0, yp); major_y1 <- c(major_y1, yp)
        lbl <- if (i <= length(major_labels)) major_labels[i] else ""
        if (nzchar(lbl) && (yp - last_ly) >= 18) {
          li <- li + 1L
          label_grobs[[li]] <- textGrob(lbl, x = unit(M$left - tick_len_major - 2, "points"),
                          y = unit(yp, "points"),
                          just = c("right", "centre"), gp = gp_label)
          last_ly <- yp
        }
      }
      for (mp in minor_pos) {
        yp <- y_to_pt(mp)
        minor_x0 <- c(minor_x0, M$left); minor_x1 <- c(minor_x1, M$left - tick_len_minor)
        minor_y0 <- c(minor_y0, yp); minor_y1 <- c(minor_y1, yp)
      }
    } else {
      tks <- pretty(yr, n = 4)
      tks <- tks[tks >= yr[1] & tks <= yr[2]]
      for (tv in tks) {
        yp <- y_to_pt(tv)
        major_x0 <- c(major_x0, M$left); major_x1 <- c(major_x1, M$left - tick_len_major)
        major_y0 <- c(major_y0, yp); major_y1 <- c(major_y1, yp)
        li <- li + 1L
        label_grobs[[li]] <- textGrob(format(tv, scientific = FALSE, trim = TRUE),
                        x = unit(M$left - tick_len_major - 2, "points"),
                        y = unit(yp, "points"),
                        just = c("right", "centre"), gp = gp_label)
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

.draw_gate_grouped <- function(gate, xr, yr, M, W, H, gate_fs, gate_idx) {
  verts <- gate$vertices
  if (is.null(verts) || length(verts) < 2) return()

  x_to_pt <- function(v) M$left + (v - xr[1]) / (xr[2] - xr[1]) * W
  y_to_pt <- function(v) M$bottom + (v - yr[1]) / (yr[2] - yr[1]) * H

  gate_type  <- gate$gate_type %||% "polygon"
  gate_color <- gate$color %||% "#377eb8"

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
    gp = gpar(fill = adjustcolor(gate_color, alpha.f = 0.05),
              col = gate_color, lwd = 1.2),
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

    label_children <- gList(
      rectGrob(
        x = unit(lx, "points"), y = unit(ly, "points"),
        width = unit(est_half_w * 2, "points"), height = unit(est_h, "points"),
        gp = gpar(fill = adjustcolor(gate_color, alpha.f = 0.85), col = NA),
        name = "label_bg"))

    if (has_pct) {
      # Two lines: name above, percentage below
      label_children <- gList(label_children,
        textGrob(gate_name,
          x = unit(lx, "points"), y = unit(ly + gate_fs * 0.45, "points"),
          just = c("centre", "centre"),
          gp = gpar(fontsize = gate_fs, fontfamily = "Helvetica", col = "#ffffff"),
          name = "label_name"),
        textGrob(pct_line,
          x = unit(lx, "points"), y = unit(ly - gate_fs * 0.55, "points"),
          just = c("centre", "centre"),
          gp = gpar(fontsize = gate_fs - 1, fontfamily = "Helvetica", col = "#ffffff"),
          name = "label_pct"))
    } else {
      label_children <- gList(label_children,
        textGrob(gate_name,
          x = unit(lx, "points"), y = unit(ly, "points"),
          just = c("centre", "centre"),
          gp = gpar(fontsize = gate_fs, fontfamily = "Helvetica", col = "#ffffff"),
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
