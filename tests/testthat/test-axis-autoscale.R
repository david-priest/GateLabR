test_that("initial axis limits resist isolated cytometry outliers", {
  central <- seq(-1, 1, length.out = 10000)
  values <- c(-1e6, central, 1e6)

  axis_range <- compute_axis_range(values)
  central_quantiles <- as.numeric(stats::quantile(values, c(0.001, 0.999)))

  expect_gt(axis_range[[1]], -2)
  expect_lt(axis_range[[2]], 2)
  expect_lt(axis_range[[1]], central_quantiles[[1]])
  expect_gt(axis_range[[2]], central_quantiles[[2]])
})

test_that("the main plot renders off-scale events as edge pile-ups", {
  source_js <- normalizePath(
    testthat::test_path("..", "..", "inst", "app", "www", "cytof_plot.js"),
    mustWork = FALSE
  )
  js_path <- if (file.exists(source_js)) {
    source_js
  } else {
    system.file("app", "www", "cytof_plot.js", package = "GateLabR", mustWork = TRUE)
  }
  js <- paste(readLines(js_path, warn = FALSE), collapse = "\n")

  expect_match(js, "function _clampPointX(scale, value)", fixed = TRUE)
  expect_match(js, "function _offscalePts()", fixed = TRUE)
  expect_match(js, "outlierPts = outlierPts.concat(_offscalePts());", fixed = TRUE)
  expect_match(js, "pxArr[i] = _clampBaseX(x[i]);", fixed = TRUE)
  expect_false(grepl("scaleLinear().domain(xr).range([0, W]).clamp(true)", js, fixed = TRUE))
})
