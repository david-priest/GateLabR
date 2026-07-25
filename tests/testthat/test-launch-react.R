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
