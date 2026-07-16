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
