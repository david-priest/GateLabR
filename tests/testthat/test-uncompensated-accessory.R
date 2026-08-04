skip_if_not_installed("SingleCellExperiment")

acc_counts <- function(offset = 0, n_cells = 6L) {
  matrix(
    seq_len(2L * n_cells) + offset,
    nrow = 2L,
    dimnames = list(c("A", "B"), paste0("cell", seq_len(n_cells)))
  )
}

acc_sce <- function(counts = acc_counts(), metadata = list(cofactor = 5)) {
  SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(
      sample_id = rep(c("s1", "s2"), each = ncol(counts) / 2)
    ),
    metadata = metadata
  )
}

test_that("a matching accessory validates and reports its counts assay", {
  primary <- acc_sce(acc_counts(offset = 100))
  accessory <- acc_sce()

  result <- GateLabR:::.gatelabr_validate_accessory_sce(primary, accessory)
  expect_identical(result$counts_assay, "counts")
})

test_that("mismatched cells, channels or order are refused, each by name", {
  primary <- acc_sce(acc_counts(offset = 100))

  expect_error(
    GateLabR:::.gatelabr_validate_accessory_sce(primary, acc_sce(acc_counts(n_cells = 4L))),
    "same cells"
  )

  wrong_channels <- acc_sce()
  rownames(wrong_channels) <- c("A", "Z")
  expect_error(
    GateLabR:::.gatelabr_validate_accessory_sce(primary, wrong_channels),
    "Channel identity and order"
  )

  reordered <- acc_sce()
  colnames(reordered) <- rev(colnames(reordered))
  expect_error(
    GateLabR:::.gatelabr_validate_accessory_sce(primary, reordered),
    "Cell identity and order"
  )

  expect_error(
    GateLabR:::.gatelabr_validate_accessory_sce(primary, "not an sce"),
    "must be a SingleCellExperiment"
  )
})

test_that("an accessory identical to the primary warns rather than silently comparing nothing", {
  # Passing the compensated object twice would render a before/after view with no
  # difference at all, which reads as 'compensation did nothing'.
  primary <- acc_sce()
  expect_warning(
    GateLabR:::.gatelabr_validate_accessory_sce(primary, acc_sce()),
    "same values"
  )
})

test_that("the accessory leads the assay list and takes the counts role", {
  # GateLab loads the FIRST linear counts-role assay as its Original layer, so
  # ordering here decides which data the user sees as 'before'.
  primary <- acc_sce(acc_counts(offset = 100))
  accessory <- acc_sce()

  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(
    primary,
    accessory = accessory
  )
  ids <- vapply(descriptor$assays, `[[`, character(1), "id")
  roles <- vapply(descriptor$assays, `[[`, character(1), "role")
  spaces <- vapply(descriptor$assays, `[[`, character(1), "coordinateSpace")

  expect_identical(ids[[1]], "gatelabr_uncompensated")
  expect_identical(roles[[1]], "counts")
  expect_identical(spaces[[1]], "linear")
  expect_identical(descriptor$defaultAssayId, "gatelabr_uncompensated")

  # The primary's own linear counts must stop claiming the counts role, or it
  # would win the first-match race and the 'before' view would be the compensated
  # data. It stays linear so it remains adoptable as the Compensated layer.
  primary_counts <- which(ids == "counts")
  expect_identical(roles[[primary_counts]], "compensated")
  expect_identical(spaces[[primary_counts]], "linear")
})

test_that("without an accessory the descriptor is unchanged", {
  primary <- acc_sce()
  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(primary)

  ids <- vapply(descriptor$assays, `[[`, character(1), "id")
  roles <- vapply(descriptor$assays, `[[`, character(1), "role")
  expect_identical(ids, c("counts", "exprs"))
  expect_identical(roles[[which(ids == "counts")]], "counts")
  expect_identical(descriptor$defaultAssayId, "counts")
  expect_false("gatelabr_uncompensated" %in% ids)
})

test_that("the spillover matrix is found on either object, primary first", {
  spill <- matrix(
    c(1, 0.02, 0.01, 1),
    nrow = 2,
    dimnames = list(c("A", "B"), c("A", "B"))
  )
  other <- matrix(
    c(1, 0.5, 0.5, 1),
    nrow = 2,
    dimnames = list(c("A", "B"), c("A", "B"))
  )
  bare <- acc_sce()
  with_spill <- acc_sce(metadata = list(cofactor = 5, spillover = spill))
  with_other <- acc_sce(metadata = list(cofactor = 5, spillover = other))

  expect_null(GateLabR:::.gatelabr_sce_spillover_matrix(bare))
  # Found on the accessory when the primary has none.
  expect_identical(
    GateLabR:::.gatelabr_sce_spillover_matrix(bare, with_spill),
    spill
  )
  # Primary wins when both carry one.
  expect_identical(
    GateLabR:::.gatelabr_sce_spillover_matrix(with_spill, with_other),
    spill
  )
})
