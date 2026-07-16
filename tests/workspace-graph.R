app_dir <- file.path("inst", "app")
if (!dir.exists(app_dir)) {
  app_dir <- system.file("app", package = "GateLabR")
}
source(file.path(app_dir, "R", "workspace.R"))

expect_error <- function(expr, pattern) {
  message <- tryCatch({
    force(expr)
    NULL
  }, error = function(e) conditionMessage(e))
  if (is.null(message) || !grepl(pattern, message, ignore.case = TRUE)) {
    stop("Expected error matching /", pattern, "/, got: ", message %||% "<no error>")
  }
}

`%||%` <- function(a, b) if (!is.null(a)) a else b

gate <- function(id, x = "A", y = "B") {
  list(
    gate_id = id, name = id, gate_type = "rectangle",
    x_channel = x, y_channel = y,
    vertices = list(c(0, 0), c(1, 1)),
    color = "#000000", label_offset = c(0, 0)
  )
}

population <- function(id, parent_id, children = character(0), refs = list()) {
  list(
    population_id = id, name = id, gate_refs = refs, gate_logic = "and",
    parent_id = parent_id, children = children,
    event_count = NULL, percent_of_parent = NULL
  )
}

ref <- function(id, include = TRUE) list(gate_id = id, include = include)

valid_workspace <- function() {
  list(
    gates = list(g1 = gate("g1"), g2 = gate("g2", x = "X")),
    gate_order = c("g1", "g2"),
    populations = list(
      root = population("root", NULL, children = c("p1", "p3")),
      p1 = population("p1", "root", children = "p2", refs = list(ref("g1"), ref("g2"))),
      p2 = population("p2", "p1", refs = list(ref("g1"))),
      p3 = population("p3", "root", refs = list(ref("g1")))
    ),
    root_population_id = "root"
  )
}

ws <- valid_workspace()
stopifnot(isTRUE(validate_workspace_graph(ws)))

# Older workspaces without an explicit gate_order remain loadable after normalization.
legacy <- ws
legacy$gate_order <- NULL
legacy <- normalize_workspace_graph(legacy)
stopifnot(identical(legacy$gate_order, c("g1", "g2")))
stopifnot(isTRUE(validate_workspace_graph(legacy)))

dangling <- ws
dangling$populations$p3$gate_refs[[1]]$gate_id <- "missing"
expect_error(validate_workspace_graph(dangling), "dangling gate reference")

bad_links <- ws
bad_links$populations$root$children <- "p1"
expect_error(validate_workspace_graph(bad_links), "absent from its parent's children")

cycle <- ws
cycle$populations$root$children <- "p3"
cycle$populations$p1$parent_id <- "p2"
cycle$populations$p1$children <- "p2"
cycle$populations$p2$parent_id <- "p1"
cycle$populations$p2$children <- "p1"
expect_error(validate_workspace_graph(cycle), "cycle")

bad_order <- ws
bad_order$gate_order <- "g1"
expect_error(validate_workspace_graph(bad_order), "gate_order does not match")

# g2 uses missing channel X. p1 references g1 AND g2, so removing only g2 would
# broaden p1. The safe result removes p1 and its child p2, while unrelated p3 survives.
pruned <- prune_workspace_for_channels(ws, c("A", "B"))
stopifnot(identical(pruned$invalid_gate_ids, "g2"))
stopifnot(setequal(pruned$removed_population_ids, c("p1", "p2")))
stopifnot(setequal(names(pruned$workspace$populations), c("root", "p3")))
stopifnot(identical(pruned$workspace$populations$root$children, "p3"))
stopifnot(identical(names(pruned$workspace$gates), "g1"))
stopifnot(isTRUE(validate_workspace_graph(pruned$workspace)))

quadrant <- list(
  gate_id = "q1", name = "quadrant", gate_type = "quadrant",
  x_channel = "A", y_channel = "B", center = c(0.5, 0.5),
  color = "#000000", label_offset = c(0, 0)
)
quadrant_ws <- list(
  gates = list(q1 = quadrant), gate_order = "q1",
  populations = list(
    root = population("root", NULL, children = "qpop"),
    qpop = population("qpop", "root", refs = list(c(ref("q1"), list(quadrant = 3L))))
  ),
  root_population_id = "root"
)
stopifnot(isTRUE(validate_workspace_graph(quadrant_ws)))
quadrant_ws$populations$qpop$gate_refs[[1]]$quadrant <- NULL
expect_error(validate_workspace_graph(quadrant_ws), "invalid quadrant reference")
