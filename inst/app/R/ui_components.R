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
