test_that("React launcher UI mounts the shared GateLab module", {
  ui <- GateLabR:::.gatelabr_react_ui("gatelabr-test-core")
  rendered <- htmltools::renderTags(ui)
  html <- paste(rendered$head, rendered$html)

  expect_match(html, "gatelabr-react-root", fixed = TRUE)
  expect_match(html, "/gatelabr-test-core/gatelab-embed.css", fixed = TRUE)
  expect_match(html, "createShinySceHost", fixed = TRUE)
  expect_match(html, "mountGateLab", fixed = TRUE)
  expect_match(html, "start\\(\\);")
})

test_that("launchGatingApp delegates to the shared React SCE launcher", {
  captured <- NULL
  testthat::local_mocked_bindings(
    launchReactGateLab = function(
        sce = NULL,
        sample_column = NULL,
        port = NULL,
        launch.browser = TRUE,
        sce_name = NULL) {
      captured <<- list(
        sce = sce,
        sample_column = sample_column,
        port = port,
        launch.browser = launch.browser,
        sce_name = sce_name
      )
      invisible(NULL)
    },
    .package = "GateLabR"
  )

  expect_invisible(GateLabR::launchGatingApp(
    sce = "sentinel",
    sample_column = "sample_id",
    port = 3325,
    launch.browser = FALSE
  ))
  expect_identical(captured, list(
    sce = "sentinel",
    sample_column = "sample_id",
    port = 3325,
    launch.browser = FALSE,
    # A literal is not a symbol, so there is no caller variable to write back to.
    sce_name = ""
  ))
})

test_that("launchGatingApp forwards the caller's own symbol for SCE writeback", {
  # Regression: launchGatingApp(my_sce) used to reach launchReactGateLab as the
  # wrapper's local symbol `sce`, so every gate/population/colData write landed
  # on a global literally named "sce" and the user's object was never updated.
  captured <- NULL
  testthat::local_mocked_bindings(
    launchReactGateLab = function(
        sce = NULL,
        sample_column = NULL,
        port = NULL,
        launch.browser = TRUE,
        sce_name = NULL) {
      captured <<- sce_name
      invisible(NULL)
    },
    .package = "GateLabR"
  )

  sce_np2 <- "sentinel"
  GateLabR::launchGatingApp(sce_np2, launch.browser = FALSE)
  expect_identical(captured, "sce_np2")
  expect_false(identical(captured, "sce"))

  # An inline expression has no symbol to write back to; the callee then falls
  # through to its explicit default rather than assigning to a garbage name.
  GateLabR::launchGatingApp(identity("sentinel"), launch.browser = FALSE)
  expect_identical(captured, "")
})

test_that("source-clone launcher exposes one React entry point and no legacy UI", {
  source_launcher <- test_path("..", "..", "launch.R")
  skip_if_not(
    file.exists(source_launcher),
    "source-clone launcher is not included in the installed package test tree"
  )
  environment <- new.env(parent = globalenv())
  sys.source(source_launcher, envir = environment)

  expect_true(is.function(environment$launchGatingApp))
  expect_true(is.function(environment$launchReactGateLab))
  # The previous GateLabR-specific Shiny UI is retired: there must be no way to
  # start it, from a source clone or an installed package.
  expect_null(environment$launchLegacyGateLabR)
  expect_false(exists("launchLegacyGateLabR", envir = asNamespace("GateLabR")))
})
