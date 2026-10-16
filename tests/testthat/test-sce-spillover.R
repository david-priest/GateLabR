spillover_sce <- function(instrument = "flow") {
  counts <- matrix(c(10, 30, 50, 20, 40, 60), nrow = 2, byrow = TRUE,
                   dimnames = list(c("CD4", "CD8"), c("event1", "event2", "event3")))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(sample_id = c("D1", "D2", "D1")),
    rowData = S4Vectors::DataFrame(pnn = c("FL1-A", "FL2-A"), pns = c("CD4", "CD8")))
  S4Vectors::metadata(sce)$instrument_type <- instrument
  S4Vectors::metadata(sce)$instrument_type_source <- "explicit"
  sce
}

test_that("the SCE manifest offers stored spillover without applying it or relabelling assays", {
  sce <- spillover_sce("cytof")
  before <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce)
  expect_null(before$compensationMatrix)
  # Row and column orders deliberately differ, and neither follows SCE row order.
  spill <- matrix(c(0.2, 1, 1, 0.05), nrow = 2, byrow = TRUE,
                  dimnames = list(c("CD8", "CD4"), c("FL1-A", "FL2-A")))
  S4Vectors::metadata(sce)$spillover <- spill
  original <- sce
  registered <- new.env(parent = emptyenv())
  sent <- NULL
  session <- list(
    registerDataObj = function(name, data, filterFunc) {
      registered[[name]] <- list(data = data, filter = filterFunc)
      paste0("session/test/", name)
    },
    sendCustomMessage = function(type, message) sent <<- message)
  manifest <- GateLabR:::.gatelabr_register_host_manifest(session, sce, dataset_id = "sce-test")
  expect_identical(sent, manifest)
  descriptor <- manifest$datasets[[1]]
  offered <- descriptor$compensationMatrix
  expect_identical(offered$kind, "cytof-spillover")
  expect_identical(offered$name, "metadata(sce)$spillover")
  expect_identical(as.character(offered$sourceChannels), c("FL2-A", "FL1-A"))
  expect_identical(as.character(offered$receiverChannels), c("FL1-A", "FL2-A"))
  expect_identical(as.numeric(offered$matrix[[1]]), c(0.2, 1))
  expect_identical(as.numeric(offered$matrix[[2]]), c(1, 0.05))
  expect_identical(descriptor$assays, before$assays)
  expect_identical(descriptor$defaultAssayId, "exprs")
  expect_length(manifest$compensationApplications, 0L)
  expect_identical(sce, original)

  # The resources the page actually fetches still contain each assay's stored values, in
  # channel-major order, on each sample. Offering a matrix must never compensate them twice.
  expected_rows <- list(c(1L, 3L), 2L)
  for (sample in seq_along(manifest$resources)) {
    resource <- manifest$resources[[sample]]
    for (assay in c("counts", "exprs")) {
      entry <- registered[[sub("^.*/", "", resource$assayUrls[[assay]])]]
      response <- entry$filter(entry$data, list(REQUEST_METHOD = "GET"))
      actual <- readBin(response$content$file, "numeric", n = 2 * length(expected_rows[[sample]]),
                        size = 4L, endian = "little")
      expected <- as.numeric(t(SummarizedExperiment::assay(sce, assay)[, expected_rows[[sample]], drop = FALSE]))
      expect_equal(actual, expected, tolerance = 1e-6)
    }
  }
})

test_that("a flow SCE's stored matrix is not offered, since the app would install it as each sample's own", {
  # host/hostedSample.ts makes a flow-spillover compensationMatrix every hosted sample's own
  # spillover. Reopening a workspace whose sample was compensated then applies it in the browser
  # at once (App.tsx, the workspace open's setCompensation(true)), and the header offers
  # "Compensated" on any linear assay, one whose role is compensated too (canUseCompensatedAssay).
  # A descriptor carrying no flow matrix leaves the hosted samples without one: such a sample
  # stays pending, and the header has nothing to apply.
  spill <- matrix(c(1, 0.05, 0.2, 1), nrow = 2, byrow = TRUE,
                  dimnames = list(c("FL1-A", "FL2-A"), c("FL1-A", "FL2-A")))
  for (with_compensated in c(FALSE, TRUE)) {
    sce <- spillover_sce()
    if (with_compensated) {
      SummarizedExperiment::assay(sce, "compensated") <- SummarizedExperiment::assay(sce, "counts")
    }
    S4Vectors::metadata(sce)$spillover <- spill
    expect_warning(descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce),
                   "metadata\\(sce\\)\\$spillover is not offered for compensation: on flow data")
    expect_null(descriptor$compensationMatrix)
    roles <- vapply(descriptor$assays, `[[`, character(1), "role")
    expect_identical("compensated" %in% roles, with_compensated)
  }
})

test_that("CyTOF spillover preserves rectangular source and receiver axes", {
  sce <- spillover_sce("cytof")
  SummarizedExperiment::rowData(sce)$pnn <- c("Nd142Di", "Nd145Di")
  S4Vectors::metadata(sce)$spillover <- matrix(c(1, 0.13), nrow = 1,
                                             dimnames = list("CD8", c("Nd145Di", "Nd142Di")))
  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce)
  offered <- descriptor$compensationMatrix
  expect_identical(offered$kind, "cytof-spillover")
  expect_identical(as.character(offered$sourceChannels), "Nd145Di")
  expect_identical(as.character(offered$receiverChannels), c("Nd145Di", "Nd142Di"))
  expect_identical(as.numeric(offered$matrix[[1]]), c(1, 0.13))
  # Even a one-element axis must travel as an array, not an auto-unboxed JSON string.
  parsed <- jsonlite::fromJSON(jsonlite::toJSON(descriptor, auto_unbox = TRUE), simplifyVector = FALSE)
  expect_identical(parsed$compensationMatrix$sourceChannels, list("Nd145Di"))
  expect_equal(parsed$compensationMatrix$matrix, list(list(1, 0.13)))
  expect_identical(vapply(descriptor$assays, `[[`, character(1), "role"), c("counts", "transformed"))
})

test_that("legacy matrix keys keep their provenance and the documented key takes precedence", {
  spill <- diag(2)
  dimnames(spill) <- list(c("CD4", "CD8"), c("CD4", "CD8"))
  for (key in c("spillover", "spillover_matrix", "spilloverMatrix", "sm")) {
    sce <- spillover_sce("cytof")
    S4Vectors::metadata(sce)[[key]] <- spill
    offered <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce)$compensationMatrix
    expect_identical(offered$name, paste0("metadata(sce)$", key))
    expect_identical(GateLabR:::.gatelabr_sce_spillover_matrix(sce), spill)
  }
  S4Vectors::metadata(sce)$spillover <- spill
  expect_identical(GateLabR:::.gatelabr_sce_dataset_descriptor(sce)$compensationMatrix$name,
                   "metadata(sce)$spillover")
})

test_that("unmatched or ambiguous matrix names are reported without guessing a mapping", {
  sce <- spillover_sce("cytof")
  spill <- diag(2)
  dimnames(spill) <- list(c("CD4", "missing"), c("CD4", "CD8"))
  S4Vectors::metadata(sce)$spillover <- spill
  result <- expect_warning(GateLabR:::.gatelabr_sce_dataset_descriptor(sce),
                           "each matrix channel must identify exactly one SCE row")
  expect_null(result$compensationMatrix)

  dimnames(spill) <- list(c("CD4", "CD8"), c("CD4", "CD8"))
  S4Vectors::metadata(sce)$spillover <- spill
  SummarizedExperiment::rowData(sce)$pns <- c("CD8", "CD4")
  result <- expect_warning(GateLabR:::.gatelabr_sce_dataset_descriptor(sce),
                           "each matrix channel must identify exactly one SCE row")
  expect_null(result$compensationMatrix)

  SummarizedExperiment::rowData(sce)$pns <- c("CD4", "CD8")
  SummarizedExperiment::rowData(sce)$pnn <- c("FL1-A", "FL1-A")
  result <- expect_warning(GateLabR:::.gatelabr_sce_dataset_descriptor(sce), "duplicate physical channel names")
  expect_null(result$compensationMatrix)
})

test_that("a matrix naming a channel the SCE lacks is refused whole, and the warning says so", {
  # CATALYST's spillover matrices carry receiver columns for every mass the instrument reads,
  # most of which a panel does not use.
  sce <- spillover_sce("cytof")
  SummarizedExperiment::rowData(sce)$pnn <- c("Nd142Di", "Nd145Di")
  S4Vectors::metadata(sce)$spillover <- matrix(c(1, 0.02, 0.01, 0.03, 1, 0.02), nrow = 2, byrow = TRUE,
    dimnames = list(c("Nd142Di", "Nd145Di"), c("Nd142Di", "Nd145Di", "Sm147Di")))
  expect_warning(descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce),
                 "Sm147Di does not\\).*refused whole")
  expect_null(descriptor$compensationMatrix)
})

test_that("a stored matrix does not supply an unknown instrument or nonfinite coefficients", {
  sce <- spillover_sce("cytof")
  spill <- diag(2)
  dimnames(spill) <- list(c("CD4", "CD8"), c("CD4", "CD8"))
  spill[1, 2] <- NA_real_
  S4Vectors::metadata(sce)$spillover <- spill
  result <- expect_warning(GateLabR:::.gatelabr_sce_dataset_descriptor(sce), "every coefficient must be finite")
  expect_null(result$compensationMatrix)

  spill[1, 2] <- 0
  S4Vectors::metadata(sce)$spillover <- spill
  S4Vectors::metadata(sce)$instrument_type <- "unknown"
  SummarizedExperiment::rowData(sce)$pnn <- NULL
  result <- expect_warning(GateLabR:::.gatelabr_sce_dataset_descriptor(sce), "set metadata\\(sce\\)\\$instrument_type")
  expect_null(result$compensationMatrix)
})
