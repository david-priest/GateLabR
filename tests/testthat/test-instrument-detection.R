make_detection_sce <- function(display_names, pnn = NULL) {
  mat <- matrix(
    seq_len(length(display_names) * 4),
    nrow = length(display_names),
    dimnames = list(display_names, paste0("event", seq_len(4)))
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = mat, exprs = mat)
  )
  if (!is.null(pnn)) {
    SummarizedExperiment::rowData(sce)$gatelabr_pnn <- pnn
  }
  sce
}

test_that("SCE detection uses persisted FCS identities before marker labels", {
  sce <- make_detection_sce(
    c("CD45", "CD19", "CD20", "CD3"),
    c("Y89Di", "Nd142Di", "Eu151Di", "Gd156Di")
  )

  detected <- detect_sce_instrument_type(sce)

  expect_identical(detected$type, "cytof")
  expect_identical(detected$confidence, "high")
  expect_true("rowData$gatelabr_pnn" %in% detected$evidence)
})

test_that("stale auto-detected metadata is corrected by stronger channel evidence", {
  sce <- make_detection_sce(
    c("CD45", "CD19", "CD20", "CD3"),
    c("89Y", "142Nd", "151Eu", "156Gd")
  )
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  S4Vectors::metadata(sce)$instrument_type_source <- "auto_detected"
  S4Vectors::metadata(sce)$instrument_mode_choice <- "auto"

  expect_identical(detect_sce_instrument_type(sce)$type, "cytof")
})

test_that("explicit instrument choices are authoritative", {
  sce <- make_detection_sce(
    c("CD45", "CD19", "CD20", "CD3"),
    c("Y89Di", "Nd142Di", "Eu151Di", "Gd156Di")
  )
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  S4Vectors::metadata(sce)$instrument_type_source <- "manual_override"
  S4Vectors::metadata(sce)$instrument_mode_choice <- "flow"

  detected <- detect_sce_instrument_type(sce)
  resolved <- resolve_sce_instrument_type(sce, "auto")

  expect_identical(detected$type, "flow")
  expect_identical(detected$confidence, "explicit")
  expect_identical(resolved$chosen, "flow")
})

test_that("ambiguous marker-only SCEs preserve stored modality", {
  sce <- make_detection_sce(c("CD45", "CD19", "CD20", "CD3"))
  S4Vectors::metadata(sce)$instrument_type <- "cytof"
  S4Vectors::metadata(sce)$instrument_type_source <- "auto_detected"
  S4Vectors::metadata(sce)$instrument_mode_choice <- "auto"

  detected <- detect_sce_instrument_type(sce)

  expect_identical(detected$type, "cytof")
  expect_identical(detected$confidence, "stored")
})

test_that("flow scatter and area channels remain flow", {
  sce <- make_detection_sce(
    c("FSC-A", "SSC-A", "CD3", "CD19"),
    c("FSC-A", "SSC-A", "BV421-A", "APC-Cy7-A")
  )

  expect_identical(detect_sce_instrument_type(sce)$type, "flow")
})
