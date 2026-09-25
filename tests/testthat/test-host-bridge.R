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
    # exprs is the arcsinh of counts at the default cofactor, which is what a real
    # object carries. counts / 5 was a plain rescale that no transform reproduces, so
    # the bridge rightly reported it as independently compensated -- an answer this
    # test never meant to assert.
    assays = list(counts = counts, exprs = asinh(counts / 5)),
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
  expect_identical(descriptor$rowDataRevision, 0)

  encoded <- jsonlite::toJSON(descriptor, auto_unbox = TRUE, null = "null")
  expect_match(encoded, '"encoding":"channel-major-float32-le"', fixed = TRUE)
  expect_match(encoded, '"coordinateSpace":"linear"', fixed = TRUE)
  expect_match(encoded, '"eventIndexEncoding":"uint32-le"', fixed = TRUE)
})

test_that("panel display labels write to revisioned rowData without replacing channel identity", {
  sce <- make_host_bridge_sce()
  written <- GateLabR:::.gatelabr_write_host_rowdata_labels(
    sce,
    expected_revision = 0,
    changes = list(
      list(channelId = "CD3", label = "T-cell marker"),
      list(channelId = "CD19", label = "")
    )
  )

  expect_identical(written$result$revision, 1)
  expect_identical(written$result$changedChannelIds, "CD3")
  expect_identical(
    as.character(SummarizedExperiment::rowData(written$sce)$gatelabr_label),
    c("T-cell marker", NA_character_)
  )
  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(written$sce)
  expect_identical(descriptor$rowDataRevision, 1)
  expect_identical(descriptor$channels[[1]]$id, "CD3")
  expect_identical(descriptor$channels[[1]]$pnn, "Nd142Di")
  expect_identical(descriptor$channels[[1]]$pns, "CD3")
  expect_identical(descriptor$channels[[1]]$displayLabel, "T-cell marker")

  expect_error(
    GateLabR:::.gatelabr_write_host_rowdata_labels(
      written$sce,
      expected_revision = 0,
      changes = list(list(channelId = "CD3", label = "stale"))
    ),
    "rowData revision"
  )
})

test_that("lightweight sample partitions preserve identity without rescanning metadata", {
  sce <- make_host_bridge_sce()
  complete <- GateLabR:::.gatelabr_sample_partition(
    sce,
    include_metadata = TRUE
  )
  lightweight <- GateLabR:::.gatelabr_sample_partition(
    sce,
    include_metadata = FALSE
  )

  expect_identical(lightweight$column, complete$column)
  expect_identical(lightweight$levels, complete$levels)
  expect_identical(lightweight$event_indices, complete$event_indices)
  expect_identical(
    vapply(lightweight$samples, `[[`, character(1), "id"),
    vapply(complete$samples, `[[`, character(1), "id")
  )
  expect_identical(
    vapply(lightweight$samples, `[[`, integer(1), "eventCount"),
    vapply(complete$samples, `[[`, integer(1), "eventCount")
  )
  expect_true(all(vapply(
    lightweight$samples,
    function(sample) length(sample$metadata) == 0L,
    logical(1)
  )))
  expect_identical(complete$samples[[1]]$metadata$batch, "one")
})

test_that("dataset descriptors can reuse one precomputed sample partition", {
  sce <- make_host_bridge_sce()
  partition <- GateLabR:::.gatelabr_sample_partition(sce)
  partition$samples[[1]]$label <- "Cached donor"

  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(
    sce,
    dataset_id = "test-sce",
    sample_partition = partition
  )

  expect_identical(descriptor$samples[[1]]$label, "Cached donor")
  expect_identical(descriptor$samples[[1]]$metadata$batch, "one")
})

make_host_instrument_sce <- function(pnn) {
  counts <- matrix(
    seq_len(length(pnn) * 3L),
    nrow = length(pnn),
    dimnames = list(
      paste0("Marker ", seq_along(pnn)),
      paste0("event", 1:3)
    )
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = counts / 5),
    colData = S4Vectors::DataFrame(
      sample_id = c("Donor A", "Donor A", "Donor B")
    )
  )
  SummarizedExperiment::rowData(sce)$gatelabr_pnn <- pnn
  sce
}

test_that("React host instrument detection uses persisted FCS identities", {
  sce <- make_host_instrument_sce(c("Y89Di", "Nd142Di", "Eu151Di"))

  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce)

  expect_identical(descriptor$instrument, "cytof")
})

test_that("React host corrects stale auto modality but respects explicit choices", {
  sce <- make_host_instrument_sce(c("Y89Di", "Nd142Di", "Eu151Di"))
  md <- S4Vectors::metadata(sce)
  md$instrument_type <- "flow"
  md$instrument_type_source <- "auto_detected"
  md$instrument_mode_choice <- "auto"
  S4Vectors::metadata(sce) <- md

  expect_identical(GateLabR:::.gatelabr_sce_instrument(sce), "cytof")

  S4Vectors::metadata(sce)$instrument_mode_choice <- "flow"
  expect_identical(GateLabR:::.gatelabr_sce_instrument(sce), "flow")
})

test_that("rowData columns named $pnn and $pns reach the channel descriptors", {
  # FCS keyword names are a common choice of rowData column. as.data.frame() made them syntactic,
  # "X.pnn" and "X.pns", so neither was found: the channels went to the app without their $PnN and
  # $PnS, and instrument detection lost the $PnN evidence.
  sce <- make_host_instrument_sce(c("Y89Di", "Nd142Di", "Eu151Di"))
  rd <- SummarizedExperiment::rowData(sce)
  rd$gatelabr_pnn <- NULL
  rd[["$pnn"]] <- c("Y89Di", "Nd142Di", "Eu151Di")
  rd[["$pns"]] <- c("CD45", "CD3", "CD19")
  SummarizedExperiment::rowData(sce) <- rd
  expect_identical(colnames(SummarizedExperiment::rowData(sce)), c("$pnn", "$pns"))

  expect_identical(
    GateLabR:::.gatelabr_first_rowdata_field(sce, "$pnn"),
    c("Y89Di", "Nd142Di", "Eu151Di")
  )
  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce)
  expect_identical(vapply(descriptor$channels, `[[`, character(1), "pnn"), c("Y89Di", "Nd142Di", "Eu151Di"))
  expect_identical(vapply(descriptor$channels, `[[`, character(1), "pns"), c("CD45", "CD3", "CD19"))
  # The row names ("Marker 1" to "Marker 3") say nothing of the instrument; the $PnN do.
  expect_identical(descriptor$instrument, "cytof")
})

test_that("React host recognizes conventional flow channel identities", {
  sce <- make_host_instrument_sce(c("FSC-A", "SSC-A", "BV421-A"))

  expect_identical(GateLabR:::.gatelabr_sce_instrument(sce), "flow")
})

test_that("assay roles distinguish uncompensated expression from compensation", {
  sce <- make_host_bridge_sce()
  counts <- SummarizedExperiment::assay(sce, "counts")
  exprs <- SummarizedExperiment::assay(sce, "exprs")
  SummarizedExperiment::assay(sce, "exprs_uncomp") <- exprs
  SummarizedExperiment::assay(sce, "counts_uncomp") <- counts
  SummarizedExperiment::assay(sce, "compcounts") <- counts
  SummarizedExperiment::assay(sce, "compexprs") <- exprs
  SummarizedExperiment::assay(sce, "custom_display_comp") <- exprs
  metadata <- S4Vectors::metadata(sce)
  metadata$gatelabr_assay_roles <- list(
    custom_display_comp = "compensated"
  )
  metadata$gatelabr_assay_coordinate_spaces <- list(
    custom_display_comp = "display"
  )
  S4Vectors::metadata(sce) <- metadata

  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce)
  assays <- setNames(descriptor$assays, vapply(
    descriptor$assays,
    `[[`,
    character(1),
    "id"
  ))

  expect_identical(assays$exprs_uncomp$role, "transformed")
  expect_identical(assays$exprs_uncomp$coordinateSpace, "display")
  expect_identical(assays$counts_uncomp$role, "counts")
  expect_identical(assays$counts_uncomp$coordinateSpace, "linear")
  expect_identical(assays$compcounts$role, "compensated")
  expect_identical(assays$compcounts$coordinateSpace, "linear")
  expect_identical(assays$compexprs$role, "compensated")
  expect_identical(assays$compexprs$coordinateSpace, "display")
  expect_identical(assays$custom_display_comp$role, "compensated")
  expect_identical(assays$custom_display_comp$coordinateSpace, "display")
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

test_that("legacy workspaces restore list-encoded coordinate pairs without changing values", {
  sce <- add_host_bridge_workspace(make_host_bridge_sce())
  original <- S4Vectors::metadata(sce)$gating_workspace$gates[["gate-1"]]$vertices
  S4Vectors::metadata(sce)$gating_workspace$gates[["gate-1"]]$gate_type <-
    "polygon"
  S4Vectors::metadata(sce)$gating_workspace$gates[["gate-1"]]$vertices <- list(
    list(original[1, 1], original[1, 2]),
    list(original[2, 1], original[2, 2]),
    list(original[1, 1], original[2, 2])
  )
  envelope <- GateLabR:::.gatelabr_host_workspace_envelope(
    sce,
    dataset_id = "test-sce"
  )

  expect_identical(envelope$sourceFormat, "gatelabr-legacy")
  restored <- jsonlite::fromJSON(
    envelope$workspaceJson,
    simplifyVector = FALSE
  )
  vertices <- restored$gates[["gate-1"]]$vertices
  expect_true(all(vapply(
    vertices,
    function(pair) is.numeric(unlist(pair)) && length(pair) == 2L,
    logical(1)
  )))
  expect_equal(
    unlist(vertices, use.names = FALSE),
    c(original[1, 1], original[1, 2],
      original[2, 1], original[2, 2],
      original[1, 1], original[2, 2])
  )
})

test_that("React host state survives a browser-session reconnect", {
  sce_name <- ".gatelabr_reconnect_test_sce"
  on.exit(
    if (exists(sce_name, envir = .GlobalEnv, inherits = FALSE)) {
      rm(list = sce_name, envir = .GlobalEnv)
    },
    add = TRUE
  )
  sce_state <- shiny::reactiveVal(make_host_bridge_sce())
  server <- GateLabR:::.gatelabr_react_server(
    sce_state = sce_state,
    sce_name = sce_name,
    dataset_id = "test-sce"
  )
  request <- list(
    requestId = "write-1",
    operation = "write-workspace",
    payload = list(
      datasetId = "test-sce",
      expectedRevision = 0L,
      clientRevision = 7L,
      reason = "explicit",
      workspaceJson = canonical_host_workspace_json()
    )
  )

  suppressWarnings(shiny::testServer(server, {
    session$flushReact()
    session$setInputs(gatelabr_host_request = request)
    session$flushReact()
  }))
  expect_identical(
    GateLabR:::.gatelabr_canonical_workspace_record(
      shiny::isolate(sce_state())
    )$revision,
    1L
  )

  # A page reload creates a second Shiny session backed by the same app-level
  # state. Its manifest must therefore expose the revision written above.
  suppressWarnings(shiny::testServer(server, {
    reconnect_revision <- GateLabR:::.gatelabr_host_workspace_envelope(
      shiny::isolate(sce_state()),
      dataset_id = "test-sce"
    )$revision
    expect_identical(reconnect_revision, 1L)
  }))
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
    "invalid compensation state"
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

test_that("a population not evaluated for a sample writes NA for its events, not the outside label", {
  stored <- GateLabR:::.gatelabr_store_host_workspace(
    make_host_bridge_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 2L,
    reason = "explicit",
    workspace_json = canonical_host_workspace_json()
  )
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
        membershipBitsBase64 = base64enc::base64encode(as.raw(1L))
      ),
      list(
        sampleId = "sample-1",
        eventCount = 1L,
        membershipBitsBase64 = "",
        notEvaluated = paste(
          "'CD3+' of 'Main' was not evaluated for Donor B:",
          "the tree it is gated under, 'Main copy', has no such population."
        )
      )
    )
  )
  expect_warning(
    written <- GateLabR:::.gatelabr_write_host_coldata(
      stored$sce,
      dataset_id = "test-sce",
      workspace_revision = 1L,
      columns = list(column)
    ),
    "Population 'CD3\\+' was not evaluated for 1 sample.*sample 'Donor B' \\(1 event\\).*has no such population"
  )
  written_column <- SummarizedExperiment::colData(written$sce)$CD3_positive
  expect_identical(as.character(written_column), c("in", "out", NA))
  expect_identical(levels(written_column), c("in", "out"))
  expect_identical(written$result$columns[[1]]$memberCount, 1L)
})

test_that("sample metadata keeps colData names exactly as GateLab writes them", {
  stored <- GateLabR:::.gatelabr_store_host_workspace(
    make_host_bridge_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 2L,
    reason = "explicit",
    workspace_json = canonical_host_workspace_json()
  )
  # Population names become colData names verbatim. Both of these are one sample's value
  # throughout, so both are sample metadata; make.names() would turn them into
  # CD4.CD8..T.cells and CD4.CD8..T.cells.1.
  population_column <- function(name, first, second) {
    list(
      populationId = name,
      populationName = name,
      columnName = name,
      inLabel = "in",
      outLabel = "out",
      sampleMasks = list(
        list(
          sampleId = "sample-0",
          eventCount = 2L,
          membershipBitsBase64 = base64enc::base64encode(as.raw(first))
        ),
        list(
          sampleId = "sample-1",
          eventCount = 1L,
          membershipBitsBase64 = base64enc::base64encode(as.raw(second))
        )
      )
    )
  }
  written <- GateLabR:::.gatelabr_write_host_coldata(
    stored$sce,
    dataset_id = "test-sce",
    workspace_revision = 1L,
    columns = list(
      population_column("CD4-CD8+ T cells", 3L, 0L),
      population_column("CD4+CD8- T cells", 0L, 1L)
    )
  )

  partition <- GateLabR:::.gatelabr_sample_partition(written$sce)
  metadata <- partition$samples[[1]]$metadata
  expect_identical(
    names(metadata),
    c("sample_id", "batch", "CD4-CD8+ T cells", "CD4+CD8- T cells")
  )
  expect_identical(metadata[["CD4-CD8+ T cells"]], "in")
  expect_identical(metadata[["CD4+CD8- T cells"]], "out")
  expect_identical(partition$samples[[2]]$metadata[["CD4+CD8- T cells"]], "in")

  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(
    written$sce,
    dataset_id = "test-sce",
    sample_partition = partition
  )
  expect_true(all(names(metadata) %in% descriptor$colDataColumns))
})

test_that("categorical sample and event annotations write atomically in SCE event order", {
  sce <- make_host_bridge_sce()
  column <- list(
    columnName = "review_group",
    levels = list("control", "stimulated"),
    sampleValues = list(
      list(
        sampleId = "sample-0",
        eventCount = 2L,
        codesBase64 = base64enc::base64encode(as.raw(c(0L, 1L)))
      ),
      list(
        sampleId = "sample-1",
        eventCount = 1L,
        constantCode = 255L
      )
    )
  )
  written <- GateLabR:::.gatelabr_write_host_categorical_coldata(
    sce,
    columns = list(column)
  )

  expect_identical(
    as.character(SummarizedExperiment::colData(written$sce)$review_group),
    c("control", "stimulated", NA_character_)
  )
  expect_identical(
    unlist(written$result$columns[[1]]$valueCounts, use.names = TRUE),
    c(control = 1L, stimulated = 1L)
  )
  expect_identical(written$result$columns[[1]]$missingCount, 1L)

  bad <- column
  bad$sampleValues[[1]]$codesBase64 <-
    base64enc::base64encode(as.raw(c(0L, 2L)))
  expect_error(
    GateLabR:::.gatelabr_write_host_categorical_coldata(
      sce,
      columns = list(bad)
    ),
    "outside its declared levels"
  )
  expect_false("review_group" %in% colnames(SummarizedExperiment::colData(sce)))
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

ellipse_host_workspace_json <- function(dataset_id = "test-sce") {
  sub(
    '"gates":{"gate-1":{"gate_id":"gate-1","name":"CD3 positive","gate_type":"rectangle","x_channel":"CD3","y_channel":"CD19","vertices":[[1,2],[3,4]],"color":"#e41a1c","label_offset":null}}',
    paste0(
      '"gates":{"gate-1":{"gate_id":"gate-1","name":"CD3 positive",',
      '"gate_type":"ellipse","x_channel":"CD3","y_channel":"CD19",',
      '"mean":[3,4],"covariance":[[4,0],[0,1]],"distance_square":1,',
      '"color":"#e41a1c","label_offset":null}}'
    ),
    canonical_host_workspace_json(dataset_id),
    fixed = TRUE
  )
}

test_that("an ellipse gate does not break the autosave mirror", {
  # Reported from a live GateLabR session as
  #   "SCE autosave failed: Invalid GateLab workspace: gate '<id>' has invalid vertices."
  # An ellipse stores mean/covariance/distanceSquare and no vertices, but the legacy mirror
  # demanded vertices for every non-quadrant gate, so the whole autosave aborted.
  sce <- make_host_bridge_sce()
  workspace_json <- ellipse_host_workspace_json()
  expect_false(identical(workspace_json, canonical_host_workspace_json()))

  written <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = workspace_json
  )

  expect_identical(written$result$revision, 1L)
  mirrored <- S4Vectors::metadata(written$sce)$gating_workspace$gates[["gate-1"]]
  expect_identical(mirrored$gate_type, "ellipse")
  expect_equal(mirrored$mean, c(3, 4))
  expect_equal(mirrored$covariance, matrix(c(4, 0, 0, 1), nrow = 2L))
  expect_equal(mirrored$distance_square, 1)
})

test_that("the mirrored ellipse carries a boundary anything reading vertices can use", {
  written <- GateLabR:::.gatelabr_store_host_workspace(
    make_host_bridge_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = ellipse_host_workspace_json()
  )
  mirrored <- S4Vectors::metadata(written$sce)$gating_workspace$gates[["gate-1"]]

  expect_equal(dim(mirrored$vertices), c(64L, 2L))
  # Every sampled point must sit exactly on the boundary the covariance defines:
  # (p - mu)' Sigma^-1 (p - mu) == distance_square. Asserted through the quadratic form rather
  # than by coordinate, so an eigenvector sign flip cannot make a correct ring look wrong.
  centred <- sweep(mirrored$vertices, 2L, mirrored$mean, "-")
  quadratic <- rowSums((centred %*% solve(mirrored$covariance)) * centred)
  expect_equal(quadratic, rep(1, 64L), tolerance = 1e-9)
})

test_that("the legacy mirror keeps each gate's space and transforms", {
  # An ellipse is always stored in display space, as is any gate drawn in display space and every
  # FlowJo biex or log gate. The mirror dropped `space` and `transforms` and declared the whole
  # workspace raw for a flow object, so a host reloading the mirror (no canonical record, e.g. the
  # mirror copied onto a rebuilt SCE) read display-space coordinates as raw values.
  sce <- make_host_bridge_sce()
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  S4Vectors::metadata(sce)$instrument_type_source <- "user"
  workspace_json <- sub(
    '"label_offset":null}}',
    paste0(
      '"label_offset":null,"space":"display","transforms":{',
      '"CD3":{"kind":"logicle","T":262144,"W":0.5,"M":4.5,"A":0},',
      '"CD19":{"kind":"asinh","cofactor":150}}}}'
    ),
    ellipse_host_workspace_json(),
    fixed = TRUE
  )
  written <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = workspace_json
  )
  mirror <- S4Vectors::metadata(written$sce)$gating_workspace
  expect_identical(mirror$gate_value_space, "raw")
  expect_identical(mirror$gates[["gate-1"]]$space, "display")
  expect_equal(
    mirror$gates[["gate-1"]]$transforms,
    list(
      CD3 = list(kind = "logicle", T = 262144, W = 0.5, M = 4.5, A = 0),
      CD19 = list(kind = "asinh", cofactor = 150)
    )
  )

  # The host reads the mirror only when the canonical record is gone; the gate must arrive with
  # its space, which the core's legacy reader honours per gate.
  bare <- written$sce
  S4Vectors::metadata(bare)$gatelab_workspace <- NULL
  envelope <- GateLabR:::.gatelabr_host_workspace_envelope(bare, dataset_id = "test-sce")
  expect_identical(envelope$sourceFormat, "gatelabr-legacy")
  sent <- jsonlite::fromJSON(envelope$workspaceJson, simplifyVector = FALSE)$gates[["gate-1"]]
  expect_identical(sent$space, "display")
  expect_identical(sent$transforms$CD3$kind, "logicle")
  expect_equal(sent$transforms$CD19$cofactor, 150)

  # A gate that never had a space keeps none, and the workspace default still applies to it.
  plain <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = canonical_host_workspace_json()
  )
  expect_null(S4Vectors::metadata(plain$sce)$gating_workspace$gates[["gate-1"]]$space)
})

# A workspace of the version 2 layout that needs features an older GateLab would misread, as
# GateLab writes it for a hosted save: version 4, the features listed, a half-open rectangle, a
# polygon on FlowJo's grid with the vertices FlowJo saved, a FlowJo rectangle with the axes and
# the bound its rule opened, a biex axis on FlowJo's table, a standard flog with bounds, and a
# file compensated with a matrix a workspace supplied.
version_four_host_workspace_json <- function(dataset_id = "test-sce") {
  gates <- paste0(
    '"gates":{',
    '"gate-1":{"gate_id":"gate-1","name":"CD3 positive","gate_type":"rectangle",',
    '"x_channel":"CD3","y_channel":"CD19","vertices":[[1,2],[3,2],[3,4],[1,4]],',
    '"bounds":"half-open","color":"#e41a1c","label_offset":null},',
    '"gate-2":{"gate_id":"gate-2","name":"Grid","gate_type":"polygon",',
    '"x_channel":"CD3","y_channel":"CD19","vertices":[[10,20],[200,40],[180,150],[40,90]],',
    '"space":"display","transforms":{',
    '"CD3":{"kind":"flowjoChannels","channels":256,"axis":{"kind":"linear","minRange":0,"maxRange":262144}},',
    '"CD19":{"kind":"flowjoChannels","channels":256,"axis":{"kind":"biex","maxValue":262144,',
    '"pos":4.41854,"neg":0,"widthBasis":-10,"channelRange":256}}},',
    '"flowjo_vertices":[[20000,-150],[200000,40],[180000,150000],[40000,90000]],',
    '"flowjo_polygon":{"quadId":-1,"gateResolution":256},',
    '"color":"#377eb8","label_offset":null},',
    '"gate-3":{"gate_id":"gate-3","name":"FlowJo box","gate_type":"rectangle",',
    '"x_channel":"CD3","y_channel":"CD19","vertices":[[-1e+308,2],[5,2],[5,8],[-1e+308,8]],',
    '"space":"display","transforms":{',
    '"CD3":{"kind":"biex","maxValue":262144,"pos":4.41854,"neg":0,"widthBasis":-10,',
    '"channelRange":256,"tableChannels":4096},',
    '"CD19":{"kind":"flog","T":262144,"M":5,"standard":true,"bounds":{"min":0.1}}},',
    '"flowjo_axes":{"CD3":{"kind":"wsplog","offset":3,"decades":5},',
    '"CD19":{"kind":"linear","minRange":0,"maxRange":262144}},',
    '"flowjo_bounds":{"CD3":[3,null],"CD19":[null,null]},',
    '"color":"#4daf4a","label_offset":null}}'
  )
  json <- sub(
    '"gates":{"gate-1":{"gate_id":"gate-1","name":"CD3 positive","gate_type":"rectangle","x_channel":"CD3","y_channel":"CD19","vertices":[[1,2],[3,4]],"color":"#e41a1c","label_offset":null}}',
    gates,
    canonical_host_workspace_json(dataset_id),
    fixed = TRUE
  )
  json <- sub('"gate_order":["gate-1"]', '"gate_order":["gate-1","gate-2","gate-3"]', json, fixed = TRUE)
  json <- sub(
    '"version":2,',
    paste0(
      '"version":4,"requiredFeatures":["flowjo-grid","flowjo-biex-table",',
      '"external-spillover","half-open-rectangle"],'
    ),
    json,
    fixed = TRUE
  )
  sub(
    '"labels":{},"metadata":{}},',
    paste0(
      '"labels":{},"metadata":{},"externalSpillover":{"matrix":{"channels":["CD3","CD19"],',
      '"matrix":[[1,0.1],[0.02,1]]},"label":"Synthetic matrix"}},'
    ),
    json,
    fixed = TRUE
  )
}

test_that("a version 4 workspace is stored as GateLab wrote it, and its mirror keeps every gate field", {
  # GateLab writes a hosted workspace as version 4, the version 2 layout with requiredFeatures,
  # whenever it holds a grid gate, FlowJo's biex table, a matrix a workspace supplied or a
  # half-open rectangle. GateLabR stored versions 2 and 3 only, so every such save was refused.
  sce <- make_host_bridge_sce()
  workspace_json <- version_four_host_workspace_json()
  sent <- jsonlite::fromJSON(workspace_json, simplifyVector = FALSE)
  expect_identical(sent$version, 4L)

  written <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "explicit",
    workspace_json = workspace_json
  )
  expect_identical(written$result$revision, 1L)
  # The canonical record is the JSON as written, requiredFeatures and externalSpillover included.
  canonical <- S4Vectors::metadata(written$sce)$gatelab_workspace
  expect_identical(canonical$workspace_json, workspace_json)
  envelope <- GateLabR:::.gatelabr_host_workspace_envelope(written$sce, dataset_id = "test-sce")
  expect_identical(envelope$sourceFormat, "gatelab-workspace")
  expect_identical(envelope$workspaceJson, workspace_json)

  # The mirror keeps each gate's edge rule, transforms and FlowJo fields exactly.
  mirror <- S4Vectors::metadata(written$sce)$gating_workspace
  expect_silent(validate_workspace_graph(mirror))
  fields <- c("space", "transforms", "bounds", "flowjo_vertices", "flowjo_axes", "flowjo_bounds",
              "flowjo_polygon")
  for (gate_id in c("gate-1", "gate-2", "gate-3")) {
    for (field in fields) {
      expect_identical(mirror$gates[[gate_id]][[field]], sent$gating$gates[[gate_id]][[field]],
                       info = paste(gate_id, field))
    }
  }
  expect_identical(mirror$gates[["gate-1"]]$bounds, "half-open")

  # And a host reloading the mirror, with the canonical record gone, sends them back unchanged.
  bare <- written$sce
  S4Vectors::metadata(bare)$gatelab_workspace <- NULL
  legacy <- GateLabR:::.gatelabr_host_workspace_envelope(bare, dataset_id = "test-sce")
  expect_identical(legacy$sourceFormat, "gatelabr-legacy")
  reloaded <- jsonlite::fromJSON(legacy$workspaceJson, simplifyVector = FALSE)$gates
  for (gate_id in c("gate-1", "gate-2", "gate-3")) {
    for (field in setdiff(fields, "space")) {
      expect_equal(reloaded[[gate_id]][[field]], sent$gating$gates[[gate_id]][[field]],
                   info = paste(gate_id, field))
    }
  }

  # A version GateLabR does not know is still refused.
  later <- sub('"version":4,', '"version":5,', workspace_json, fixed = TRUE)
  expect_error(
    GateLabR:::.gatelabr_store_host_workspace(
      sce,
      dataset_id = "test-sce",
      expected_revision = 0L,
      client_revision = 1L,
      reason = "explicit",
      workspace_json = later
    ),
    "GateLabR can store GateLab workspace versions 2, 3 and 4 only.",
    fixed = TRUE
  )
})

test_that("a revision conflict carries the data a browser needs to resync", {
  # The browser learns the stored revision only from a successful write, so a write whose reply
  # is lost leaves it behind for good. Reported live as "expected revision 14 but the SCE is at
  # revision 15", curable only by reloading. The conflict now reports the current revision and
  # who wrote it.
  sce <- make_host_bridge_sce()
  written <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = canonical_host_workspace_json(),
    writer_id = "browser-a"
  )
  expect_identical(written$result$revision, 1L)
  expect_identical(
    S4Vectors::metadata(written$sce)$gatelab_workspace$writer_id,
    "browser-a"
  )

  conflict <- tryCatch(
    GateLabR:::.gatelabr_store_host_workspace(
      written$sce,
      dataset_id = "test-sce",
      expected_revision = 0L, # stale: the SCE has moved to 1
      client_revision = 2L,
      reason = "autosave",
      workspace_json = canonical_host_workspace_json(),
      writer_id = "browser-a"
    ),
    gatelabr_revision_conflict = function(cause) cause
  )

  expect_s3_class(conflict, "gatelabr_revision_conflict")
  expect_identical(conflict$current_revision, 1L)
  expect_identical(conflict$expected_revision, 0L)
  # The winning write was this same browser's, which is what lets it resync instead of reloading.
  expect_identical(conflict$writer_id, "browser-a")
  expect_match(conditionMessage(conflict), "expected revision 0 but the SCE is at revision 1")
})

test_that("a conflict is unattributable when the stored write carried no writer id", {
  # Workspaces written before writer ids exist must not be mistaken for the current browser's
  # own work, or resyncing would silently overwrite them.
  sce <- make_host_bridge_sce()
  written <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = canonical_host_workspace_json()
  )
  expect_true(is.na(S4Vectors::metadata(written$sce)$gatelab_workspace$writer_id))

  conflict <- tryCatch(
    GateLabR:::.gatelabr_store_host_workspace(
      written$sce,
      dataset_id = "test-sce",
      expected_revision = 0L,
      client_revision = 2L,
      reason = "autosave",
      workspace_json = canonical_host_workspace_json(),
      writer_id = "browser-a"
    ),
    gatelabr_revision_conflict = function(cause) cause
  )
  expect_true(is.na(conflict$writer_id))
})
