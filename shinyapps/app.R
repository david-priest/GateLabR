# GateLabR desktop entry (ShinyApps bundle).
# The shell runs shiny::runApp(app_dir); this app.R builds and returns a
# shiny.appobj and never starts a server itself.
library(GateLabR)
library(SingleCellExperiment)

make_demo_sce <- function() {
  set.seed(42)
  channels <- c("FSC-A","SSC-A","CD3","CD4","CD8","CD19","CD56","CD45")
  n <- 800
  base <- matrix(abs(rnorm(length(channels) * n, 600, 250)),
                 nrow = length(channels), dimnames = list(channels, NULL))
  SingleCellExperiment(
    assays = list(counts = base),
    colData = S4Vectors::DataFrame(sample_id = rep("demo", n)),
    rowData = S4Vectors::DataFrame(channel_name = channels, marker_name = channels)
  )
}

sce <- make_demo_sce()
assign("sce", sce, envir = .GlobalEnv)

prefix <- paste0("gatelabr-core-", Sys.getpid(), "-",
                 paste(sample(c(letters, 0:9), 8L, replace = TRUE), collapse = ""))
assets <- GateLabR:::.gatelabr_react_asset_dir()
build  <- GateLabR:::.gatelabr_build_identity(assets)
shiny::addResourcePath(prefix, assets)

sce_name <- "sce"
dataset_id <- paste0("sce-", substr(gsub("[^A-Za-z0-9_-]", "-", sce_name), 1L, 48L))
ui <- GateLabR:::.gatelabr_react_ui(prefix, build, object_kind = "SingleCellExperiment")
sce_state <- shiny::reactiveVal(sce)
compensation_backend <- GateLabR:::.gatelabr_start_compensation_backend()

live <- GateLabR:::.gatelabr_live
live$token <- prefix
live$handle <- NULL
live$sce_name <- sce_name
live$gatingset <- NULL
live$set_sce <- function(object) sce_state(object)
live$get_sce <- function() shiny::isolate(sce_state())
live$written <- get0(sce_name, envir = .GlobalEnv, inherits = FALSE)
live$address <- GateLabR:::.gatelabr_object_address(live$written)
live$refused_address <- NULL

server <- GateLabR:::.gatelabr_react_server(
  sce_state = sce_state, sce_name = sce_name, dataset_id = dataset_id,
  sample_column = NULL, absent_gates = NULL, live = live)

cleanup <- function() {
  shiny::removeResourcePath(prefix)
  GateLabR:::.gatelabr_stop_compensation_backend(compensation_backend)
}

shiny::shinyApp(ui = ui, server = server, onStart = function() shiny::onStop(cleanup))