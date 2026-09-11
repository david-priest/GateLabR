test_that("the catalogue marks what cannot be switched to, and why", {
  skip_if_not_installed("SingleCellExperiment")
  env <- new.env(parent = emptyenv())
  m <- matrix(seq_len(12), nrow = 3, dimnames = list(c("CD3", "CD4", "CD8"), NULL))
  env$fine <- SingleCellExperiment::SingleCellExperiment(
    list(counts = m),
    colData = S4Vectors::DataFrame(sample_id = c("D1", "D1", "D2", "D2"))
  )
  env$no_assays <- SingleCellExperiment::SingleCellExperiment()
  env$no_sample <- SingleCellExperiment::SingleCellExperiment(list(counts = m))

  cat_ <- .gatelabr_sce_catalogue(env, active_name = "fine", sample_column = "sample_id")
  by_id <- stats::setNames(cat_, vapply(cat_, function(e) e$id, character(1)))
  expect_true(by_id$fine$loadable)
  expect_null(by_id$fine$problem)
  expect_false(by_id$no_assays$loadable)
  expect_identical(by_id$no_assays$problem, "no assays")
  expect_false(by_id$no_sample$loadable)
  expect_identical(by_id$no_sample$problem, "no colData column 'sample_id'")
  # Without a sample column the same object is fine: the partition falls back to one sample.
  expect_true(.gatelabr_sce_catalogue(env, active_name = "fine")[[3]]$loadable)
})

test_that("a workspace saved in the older plain-JSON form still counts as a workspace", {
  skip_if_not_installed("SingleCellExperiment")
  env <- new.env(parent = emptyenv())
  m <- matrix(seq_len(12), nrow = 3, dimnames = list(c("CD3", "CD4", "CD8"), NULL))
  env$legacy <- SingleCellExperiment::SingleCellExperiment(list(counts = m))
  S4Vectors::metadata(env$legacy)$gatelab_workspace <- '{"format":"gatelab-workspace","version":2}'
  env$canonical <- SingleCellExperiment::SingleCellExperiment(list(counts = m))
  S4Vectors::metadata(env$canonical)$gatelab_workspace <- list(
    format = "gatelab-sce-workspace", version = 1L, revision = 2L,
    workspace_json = '{"format":"gatelab-workspace","version":2}'
  )
  env$none <- SingleCellExperiment::SingleCellExperiment(list(counts = m))

  cat_ <- .gatelabr_sce_catalogue(env, active_name = "none")
  by_id <- stats::setNames(cat_, vapply(cat_, function(e) e$id, character(1)))
  expect_true(by_id$legacy$hasWorkspace)
  expect_true(by_id$canonical$hasWorkspace)
  expect_false(by_id$none$hasWorkspace)
})

test_that("a dataset id is derived from the object's name, one per object", {
  expect_identical(.gatelabr_dataset_id_for("sce_np4"), "sce-sce_np4")
  expect_identical(.gatelabr_dataset_id_for("my sce (v2)"), "sce-my-sce--v2-")
  expect_false(identical(.gatelabr_dataset_id_for("a"), .gatelabr_dataset_id_for("b")))
})

test_that("only SingleCellExperiments in the environment are listed", {
  skip_if_not_installed("SingleCellExperiment")
  env <- new.env(parent = emptyenv())
  m <- matrix(seq_len(12), nrow = 3, dimnames = list(c("CD3", "CD4", "CD8"), NULL))
  env$sce_a <- SingleCellExperiment::SingleCellExperiment(list(counts = m))
  env$sce_b <- SingleCellExperiment::SingleCellExperiment(list(counts = m[, 1:2, drop = FALSE]))
  env$not_an_sce <- data.frame(x = 1)
  env$a_number <- 42

  expect_identical(.gatelabr_sce_names(env), c("sce_a", "sce_b"))
})

test_that("the catalogue reports dimensions without touching assay data", {
  skip_if_not_installed("SingleCellExperiment")
  env <- new.env(parent = emptyenv())
  m <- matrix(seq_len(12), nrow = 3, dimnames = list(c("CD3", "CD4", "CD8"), NULL))
  env$sce_a <- SingleCellExperiment::SingleCellExperiment(list(counts = m))

  cat_ <- .gatelabr_sce_catalogue(env, active_name = "sce_a")
  expect_length(cat_, 1L)
  expect_identical(cat_[[1]]$id, "sce_a")
  expect_identical(cat_[[1]]$eventCount, 4L)
  expect_identical(cat_[[1]]$channelCount, 3L)
  expect_identical(cat_[[1]]$assays, "counts")
  expect_true(cat_[[1]]$active)
  expect_false(cat_[[1]]$hasWorkspace)
})

test_that("an object launched from an expression is still listed as active", {
  skip_if_not_installed("SingleCellExperiment")
  env <- new.env(parent = emptyenv())
  # launchGatingApp(sce = build()) has no name in the environment; the picker must still show
  # the object that is on screen rather than silently omitting it.
  cat_ <- .gatelabr_sce_catalogue(env, active_name = "transient")
  expect_length(cat_, 0L)
  expect_silent(.gatelabr_sce_catalogue(env, active_name = "transient"))
})

test_that("activation refuses a name that is not a SingleCellExperiment", {
  skip_if_not_installed("SingleCellExperiment")
  env <- new.env(parent = emptyenv())
  m <- matrix(seq_len(12), nrow = 3, dimnames = list(c("CD3", "CD4", "CD8"), NULL))
  env$sce_a <- SingleCellExperiment::SingleCellExperiment(list(counts = m))
  env$wrong <- data.frame(x = 1)

  expect_s4_class(.gatelabr_sce_by_name("sce_a", env), "SingleCellExperiment")
  expect_error(.gatelabr_sce_by_name("wrong", env), "not a SingleCellExperiment")
  expect_error(.gatelabr_sce_by_name("absent", env), "No object named")
  expect_error(.gatelabr_sce_by_name("", env), "single non-empty name")
})
