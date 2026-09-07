make_overlay_sce <- function() {
  counts <- matrix(seq_len(10), nrow = 2, dimnames = list(c("CD3", "CD19"), paste0("event", 1:5)))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(
      sample_id = c("Donor A", "Donor A", "Donor A", "Donor B", "Donor B"),
      cluster = factor(c("T", "B", NA, "T", "T"), levels = c("B", "T", "NK")),
      flag = c(TRUE, FALSE, TRUE, TRUE, FALSE),
      score = c(0.1, 0.2, 0.3, 0.4, 0.5),
      note = c("x", "y", "x", "z", "x")
    )
  )
  S4Vectors::metadata(sce)$instrument_type <- "cytof"
  sce
}

test_that("the dataset descriptor advertises categorical columns with their level counts", {
  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(make_overlay_sce(), dataset_id = "test-sce")
  offered <- descriptor$colDataCategorical
  expect_identical(vapply(offered, `[[`, character(1), "name"), c("sample_id", "cluster", "flag", "note"))
  expect_identical(vapply(offered, `[[`, integer(1), "levelCount"), c(2L, 3L, 2L, 3L))
  # The numeric column stays in colDataColumns (collision warnings) but is not offered.
  expect_true("score" %in% descriptor$colDataColumns)

  wide <- make_overlay_sce()
  wide$many <- as.character(seq_len(ncol(wide)))
  expect_true("many" %in% vapply(
    GateLabR:::.gatelabr_categorical_coldata_columns(wide), `[[`, character(1), "name"
  ))
  big <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = matrix(0, nrow = 1, ncol = 300)),
    colData = S4Vectors::DataFrame(many = as.character(seq_len(300)))
  )
  expect_length(GateLabR:::.gatelabr_categorical_coldata_columns(big), 0L)
})

test_that("a factor column is served per sample as codes into its declared levels", {
  read <- GateLabR:::.gatelabr_read_host_categorical_coldata(make_overlay_sce(), "cluster")
  result <- read$result
  expect_identical(as.character(result$levels), c("B", "T", "NK"))
  expect_s3_class(result$levels, "AsIs")
  expect_null(result$colors)
  expect_length(result$sampleValues, 2L)
  donor_a <- result$sampleValues[[1]]
  expect_identical(donor_a$sampleId, "sample-0")
  expect_identical(donor_a$eventCount, 3L)
  expect_null(donor_a$constantCode)
  expect_identical(as.integer(base64enc::base64decode(donor_a$codesBase64)), c(1L, 0L, 255L))
  donor_b <- result$sampleValues[[2]]
  expect_identical(donor_b$constantCode, 1L)
  expect_null(donor_b$codesBase64)
})

test_that("logical and character columns code into their own level sets", {
  flag <- GateLabR:::.gatelabr_read_host_categorical_coldata(make_overlay_sce(), "flag")$result
  expect_identical(as.character(flag$levels), c("FALSE", "TRUE"))
  expect_identical(as.integer(base64enc::base64decode(flag$sampleValues[[1]]$codesBase64)), c(1L, 0L, 1L))
  note <- GateLabR:::.gatelabr_read_host_categorical_coldata(make_overlay_sce(), "note")$result
  expect_identical(as.character(note$levels), c("x", "y", "z"))
  expect_identical(as.integer(base64enc::base64decode(note$sampleValues[[2]]$codesBase64)), c(2L, 0L))
})

test_that("a palette fixed in metadata rides along when it names every level", {
  sce <- make_overlay_sce()
  S4Vectors::metadata(sce)$gatelab_palettes <- list(cluster = c(T = "#ff0000", B = "#0000ff", NK = "#00ff00"))
  result <- GateLabR:::.gatelabr_read_host_categorical_coldata(sce, "cluster")$result
  expect_identical(as.character(result$colors), c("#0000ff", "#ff0000", "#00ff00"))

  S4Vectors::metadata(sce)$gatelab_palettes <- list(cluster = c(T = "#ff0000"))
  expect_null(GateLabR:::.gatelabr_read_host_categorical_coldata(sce, "cluster")$result$colors)
})

test_that("columns that cannot colour a plot are refused with the reason", {
  expect_error(GateLabR:::.gatelabr_read_host_categorical_coldata(make_overlay_sce(), "score"), "factor, character or logical")
  expect_error(GateLabR:::.gatelabr_read_host_categorical_coldata(make_overlay_sce(), "absent"), "no column 'absent'")
})

test_that("the host dispatcher serves the read under the colData contract", {
  handled <- GateLabR:::.gatelabr_handle_host_request(
    make_overlay_sce(),
    list(
      operation = "read-categorical-coldata",
      payload = list(datasetId = "test-sce", contractVersion = 1L, columnName = "cluster")
    ),
    dataset_id = "test-sce"
  )
  expect_identical(handled$result$columnName, "cluster")
  expect_identical(handled$result$sampleValues[[2]]$constantCode, 1L)
  expect_error(
    GateLabR:::.gatelabr_handle_host_request(
      make_overlay_sce(),
      list(
        operation = "read-categorical-coldata",
        payload = list(datasetId = "test-sce", contractVersion = 99L, columnName = "cluster")
      ),
      dataset_id = "test-sce"
    ),
    "incompatible colData contract"
  )
})
