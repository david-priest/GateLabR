library(GateLabR)

scientific <- list(
  schema = "gatelab.compensation-profile.v1",
  kind = "cytof-spillover",
  method = "nnls",
  solverVersion = "r-nnls-v1",
  solverSettings = list(
    list(key = "adaptationVersion", value = "identity-backed-v1"),
    list(key = "kktTolerance", value = 1e-9),
    list(key = "maxIterations", value = 1000),
    list(key = "tolerance", value = 1e-10)
  ),
  matrix = list(
    schema = "gatelab.compensation-matrix.v1",
    orientation = "source-rows-receiver-columns",
    sourceChannels = c("A", "B"),
    receiverChannels = c("A", "B"),
    matrix = list(c(1, 0.1), c(0.2, 1))
  ),
  includedChannels = c("A", "B")
)
matrix_record <- GateLabR:::.gatelabr_comp_matrix_record(scientific)
matrix_hash <- GateLabR:::.gatelabr_comp_matrix_hash(matrix_record)
profile_hash <- GateLabR:::.gatelabr_comp_profile_hash(
  scientific,
  matrix_hash
)
profile_json <- jsonlite::toJSON(
  list(
    schema = "gatelab.compensation-profile-record.v1",
    recordType = "baseline",
    profileId = "cold-restart-profile",
    name = "Cold restart matrix",
    createdAt = "2026-07-26T00:00:00.000Z",
    note = NULL,
    scientific = scientific,
    matrixHash = matrix_hash,
    profileHash = profile_hash,
    origin = list(
      type = "uploaded",
      fileName = "cold-restart.csv",
      format = "csv",
      sourceColumnHeader = ""
    ),
    provenance = NULL,
    baselineProfileId = "cold-restart-profile",
    baselineMatrixHash = matrix_hash,
    baselineProfileHash = profile_hash,
    parentProfileId = NULL,
    revisionReason = NULL
  ),
  auto_unbox = TRUE,
  digits = NA,
  null = "null",
  na = "null"
)

counts <- rbind(
  A = c(10, 4, 8, 20),
  B = c(3, 7, 2, 12),
  pass = c(100, 101, 200, 201)
)
sce <- SingleCellExperiment::SingleCellExperiment(
  assays = list(counts = counts)
)
SummarizedExperiment::rowData(sce)$pnn <- rownames(counts)
applied <- GateLabR:::.gatelabr_apply_host_compensation(
  sce,
  dataset_id = "cold-sce",
  profile_json = profile_json,
  targets = list(list(
    sampleId = "sample-0",
    sourceAssayId = "counts",
    expectedAssayRevision = 0,
    activeLayer = "compensated"
  )),
  worker_count = 1L
)

workspace_json <- paste0(
  '{"format":"gatelab-workspace","version":2,',
  '"workspaceId":"cold-workspace",',
  '"savedAt":"2026-07-26T00:00:00Z","app":"GateLab",',
  '"samples":[{"sampleId":"cold-sce:sample-0",',
  '"fileName":"Cold sample","dataPath":"data/cold.fcs",',
  '"logicleW":{},"scatterCofactor":{},"cytofCofactor":5,',
  '"compensationOn":false,"instrumentMode":"cytof",',
  '"labels":{},"metadata":{}}],"activeSample":0,',
  '"gating":{"gates":{"gate-1":{"gate_id":"gate-1",',
  '"name":"A positive","gate_type":"rectangle",',
  '"x_channel":"A","y_channel":"B",',
  '"vertices":[[0,0],[4,4]],"color":"#e41a1c",',
  '"label_offset":null}},"gate_order":["gate-1"],',
  '"populations":{"root":{"population_id":"root",',
  '"name":"All Events","gate_refs":[],"gate_logic":"and",',
  '"parent_id":null,"children":["child"],"event_count":4,',
  '"percent_of_parent":100},"child":{"population_id":"child",',
  '"name":"A+","gate_refs":[{"gate_id":"gate-1","include":true}],',
  '"gate_logic":"and","parent_id":"root","children":[],',
  '"event_count":2,"percent_of_parent":50}},',
  '"root_population_id":"root","active_population_id":"child",',
  '"selected_gate_id":"gate-1"},',
  '"scales":{"globalScales":{"A":[0,5],"B":[0,5]}},',
  '"display":{"xChannel":"A","yChannel":"B",',
  '"mode":"pseudocolor","maxEvents":50000,"contourThreshold":5}}'
)
stored <- GateLabR:::.gatelabr_store_host_workspace(
  applied$sce,
  dataset_id = "cold-sce",
  expected_revision = 0L,
  client_revision = 1L,
  reason = "explicit",
  workspace_json = workspace_json
)
membership <- GateLabR:::.gatelabr_write_host_coldata(
  stored$sce,
  dataset_id = "cold-sce",
  workspace_revision = 1L,
  columns = list(list(
    populationId = "child",
    populationName = "A+",
    columnName = "A_positive",
    inLabel = "in",
    outLabel = "out",
    sampleMasks = list(list(
      sampleId = "sample-0",
      eventCount = 4L,
      membershipBitsBase64 = base64enc::base64encode(as.raw(5L))
    ))
  ))
)

saved_path <- tempfile(fileext = ".rds")
saveRDS(membership$sce, saved_path)
child_path <- tempfile(fileext = ".R")
child_lines <- c(
  "library(GateLabR)",
  sprintf("sce <- readRDS(%s)", deparse(saved_path)),
  "stopifnot('gatelab_compensated' %in% SummarizedExperiment::assayNames(sce))",
  "before <- digest::digest(SummarizedExperiment::assay(sce, 'gatelab_compensated'), algo='sha256')",
  "trace('.gatelabr_solve_cytof_events', tracer=quote(stop('unexpected solver invocation')), where=asNamespace('GateLabR'), print=FALSE)",
  "registered <- new.env(parent=emptyenv())",
  "session <- new.env(parent=emptyenv())",
  "session$registerDataObj <- function(name, data, filterFunc) { registered[[name]] <- data; paste0('/session/', name) }",
  "session$sendCustomMessage <- function(type, message) invisible(NULL)",
  "manifest <- GateLabR:::.gatelabr_register_host_manifest(session, sce, dataset_id='cold-sce')",
  "after <- digest::digest(SummarizedExperiment::assay(sce, 'gatelab_compensated'), algo='sha256')",
  "stopifnot(identical(before, after))",
  "stopifnot(identical(manifest$workspace$revision, 1L))",
  "stopifnot(length(manifest$compensationApplications) == 1L)",
  "stopifnot(identical(manifest$compensationApplications[[1]]$outputAssay$coordinateSpace, 'linear'))",
  "stopifnot(identical(manifest$compensationApplications[[1]]$targetSampleIds, 'sample-0'))",
  "stopifnot(identical(as.character(SummarizedExperiment::colData(sce)$A_positive), c('in','out','in','out')))",
  "stopifnot(grepl('A positive', manifest$workspace$workspaceJson, fixed=TRUE))",
  "stopifnot(length(ls(registered)) == 3L)"
)
writeLines(child_lines, child_path)
library_paths <- paste(.libPaths(), collapse = .Platform$path.sep)
status <- system2(
  file.path(R.home("bin"), "Rscript"),
  c("--vanilla", child_path),
  env = paste0("R_LIBS=", library_paths)
)
stopifnot(identical(status, 0L))
