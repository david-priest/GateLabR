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
        launch.browser = TRUE) {
      captured <<- list(
        sce = sce,
        sample_column = sample_column,
        port = port,
        launch.browser = launch.browser
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
    launch.browser = FALSE
  ))
})

test_that("source-clone launcher exposes both default and legacy entry points", {
  source_launcher <- test_path("..", "..", "launch.R")
  skip_if_not(
    file.exists(source_launcher),
    "source-clone launcher is not included in the installed package test tree"
  )
  environment <- new.env(parent = globalenv())
  sys.source(source_launcher, envir = environment)

  expect_true(is.function(environment$launchGatingApp))
  expect_true(is.function(environment$launchReactGateLab))
  expect_true(is.function(environment$launchLegacyGateLabR))
})
