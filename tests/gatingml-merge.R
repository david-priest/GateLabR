source_app_r_dir <- file.path(getwd(), "inst", "app", "R")
app_r_dir <- if (dir.exists(source_app_r_dir)) {
  source_app_r_dir
} else {
  system.file("app", "R", package = "GateLabR", mustWork = TRUE)
}
if (!exists("%||%")) `%||%` <- function(a, b) if (!is.null(a)) a else b
for (file in c("models.R", "workspace.R", "gatingml_merge.R")) {
  sys.source(file.path(app_r_dir, file), envir = globalenv())
}

rectangle_gate <- function(gate_id, name) {
  list(
    gate_id = gate_id,
    name = name,
    gate_type = "rectangle",
    x_channel = "FSC-A",
    y_channel = "SSC-A",
    vertices = list(c(0, 0), c(1, 1)),
    color = "#377eb8",
    label_offset = NULL
  )
}

population_graph <- function(root_id, branch_id, branch_name, gate_id, child = NULL) {
  root <- list(
    population_id = root_id,
    name = "All Events",
    gate_refs = list(),
    gate_logic = "and",
    parent_id = NULL,
    children = branch_id,
    event_count = 100,
    percent_of_parent = 100
  )
  branch <- list(
    population_id = branch_id,
    name = branch_name,
    gate_refs = list(list(gate_id = gate_id, include = TRUE)),
    gate_logic = "and",
    parent_id = root_id,
    children = if (is.null(child)) character(0) else child$id,
    event_count = 50,
    percent_of_parent = 50
  )
  out <- setNames(list(root, branch), c(root_id, branch_id))
  if (!is.null(child)) {
    out[[child$id]] <- list(
      population_id = child$id,
      name = child$name,
      gate_refs = list(list(gate_id = child$gate_id, include = TRUE)),
      gate_logic = "and",
      parent_id = branch_id,
      children = character(0),
      event_count = 25,
      percent_of_parent = 50
    )
  }
  out
}

current <- list(
  gates = list(shared = rectangle_gate("shared", "Existing gate")),
  gate_order = "shared",
  populations = population_graph("root", "shared-pop", "Existing population", "shared"),
  root_population_id = "root"
)
imported <- list(
  gates = list(
    shared = rectangle_gate("shared", "Imported gate"),
    imported_child_gate = rectangle_gate("imported_child_gate", "Imported child gate")
  ),
  gate_order = c("shared", "imported_child_gate"),
  populations = population_graph(
    "import-root", "shared-pop", "Imported population", "shared",
    list(id = "imported-child", name = "Imported child", gate_id = "imported_child_gate")
  ),
  root_population_id = "import-root"
)

merged <- merge_gating_strategies(current, imported)
imported_gate_id <- unname(merged$gate_id_map[["shared"]])
imported_pop_id <- unname(merged$population_id_map[["shared-pop"]])
imported_child_id <- unname(merged$population_id_map[["imported-child"]])

stopifnot(identical(merged$root_population_id, "root"))
stopifnot(identical(merged$gates$shared$name, "Existing gate"))
stopifnot(identical(imported_gate_id, "shared-imported"))
stopifnot(identical(merged$gates[[imported_gate_id]]$name, "Imported gate"))
stopifnot(identical(merged$gate_order, c("shared", "shared-imported", "imported_child_gate")))
stopifnot(identical(imported_pop_id, "shared-pop-imported"))
stopifnot(identical(merged$populations[[imported_pop_id]]$parent_id, "root"))
stopifnot(identical(merged$populations[[imported_child_id]]$parent_id, imported_pop_id))
stopifnot(identical(merged$populations[[imported_pop_id]]$gate_refs[[1]]$gate_id, imported_gate_id))
stopifnot(all(c("shared-pop", imported_pop_id) %in% merged$populations$root$children))
stopifnot(is.null(merged$populations[[imported_pop_id]]$event_count))
stopifnot(identical(imported$gates$shared$gate_id, "shared"))
stopifnot(identical(imported$populations[["shared-pop"]]$population_id, "shared-pop"))
validate_workspace_graph(merged)

dangling <- imported
dangling$gates <- list()
dangling$gate_order <- character(0)
dangling_problem <- tryCatch(
  {
    merge_gating_strategies(current, dangling)
    ""
  },
  error = function(e) conditionMessage(e)
)
stopifnot(grepl("dangling gate reference", dangling_problem, ignore.case = TRUE))

stopifnot(grepl(
  "compensation",
  gating_merge_space_conflict(TRUE, TRUE, FALSE, TRUE, 5, 5),
  ignore.case = TRUE
))
stopifnot(grepl(
  "cofactor",
  gating_merge_space_conflict(TRUE, FALSE, FALSE, NULL, 5, 7.5),
  ignore.case = TRUE
))
stopifnot(is.null(gating_merge_space_conflict(TRUE, TRUE, FALSE, FALSE, 5, 5)))
stopifnot(is.null(gating_merge_space_conflict(FALSE, TRUE, FALSE, TRUE, 5, 7.5)))

message("GatingML merge tests passed")
