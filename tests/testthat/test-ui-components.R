if (!exists("%||%")) `%||%` <- function(a, b) if (!is.null(a)) a else b
tags <- shiny::tags
source(file.path(app_r_dir, "ui_components.R"))

test_that("fill-first picker columns preserve reading order", {
  layout <- layout_fill_first_columns(letters[1:10], visible_rows = 4, max_columns = 4)

  expect_equal(lengths(layout$columns), c(4L, 4L, 2L))
  expect_identical(unlist(layout$columns, use.names = FALSE), letters[1:10])
  expect_false(layout$last_column_scrollable)
})

test_that("overflow is confined to the final picker column", {
  layout <- layout_fill_first_columns(seq_len(20), visible_rows = 4, max_columns = 4)

  expect_equal(lengths(layout$columns), c(4L, 4L, 4L, 8L))
  expect_identical(unlist(layout$columns, use.names = FALSE), seq_len(20))
  expect_true(layout$last_column_scrollable)
})

test_that("multi-column picker retains Shiny checkbox-group semantics", {
  ui <- multi_column_checkbox_group(
    "channels",
    choices = c("Channel A" = "A", "Channel B" = "B", "Channel C" = "C"),
    selected = c("B"),
    visible_rows = 2,
    max_columns = 4,
    depths = c(A = 0, B = 1, C = 0)
  )
  html <- as.character(htmltools::renderTags(ui)$html)

  expect_match(html, 'id="channels"', fixed = TRUE)
  expect_match(html, 'class="form-group shiny-input-checkboxgroup shiny-input-container', fixed = TRUE)
  expect_equal(length(gregexpr('name="channels"', html, fixed = TRUE)[[1]]), 3L)
  expect_match(html, 'value="B" checked="checked"', fixed = TRUE)
  expect_match(html, 'padding-left:10px', fixed = TRUE)
  expect_equal(length(gregexpr('class="glr-multi-picker-column(?: |")', html, perl = TRUE)[[1]]), 2L)
})
