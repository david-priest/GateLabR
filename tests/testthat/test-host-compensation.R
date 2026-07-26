host_compensation_profile <- function(
    kind = c("cytof-spillover", "flow-spillover"),
    spill_matrix = matrix(c(1, 0.1, 0.2, 1), nrow = 2, byrow = TRUE),
    solver_version = NULL) {
  kind <- match.arg(kind)
  channels <- c("A", "B")
  scientific <- list(
    schema = "gatelab.compensation-profile.v1",
    kind = kind,
    method = if (kind == "cytof-spillover") "nnls" else "matrix-inverse",
    solverVersion = if (!is.null(solver_version)) {
      solver_version
    } else if (kind == "cytof-spillover") {
      "r-nnls-v1"
    } else {
      "r-matrix-inverse-v1"
    },
    solverSettings = if (kind == "cytof-spillover") {
      list(
        list(key = "adaptationVersion", value = "identity-backed-v1"),
        list(key = "kktTolerance", value = 1e-9),
        list(key = "maxIterations", value = 1000),
        list(key = "tolerance", value = 1e-10)
      )
    } else {
      list(
        list(key = "conditionWarningThreshold", value = 1e8),
        list(key = "singularTolerance", value = 1e-12)
      )
    },
    matrix = list(
      schema = "gatelab.compensation-matrix.v1",
      orientation = "source-rows-receiver-columns",
      sourceChannels = channels,
      receiverChannels = channels,
      matrix = lapply(seq_len(nrow(spill_matrix)), function(row) {
        unname(as.numeric(spill_matrix[row, ]))
      })
    ),
    includedChannels = if (kind == "cytof-spillover") channels else list()
  )
  matrix_record <- GateLabR:::.gatelabr_comp_matrix_record(scientific)
  matrix_hash <- GateLabR:::.gatelabr_comp_matrix_hash(matrix_record)
  profile_hash <- GateLabR:::.gatelabr_comp_profile_hash(
    scientific,
    matrix_hash
  )
  profile_id <- paste0("r-test-", sub("-spillover", "", kind))
  profile <- list(
    schema = "gatelab.compensation-profile-record.v1",
    recordType = "baseline",
    profileId = profile_id,
    name = "Host compensation test",
    createdAt = "2026-07-25T00:00:00.000Z",
    note = NULL,
    scientific = scientific,
    matrixHash = matrix_hash,
    profileHash = profile_hash,
    origin = list(
      type = "uploaded",
      fileName = "test.csv",
      format = "csv",
      sourceColumnHeader = ""
    ),
    provenance = NULL,
    baselineProfileId = profile_id,
    baselineMatrixHash = matrix_hash,
    baselineProfileHash = profile_hash,
    parentProfileId = NULL,
    revisionReason = NULL
  )
  jsonlite::toJSON(
    profile,
    auto_unbox = TRUE,
    digits = NA,
    null = "null",
    na = "null",
    dataframe = "rows",
    matrix = "rowmajor"
  )
}

host_compensation_sce <- function() {
  counts <- rbind(
    A = c(10, 4, 8, 20),
    B = c(3, 7, 2, 12),
    pass = c(100, 101, 200, 201)
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts),
    colData = S4Vectors::DataFrame(
      sample_id = c("one", "one", "two", "two")
    ),
    rowData = S4Vectors::DataFrame(
      pnn = c("A", "B", "pass"),
      row.names = rownames(counts)
    )
  )
  S4Vectors::metadata(sce)$instrument_type <- "cytof"
  sce
}

test_that("R host CyTOF Apply is transactional and preserves unchecked events", {
  sce <- host_compensation_sce()
  profile_json <- host_compensation_profile()
  handled <- GateLabR:::.gatelabr_apply_host_compensation(
    sce,
    dataset_id = "sce-test",
    profile_json = profile_json,
    targets = list(list(
      sampleId = "sample-0",
      sourceAssayId = "counts",
      expectedAssayRevision = 0,
      activeLayer = "compensated"
    )),
    worker_count = 1,
    sample_column = "sample_id"
  )

  output_name <- handled$result$output_assay_id
  expect_true(output_name %in% SummarizedExperiment::assayNames(handled$sce))
  output <- SummarizedExperiment::assay(handled$sce, output_name)
  source <- SummarizedExperiment::assay(sce, "counts")
  spill <- matrix(c(1, 0.1, 0.2, 1), nrow = 2, byrow = TRUE)
  expected <- vapply(seq_len(2), function(event) {
    nnls::nnls(t(spill), source[c("A", "B"), event])$x
  }, numeric(2))

  expect_equal(
    unname(output[c("A", "B"), 1:2]),
    unname(expected),
    tolerance = 1e-12
  )
  expect_identical(output[, 3:4], source[, 3:4])
  expect_identical(output["pass", ], source["pass", ])
  expect_identical(
    S4Vectors::metadata(handled$sce)$
      gatelabr_assay_coordinate_spaces[[output_name]],
    "linear"
  )
  expect_identical(
    S4Vectors::metadata(handled$sce)$gatelabr_assay_roles[[output_name]],
    "compensated"
  )
  expect_identical(
    handled$result$application$outputAssay$role,
    "compensated"
  )
  expect_identical(
    handled$result$application$targetSampleIds,
    "sample-0"
  )
  expect_identical(handled$result$application$execution, "computed")
})

test_that("R host flow Apply uses the conventional event by inverse convention", {
  sce <- host_compensation_sce()
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  profile_json <- host_compensation_profile("flow-spillover")
  handled <- GateLabR:::.gatelabr_apply_host_compensation(
    sce,
    dataset_id = "sce-test",
    profile_json = profile_json,
    targets = list(list(
      sampleId = "sample-0",
      sourceAssayId = "counts",
      expectedAssayRevision = 0,
      activeLayer = "compensated"
    )),
    worker_count = 1,
    sample_column = "sample_id"
  )
  output <- SummarizedExperiment::assay(
    handled$sce,
    handled$result$output_assay_id
  )
  spill <- matrix(c(1, 0.1, 0.2, 1), nrow = 2, byrow = TRUE)
  expected <- t(
    t(SummarizedExperiment::assay(sce, "counts")[c("A", "B"), 1:2]) %*%
      solve(spill)
  )
  expect_equal(
    unname(output[c("A", "B"), 1:2]),
    unname(expected),
    tolerance = 1e-12
  )
})

test_that("reapplying a profile can return a sample to the Original layer", {
  sce <- host_compensation_sce()
  profile_json <- host_compensation_profile()
  compensated <- GateLabR:::.gatelabr_apply_host_compensation(
    sce,
    dataset_id = "sce-test",
    profile_json = profile_json,
    targets = list(list(
      sampleId = "sample-0",
      sourceAssayId = "counts",
      expectedAssayRevision = 0,
      activeLayer = "compensated"
    )),
    worker_count = 1,
    sample_column = "sample_id"
  )
  original <- GateLabR:::.gatelabr_apply_host_compensation(
    compensated$sce,
    dataset_id = "sce-test",
    profile_json = profile_json,
    targets = list(list(
      sampleId = "sample-0",
      sourceAssayId = "counts",
      expectedAssayRevision = 0,
      activeLayer = "original"
    )),
    worker_count = 1,
    sample_column = "sample_id"
  )

  expect_identical(
    original$result$application$activeSampleIds,
    character(0)
  )
  expect_identical(
    original$result$application$targetSampleIds,
    "sample-0"
  )
})

test_that("the Shiny host operation returns the persisted assay resource", {
  sce <- host_compensation_sce()
  registered <- new.env(parent = emptyenv())
  session <- new.env(parent = emptyenv())
  session$registerDataObj <- function(name, data, filterFunc) {
    registered[[name]] <- list(data = data, filter = filterFunc)
    paste0("session/test/dataobj/", name)
  }
  handled <- GateLabR:::.gatelabr_handle_host_request(
    sce,
    request = list(
      operation = "apply-compensation",
      payload = list(
        contractVersion = 1,
        datasetId = "sce-test",
        profileJson = host_compensation_profile(),
        targets = list(list(
          sampleId = "sample-0",
          sourceAssayId = "counts",
          expectedAssayRevision = 0,
          activeLayer = "compensated"
        )),
        workerCount = 1
      )
    ),
    dataset_id = "sce-test",
    sample_column = "sample_id",
    session = session
  )

  expect_identical(length(handled$result$targets), 1L)
  expect_identical(handled$result$targets[[1]]$sampleId, "sample-0")
  expect_match(
    handled$result$targets[[1]]$assayUrl,
    "^session/test/dataobj/gatelabr-comp-"
  )
  expect_identical(length(ls(registered)), 1L)
  expect_true(
    handled$result$application$outputAssay$id %in%
      SummarizedExperiment::assayNames(handled$sce)
  )
})

test_that("tampered host compensation profiles are rejected before SCE mutation", {
  sce <- host_compensation_sce()
  profile <- jsonlite::fromJSON(
    host_compensation_profile(),
    simplifyVector = FALSE
  )
  profile$scientific$matrix$matrix[[1]][[2]] <- 0.5
  tampered <- jsonlite::toJSON(
    profile,
    auto_unbox = TRUE,
    digits = NA,
    null = "null",
    na = "null"
  )
  expect_error(
    GateLabR:::.gatelabr_apply_host_compensation(
      sce,
      dataset_id = "sce-test",
      profile_json = tampered,
      targets = list(list(
        sampleId = "sample-0",
        sourceAssayId = "counts",
        expectedAssayRevision = 0,
        activeLayer = "compensated"
      )),
      sample_column = "sample_id"
    ),
    "hash"
  )
  expect_identical(SummarizedExperiment::assayNames(sce), "counts")
})

test_that("an existing linear assay is adopted without recomputing its values", {
  sce <- host_compensation_sce()
  adopted_values <- SummarizedExperiment::assay(sce, "counts") + 1000
  SummarizedExperiment::assay(sce, "precomputed") <- adopted_values
  md <- S4Vectors::metadata(sce)
  md$gatelabr_assay_coordinate_spaces <- list(precomputed = "linear")
  md$gatelabr_assay_revisions <- list(precomputed = 7)
  S4Vectors::metadata(sce) <- md

  handled <- GateLabR:::.gatelabr_adopt_host_compensation(
    sce,
    dataset_id = "sce-test",
    profile_json = host_compensation_profile(
      solver_version = "r-external-precomputed-v1"
    ),
    output_assay_id = "precomputed",
    expected_output_assay_revision = 7,
    targets = list(list(
      sampleId = "sample-0",
      sourceAssayId = "counts",
      expectedAssayRevision = 0,
      activeLayer = "compensated"
    )),
    sample_column = "sample_id"
  )

  expect_identical(
    SummarizedExperiment::assay(handled$sce, "precomputed"),
    adopted_values
  )
  expect_identical(
    handled$result$application$execution,
    "adopted-existing-assay"
  )
  expect_identical(
    handled$result$application$outputAssay$revision,
    7
  )
  expect_identical(
    S4Vectors::metadata(handled$sce)$gatelabr_assay_roles$precomputed,
    "compensated"
  )
  application <- S4Vectors::metadata(handled$sce)$
    gatelabr_compensation$applications[[1]]
  expect_identical(application$managed_output, FALSE)
  expect_identical(application$output_assay_revision, 7)
})

test_that("assay adoption rejects transformed outputs and stale revisions", {
  sce <- host_compensation_sce()
  SummarizedExperiment::assay(sce, "compexprs") <-
    SummarizedExperiment::assay(sce, "counts") / 5
  profile_json <- host_compensation_profile(
    solver_version = "r-external-precomputed-v1"
  )
  targets <- list(list(
    sampleId = "sample-0",
    sourceAssayId = "counts",
    expectedAssayRevision = 0,
    activeLayer = "compensated"
  ))

  expect_error(
    GateLabR:::.gatelabr_adopt_host_compensation(
      sce,
      dataset_id = "sce-test",
      profile_json = profile_json,
      output_assay_id = "compexprs",
      expected_output_assay_revision = 0,
      targets = targets,
      sample_column = "sample_id"
    ),
    "linear"
  )

  md <- S4Vectors::metadata(sce)
  md$gatelabr_assay_coordinate_spaces <- list(compexprs = "linear")
  md$gatelabr_assay_revisions <- list(compexprs = 2)
  S4Vectors::metadata(sce) <- md
  expect_error(
    GateLabR:::.gatelabr_adopt_host_compensation(
      sce,
      dataset_id = "sce-test",
      profile_json = profile_json,
      output_assay_id = "compexprs",
      expected_output_assay_revision = 1,
      targets = targets,
      sample_column = "sample_id"
    ),
    "changed before adoption"
  )
})

test_that("computed Apply never overwrites an adopted external assay", {
  sce <- host_compensation_sce()
  adopted_values <- SummarizedExperiment::assay(sce, "counts") + 1000
  SummarizedExperiment::assay(sce, "gatelab_compensated") <- adopted_values
  md <- S4Vectors::metadata(sce)
  md$gatelabr_assay_coordinate_spaces <- list(
    gatelab_compensated = "linear"
  )
  S4Vectors::metadata(sce) <- md
  adopted <- GateLabR:::.gatelabr_adopt_host_compensation(
    sce,
    dataset_id = "sce-test",
    profile_json = host_compensation_profile(
      solver_version = "r-external-precomputed-v1"
    ),
    output_assay_id = "gatelab_compensated",
    expected_output_assay_revision = 0,
    targets = list(list(
      sampleId = "sample-0",
      sourceAssayId = "counts",
      expectedAssayRevision = 0,
      activeLayer = "compensated"
    )),
    sample_column = "sample_id"
  )
  applied <- GateLabR:::.gatelabr_apply_host_compensation(
    adopted$sce,
    dataset_id = "sce-test",
    profile_json = host_compensation_profile(),
    targets = list(list(
      sampleId = "sample-0",
      sourceAssayId = "counts",
      expectedAssayRevision = 0,
      activeLayer = "compensated"
    )),
    worker_count = 1,
    sample_column = "sample_id"
  )

  expect_identical(applied$result$output_assay_id, "gatelab_compensated_2")
  expect_identical(
    SummarizedExperiment::assay(applied$sce, "gatelab_compensated"),
    adopted_values
  )
})

test_that("the Shiny host can adopt and return an existing assay resource", {
  sce <- host_compensation_sce()
  SummarizedExperiment::assay(sce, "precomputed") <-
    SummarizedExperiment::assay(sce, "counts") + 1000
  md <- S4Vectors::metadata(sce)
  md$gatelabr_assay_coordinate_spaces <- list(precomputed = "linear")
  S4Vectors::metadata(sce) <- md
  registered <- new.env(parent = emptyenv())
  session <- new.env(parent = emptyenv())
  session$registerDataObj <- function(name, data, filterFunc) {
    registered[[name]] <- list(data = data, filter = filterFunc)
    paste0("session/test/dataobj/", name)
  }

  handled <- GateLabR:::.gatelabr_handle_host_request(
    sce,
    request = list(
      operation = "adopt-compensated-assay",
      payload = list(
        contractVersion = 1,
        datasetId = "sce-test",
        profileJson = host_compensation_profile(
          solver_version = "r-external-precomputed-v1"
        ),
        outputAssayId = "precomputed",
        expectedOutputAssayRevision = 0,
        targets = list(list(
          sampleId = "sample-0",
          sourceAssayId = "counts",
          expectedAssayRevision = 0,
          activeLayer = "compensated"
        ))
      )
    ),
    dataset_id = "sce-test",
    sample_column = "sample_id",
    session = session
  )

  expect_identical(
    handled$result$application$execution,
    "adopted-existing-assay"
  )
  expect_identical(handled$result$targets[[1]]$sampleId, "sample-0")
  expect_identical(length(ls(registered)), 1L)
})

test_that("CyTOF matrix adaptation is rectangular and identity-backed", {
  scientific <- list(
    kind = "cytof-spillover",
    matrix = list(
      schema = "gatelab.compensation-matrix.v1",
      orientation = "source-rows-receiver-columns",
      sourceChannels = c("A", "B"),
      receiverChannels = c("A", "B", "C"),
      matrix = list(
        c(1, 0.1, 0.05),
        c(0.2, 1, 0.03)
      )
    )
  )
  matrix_record <- GateLabR:::.gatelabr_comp_matrix_record(scientific)
  adapted <- GateLabR:::.gatelabr_adapt_cytof_matrix(
    matrix_record,
    c("A", "B", "C")
  )

  expect_equal(
    unname(adapted),
    rbind(
      c(1, 0.1, 0.05),
      c(0.2, 1, 0.03),
      c(0, 0, 1)
    )
  )
})

test_that("compensation hashes canonicalize signed zero", {
  expect_identical(
    GateLabR:::.gatelabr_comp_float64_hex(-0),
    GateLabR:::.gatelabr_comp_float64_hex(0)
  )
})
