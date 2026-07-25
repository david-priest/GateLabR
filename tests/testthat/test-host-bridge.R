make_host_bridge_sce <- function() {
  counts <- matrix(
    c(
      1.25, 2.5, 3.75,
      -4.5, 0, 8.25
    ),
    nrow = 2,
    byrow = TRUE,
    dimnames = list(c("CD3", "CD19"), paste0("event", 1:3))
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = counts / 5),
    colData = S4Vectors::DataFrame(
      sample_id = c("Donor A", "Donor A", "Donor B"),
      batch = c("one", "one", "two")
    )
  )
  rd <- SummarizedExperiment::rowData(sce)
  rd$gatelabr_pnn <- c("Nd142Di", "Eu151Di")
  rd$marker <- c("CD3", "CD19")
  SummarizedExperiment::rowData(sce) <- rd
  S4Vectors::metadata(sce)$instrument_type <- "cytof"
  sce
}

test_that("SCE host descriptors preserve assays, channels, and sample metadata", {
  sce <- make_host_bridge_sce()
  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(
    sce,
    dataset_id = "test-sce",
    label = "Test SCE"
  )

  expect_identical(descriptor$contractVersion, 1L)
  expect_identical(descriptor$id, "test-sce")
  expect_identical(descriptor$instrument, "cytof")
  expect_identical(descriptor$eventCount, 3L)
  expect_identical(descriptor$defaultAssayId, "counts")
  expect_identical(vapply(descriptor$channels, `[[`, character(1), "id"), c("CD3", "CD19"))
  expect_identical(vapply(descriptor$channels, `[[`, character(1), "pnn"), c("Nd142Di", "Eu151Di"))
  expect_identical(vapply(descriptor$assays, `[[`, character(1), "role"), c("counts", "transformed"))
  expect_identical(
    vapply(descriptor$assays, `[[`, character(1), "coordinateSpace"),
    c("linear", "display")
  )
  expect_identical(vapply(descriptor$samples, `[[`, integer(1), "eventCount"), c(2L, 1L))
  expect_identical(descriptor$samples[[1]]$metadata$batch, "one")
  expect_identical(descriptor$samples[[1]]$assayByteLength, 16)
  expect_identical(descriptor$samples[[1]]$eventIndexByteLength, 8)

  encoded <- jsonlite::toJSON(descriptor, auto_unbox = TRUE, null = "null")
  expect_match(encoded, '"encoding":"channel-major-float32-le"', fixed = TRUE)
  expect_match(encoded, '"coordinateSpace":"linear"', fixed = TRUE)
  expect_match(encoded, '"eventIndexEncoding":"uint32-le"', fixed = TRUE)
})

test_that("assay payload is channel-major Float32 little-endian", {
  sce <- make_host_bridge_sce()
  path <- tempfile(fileext = ".f32")
  on.exit(unlink(path), add = TRUE)

  GateLabR:::.gatelabr_write_assay_payload(sce, "counts", path)

  expect_identical(as.numeric(file.info(path)$size), 24)
  values <- readBin(path, what = "numeric", n = 6, size = 4L, endian = "little")
  expect_equal(values, c(1.25, 2.5, 3.75, -4.5, 0, 8.25), tolerance = 1e-6)
})

test_that("event-index payload preserves zero-based original SCE columns", {
  path <- tempfile(fileext = ".u32")
  on.exit(unlink(path), add = TRUE)

  GateLabR:::.gatelabr_write_event_index_payload(c(1L, 2L, 5L), path)

  expect_identical(as.numeric(file.info(path)$size), 12)
  event_indices <- readBin(path, what = "integer", n = 3, size = 4L, endian = "little")
  expect_identical(event_indices, c(0L, 1L, 4L))
})

test_that("assay payload can stream one SCE sample without browser-side splitting", {
  sce <- make_host_bridge_sce()
  path <- tempfile(fileext = ".f32")
  on.exit(unlink(path), add = TRUE)

  GateLabR:::.gatelabr_write_assay_payload(sce, "counts", path, event_indices = c(1L, 2L))

  expect_identical(as.numeric(file.info(path)$size), 16)
  values <- readBin(path, what = "numeric", n = 4, size = 4L, endian = "little")
  expect_equal(values, c(1.25, 2.5, -4.5, 0), tolerance = 1e-6)
})

test_that("host manifest registers lazy per-sample assay and event resources", {
  sce <- make_host_bridge_sce()
  registered <- new.env(parent = emptyenv())
  messages <- list()
  session <- new.env(parent = emptyenv())
  session$registerDataObj <- function(name, data, filterFunc) {
    registered[[name]] <- list(data = data, filter = filterFunc)
    paste0("session/test/dataobj/", name)
  }
  session$sendCustomMessage <- function(type, message) {
    messages[[type]] <<- message
  }

  manifest <- GateLabR:::.gatelabr_register_host_manifest(
    session,
    sce,
    dataset_id = "test-sce",
    label = "Test SCE"
  )

  expect_identical(messages[["gatelabr-host-manifest"]], manifest)
  expect_identical(length(manifest$resources), 2L)
  expect_identical(
    names(manifest$resources[[1]]$assayUrls),
    c("counts", "exprs")
  )
  expect_match(manifest$resources[[1]]$eventIndexUrl, "events$")
  expect_identical(length(ls(registered)), 6L)

  assay_name <- sub("^.*/", "", manifest$resources[[1]]$assayUrls$counts)
  assay_response <- registered[[assay_name]]$filter(
    registered[[assay_name]]$data,
    list(REQUEST_METHOD = "GET")
  )
  expect_s3_class(assay_response, "httpResponse")
  expect_identical(assay_response$status, 200L)
  expect_identical(as.numeric(file.info(assay_response$content$file)$size), 16)
  unlink(assay_response$content$file)

  event_name <- sub("^.*/", "", manifest$resources[[1]]$eventIndexUrl)
  event_response <- registered[[event_name]]$filter(
    registered[[event_name]]$data,
    list(REQUEST_METHOD = "GET")
  )
  expect_s3_class(event_response, "httpResponse")
  expect_identical(event_response$status, 200L)
  expect_identical(
    readBin(event_response$content$file, "integer", n = 2, size = 4L, endian = "little"),
    c(0L, 1L)
  )
  unlink(event_response$content$file)
})
