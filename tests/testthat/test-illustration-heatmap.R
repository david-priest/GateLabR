make_heatmap_fixture <- function() {
  assay <- cbind(
    X = 1:6,
    Y = 1:6,
    BarcodeA = c(0, 2, 4, 6, 8, 10),
    BarcodeB = c(10, 8, 6, 4, 2, 0)
  )
  gates <- list(
    low = list(
      gate_id = "low", name = "Low", gate_type = "rectangle",
      x_channel = "X", y_channel = "Y",
      vertices = list(c(0, 0), c(3.5, 3.5))
    ),
    high = list(
      gate_id = "high", name = "High", gate_type = "rectangle",
      x_channel = "X", y_channel = "Y",
      vertices = list(c(3.5, 3.5), c(7, 7))
    ),
    empty = list(
      gate_id = "empty", name = "Empty", gate_type = "rectangle",
      x_channel = "X", y_channel = "Y",
      vertices = list(c(20, 20), c(30, 30))
    )
  )
  child <- function(id, name, gate_id) list(
    population_id = id, name = name, parent_id = "root",
    children = character(0),
    gate_refs = list(list(gate_id = gate_id, include = TRUE)),
    gate_logic = "and"
  )
  populations <- list(
    root = list(
      population_id = "root", name = "All Events", parent_id = NULL,
      children = c("low", "high", "empty"), gate_refs = list(), gate_logic = "and"
    ),
    low = child("low", "Low barcode", "low"),
    high = child("high", "High barcode", "high"),
    empty = child("empty", "No events", "empty")
  )
  list(assay = assay, gates = gates, populations = populations)
}

test_that("illustration heatmap calculates exact population summaries", {
  f <- make_heatmap_fixture()
  hm <- compute_illustration_heatmap(
    f$assay, f$gates, f$populations, "root",
    c("low", "high", "empty"), c("BarcodeA", "BarcodeB"),
    summary_stat = "median", scale_mode = "none"
  )

  expect_identical(hm$pop_ids, c("low", "high", "empty"))
  expect_identical(unname(hm$pop_counts), c(3L, 3L, 0L))
  expect_equal(unname(hm$raw_values[1:2, ]), rbind(c(2, 8), c(8, 2)))
  expect_true(all(is.na(hm$raw_values[3, ])))
  expect_equal(hm$values, hm$raw_values)
  expect_equal(c(hm$legend_min, hm$legend_max), c(2, 8))
})

test_that("illustration heatmap scaling is explicit and NA-safe", {
  x <- rbind(
    c(2, 8, NA),
    c(8, 2, NA),
    c(5, 5, NA)
  )

  expect_equal(
    scale_illustration_heatmap(x, "column_minmax"),
    rbind(c(0, 1, NA), c(1, 0, NA), c(0.5, 0.5, NA))
  )
  expect_equal(
    scale_illustration_heatmap(x, "row_minmax"),
    rbind(c(0, 1, NA), c(1, 0, NA), c(0.5, 0.5, NA))
  )
  z <- scale_illustration_heatmap(x, "column_zscore")
  expect_equal(z[, 1], c(-1, 1, 0), tolerance = 1e-12)
  expect_equal(z[, 2], c(1, -1, 0), tolerance = 1e-12)
  expect_true(all(is.na(z[, 3])))
})

test_that("illustration heatmap supports mean summaries and selected order", {
  f <- make_heatmap_fixture()
  hm <- compute_illustration_heatmap(
    f$assay, f$gates, f$populations, "root",
    c("high", "low"), c("BarcodeB", "BarcodeA"),
    summary_stat = "mean", scale_mode = "row_minmax"
  )

  expect_identical(hm$pop_ids, c("high", "low"))
  expect_identical(hm$channels, c("BarcodeB", "BarcodeA"))
  expect_equal(unname(hm$raw_values), rbind(c(2, 8), c(8, 2)))
  expect_equal(unname(hm$values), rbind(c(0, 1), c(1, 0)))
})
