test_that("duplicate FCS marker labels retain distinct channel identities", {
  skip_if_not_installed("flowCore")

  values <- matrix(
    c(
      10, 100, 1000,
      20, 200, 2000,
      30, 300, 3000
    ),
    nrow = 3,
    byrow = TRUE,
    dimnames = list(NULL, c("FSC-A", "V1-A", "V2-A"))
  )
  frame <- flowCore::flowFrame(values)
  flowCore::pData(flowCore::parameters(frame))$desc <- c(NA, "CD3", " CD3 ")
  path <- tempfile(fileext = ".fcs")
  flowCore::write.FCS(frame, path)

  sce <- import_fcs_files(path, instrument_mode = "flow")

  expect_identical(rownames(sce), c("FSC-A", "CD3 (V1-A)", "CD3 (V2-A)"))
  expect_false(anyDuplicated(rownames(sce)) > 0L)
  expect_identical(
    unlist(S4Vectors::metadata(sce)$channel_to_pnn, use.names = TRUE),
    c("FSC-A" = "FSC-A", "CD3 (V1-A)" = "V1-A", "CD3 (V2-A)" = "V2-A")
  )

  unlink(path)
})

test_that("malformed repeated parameter names receive deterministic suffixes", {
  expect_identical(
    .make_unique_channel_names(c("CD3", "CD3"), c("CD3", "CD3")),
    c("CD3", "CD3 [2]")
  )
})

test_that("conjugate names ending -A do not make a file spectral-unmixed", {
  skip_if_not_installed("flowCore")

  # An analyser that names the conjugate rather than the detector: $PnN "FL1-A" with
  # $PnS "FITC-A". Every fluorescence channel satisfies the unmixed marker test, but
  # the file carries no raw detectors, so nothing may be dropped.
  chans <- c("FSC-A", "FSC-Width", "FL1-H", "FL1-A", "FL2-H", "FL2-A")
  descs <- c("FSC-A", "FSC-Width", "FITC-H", "FITC-A", "PE-H", "PE-A")
  values <- matrix(seq_len(3 * length(chans)), nrow = 3,
                   dimnames = list(NULL, chans))
  frame <- flowCore::flowFrame(values)
  flowCore::pData(flowCore::parameters(frame))$desc <- descs
  path <- tempfile(fileext = ".fcs")
  flowCore::write.FCS(frame, path)

  sce <- import_fcs_files(path, instrument_mode = "flow")

  expect_identical(rownames(sce), descs)
  expect_true("FSC-Width" %in% rownames(sce))
  expect_true("FITC-H" %in% rownames(sce))

  unlink(path)
})

test_that("a raw detector alongside unmixed markers still triggers filtering", {
  skip_if_not_installed("flowCore")

  # Same file plus one raw spectral detector (no $PnS of its own). That is what an
  # unmixed export looks like, so the detector is dropped and markers are renamed.
  chans <- c("FSC-A", "B1-A", "V500-A", "PE-A")
  descs <- c("FSC-A", NA, "CD4-A", "CD25-A")
  values <- matrix(seq_len(3 * length(chans)), nrow = 3,
                   dimnames = list(NULL, chans))
  frame <- flowCore::flowFrame(values)
  flowCore::pData(flowCore::parameters(frame))$desc <- descs
  path <- tempfile(fileext = ".fcs")
  flowCore::write.FCS(frame, path)

  sce <- import_fcs_files(path, instrument_mode = "flow")

  expect_false("B1-A" %in% rownames(sce))
  expect_identical(rownames(sce), c("FSC-A", "CD4-A (V500-A)", "CD25-A (PE-A)"))

  unlink(path)
})
