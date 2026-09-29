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
  # The embedded importer leaves an OR population out, with everything beneath it, names it in a
  # warning and imports the rest of the file; it reads a complemented gate reference (NOT) as an
  # excluded gate, and reads EllipsoidGate. The core embedded before refused a file holding an OR
  # population outright ("uses OR logic; GateLab imports AND populations, ...").
  expect_true(grepl(
    "combines its references with OR, which GateLab cannot represent; it and anything below it were skipped.",
    core,
    fixed = TRUE
  ))
  expect_false(grepl("uses OR logic; GateLab imports AND populations", core, fixed = TRUE))
  expect_true(grepl('operation === "not" ?', core, fixed = TRUE))
  expect_true(grepl('"EllipsoidGate"', core, fixed = TRUE))

  readme <- package_readme()
  feature <- readme_gatingml_feature(readme)
  # "NOT or OR populations ... are rejected" was the retired R importer's rule, and "Files
  # containing OR populations ... are refused" the previous core's.
  expect_false(grepl("NOT or OR populations", feature, fixed = TRUE))
  expect_false(grepl("Files containing OR populations", feature, fixed = TRUE))
  expect_match(feature, "An OR population is left out, with everything beneath it, and named in a warning", fixed = TRUE)
  expect_match(feature, "ellipse", fixed = TRUE)
  table_row <- grep("Gating-ML 2.0 exchange", readme, fixed = TRUE, value = TRUE)
  expect_length(table_row, 1L)
  expect_false(grepl("positive AND", table_row, fixed = TRUE))
})

test_that("the README says which forms of an excluded gate the embedded importer reads", {
  # The core writes an excluded gate's reference with the schema's gating:use-as-complement="true"
  # and reads it, and still reads gating:complement="true", the attribute outside the Gating-ML 2.0
  # schema that GateLab wrote before. The core embedded before wrote and read only the latter, so
  # A AND NOT B from a schema-following writer imported as A AND B, with no warning, and the README
  # said so. When a core sync stops reading either attribute, this test fails until the README
  # follows.
  core <- embedded_core_source()
  expect_true(grepl('gating:use-as-complement="true"', core, fixed = TRUE))
  expect_false(grepl('gating:complement="true"', core, fixed = TRUE))
  # Both attributes are read from one reference, in one statement.
  expect_true(grepl(
    '\\(\\s*\\w+,\\s*"use-as-complement"\\)[^;]*\\(\\s*\\w+,\\s*"complement"\\)',
    core
  ))

  readme <- package_readme()
  feature <- readme_gatingml_feature(readme)
  expect_match(feature, 'gating:use-as-complement="true"', fixed = TRUE)
  expect_match(feature, 'gating:complement="true"', fixed = TRUE)
  expect_false(grepl("imported as an included gate", feature, fixed = TRUE))
  expect_false(grepl("is not yet read", feature, fixed = TRUE))
  expect_false(grepl("AND populations in which a population may exclude a gate", feature, fixed = TRUE))
  whole <- paste(readme, collapse = " ")
  expect_false(grepl("including populations that exclude a gate, can move between", whole, fixed = TRUE))
  table_row <- grep("Gating-ML 2.0 exchange", readme, fixed = TRUE, value = TRUE)
  expect_false(grepl("excluded gates", table_row, fixed = TRUE))
})

test_that("the README and DESCRIPTION describe populations that may exclude a gate", {
  # The core writes a population's excluded gate as a complemented gate reference, and reads one
  # back as an excluded gate, so "positive AND" undersells what a population can be.
  core <- embedded_core_source()
  expect_true(grepl('gating:use-as-complement="true"', core, fixed = TRUE))

  readme <- package_readme()
  expect_false(any(grepl("Positive AND", readme, fixed = TRUE)))
  start <- grep("^- \\*\\*Population trees\\.\\*\\*", readme)
  expect_length(start, 1L)
  expect_match(readme[[start]], "exclude a gate (NOT)", fixed = TRUE)

  description <- read.dcf(system.file("DESCRIPTION", package = "GateLabR"), fields = "Description")
  description <- gsub("\\s+", " ", description[[1]])
  expect_false(grepl("positive-AND", description, fixed = TRUE))
  expect_match(description, "may exclude a gate", fixed = TRUE)
})

test_that("the vignette describes Gating-ML exchange and the workspace record as the README does", {
  path <- testthat::test_path("..", "..", "vignettes", "getting-started.Rmd")
  testthat::skip_if_not(file.exists(path), "the vignette source is only in the source tree")
  vignette <- paste(readLines(path, warn = FALSE, encoding = "UTF-8"), collapse = " ")
  # FlowJo does not read Gating-ML; the README says so.
  expect_false(grepl("round-trip gates with Cytobank / FlowJo", vignette, fixed = TRUE))
  expect_match(vignette, "FlowJo does not read Gating-ML", fixed = TRUE)
  # The workspace GateLabR reloads is metadata(sce)$gatelab_workspace; gating_workspace is the
  # mirror kept for the previous interface.
  expect_match(vignette, "Workspace** is embedded in `metadata(sce)$gatelab_workspace`", fixed = TRUE)
})
