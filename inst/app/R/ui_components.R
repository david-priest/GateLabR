# Compact UI primitives shared by dense analysis tabs.

control_row <- function(label, ..., class = NULL) {
  tags$div(
    class = paste(c("glr-control-row", class), collapse = " "),
    tags$div(class = "glr-control-row-label", label),
    tags$div(class = "glr-control-row-body", ...)
  )
}

inline_field <- function(label, control, class = NULL, title = NULL) {
  tags$div(
    class = paste(c("glr-inline-field", class), collapse = " "),
    title = title,
    tags$span(class = "glr-inline-field-label", label),
    control
  )
}

inline_check <- function(control, class = NULL) {
  tags$div(
    class = paste(c("glr-inline-check", class), collapse = " "),
    control
  )
}

control_separator <- function() {
  tags$span(class = "glr-control-separator", `aria-hidden` = "true")
}

control_hint <- function(...) {
  tags$span(class = "glr-control-hint", ...)
}

# Split a reading-order vector into at most `max_columns`, filling each visible
# column from top to bottom before moving right. When there are more entries than
# the visible grid can hold, the final column receives the remainder and scrolls.
layout_fill_first_columns <- function(items, visible_rows = 10L, max_columns = 4L) {
  visible_rows <- max(1L, as.integer(visible_rows))
  max_columns <- max(1L, as.integer(max_columns))
  n <- length(items)
  if (n == 0L) {
    return(list(columns = list(), last_column_scrollable = FALSE))
  }

  n_columns <- min(max_columns, max(1L, ceiling(n / visible_rows)))
  columns <- vector("list", n_columns)
  for (column_index in seq_len(n_columns)) {
    first <- (column_index - 1L) * visible_rows + 1L
    last <- if (column_index == n_columns) n else min(column_index * visible_rows, n)
    columns[[column_index]] <- items[seq.int(first, last)]
  }

  list(
    columns = columns,
    last_column_scrollable = n > (visible_rows * max_columns)
  )
}

# A compact checkboxGroupInput-compatible control with deterministic fill-down
# columns. It keeps Shiny's standard checkbox-group DOM contract, so
# updateCheckboxGroupInput() and input[[id]] continue to work normally.
multi_column_checkbox_group <- function(input_id, choices, selected = character(0),
                                        visible_rows = 10L, max_columns = 4L,
                                        aria_label = NULL, depths = NULL,
                                        class = NULL) {
  values <- as.character(unname(choices))
  labels <- names(choices)
  if (is.null(labels)) labels <- values
  labels[!nzchar(labels)] <- values[!nzchar(labels)]
  selected <- as.character(selected %||% character(0))

  if (is.null(depths)) {
    depths <- integer(length(values))
  } else if (!is.null(names(depths))) {
    depths <- as.integer(depths[values])
  } else {
    depths <- rep_len(as.integer(depths), length(values))
  }
  depths[is.na(depths)] <- 0L

  rows <- lapply(seq_along(values), function(i) {
    shiny::tags$div(
      class = "checkbox glr-multi-picker-item",
      style = if (depths[i] > 0L) paste0("padding-left:", depths[i] * 10L, "px;") else NULL,
      shiny::tags$label(
        shiny::tags$input(
          type = "checkbox", name = input_id, value = values[i],
          checked = if (values[i] %in% selected) "checked" else NULL
        ),
        shiny::tags$span(class = "glr-multi-picker-label", title = labels[i], labels[i])
      )
    )
  })
  layout <- layout_fill_first_columns(rows, visible_rows, max_columns)
  n_columns <- max(1L, length(layout$columns))
  height_px <- visible_rows * 21L + 10L

  shiny::tags$div(
    id = input_id,
    class = paste(c(
      "form-group shiny-input-checkboxgroup shiny-input-container glr-multi-picker-input",
      class
    ), collapse = " "),
    role = "group",
    `aria-labelledby` = paste0(input_id, "-label"),
    `aria-label` = aria_label,
    shiny::tags$label(
      class = "control-label shiny-label-null", `for` = input_id,
      id = paste0(input_id, "-label")
    ),
    shiny::tags$div(
      class = "glr-multi-picker-columns",
      style = paste0(
        "height:", height_px, "px;grid-template-columns:repeat(",
        n_columns, ",minmax(0,1fr));"
      ),
      lapply(seq_along(layout$columns), function(column_index) {
        is_scrollable <- layout$last_column_scrollable &&
          column_index == length(layout$columns)
        shiny::tags$div(
          class = paste(
            "glr-multi-picker-column",
            if (is_scrollable) "is-scrollable" else NULL
          ),
          layout$columns[[column_index]]
        )
      })
    )
  )
}
