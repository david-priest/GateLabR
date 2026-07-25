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

add_host_bridge_workspace <- function(sce) {
  gate <- list(
    gate_id = "gate-1",
    name = "CD3 positive",
    gate_type = "rectangle",
    x_channel = "CD3",
    y_channel = "CD19",
    vertices = matrix(c(1, 2, 3, 4), ncol = 2, byrow = TRUE),
    color = "#e41a1c",
    label_offset = NULL
  )
  root <- list(
    population_id = "root",
    name = "All Events",
    gate_refs = list(),
    gate_logic = "and",
    parent_id = NULL,
    children = "cd3-positive",
    event_count = 3L,
    percent_of_parent = 100
  )
  child <- list(
    population_id = "cd3-positive",
    name = "CD3+",
    gate_refs = list(list(gate_id = "gate-1", include = TRUE)),
    gate_logic = "and",
    parent_id = "root",
    children = character(0),
    event_count = 2L,
    percent_of_parent = 2 / 3 * 100
  )
  S4Vectors::metadata(sce)$gating_workspace <- list(
    gates = list(`gate-1` = gate),
    gate_order = "gate-1",
    populations = list(root = root, `cd3-positive` = child),
    root_population_id = "root",
    gate_value_space = "display",
    global_scale_ranges = list(CD3 = c(0, 10), CD19 = c(0, 20)),
    version = 3L,
    saved_at = "2026-07-25 12:00:00"
  )
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
  expect_identical(descriptor$colDataColumns, c("sample_id", "batch"))

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

test_that("legacy GateLabR workspace is carried as an explicit JSON envelope", {
  sce <- add_host_bridge_workspace(make_host_bridge_sce())

  envelope <- GateLabR:::.gatelabr_host_workspace_envelope(
    sce,
    dataset_id = "test-sce"
  )

  expect_identical(envelope$contractVersion, 1L)
  expect_identical(envelope$datasetId, "test-sce")
  expect_identical(envelope$sourceFormat, "gatelabr-legacy")
  expect_identical(envelope$revision, 0L)
  expect_type(envelope$workspaceJson, "character")
  decoded <- jsonlite::fromJSON(envelope$workspaceJson, simplifyVector = FALSE)
  expect_identical(decoded$gate_order, "gate-1")
  expect_identical(decoded$populations$root$children, "cd3-positive")
  expect_equal(decoded$gates$`gate-1`$vertices[[1]], list(1, 2))
})

test_that("host manifest includes workspace metadata without registering more data resources", {
  sce <- add_host_bridge_workspace(make_host_bridge_sce())
  registered <- new.env(parent = emptyenv())
  session <- new.env(parent = emptyenv())
  session$registerDataObj <- function(name, data, filterFunc) {
    registered[[name]] <- list(data = data, filter = filterFunc)
    paste0("session/test/dataobj/", name)
  }
  session$sendCustomMessage <- function(type, message) invisible(NULL)

  manifest <- GateLabR:::.gatelabr_register_host_manifest(
    session,
    sce,
    dataset_id = "test-sce"
  )

  expect_identical(manifest$workspace$sourceFormat, "gatelabr-legacy")
  expect_match(manifest$workspace$workspaceJson, '"CD3 positive"', fixed = TRUE)
  expect_identical(length(ls(registered)), 6L)
})

test_that("SCEs without a workspace advertise no hosted workspace", {
  expect_null(GateLabR:::.gatelabr_host_workspace_envelope(make_host_bridge_sce()))
})

canonical_host_workspace_json <- function(dataset_id = "test-sce") {
  paste0(
    '{"format":"gatelab-workspace","version":2,',
    '"workspaceId":"sce-workspace","savedAt":"2026-07-25T00:00:00Z",',
    '"app":"GateLab","samples":[',
    '{"sampleId":"', dataset_id, ':sample-0","fileName":"Donor A",',
    '"dataPath":"data/sce-1.fcs","logicleW":{},"scatterCofactor":{},',
    '"cytofCofactor":5,"compensationOn":false,"instrumentMode":"cytof",',
    '"labels":{},"metadata":{}},',
    '{"sampleId":"', dataset_id, ':sample-1","fileName":"Donor B",',
    '"dataPath":"data/sce-2.fcs","logicleW":{},"scatterCofactor":{},',
    '"cytofCofactor":5,"compensationOn":false,"instrumentMode":"cytof",',
    '"labels":{},"metadata":{}}],',
    '"activeSample":0,"gating":{"gates":{"gate-1":{',
    '"gate_id":"gate-1","name":"CD3 positive","gate_type":"rectangle",',
    '"x_channel":"CD3","y_channel":"CD19","vertices":[[1,2],[3,4]],',
    '"color":"#e41a1c","label_offset":null}},',
    '"gate_order":["gate-1"],"populations":{"root":{',
    '"population_id":"root","name":"All Events","gate_refs":[],',
    '"gate_logic":"and","parent_id":null,"children":["child"],',
    '"event_count":3,"percent_of_parent":100},"child":{',
    '"population_id":"child","name":"CD3+","gate_refs":[',
    '{"gate_id":"gate-1","include":true}],"gate_logic":"and",',
    '"parent_id":"root","children":[],"event_count":2,',
    '"percent_of_parent":66.7}},"root_population_id":"root",',
    '"active_population_id":"child","selected_gate_id":"gate-1"},',
    '"scales":{"globalScales":{"CD3":[0,10],"CD19":[0,20]}},',
    '"display":{"xChannel":"CD3","yChannel":"CD19",',
    '"mode":"pseudocolor","maxEvents":50000,"contourThreshold":5}}'
  )
}

test_that("canonical hosted workspace writes are revisioned and mirrored atomically", {
  sce <- make_host_bridge_sce()
  workspace_json <- canonical_host_workspace_json()
  written <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 7L,
    reason = "explicit",
    workspace_json = workspace_json
  )

  expect_identical(written$result$revision, 1L)
  expect_identical(written$result$clientRevision, 7L)
  canonical <- S4Vectors::metadata(written$sce)$gatelab_workspace
  expect_identical(canonical$format, "gatelab-sce-workspace")
  expect_identical(canonical$workspace_json, workspace_json)
  expect_identical(canonical$event_count, 3L)
  expect_identical(canonical$channel_ids, c("CD3", "CD19"))
  expect_identical(
    S4Vectors::metadata(written$sce)$gating_workspace$gate_order,
    "gate-1"
  )
  expect_silent(validate_workspace_graph(
    S4Vectors::metadata(written$sce)$gating_workspace
  ))

  envelope <- GateLabR:::.gatelabr_host_workspace_envelope(
    written$sce,
    dataset_id = "test-sce"
  )
  expect_identical(envelope$sourceFormat, "gatelab-workspace")
  expect_identical(envelope$revision, 1L)
  expect_identical(envelope$workspaceJson, workspace_json)

  expect_error(
    GateLabR:::.gatelabr_store_host_workspace(
      written$sce,
      dataset_id = "test-sce",
      expected_revision = 0L,
      client_revision = 8L,
      reason = "autosave",
      workspace_json = workspace_json
    ),
    "revision conflict"
  )
})

test_that("host workspace validation rejects mismatched SCE and compensated v3 state", {
  sce <- make_host_bridge_sce()
  wrong_dataset <- sub(
    "test-sce:sample-0",
    "other:sample-0",
    canonical_host_workspace_json(),
    fixed = TRUE
  )
  expect_error(
    GateLabR:::.gatelabr_store_host_workspace(
      sce,
      dataset_id = "test-sce",
      expected_revision = 0L,
      client_revision = 1L,
      reason = "explicit",
      workspace_json = wrong_dataset
    ),
    "sample identities"
  )
  version_three <- sub(
    '"version":2',
    '"version":3',
    canonical_host_workspace_json(),
    fixed = TRUE
  )
  expect_error(
    GateLabR:::.gatelabr_store_host_workspace(
      sce,
      dataset_id = "test-sce",
      expected_revision = 0L,
      client_revision = 1L,
      reason = "explicit",
      workspace_json = version_three
    ),
    "version 2 hosted workspaces only"
  )
})

test_that("packed browser population masks write back in original SCE event order", {
  stored <- GateLabR:::.gatelabr_store_host_workspace(
    make_host_bridge_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 2L,
    reason = "explicit",
    workspace_json = canonical_host_workspace_json()
  )
  encode_byte <- function(value) base64enc::base64encode(as.raw(value))
  column <- list(
    populationId = "child",
    populationName = "CD3+",
    columnName = "CD3_positive",
    inLabel = "in",
    outLabel = "out",
    sampleMasks = list(
      list(
        sampleId = "sample-0",
        eventCount = 2L,
        membershipBitsBase64 = encode_byte(1L)
      ),
      list(
        sampleId = "sample-1",
        eventCount = 1L,
        membershipBitsBase64 = encode_byte(1L)
      )
    )
  )
  written <- GateLabR:::.gatelabr_write_host_coldata(
    stored$sce,
    dataset_id = "test-sce",
    workspace_revision = 1L,
    columns = list(column)
  )

  expect_identical(
    as.character(SummarizedExperiment::colData(written$sce)$CD3_positive),
    c("in", "out", "in")
  )
  expect_identical(written$result$columns[[1]]$memberCount, 2L)

  expect_error(
    GateLabR:::.gatelabr_write_host_coldata(
      written$sce,
      dataset_id = "test-sce",
      workspace_revision = 1L,
      columns = list(column),
      overwrite = FALSE
    ),
    "already contains"
  )
  overwritten <- GateLabR:::.gatelabr_write_host_coldata(
    written$sce,
    dataset_id = "test-sce",
    workspace_revision = 1L,
    columns = list(column),
    overwrite = TRUE
  )
  expect_identical(
    as.character(SummarizedExperiment::colData(overwritten$sce)$CD3_positive),
    c("in", "out", "in")
  )
})

test_that("host request dispatcher enforces dataset and colData contract identities", {
  request <- list(
    operation = "write-workspace",
    payload = list(
      datasetId = "test-sce",
      expectedRevision = 0L,
      clientRevision = 3L,
      reason = "autosave",
      workspaceJson = canonical_host_workspace_json()
    )
  )
  handled <- GateLabR:::.gatelabr_handle_host_request(
    make_host_bridge_sce(),
    request,
    dataset_id = "test-sce"
  )
  expect_identical(handled$result$revision, 1L)

  request$payload$datasetId <- "wrong-sce"
  expect_error(
    GateLabR:::.gatelabr_handle_host_request(
      make_host_bridge_sce(),
      request,
      dataset_id = "test-sce"
    ),
    "different SCE dataset"
  )
})
