source_app_r_dir <- normalizePath(
  testthat::test_path("..", "..", "inst", "app", "R"),
  mustWork = FALSE
)
app_r_dir <- if (dir.exists(source_app_r_dir)) {
  source_app_r_dir
} else {
  system.file("app", "R", package = "GateLabR", mustWork = TRUE)
}

for (file in c(
  "data_utils.R",
  "models.R",
  "gate_engine.R",
  "strategy_utils.R",
  "workspace.R",
  "fcs_import.R",
  "fcs_export.R"
)) {
  sys.source(file.path(app_r_dir, file), envir = globalenv())
}
