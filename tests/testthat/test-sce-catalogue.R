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
