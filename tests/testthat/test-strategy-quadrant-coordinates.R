# Distance from independently sampled analytical dividers to the drawn open polylines.
quadrant_path_error <- function(points, drawn, spans) {
  nearest <- rep(Inf, nrow(points))
  for (j in seq_len(nrow(drawn) - 1L)) {
    start <- drawn[j, ]; delta <- (drawn[j + 1L, ] - start) / spans
    relative <- sweep(sweep(points, 2, start), 2, spans, `/`)
    length_square <- sum(delta^2)
    along <- if (length_square > 0) pmin(1, pmax(0, as.vector(relative %*% delta) / length_square)) else rep(0, nrow(points))
    nearest <- pmin(nearest, sqrt(rowSums((relative - outer(along, delta))^2)))
  }
  max(nearest)
}

test_that("quadrant divider paths are mapped from raw and saved-transform coordinates", {
  trans <- list(kind = "asinh", cofactor = 5)
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = rbind(CD4 = c(1, 10, 100, 1000), CD8 = c(1, 10, 100, 1000))))
  coordinates <- GateLabR:::.gatelabr_strategy_coordinates(sce,
    list(workspace = list(hostedChannelTransforms = list(CD4 = trans, CD8 = trans))), "counts")
  # Raw gate units and a different saved asinh both produce curved display paths. In neither
  # case are the saved arms or curl coefficients valid alongside the mapped centre.
  for (saved in list(list(space = "raw"),
                     list(space = "display", transforms = list(CD4 = list(kind = "asinh", cofactor = 50),
                                                               CD8 = list(kind = "asinh", cofactor = 50))))) {
    raw <- identical(saved$space, "raw")
    to_display <- if (raw) function(v) asinh(v / 5) else function(v) asinh(10 * sinh(v))
    center <- c(2, 2)
    arms <- list(down = c(3, 0), right = c(4, 3), up = c(1, 4), left = c(0, 1))
    for (shape in list(list(arms = arms), list(curl = list(power = 1.5, kx = 0.5, ky = 0.25)))) {
      gate <- GateLabR:::.gatelabr_strategy_gate(c(list(
        gate_id = "g", name = "CD4_positive", gate_type = "quadrant", x_channel = "CD4", y_channel = "CD8",
        center = center), saved, shape))
      drawn <- GateLabR:::.gatelabr_strategy_gate_display(gate, coordinates)
      expect_null(drawn$curl)
      expect_null(drawn$arms)
      expect_equal(drawn$center, to_display(center))
      # Resolve after ranges have been widened: the arms must reach this final boundary.
      lim <- to_display(c(-1, 6))
      geometry <- drawn$quadrant_geometry(lim, lim)
      t <- seq(0, 1, length.out = 1013) # independent of the adaptive sampler
      if (!is.null(shape$arms)) {
        expected <- lapply(arms, function(end) to_display(rbind(2 + (end[1] - 2) * t, 2 + (end[2] - 2) * t)))
        expected <- lapply(expected, base::t)
        expect_equal(geometry$box, to_display(rbind(c(0, 0), c(4, 0), c(4, 4), c(0, 4))))
        # An endpoint-only mapping would leave each of these arms straight.
        expect_true(any(vapply(geometry$paths, nrow, integer(1)) > 2L))
      } else {
        expected <- list(to_display(cbind(-1 + 3 * t, 2)), to_display(cbind(2, -1 + 3 * t)),
                         to_display(cbind(2 + 4 * t, 2 + 0.5 * (4 * t)^1.5)),
                         to_display(cbind(2 + 0.25 * (4 * t)^1.5, 2 + 4 * t)))
        expect_equal(unname(tail(geometry$paths[[3]][, 1], 1)), lim[2])
        expect_equal(unname(tail(geometry$paths[[4]][, 2], 1)), lim[2])
      }
      errors <- vapply(seq_along(expected), function(i)
        quadrant_path_error(expected[[i]], geometry$paths[[i]], rep(diff(lim), 2)), numeric(1))
      expect_true(all(errors <= 0.002), info = paste(saved$space, paste(errors, collapse = ", ")))
      # The public panel must consume the mapped paths, including the spider's dashed box.
      panel <- gatelabPanelGrob(to_display(c(1, 3)), to_display(c(1, 3)), lim, lim, gates = list(drawn))
      clipped <- Filter(function(child) inherits(child, "gTree") && isTRUE(child$vp$clip), panel$children)
      outlines <- unlist(lapply(clipped[-1], function(child) child$children), recursive = FALSE)
      expect_equal(sum(vapply(outlines, inherits, logical(1), "polyline")), 4L)
    }
  }
})

test_that("display-coordinate shortcuts require exactly equal transform parameters", {
  sce <- SingleCellExperiment::SingleCellExperiment(assays = list(exprs = matrix(2, 2, 1,
    dimnames = list(c("CD4", "CD8"), NULL))))
  S4Vectors::metadata(sce)$cofactor <- 5
  close <- list(kind = "asinh", cofactor = 5 * (1 + 1e-9))
  coordinates <- GateLabR:::.gatelabr_strategy_coordinates(sce,
    list(workspace = list(hostedChannelTransforms = list(CD4 = close, CD8 = close))), "exprs")
  expect_lt(coordinates$display("CD4"), 2)
  gate <- GateLabR:::.gatelabr_strategy_gate(list(gate_id = "g", name = "CD4_positive", gate_type = "quadrant",
    x_channel = "CD4", y_channel = "CD8", space = "display", center = c(2, 2),
    transforms = list(CD4 = close, CD8 = close)))
  expect_false(GateLabR:::.gatelabr_strategy_gate_membership(gate, coordinates, quadrant = 2L))
  expect_true(GateLabR:::.gatelabr_strategy_gate_membership(gate, coordinates, quadrant = 4L))
})

test_that("asymmetric display axes preserve stored-space quadrant membership", {
  points <- rbind(c(3, 2.3), c(2.1, 3), c(3, 3), c(1, 1), c(1, 3), c(3, 1), c(2, 2))
  sce <- SingleCellExperiment::SingleCellExperiment(assays = list(counts = t(points)))
  rownames(sce) <- c("CD4", "CD8")
  coordinates <- GateLabR:::.gatelabr_strategy_coordinates(sce,
    list(workspace = list(hostedChannelTransforms = list(CD4 = list(kind = "asinh", cofactor = 5),
                                                       CD8 = list(kind = "asinh", cofactor = 20)))), "counts")
  gate <- GateLabR:::.gatelabr_strategy_gate(list(gate_id = "g", name = "CD4_positive", gate_type = "quadrant",
    x_channel = "CD4", y_channel = "CD8", space = "raw", center = c(2, 2),
    curl = list(power = 1.5, kx = 0.5, ky = 0.25)))
  expected <- c(3L, 1L, 2L, 4L, 1L, 3L, 2L)
  for (q in 1:4)
    expect_identical(GateLabR:::.gatelabr_strategy_gate_membership(gate, coordinates, quadrant = q), expected == q)
  drawn <- GateLabR:::.gatelabr_strategy_gate_display(gate, coordinates)
  expect_equal(drawn$center, c(asinh(2 / 5), asinh(2 / 20)))
  xlim <- asinh(c(0, 6) / 5); ylim <- asinh(c(0, 8) / 20)
  geometry <- drawn$quadrant_geometry(xlim, ylim)
  expect_equal(unname(tail(geometry$paths[[3]], 1)), matrix(c(asinh(6 / 5), asinh(6 / 20)), 1, 2))
  expect_equal(unname(tail(geometry$paths[[4]], 1)), matrix(c(asinh((2 + 0.25 * 6^1.5) / 5), asinh(8 / 20)), 1, 2))
})
