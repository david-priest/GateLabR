make_flow_gating_fixture <- function() {
  counts <- rbind(
    X = c(0, 1, 100, 101),
    Y = c(0, 1, 100, 101)
  )
  # Deliberately unrelated display values: evaluating the raw-coordinate gate
  # against this assay selects no events and recreates the original regression.
  exprs <- matrix(
    c(0, 0.1, 0.2, 0.3, 0, 0.1, 0.2, 0.3),
    nrow = 2,
    byrow = TRUE,
    dimnames = list(c("X", "Y"), NULL)
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = exprs)
  )
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  S4Vectors::metadata(sce)$gating_workspace <- list(gate_value_space = "raw")

  gates <- list(gate = list(
    gate_id = "gate",
    name = "raw gate",
    gate_type = "rectangle",
    x_channel = "X",
    y_channel = "Y",
    vertices = list(c(90, 90), c(110, 110))
  ))
  populations <- list(
    root = list(
      population_id = "root", name = "All Events", parent_id = NULL,
      children = "selected", gate_refs = list()
    ),
    selected = list(
      population_id = "selected", name = "Selected", parent_id = "root",
      children = character(0),
      gate_refs = list(list(gate_id = "gate", include = TRUE)),
      gate_logic = "and"
    )
  )
  list(sce = sce, gates = gates, populations = populations)
}

test_that("flow workspaces evaluate stored gates in raw coordinates", {
  fixture <- make_flow_gating_fixture()
  mat <- gating_matrix_for_sce(fixture$sce, assay_name = "exprs")

  expect_identical(unname(mat), unname(t(SummarizedExperiment::assay(fixture$sce, "counts"))))

  gated <- export_population_to_coldata(
    fixture$sce,
    population_id = "selected",
    pop_name = "Selected",
    gates = fixture$gates,
    populations = fixture$populations,
    root_population_id = "root",
    assay_name = "exprs",
    col_name = "selected"
  )
  expect_identical(as.character(SummarizedExperiment::colData(gated)$selected),
                   c("FALSE", "FALSE", "TRUE", "TRUE"))
})

test_that("live gating data is authoritative and validated", {
  fixture <- make_flow_gating_fixture()
  live <- t(SummarizedExperiment::assay(fixture$sce, "counts")) + 10
  expect_identical(
    unname(gating_matrix_for_sce(fixture$sce, gating_data = live)),
    unname(live)
  )
  expect_error(
    gating_matrix_for_sce(fixture$sce, gating_data = live[-1, , drop = FALSE]),
    "3 events; expected 4"
  )
})

test_that("saved compensation state is applied to raw flow gating data", {
  fixture <- make_flow_gating_fixture()
  spill <- matrix(
    c(1, 0.1, 0.2, 1),
    nrow = 2,
    byrow = TRUE,
    dimnames = list(c("X", "Y"), c("X", "Y"))
  )
  S4Vectors::metadata(fixture$sce)$comp_on <- TRUE
  S4Vectors::metadata(fixture$sce)$spillover_matrix <- spill

  raw <- t(SummarizedExperiment::assay(fixture$sce, "counts"))
  expect_equal(
    gating_matrix_for_sce(fixture$sce),
    compensate_matrix(raw, spill),
    tolerance = 1e-12
  )
})

test_that("display-space workspaces continue to use their selected assay", {
  fixture <- make_flow_gating_fixture()
  S4Vectors::metadata(fixture$sce)$instrument_type <- "cytof"
  S4Vectors::metadata(fixture$sce)$gating_workspace$gate_value_space <- "display"

  expect_identical(
    unname(gating_matrix_for_sce(fixture$sce, assay_name = "exprs")),
    unname(t(SummarizedExperiment::assay(fixture$sce, "exprs")))
  )
})

test_that("programmatic FCS export uses the same raw gating space", {
  skip_if_not_installed("flowCore")
  fixture <- make_flow_gating_fixture()
  out_dir <- tempfile("gatelabr-fcs-export-")
  dir.create(out_dir)

  paths <- export_population_as_fcs(
    fixture$sce,
    population_id = "selected",
    populations = fixture$populations,
    gates = fixture$gates,
    root_population_id = "root",
    assay_name = "counts",
    split_by_sample = FALSE,
    output_dir = out_dir
  )

  exported <- flowCore::read.FCS(paths[[1]], transformation = FALSE,
                                 truncate_max_range = FALSE)
  exported_mat <- flowCore::exprs(exported)
  expected_mat <- unname(t(SummarizedExperiment::assay(fixture$sce, "counts")))[3:4, ]
  expect_equal(dim(exported_mat), c(2L, 2L))
  expect_equal(as.numeric(exported_mat), as.numeric(expected_mat),
               tolerance = 1e-6)
})
