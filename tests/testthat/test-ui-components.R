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

test_that("sample selection is explicit while metadata filters narrow it", {
  expect_identical(
    resolve_sample_table_rows(NULL, NULL, 4),
    1:4
  )
  expect_identical(
    resolve_sample_table_rows(c(2, 3, 4), c(1, 3, 4), 4),
    c(3L, 4L)
  )
  expect_identical(
    resolve_sample_table_rows(NULL, integer(0), 4),
    integer(0)
  )
})

test_that("sample row normalization handles DT zero-based indices", {
  expect_identical(normalize_sample_table_rows(c(0, 2), 4), c(1L, 3L))
  expect_null(normalize_sample_table_rows(NULL, 4))
  expect_identical(normalize_sample_table_rows(integer(0), 4), integer(0))
})
