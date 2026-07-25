read_main_plot_js <- function() {
  source_js <- normalizePath(
    testthat::test_path("..", "..", "inst", "app", "www", "cytof_plot.js"),
    mustWork = FALSE
  )
  js_path <- if (file.exists(source_js)) {
    source_js
  } else {
    system.file("app", "www", "cytof_plot.js", package = "GateLabR", mustWork = TRUE)
  }
  paste(readLines(js_path, warn = FALSE), collapse = "\n")
}

test_that("navigation uses pointer capture and cleans up interrupted gestures", {
  js <- read_main_plot_js()

  expect_match(js, "setPointerCapture(event.pointerId)", fixed = TRUE)
  expect_match(js, "releasePointerCapture(_pan.pointerId)", fixed = TRUE)
  expect_match(js, "window.addEventListener('pointercancel', _onPanCancel, true)", fixed = TRUE)
  expect_match(js, "window.addEventListener('blur', _onPanCancel, true)", fixed = TRUE)
  expect_match(js, "document.addEventListener('visibilitychange'", fixed = TRUE)
})

test_that("Shift and Option are live stretch modifiers", {
  js <- read_main_plot_js()

  expect_match(js, "var wantsStretch = !!(event.altKey || event.shiftKey);", fixed = TRUE)
  expect_match(js, "_rebasePan(event, wantsStretch);", fixed = TRUE)
  expect_false(grepl("alt: !!(event.altKey || event.shiftKey)", js, fixed = TRUE))
})
