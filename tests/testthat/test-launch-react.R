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

test_that("React launcher UI brings no stylesheet but GateLab's own", {
  rendered <- htmltools::renderTags(GateLabR:::.gatelabr_react_ui("gatelabr-test-core"))
  dependencies <- vapply(rendered$dependencies, function(dep) dep$name, character(1))

  # Bootstrap restyles the embedded app: labels, <summary>, the root font size.
  expect_false("bootstrap" %in% dependencies)
  expect_match(rendered$head, "<title>GateLabR</title>", fixed = TRUE)
  expect_match(rendered$head, "/gatelabr-test-core/gatelab-embed.css", fixed = TRUE)
})

test_that("launchGatingApp delegates to the shared React SCE launcher", {
  captured <- NULL
  testthat::local_mocked_bindings(
    launchReactGateLab = function(
        sce = NULL,
        sample_column = NULL,
        port = NULL,
        launch.browser = TRUE,
        sce_name = NULL,
        agent = NULL,
        blocking = NULL) {
      captured <<- list(
        sce = sce,
        sample_column = sample_column,
        port = port,
        launch.browser = launch.browser,
        sce_name = sce_name,
        agent = agent,
        blocking = blocking
      )
      invisible(NULL)
    },
    .package = "GateLabR"
  )

  expect_invisible(GateLabR::launchGatingApp(
    sce = "sentinel",
    sample_column = "sample_id",
    port = 3325,
    launch.browser = FALSE,
    blocking = TRUE
  ))
  expect_identical(captured, list(
    sce = "sentinel",
    sample_column = "sample_id",
    port = 3325,
    launch.browser = FALSE,
    # A literal is not a symbol, so there is no caller variable to write back to.
    sce_name = "",
    agent = NULL,
    blocking = TRUE
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
        sce_name = NULL,
        agent = NULL,
        blocking = NULL) {
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
  # The previous GateLabR-specific Shiny UI is retired. The entry point survives
  # only to explain itself, so it must error rather than start an application.
  expect_error(environment$launchLegacyGateLabR(), "defunct")
  expect_error(GateLabR::launchLegacyGateLabR(), "defunct")
})

# The launcher's two ways of running the app, with Shiny's part played by fakes that keep to
# its contract: onStart() runs when the app starts, and the callbacks given to onStop() run
# when it stops, whether runApp() returns or a handle's stop() is called.
make_launch_sce <- function() {
  counts <- matrix(c(1, 2, 3, 4, 5, 6), nrow = 2, dimnames = list(c("CD3", "CD19"), paste0("event", 1:3)))
  SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(sample_id = c("D1", "D1", "D2"))
  )
}

local_launch_fakes <- function(start_app, env = parent.frame()) {
  record <- new.env(parent = emptyenv())
  record$stop_callbacks <- list()
  record$backend_stops <- 0L
  record$warned <- character(0)
  record$run_app <- NULL
  assets <- withr::local_tempdir(.local_envir = env)
  testthat::local_mocked_bindings(
    .gatelabr_react_asset_dir = function() assets,
    .gatelabr_start_compensation_backend = function() "backend",
    .gatelabr_stop_compensation_backend = function(backend) record$backend_stops <- record$backend_stops + 1L,
    .gatelabr_warn_memberships_at_stop = function(sce_name) record$warned <- c(record$warned, sce_name),
    .gatelabr_start_app_fn = function() start_app,
    .package = "GateLabR",
    .env = env
  )
  testthat::local_mocked_bindings(
    onStop = function(fun, session = NULL) record$stop_callbacks <- c(record$stop_callbacks, fun),
    runApp = function(appDir, port = NULL, launch.browser = TRUE, ...) {
      record$run_app <- list(app = appDir, port = port, launch.browser = launch.browser)
      appDir$onStart()
      for (callback in record$stop_callbacks) callback()
      invisible(NULL)
    },
    .package = "shiny",
    .env = env
  )
  record
}

test_that("without a background start the launcher blocks, and the app's stop clears up once", {
  sce_name <- ".gatelabr_blocking_launch_test_sce"
  on.exit(if (exists(sce_name, envir = .GlobalEnv, inherits = FALSE)) rm(list = sce_name, envir = .GlobalEnv), add = TRUE)
  live <- GateLabR:::.gatelabr_live
  on.exit(rm(list = ls(live, all.names = TRUE), envir = live), add = TRUE)
  record <- local_launch_fakes(start_app = NULL)
  object <- make_launch_sce()

  messages <- character(0)
  result <- withCallingHandlers(
    GateLabR::launchReactGateLab(object, sce_name = sce_name, launch.browser = FALSE),
    message = function(condition) {
      messages <<- c(messages, conditionMessage(condition))
      invokeRestart("muffleMessage")
    }
  )
  expect_null(result)
  expect_match(messages, "the prompt returns when the app stops", all = FALSE)
  expect_match(messages, "shiny 1.14.0 or later runs the app in the background", all = FALSE)
  expect_identical(record$run_app$launch.browser, FALSE)
  expect_s3_class(record$run_app$app, "shiny.appobj")
  # The stop callback ran once at the app's stop, and the on.exit afterwards did not run it again.
  expect_identical(record$backend_stops, 1L)
  expect_identical(record$warned, sce_name)
  expect_null(live$handle)
  expect_null(live$sce_name)
  expect_identical(get(sce_name, envir = .GlobalEnv), object)
  expect_error(
    GateLabR::launchReactGateLab(object, sce_name = sce_name, launch.browser = FALSE, blocking = FALSE),
    "blocking = FALSE needs shiny 1.14.0 or later"
  )
  expect_error(
    GateLabR::launchReactGateLab(object, sce_name = sce_name, launch.browser = FALSE, blocking = "later"),
    "must be NULL, TRUE or FALSE"
  )
})

test_that("with a background start the launcher returns the handle, and the console can stop it", {
  sce_name <- ".gatelabr_background_launch_test_sce"
  on.exit(if (exists(sce_name, envir = .GlobalEnv, inherits = FALSE)) rm(list = sce_name, envir = .GlobalEnv), add = TRUE)
  live <- GateLabR:::.gatelabr_live
  on.exit(rm(list = ls(live, all.names = TRUE), envir = live), add = TRUE)
  starts <- list()
  stops <- 0L
  record <- NULL
  start_app <- function(appDir, port = NULL, launch.browser = TRUE, ...) {
    starts[[length(starts) + 1L]] <<- list(app = appDir, port = port, launch.browser = launch.browser)
    appDir$onStart()
    callbacks <- record$stop_callbacks
    record$stop_callbacks <- list()
    list(
      stop = function() {
        stops <<- stops + 1L
        for (callback in callbacks) callback()
      },
      url = function() "http://127.0.0.1:4242/",
      status = function() "running"
    )
  }
  record <- local_launch_fakes(start_app = start_app)
  object <- make_launch_sce()

  messages <- character(0)
  handle <- withCallingHandlers(
    GateLabR::launchReactGateLab(object, sce_name = sce_name, port = 4242, launch.browser = FALSE),
    message = function(condition) {
      messages <<- c(messages, conditionMessage(condition))
      invokeRestart("muffleMessage")
    }
  )
  expect_match(messages, "running at http://127.0.0.1:4242/ and the prompt is yours", all = FALSE)
  expect_match(messages, "gatelabSync(\".gatelabr_background_launch_test_sce\")", fixed = TRUE, all = FALSE)
  expect_identical(starts[[1]]$port, 4242)
  expect_identical(starts[[1]]$launch.browser, FALSE)
  expect_null(record$run_app)
  expect_identical(live$handle, handle)
  expect_identical(live$sce_name, sce_name)
  expect_identical(live$address, GateLabR:::.gatelabr_object_address(get(sce_name, envir = .GlobalEnv)))
  expect_true(is.function(live$set_sce))
  # Nothing is cleared while the app runs.
  expect_identical(record$backend_stops, 0L)
  expect_length(record$warned, 0L)

  # A second launch stops the running app first; its stop clears up and warns for its object.
  other_name <- ".gatelabr_background_launch_test_other"
  on.exit(if (exists(other_name, envir = .GlobalEnv, inherits = FALSE)) rm(list = other_name, envir = .GlobalEnv), add = TRUE)
  expect_message(
    second <- GateLabR::launchReactGateLab(object, sce_name = other_name, launch.browser = FALSE),
    "stopping the app running on `.gatelabr_background_launch_test_sce`"
  )
  expect_identical(stops, 1L)
  expect_identical(record$backend_stops, 1L)
  expect_identical(record$warned, sce_name)
  expect_identical(live$handle, second)
  expect_identical(live$sce_name, other_name)

  # gatelabStop() stops it from the console; the record is cleared and the warning said.
  expect_true(GateLabR::gatelabStop())
  expect_identical(stops, 2L)
  expect_identical(record$backend_stops, 2L)
  expect_identical(record$warned, c(sce_name, other_name))
  expect_null(live$handle)
  expect_null(live$sce_name)
  expect_message(GateLabR::gatelabStop(), "no app is running")

  # blocking = TRUE still blocks with a background start available.
  expect_message(
    GateLabR::launchReactGateLab(object, sce_name = sce_name, launch.browser = FALSE, blocking = TRUE),
    "blocking = TRUE, so the prompt returns when the app stops"
  )
  expect_s3_class(record$run_app$app, "shiny.appobj")
  expect_identical(record$backend_stops, 3L)
})

test_that("the page tells the app which build it is, in the form a version or a commit takes", {
  dir <- tempfile("gatelabr-core-")
  dir.create(dir)
  on.exit(unlink(dir, recursive = TRUE), add = TRUE)
  writeLines(
    '{"schemaVersion": 1, "sourceCommit": "89abcdef0123456789abcdef0123456789abcdef"}',
    file.path(dir, "CORE_PROVENANCE.json")
  )
  build <- GateLabR:::.gatelabr_build_identity(dir)
  expect_identical(build$coreCommit, "89abcdef0123456789abcdef0123456789abcdef")
  expect_match(build$hostVersion, "^[0-9]+\\.[0-9]+\\.[0-9]+")
  expect_match(GateLabR:::.gatelabr_build_label(build), "^GateLabR [0-9.]+.* GateLab core 89abcde$")

  rendered <- htmltools::renderTags(GateLabR:::.gatelabr_react_ui("gatelabr-test-core", build))
  expect_match(rendered$html, "createShinySceHost({\"build\":{", fixed = TRUE)
  expect_match(rendered$html, "\"coreCommit\":\"89abcdef0123456789abcdef0123456789abcdef\"", fixed = TRUE)

  # A record that is not a commit is left out, and a core with no record still launches.
  writeLines('{"sourceCommit": "</script><script>alert(1)"}', file.path(dir, "CORE_PROVENANCE.json"))
  expect_null(GateLabR:::.gatelabr_build_identity(dir)$coreCommit)
  expect_null(GateLabR:::.gatelabr_build_identity(tempfile("absent-"))$coreCommit)
  expect_match(GateLabR:::.gatelabr_build_label(list()), "version unknown.*commit unknown")
  bare <- htmltools::renderTags(GateLabR:::.gatelabr_react_ui("gatelabr-test-core"))
  expect_match(bare$html, "createShinySceHost()", fixed = TRUE)
})

test_that("the app keeps one port from session to session unless told otherwise", {
  old <- options(gatelabr.port = NULL, shiny.port = NULL)
  on.exit(options(old), add = TRUE)

  # options(gatelabr.port = FALSE), or a port set for every Shiny app, leaves the choice to Shiny.
  options(gatelabr.port = FALSE)
  expect_null(GateLabR:::.gatelabr_default_port())
  options(gatelabr.port = NULL, shiny.port = 5555L)
  expect_null(GateLabR:::.gatelabr_default_port())
  options(shiny.port = NULL)

  testthat::local_mocked_bindings(.gatelabr_port_is_free = function(port) TRUE, .package = "GateLabR")
  # Unset, it is 4283.
  expect_identical(GateLabR:::.gatelabr_default_port(), 4283L)
  options(gatelabr.port = 4411)
  expect_identical(GateLabR:::.gatelabr_default_port(), 4411L)
  options(gatelabr.port = "not a port")
  expect_warning(expect_null(GateLabR:::.gatelabr_default_port()), "not a port number")

  # In use, for instance by a second session: Shiny chooses, and the user is told why.
  options(gatelabr.port = 4283L)
  testthat::local_mocked_bindings(.gatelabr_port_is_free = function(port) FALSE, .package = "GateLabR")
  expect_message(expect_null(GateLabR:::.gatelabr_default_port()), "port 4283 is in use")
})

test_that("a port is found in use by connecting to it", {
  port <- 47283L
  socket <- tryCatch(serverSocket(port), error = function(cause) NULL)
  skip_if(is.null(socket), "the test's port is taken")
  on.exit(try(close(socket), silent = TRUE), add = TRUE)
  expect_false(GateLabR:::.gatelabr_port_is_free(port))
  close(socket)
  expect_true(GateLabR:::.gatelabr_port_is_free(port))
})
