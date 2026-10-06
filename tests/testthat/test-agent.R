test_that("the relay address comes from the argument or the relay's file, and is checked", {
  resolve <- GateLabR:::.gatelabr_agent_relay_url
  expect_null(resolve(NULL))
  expect_null(resolve(FALSE))
  expect_identical(resolve("ws://127.0.0.1:48123/?token=abc"), "ws://127.0.0.1:48123/?token=abc")
  expect_identical(resolve("wss://127.0.0.1:1/"), "wss://127.0.0.1:1/")
  expect_error(resolve("http://127.0.0.1:48123/"), "ws:// address")
  expect_error(resolve(42), "ws:// address")
  file <- tempfile(fileext = ".json")
  withr::local_options(list(gatelabr.agent_relay_file = file))
  expect_error(resolve(TRUE), "no relay has recorded its address")
  writeLines('{"token":"abc","port":48123,"url":"ws://127.0.0.1:48123/?token=abc"}', file)
  expect_identical(resolve(TRUE), "ws://127.0.0.1:48123/?token=abc")
  writeLines('{"token":"abc"}', file)
  expect_error(resolve(TRUE), "records no address")
  writeLines("{not json", file)
  expect_error(resolve(TRUE), "could not be read")
})

test_that("the tab opens with the relay address on the page URL, encoded", {
  page <- GateLabR:::.gatelabr_agent_page_url("http://127.0.0.1:1234", "ws://127.0.0.1:48123/?token=a+b")
  expect_identical(page, "http://127.0.0.1:1234/?agent=ws%3A%2F%2F127.0.0.1%3A48123%2F%3Ftoken%3Da%2Bb")
  expect_identical(GateLabR:::.gatelabr_agent_page_url("http://127.0.0.1:1234/", "ws://x/"), "http://127.0.0.1:1234/?agent=ws%3A%2F%2Fx%2F")
  opened <- NULL
  withr::local_options(list(browser = function(url) opened <<- url))
  open <- GateLabR:::.gatelabr_agent_browser("ws://127.0.0.1:48123/?token=abc")
  expect_message(open("http://127.0.0.1:1234"), "connects to the agent relay")
  expect_identical(opened, "http://127.0.0.1:1234/?agent=ws%3A%2F%2F127.0.0.1%3A48123%2F%3Ftoken%3Dabc")
})

test_that("launchGatingApp forwards agent to the React launcher", {
  captured <- NULL
  testthat::local_mocked_bindings(
    launchReactGateLab = function(
        sce = NULL,
        sample_column = NULL,
        port = NULL,
        launch.browser = TRUE,
        sce_name = NULL,
        agent = NULL) {
      captured <<- list(sce_name = sce_name, agent = agent)
      invisible(NULL)
    },
    .package = "GateLabR"
  )
  my_sce <- "sentinel"
  GateLabR::launchGatingApp(my_sce, agent = TRUE)
  expect_identical(captured, list(sce_name = "my_sce", agent = TRUE))
  GateLabR::launchGatingApp(my_sce)
  expect_null(captured$agent)
})
