skip_if_not_installed("SingleCellExperiment")

make_sce <- function(counts, exprs, metadata = list()) {
  SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = exprs),
    metadata = metadata
  )
}

raw_counts <- function() {
  matrix(
    c(10, 20, 30, 40, 50, 60, 70, 80),
    nrow = 2,
    dimnames = list(c("A", "B"), NULL)
  )
}

test_that("exprs that is only a transform of counts is not called compensated", {
  # CATALYST::prepData() alone produces exprs = asinh(counts / cofactor) with no
  # compensation. Misreading this as compensated would be worse than the gap it
  # is meant to close, so it is the first case to pin.
  counts <- raw_counts()
  sce <- make_sce(counts, asinh(counts / 5), list(cofactor = 5))

  expect_identical(GateLabR:::.gatelabr_assay_role("exprs", sce), "transformed")
  expect_false(
    GateLabR:::.gatelabr_transformed_assay_compensation(sce, "exprs")$compensated
  )
  expect_null(GateLabR:::.gatelabr_precompensation_note(sce))
})

test_that("exprs that differs from the counts transform is treated as compensated", {
  counts <- raw_counts()
  # Stand-in for a compensation applied in R before launch: exprs no longer
  # reproduces from counts.
  compensated <- asinh((counts - c(2, 3)) / 5)
  sce <- make_sce(counts, compensated, list(cofactor = 5))

  found <- GateLabR:::.gatelabr_transformed_assay_compensation(sce, "exprs")
  expect_true(found$compensated)
  expect_identical(found$counts_assay, "counts")
  expect_identical(found$evidence, "values-differ")
  expect_identical(GateLabR:::.gatelabr_assay_role("exprs", sce), "compensated")
  # Still display coordinates: compensation does not make exprs linear.
  expect_identical(GateLabR:::.gatelabr_assay_coordinate_space(sce, "exprs"), "display")
})

test_that("the assumption is announced, and names the counts assay", {
  counts <- raw_counts()
  sce <- make_sce(counts, asinh((counts - 2) / 5), list(cofactor = 5))

  note <- GateLabR:::.gatelabr_precompensation_note(sce)
  expect_match(note, "already compensated", fixed = TRUE)
  expect_match(note, "`exprs`", fixed = TRUE)
  expect_match(note, "`counts`", fixed = TRUE)
  expect_match(note, "No spillover matrix was found", fixed = TRUE)
  expect_match(note, "gatelabr_assay_roles", fixed = TRUE)
})

test_that("a CATALYST spillover matrix in metadata is found and reported", {
  spill <- matrix(
    c(1, 0.02, 0.01, 1),
    nrow = 2,
    dimnames = list(c("A", "B"), c("A", "B"))
  )
  counts <- raw_counts()
  sce <- make_sce(counts, asinh((counts - 2) / 5),
                  list(cofactor = 5, spillover = spill))

  expect_identical(GateLabR:::.gatelabr_sce_spillover_matrix(sce), spill)
  found <- GateLabR:::.gatelabr_transformed_assay_compensation(sce, "exprs")
  expect_true(found$compensated)
  expect_identical(found$evidence, "values-differ+spillover")
  expect_match(GateLabR:::.gatelabr_precompensation_note(sce), "Spillover matrix: 2 x 2",
               fixed = TRUE)
})

test_that("a stored spillover matrix alone does not override the data", {
  # The matrix may be computed but never applied. exprs still reproduces from
  # counts, so the assay is not compensated whatever metadata() holds.
  spill <- matrix(
    c(1, 0.02, 0.01, 1),
    nrow = 2,
    dimnames = list(c("A", "B"), c("A", "B"))
  )
  counts <- raw_counts()
  sce <- make_sce(counts, asinh(counts / 5), list(cofactor = 5, spillover = spill))

  expect_false(
    GateLabR:::.gatelabr_transformed_assay_compensation(sce, "exprs")$compensated
  )
  expect_identical(GateLabR:::.gatelabr_assay_role("exprs", sce), "transformed")
})

test_that("an explicit role override wins and is not narrated", {
  counts <- raw_counts()
  sce <- make_sce(counts, asinh((counts - 2) / 5), list(
    cofactor = 5,
    gatelabr_assay_roles = list(exprs = "transformed")
  ))

  expect_identical(GateLabR:::.gatelabr_assay_role("exprs", sce), "transformed")
  expect_null(GateLabR:::.gatelabr_precompensation_note(sce))
})
