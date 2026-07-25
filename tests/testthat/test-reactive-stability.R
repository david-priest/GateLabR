read_app_source <- function() {
  source_app <- normalizePath(
    testthat::test_path("..", "..", "inst", "app", "app.R"),
    mustWork = FALSE
  )
  app_path <- if (file.exists(source_app)) {
    source_app
  } else {
    system.file("app", "app.R", package = "GateLabR", mustWork = TRUE)
  }
  paste(readLines(app_path, warn = FALSE), collapse = "\n")
}

test_that("population-tree cache bookkeeping is isolated from renderUI", {
  app_source <- read_app_source()

  expect_match(
    app_source,
    "cached_key <- isolate(rv$.population_tree_cache_key)",
    fixed = TRUE
  )
  expect_match(
    app_source,
    "cached_value <- isolate(rv$.population_tree_cache)",
    fixed = TRUE
  )
  expect_match(
    app_source,
    "isolate({\n      rv$.population_tree_cache_key <- cache_key",
    fixed = TRUE
  )
})
