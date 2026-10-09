# The strategy drawing suite: gatelabContour(), gatelabDisplayEvents(), gatelabPanelGrob(),
# gatelabStrategyPlot() and the workspace reader behind it.
# Synthetic data throughout: donors D1 to D3, markers CD4, CD8, CD45RA and CCR7.

test_that("d3 ticks match d3-array for the cases an axis and a contour generator meet", {
  expect_equal(GateLabR:::.gatelabr_d3_ticks(-0.7, 7.4, 4), c(0, 2, 4, 6))
  expect_equal(GateLabR:::.gatelabr_d3_ticks(-0.6, 5.76, 4), c(0, 2, 4))
  expect_equal(GateLabR:::.gatelabr_d3_ticks(0, 1, 4), c(0, 0.2, 0.4, 0.6, 0.8, 1))
  expect_equal(GateLabR:::.gatelabr_d3_ticks(0, 1, 10), seq(0, 1, by = 0.1))
  expect_equal(GateLabR:::.gatelabr_d3_ticks(0, 10000, 4), c(0, 2000, 4000, 6000, 8000, 10000))
  # The contour generator's use: ticks up from the smallest positive number.
  top <- GateLabR:::.gatelabr_d3_ticks(.Machine$double.xmin, 0.00437, 20)
  expect_equal(top[length(top)], 0.0042)
  expect_equal(diff(top)[1], 0.0002)
})

# blur.js's blurf() and blur2(), line for line with zero-based indices, to check the vectorised
# port against.
blur_reference <- function(values, width, height, radius) {
  whole <- floor(radius); part <- radius - whole; span <- 2 * radius + 1
  pass <- function(to, from, start, stop, step) {
    at <- function(i) from[i + 1]
    stop <- stop - step
    if (!(stop >= start)) return(to)
    total <- whole * at(start)
    s0 <- step * whole; s1 <- s0 + step
    i <- start
    while (i < start + s0) { total <- total + at(min(stop, i)); i <- i + step }
    i <- start
    while (i <= stop) {
      total <- total + at(min(stop, i + s0))
      to[i + 1] <- (total + part * (at(max(start, i - s1)) + at(min(stop, i + s1)))) / span
      total <- total - at(max(start, i - s0))
      i <- i + step
    }
    to
  }
  along_x <- function(from) { to <- from; for (y in seq(0, width * height - width, by = width)) to <- pass(to, from, y, y + width, 1); to }
  along_y <- function(from) { to <- from; for (x in seq_len(width) - 1) to <- pass(to, from, x, x + width * height, width); to }
  for (i in 1:3) values <- along_x(values)
  for (i in 1:3) values <- along_y(values)
  values
}

test_that("the blur matches d3-array's blur2, at the edges and for a fractional radius", {
  blur2 <- GateLabR:::.gatelabr_d3_blur2
  set.seed(4)
  values <- runif(23 * 17)
  expect_equal(blur2(values, 23, 17, 2.378), blur_reference(values, 23, 17, 2.378))
  expect_equal(blur2(values, 23, 17, 2), blur_reference(values, 23, 17, 2))
  expect_equal(blur2(values, 23, 17, 0.4), blur_reference(values, 23, 17, 0.4))
  expect_equal(blur2(values, 23, 17, 0), values)
  # Away from an edge the blur moves mass without losing it, and is the same along x and y.
  grid <- matrix(0, 41, 41); grid[21, 21] <- 1
  blurred <- blur2(as.vector(grid), 41, 41, 1.5)
  expect_equal(sum(blurred), 1)
  expect_equal(matrix(blurred, 41), t(matrix(blurred, 41)))
  expect_equal(which.max(blurred), 21 + 20 * 41)
})

test_that("the density grid bins as d3.contourDensity does", {
  # One event at the centre of a 560 px square, bandwidth 10: grid side and the event's cell.
  dens <- GateLabR:::.gatelabr_d3_density_grid(280, 280, 560, 10)
  radius <- (sqrt(401) - 1) / 2
  expect_equal(dens$offset, 3 * radius)
  expect_equal(dens$size, floor(floor(560 + 6 * radius) / 4))
  expect_equal(sum(dens$values), 1)
  peak <- arrayInd(which.max(dens$values), c(dens$size, dens$size))
  expect_true(all(abs((peak - 0.5) * 4 - dens$offset - 280) <= 4))
})

test_that("gatelabContour gives log-spaced levels and outliers outside the lowest one", {
  set.seed(1)
  x <- c(rnorm(4000, 1, 0.4), rnorm(4000, 4, 0.5)); y <- c(rnorm(4000, 4, 0.5), rnorm(4000, 1, 0.4))
  ct <- gatelabContour(x, y, xlim = c(-1, 7), ylim = c(-1, 7), levels = 10, threshold = 5)
  expect_equal(ct$n, 8000)
  expect_equal(ct$bandwidth, 10)                       # max(2, min(10, round(1200 / sqrt(8000))))
  expect_length(ct$levels, 10)
  expect_equal(ct$levels[1] / ct$levels[10], 0.05)
  expect_equal(diff(log(ct$levels)), rep(log(20) / 9, 9))
  expect_setequal(unique(ct$paths$level), ct$levels[ct$levels %in% ct$paths$level])
  expect_gt(length(unique(ct$paths$level)), 5)
  # Outliers are a minority and lie outside the bulk of both clusters.
  expect_gt(nrow(ct$outliers), 0)
  expect_lt(nrow(ct$outliers), 0.2 * ct$n)
  centre_distance <- pmin(sqrt((ct$outliers$x - 1)^2 + (ct$outliers$y - 4)^2), sqrt((ct$outliers$x - 4)^2 + (ct$outliers$y - 1)^2))
  expect_gt(min(centre_distance), 0.4)
  # Events off the plot are neither contoured nor returned.
  off <- gatelabContour(c(x, 50), c(y, 50), xlim = c(-1, 7), ylim = c(-1, 7))
  expect_equal(off$n, 8000)
  expect_equal(gatelabContour(numeric(0), numeric(0), c(0, 1), c(0, 1))$n, 0)
})

test_that("the cap is shared by sample size and each sample thinned evenly", {
  sample_caps <- GateLabR:::.gatelabr_display_sample_caps
  thin_evenly <- GateLabR:::.gatelabr_thin_evenly
  expect_equal(sample_caps(c(600, 300, 100), 50), c(30, 15, 5))
  expect_equal(sample_caps(c(5, 5, 5), 100), c(5, 5, 5))          # under the cap: everything
  expect_equal(sample_caps(c(1, 1, 1), 2), c(1, 1, 0))            # a tie goes to the earlier sample
  expect_equal(sum(sample_caps(c(333, 333, 334), 10)), 10)
  expect_equal(thin_evenly(1:10, 4), c(1, 4, 7, 10))
  expect_equal(thin_evenly(1:5, 10), 1:5)
  sample_id <- rep(c("D1", "D2", "D3"), c(600, 300, 100))
  keep <- gatelabDisplayEvents(NULL, sample_id, max_events = 50)
  expect_equal(as.vector(table(sample_id[keep])), c(30, 15, 5))
  expect_equal(keep[c(1, 30)], c(1, 600))
  member <- rep(c(TRUE, FALSE), 500)
  expect_true(all(member[gatelabDisplayEvents(member, sample_id, max_events = 50)]))
  expect_equal(gatelabDisplayEvents(member, sample_id, max_events = 0), which(member))
})

# A two-step workspace: a polygon on the root, then a quadrant inside it.
strategy_workspace <- function(label_offset = NULL) list(
  hostedAssayId = "exprs",
  gating = list(
    root_population_id = "root",
    gates = list(
      g_poly = list(gate_id = "g_poly", name = "CD4_positive gate", gate_type = "polygon", x_channel = "CD4",
                    y_channel = "CD8", color = "#e41a1c", label_offset = label_offset,
                    vertices = list(list(2.5, -0.5), list(6, -0.5), list(6, 2.5), list(2.5, 2.5))),
      g_quad = list(gate_id = "g_quad", name = "CD45RA x CCR7 quadrant", gate_type = "quadrant", x_channel = "CD45RA",
                    y_channel = "CCR7", color = "#377eb8", label_offset = NULL, center = list(2, 2))),
    populations = list(
      root = list(population_id = "root", name = "All Events", parent_id = NULL, children = list("p_cd4"), gate_refs = list()),
      p_cd4 = list(population_id = "p_cd4", name = "CD4_positive", parent_id = "root", children = list("p_naive", "p_em"),
                   gate_refs = list(list(gate_id = "g_poly", include = TRUE))),
      p_naive = list(population_id = "p_naive", name = "naive", parent_id = "p_cd4", children = list(),
                     gate_refs = list(list(gate_id = "g_quad", include = TRUE, quadrant = 2))),
      p_em = list(population_id = "p_em", name = "effector_memory", parent_id = "p_cd4", children = list(),
                  gate_refs = list(list(gate_id = "g_quad", include = TRUE, quadrant = 4))))),
  scales = list(globalScales = list()), display = list())

# An object carrying that workspace and no stored memberships, with the memberships its gates
# give worked out from their geometry.
strategy_sce <- function(workspace = strategy_workspace()) {
  set.seed(2)
  n <- 6000
  cd4 <- rep(c(TRUE, FALSE), each = n / 2)
  values <- rbind(CD4 = ifelse(cd4, rnorm(n, 4, 0.5), rnorm(n, 1, 0.4)), CD8 = ifelse(cd4, rnorm(n, 1, 0.4), rnorm(n, 4, 0.5)),
                  CD45RA = rnorm(n, rep(c(1, 3), n / 2), 0.4), CCR7 = rnorm(n, rep(c(1, 3), n / 2), 0.4))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(exprs = values),
    colData = S4Vectors::DataFrame(sample_id = factor(rep(c("D1", "D2", "D3"), length.out = n))))
  S4Vectors::metadata(sce)$gatelab_workspace <- list(workspace_json = as.character(jsonlite::toJSON(workspace, auto_unbox = TRUE, null = "null")))
  gating <- GateLabR:::.gatelabr_strategy_gating(sce)
  in_gate <- GateLabR:::.gatelabr_strategy_in_gate
  in_cd4 <- in_gate(gating$gates$g_poly, values["CD4", ], values["CD8", ])
  membership <- cbind(CD4_positive = in_cd4,
                      naive = in_cd4 & in_gate(gating$gates$g_quad, values["CD45RA", ], values["CCR7", ], 2),
                      effector_memory = in_cd4 & in_gate(gating$gates$g_quad, values["CD45RA", ], values["CCR7", ], 4))
  list(sce = sce, membership = membership)
}

test_that("the workspace reader gives gates, populations and the root", {
  strategy_gating <- GateLabR:::.gatelabr_strategy_gating
  in_gate <- GateLabR:::.gatelabr_strategy_in_gate
  fixture <- strategy_sce()
  gating <- strategy_gating(fixture$sce)
  expect_equal(gating$root, "root")
  expect_equal(gating$assay, "exprs")
  expect_setequal(names(gating$gates), c("g_poly", "g_quad"))
  expect_equal(dim(gating$gates$g_poly$vertices), c(4L, 2L))
  expect_null(gating$gates$g_poly$label_offset)
  expect_equal(gating$gates$g_quad$center, c(2, 2))
  expect_true(is.na(gating$populations$root$parent_id))
  expect_equal(gating$populations$p_em$gate_refs$quadrant, 4L)
  expect_equal(gating$populations$p_cd4$gate_refs$include, TRUE)
  # A rectangle comes back as its four corners; quadrants are numbered as the app numbers them.
  rectangle <- strategy_workspace()
  rectangle$gating$gates$g_poly$gate_type <- "rectangle"
  rectangle$gating$gates$g_poly$vertices <- list(list(6, 2.5), list(2.5, -0.5))
  expect_equal(strategy_gating(rectangle)$gates$g_poly$vertices, cbind(c(2.5, 6, 6, 2.5), c(-0.5, -0.5, 2.5, 2.5)))
  quadrant <- gating$gates$g_quad
  expect_equal(c(in_gate(quadrant, 1, 3, 1), in_gate(quadrant, 3, 3, 2), in_gate(quadrant, 3, 1, 3),
                 in_gate(quadrant, 1, 1, 4), in_gate(quadrant, 2, 2, 2)), rep(TRUE, 5))
  expect_error(strategy_gating(SingleCellExperiment::SingleCellExperiment()), "no GateLab workspace")
  # The hierarchy the workspace holds is the one it names as active, where it names one.
  expect_null(gating$hierarchy_id)
  named <- strategy_workspace()
  named$gating$active_hierarchy_id <- "main"
  expect_equal(strategy_gating(named)$hierarchy_id, "main")
})

test_that("a panel follows the app's margins, ticks and label rules", {
  panel_geometry <- GateLabR:::.gatelabr_panel_geometry
  fs <- GateLabR:::.gatelabr_panel_font_sizes(c(tick = 12, axis = 12))
  geo <- panel_geometry(c(-0.7, 7.4), c(-0.8, 7.5), 300, fs)
  expect_equal(unname(geo$margin), c(22, 8, 50, 54))
  expect_equal(c(geo$W, geo$H), c(238, 228))
  expect_equal(geo$x_labels, c("0", "2", "4", "6"))
  expect_equal(c(geo$x_title_offset, geo$y_title_offset), c(34, 25))
  # Wide tick labels push the y title out and the left margin with it.
  wide <- panel_geometry(c(0, 1), c(0, 262144), 300, fs)
  expect_equal(wide$y_labels[2:3], c("50K", "100K"))
  expect_gt(wide$y_title_offset, geo$y_title_offset)
  expect_equal(vapply(c(0, 2.5, -3, 0.25, 150, 1500, 2.5e6), GateLabR:::.gatelabr_panel_format_linear, ""),
               c("0", "2.5", "-3", "0.25", "150", "1.5K", "2.5M"))
  expect_equal(GateLabR:::.gatelabr_panel_spaced(c(0, 10, 40, 50, 90), 28), c(TRUE, FALSE, TRUE, FALSE, TRUE))

  set.seed(3)
  gate <- list(type = "polygon", gate_id = "g1", name = "CD4_positive", color = "#e41a1c", percent = 49.96,
               vertices = cbind(c(2.5, 6, 6, 2.5), c(-0.5, -0.5, 2.5, 2.5)), label_offset = c(0, 1.74), label_placed = FALSE)
  panel <- gatelabPanelGrob(rnorm(2000, 2, 1), rnorm(2000, 2, 1), xlim = c(-1, 7), ylim = c(-1, 7), xlab = "CD4", ylab = "CD8",
                            title = "All Events (2,000)", gates = list(gate))
  expect_s3_class(panel, "gatelab_panel")
  expect_named(attr(panel, "anchors"), "g1")
  labels <- unlist(lapply(panel$children, function(child) if (inherits(child, "text")) child$label))
  expect_true(all(c("All Events (2,000)", "CD4", "CD8", "CD4_positive", "50.0%", "0", "2", "4", "6") %in% labels))
  # It draws on a real device.
  file <- tempfile(fileext = ".pdf")
  grDevices::pdf(file, width = 300 / 96, height = 300 / 96)
  grid::grid.draw(panel)
  grDevices::dev.off()
  expect_gt(file.size(file), 1000)
})

test_that("a quadrant's shares sit in the corners with a backing, or where the app put them", {
  quadrant <- list(type = "quadrant", gate_id = "g2", name = "CD4 x CD8", color = "#377eb8", center = c(2, 2),
                   quadrant_pcts = c(10, 20, 30, 40))
  shares <- function(panel) {
    found <- Filter(function(child) inherits(child, "text") && grepl("%$", child$label), panel$children)
    out <- data.frame(label = vapply(found, function(g) g$label, ""), x = vapply(found, function(g) as.numeric(g$x), 0),
                      y = vapply(found, function(g) as.numeric(g$y), 0), hjust = vapply(found, function(g) g$hjust, 0))
    out[order(out$label), ]
  }
  backings <- function(panel) sum(vapply(panel$children, function(child) inherits(child, "roundrect"), logical(1)))
  draw <- function(...) gatelabPanelGrob(c(1, 3), c(1, 3), xlim = c(0, 4), ylim = c(0, 4), gates = list(quadrant), ...)
  geo <- GateLabR:::.gatelabr_panel_geometry(c(0, 4), c(0, 4), 300, GateLabR:::.gatelabr_panel_font_sizes(NULL), has_ylab = FALSE)
  left <- geo$margin[["left"]]; top <- geo$margin[["top"]]; right <- left + geo$W; bottom <- top + geo$H

  corner <- shares(draw())
  expect_equal(corner$label, c("10.0%", "20.0%", "30.0%", "40.0%"))           # top left, top right, bottom right, bottom left
  expect_equal(corner$hjust, c(0, 1, 1, 0))
  expect_equal(corner$x, c(left + 6, right - 6, right - 6, left + 6))
  expect_equal(corner$y, c(top + 6 + 0.905 * 12, top + 6 + 0.905 * 12, bottom - 6 - 0.212 * 12, bottom - 6 - 0.212 * 12))
  expect_equal(backings(draw()), 4)
  expect_equal(backings(draw(label_background = 0)), 0)
  expect_equal(backings(draw(pub_style = FALSE)), 4)

  centre <- shares(draw(quadrant_labels = "centre"))
  expect_equal(centre$hjust, rep(0.5, 4))
  expect_equal(centre$x, c(left + geo$W / 4, left + 3 * geo$W / 4, left + 3 * geo$W / 4, left + geo$W / 4))
  expect_equal(centre$y, c(top + geo$H / 4, top + geo$H / 4, top + 3 * geo$H / 4, top + 3 * geo$H / 4))

  # A share moved in the app is drawn from the quadrant's centre by its offset, in display units.
  quadrant$quadrant_label_offsets <- list(NULL, c(0.5, 1), NULL, NULL)
  moved <- shares(draw())
  expect_equal(moved$hjust, c(0, 0.5, 1, 0))
  expect_equal(c(moved$x[2], moved$y[2]), c(left + 3 * geo$W / 4 + 0.5 / 4 * geo$W, top + geo$H / 4 - 1 / 4 * geo$H))
  expect_error(draw(quadrant_labels = "edge"), "should be one of")
})

test_that("names take the hyphen glyph on pdf(), numbers keep the minus", {
  true_hyphens <- GateLabR:::.gatelabr_panel_true_hyphens
  set.seed(5)
  gate <- list(type = "polygon", gate_id = "g1", name = "CD8-", color = "#e41a1c", percent = 40,
               vertices = cbind(c(2.5, 6, 6, 2.5), c(-0.5, -0.5, 2.5, 2.5)), label_offset = c(0, 1.74), label_placed = FALSE)
  panel <- gatelabPanelGrob(rnorm(500), rnorm(500), xlim = c(-3, 7), ylim = c(-3, 7), xlab = "CD4", ylab = "CD8",
                            title = "CD4-CD8- (500)", gates = list(gate))
  labels_of <- function(tree) vapply(Filter(function(child) inherits(child, "text"), tree$children), function(child) child$label, "")
  expect_true(all(c("CD4-CD8- (500)", "CD8-", "-2") %in% labels_of(panel)))
  file <- tempfile(fileext = ".pdf")
  grDevices::pdf(file)
  on_pdf <- labels_of(true_hyphens(panel))
  off <- labels_of(true_hyphens(gatelabPanelGrob(1, 1, c(-3, 7), c(-3, 7), title = "CD4-CD8- (1)", true_hyphen = FALSE)))
  # grid reaches the rule through its own generic as it draws the panel.
  through_grid <- labels_of(grid::makeContent(panel))
  grDevices::dev.off()
  expect_true(all(c("CD4\u00adCD8\u00ad (500)", "CD8\u00ad", "-2") %in% on_pdf))
  expect_false("CD4-CD8- (500)" %in% on_pdf)
  expect_true("CD4-CD8- (1)" %in% off)
  expect_identical(through_grid, on_pdf)
  skip_if_not_installed("ragg")
  capture <- ragg::agg_capture(width = 3, height = 3, units = "in", res = 48)
  expect_true("CD4-CD8- (500)" %in% labels_of(true_hyphens(panel)))
  grDevices::dev.off()
})

test_that("a strategy has a panel per parent, GateLab's counts and an arrow between them", {
  fixture <- strategy_sce()
  strategy <- gatelabStrategyPlot(fixture$sce, c("naive", "effector_memory"), membership = fixture$membership, max_events = 1500)
  expect_s3_class(strategy, "gatelab_strategy")
  panels <- attr(strategy, "panels")
  expect_equal(unique(panels$panel), c("All Events", "CD4_positive"))
  expect_equal(panels$population, c("CD4_positive", "quadrant 1", "naive", "quadrant 3", "effector_memory"))
  n_cd4 <- sum(fixture$membership[, "CD4_positive"])
  expect_equal(panels$parent_events, c(6000, rep(n_cd4, 4)))
  expect_equal(panels$events_drawn, rep(1500, 5))
  expect_equal(panels$events[c(1, 3, 5)], unname(colSums(fixture$membership)))
  expect_equal(sum(panels$events[2:5]), n_cd4)
  expect_equal(panels$percent_of_parent[1], round(n_cd4 / 6000 * 100, 1))
  # Two panels side by side, 28 px apart for the arrow, 4 px at the left and top, and the app's
  # free gutter at the right (28 px) and the bottom (8 px): 660 by 312 px, as the app exports it.
  expect_equal(attr(strategy, "width"), 660 / 96)
  expect_equal(attr(strategy, "height"), 312 / 96)
  no_arrows <- gatelabStrategyPlot(fixture$sce, c("naive", "effector_memory"), membership = fixture$membership, arrows = FALSE)
  expect_equal(c(attr(no_arrows, "width"), attr(no_arrows, "height")), c(8 + 2 * 300 + 8, 8 + 300) / 96)
  expect_equal(sum(vapply(strategy$children, function(child) inherits(child, "polygon"), logical(1))), 1)   # one arrow head
  expect_error(gatelabStrategyPlot(fixture$sce, "memory", membership = fixture$membership), "No population called")

  # Samples can be pooled in part, and the counts follow.
  d1 <- gatelabStrategyPlot(fixture$sce, "naive", samples = "D1", membership = fixture$membership)
  expect_equal(attr(d1, "panels")$parent_events[1], 2000)
  # The samples can be given as a vector with one value per event in place of a colData column.
  by_vector <- gatelabStrategyPlot(fixture$sce, "naive", sample_column = as.character(fixture$sce$sample_id), samples = "D1",
                                   membership = fixture$membership)
  expect_equal(attr(by_vector, "panels"), attr(d1, "panels"))
  expect_error(gatelabStrategyPlot(fixture$sce, "naive", sample_column = "donor", membership = fixture$membership),
               "sample_column must name a colData column")

  # A label the user moved may sit past the axes; the ranges widen to keep it in view.
  moved <- strategy_sce(strategy_workspace(label_offset = list(0, 9)))
  expect_s3_class(gatelabStrategyPlot(moved$sce, "CD4_positive", membership = moved$membership), "gatelab_strategy")

  # A membership matrix of another length is refused, as is an object with none stored and none given.
  expect_error(gatelabStrategyPlot(fixture$sce, "naive", membership = fixture$membership[1:10, ]), "one row per event")
  expect_error(gatelabStrategyPlot(fixture$sce, "naive"), "No population memberships")
})

test_that("print() and plot() draw a strategy or a panel on a new page and return it invisibly", {
  fixture <- strategy_sce()
  strategy <- gatelabStrategyPlot(fixture$sce, c("naive", "effector_memory"), membership = fixture$membership, max_events = 1500)
  set.seed(6)
  panel <- gatelabPanelGrob(rnorm(500, 2), rnorm(500, 2), xlim = c(-1, 7), ylim = c(-1, 7), xlab = "CD4", ylab = "CD8")
  file <- tempfile(fileext = ".pdf")
  grDevices::pdf(file, width = attr(strategy, "width"), height = attr(strategy, "height"))
  expect_invisible(print(strategy))
  expect_invisible(plot(strategy))
  expect_invisible(print(panel))
  expect_invisible(plot(panel))
  expect_identical(print(strategy), strategy)
  expect_identical(plot(panel), panel)
  grDevices::dev.off()
  expect_gt(file.size(file), 1000)
  # Printed, the strategy shows both panels: ink in the left and the right half of the page.
  skip_if_not_installed("ragg")
  capture <- ragg::agg_capture(width = attr(strategy, "width"), height = attr(strategy, "height"), units = "in", res = 48)
  print(strategy)
  page <- capture()
  grDevices::dev.off()
  ink <- page != page[1, 1]
  half <- ncol(ink) %/% 2
  expect_gt(mean(ink[, seq_len(half)]), 0.02)
  expect_gt(mean(ink[, half + seq_len(half)]), 0.02)
})

# The fixture as "Save to SCE" leaves it: the workspace as GateLab writes it and the memberships
# payload GateLab sends with it, put through the host's own store. `membership` is what the app
# is taken to have decided, by population name. A second hierarchy, "Other", is stored inactive.
strategy_workspace_json <- function(sce, active = "main") {
  workspace <- strategy_workspace()
  partition <- GateLabR:::.gatelabr_sample_partition(sce, include_metadata = FALSE)
  gating <- workspace$gating
  gating$populations <- lapply(gating$populations, function(population) c(population, list(gate_logic = "and")))
  gating$gate_order <- names(gating$gates)
  gating$hierarchies <- list(list(id = "main", name = "Main"), list(id = "other", name = "Other"))
  gating$active_hierarchy_id <- active
  none <- structure(list(), names = character(0))      # written as {}
  as.character(jsonlite::toJSON(list(
    format = "gatelab-workspace", version = 2, workspaceId = "strategy-workspace",
    savedAt = "2026-01-01T00:00:00Z", app = "GateLab", hostedAssayId = "exprs",
    samples = lapply(partition$samples, function(sample) list(
      sampleId = paste0("strategy-sce:", sample$id), fileName = sample$label, logicleW = none, scatterCofactor = none,
      cytofCofactor = 5, compensationOn = FALSE, instrumentMode = "cytof", labels = none, metadata = none)),
    activeSample = 0, gating = gating,
    # CD4 is given a global scale wider than its events; the other channels have none.
    scales = list(globalScales = list(CD4 = list(-2, 10))), display = none
  ), auto_unbox = TRUE, null = "null", digits = I(17)))
}

strategy_saved_sce <- function(sce, membership) {
  S4Vectors::metadata(sce) <- list(instrument_type = "cytof")
  partition <- GateLabR:::.gatelabr_sample_partition(sce, include_metadata = FALSE)
  masks <- function(bits) lapply(seq_along(partition$samples), function(index) {
    rows <- partition$event_indices[[index]]
    list(sampleId = partition$samples[[index]]$id, eventCount = length(rows),
         membershipBitsBase64 = base64enc::base64encode(GateLabR:::.gatelabr_pack_bits(bits[rows])))
  })
  everything <- rep(TRUE, ncol(sce))
  population <- function(hierarchy, id, name, parent, bits, gates = list())
    list(hierarchyId = hierarchy, populationId = id, populationName = name, parentId = parent, gateLogic = "and",
         gates = gates, sampleMasks = masks(bits))
  polygon <- list(gateId = "g_poly", gateName = "CD4_positive gate", include = TRUE)
  quadrant <- function(q) list(gateId = "g_quad", gateName = "CD45RA x CCR7 quadrant", include = TRUE, quadrant = q)
  GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "strategy-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "explicit",
    workspace_json = strategy_workspace_json(sce),
    memberships = list(
      hierarchies = list(
        list(id = "main", name = "Main", active = TRUE, rootPopulationId = "root"),
        list(id = "other", name = "Other", active = FALSE, rootPopulationId = "other_root")),
      populations = list(
        population("main", "root", "All Events", NULL, everything),
        population("main", "p_cd4", "CD4_positive", "root", membership[, "CD4_positive"], list(polygon)),
        population("main", "p_naive", "naive", "p_cd4", membership[, "naive"], list(quadrant(2L))),
        population("main", "p_em", "effector_memory", "p_cd4", membership[, "effector_memory"], list(quadrant(4L))),
        population("other", "other_root", "All Events", NULL, everything)))
  )$sce
}

test_that("a strategy takes its counts from the memberships Save to SCE stored", {
  fixture <- strategy_sce()
  # What the app decided differs from the gates' geometry by the first twenty events of
  # CD4_positive, so a count that follows the stored memberships cannot have come from geometry.
  stored <- fixture$membership
  stored[which(stored[, "CD4_positive"])[1:20], ] <- FALSE
  sce <- strategy_saved_sce(fixture$sce, stored)
  expect_identical(colSums(gatelabPopulations(sce))[-1], colSums(stored))

  strategy <- gatelabStrategyPlot(sce, c("naive", "effector_memory"), max_events = 1500)
  expect_s3_class(strategy, "gatelab_strategy")
  panels <- attr(strategy, "panels")
  n_cd4 <- sum(stored[, "CD4_positive"])
  expect_equal(n_cd4, sum(fixture$membership[, "CD4_positive"]) - 20)
  expect_equal(panels$population, c("CD4_positive", "quadrant 1", "naive", "quadrant 3", "effector_memory"))
  expect_equal(panels$parent_events, c(6000, rep(n_cd4, 4)))
  expect_equal(panels$events[c(1, 3, 5)], unname(colSums(stored)))
  expect_equal(sum(panels$events[2:5]), n_cd4)
  # The same figure as from the same memberships handed over as a matrix.
  expect_equal(attr(gatelabStrategyPlot(sce, c("naive", "effector_memory"), membership = stored, max_events = 1500), "panels"), panels)

  # The memberships follow the events, so a reordered object gives the same counts.
  reordered <- sce[, rev(seq_len(ncol(sce)))]
  expect_equal(attr(gatelabStrategyPlot(reordered, c("naive", "effector_memory"), max_events = 1500), "panels"), panels)

  # The workspace's global scale is used for the channel that has one, unless it is turned off.
  tick_labels <- function(tree) unlist(lapply(tree$children, function(child) {
    if (inherits(child, "text")) child$label else if (inherits(child, "gTree")) tick_labels(child)
  }))
  expect_true("10" %in% tick_labels(strategy))
  expect_false("10" %in% tick_labels(gatelabStrategyPlot(sce, "naive", global_scales = FALSE)))

  # Only the hierarchy that was active at the save can be drawn.
  expect_s3_class(gatelabStrategyPlot(sce, "naive", hierarchy = "Main"), "gatelab_strategy")
  expect_error(gatelabStrategyPlot(sce, "naive", hierarchy = "Other"), "Only the hierarchy that was active when the workspace was saved")
  expect_error(gatelabStrategyPlot(sce, "naive", hierarchy = "Other", membership = stored), "which is 'Main', not 'Other'")
  expect_error(gatelabStrategyPlot(sce, "naive", hierarchy = "Absent"), "No hierarchy called 'Absent'")

  # An autosave moves the workspace on: the stored memberships are refused until they are allowed.
  autosave <- function(active) GateLabR:::.gatelabr_store_host_workspace(
    sce, dataset_id = "strategy-sce", expected_revision = 1L, client_revision = 2L, reason = "autosave",
    workspace_json = strategy_workspace_json(sce, active = active))$sce
  expect_error(gatelabStrategyPlot(autosave("main"), "naive"), "saved at workspace revision 1 but the workspace is now at revision 2")
  expect_equal(attr(gatelabStrategyPlot(autosave("main"), c("naive", "effector_memory"), max_events = 1500, allow_stale = TRUE), "panels"), panels)
  # Not when the workspace has since been saved with another hierarchy active: its gates are another tree's.
  expect_error(gatelabStrategyPlot(autosave("other"), "naive", allow_stale = TRUE), "holds the gates of hierarchy 'Other'")

  # An object that carries the workspaces of two saves is refused, not read from the first.
  combined <- sce
  S4Vectors::metadata(combined) <- c(S4Vectors::metadata(sce), S4Vectors::metadata(sce)["gatelab_workspace"])
  expect_error(gatelabStrategyPlot(combined, "naive"), "workspaces of several saved objects")
})
