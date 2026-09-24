# launchGatingApp() imports Gating-ML with the embedded GateLab core, in the browser. The R host
# has no Gating-ML operation, and the R importer under inst/app/R belongs to the retired Shiny
# interface (the tests in tests/gatingml-*.R exercise that one). The README's Gating-ML claims
# must describe the embedded importer, so they are checked against the bundle here: a core sync
# that changes what the importer accepts fails this file until the README follows.

embedded_core_source <- function() {
  assets <- GateLabR:::.gatelabr_react_asset_dir()
  scripts <- list.files(assets, pattern = "\\.js$", full.names = TRUE)
  paste(
    vapply(scripts, function(path) paste(readLines(path, warn = FALSE), collapse = "\n"), ""),
    collapse = "\n"
  )
}

package_readme <- function() {
  path <- testthat::test_path("..", "..", "README.md")
  # R CMD check runs the tests against the installed package, which carries no README.
  testthat::skip_if_not(file.exists(path), "README.md is only in the source tree")
  readLines(path, warn = FALSE, encoding = "UTF-8")
}

readme_gatingml_feature <- function(readme) {
  start <- grep("Gating-ML 2.0 import / export", readme, fixed = TRUE)
  testthat::expect_length(start, 1L)
  following <- grep("^- \\*\\*", readme)
  end <- min(c(following[following > start], length(readme) + 1L)) - 1L
  paste(readme[start:end], collapse = " ")
}

test_that("the R host has no Gating-ML operation of its own", {
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = matrix(1, nrow = 1, ncol = 1, dimnames = list("CD3", NULL)))
  )
  expect_error(
    GateLabR:::.gatelabr_handle_host_request(
      sce,
      list(operation = "import-gatingml", payload = list(datasetId = "test-sce")),
      dataset_id = "test-sce"
    ),
    "Unsupported GateLab host operation 'import-gatingml'"
  )
})

test_that("the README's Gating-ML claims describe the importer launchGatingApp() runs", {
  core <- embedded_core_source()
  # The embedded importer refuses OR populations, reads a complemented gate reference (NOT) as
  # an excluded gate, and reads EllipsoidGate.
  expect_true(grepl(
    "uses OR logic; GateLab imports AND populations, with NOT on individual gate references",
    core,
    fixed = TRUE
  ))
  expect_true(grepl('operation === "not" ?', core, fixed = TRUE))
  expect_true(grepl('"EllipsoidGate"', core, fixed = TRUE))

  readme <- package_readme()
  feature <- readme_gatingml_feature(readme)
  # "NOT or OR populations ... are rejected" was the retired R importer's rule.
  expect_false(grepl("NOT or OR populations", feature, fixed = TRUE))
  expect_match(feature, "OR populations", fixed = TRUE)
  expect_match(feature, "exclude a gate (NOT)", fixed = TRUE)
  expect_match(feature, "ellipse", fixed = TRUE)
  table_row <- grep("Gating-ML 2.0 exchange", readme, fixed = TRUE, value = TRUE)
  expect_length(table_row, 1L)
  expect_false(grepl("positive AND", table_row, fixed = TRUE))
})
