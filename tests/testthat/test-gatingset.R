# A flowWorkspace GatingSet as the object GateLabR serves and writes back to (R/gatingset.R).
# Built from flowCore's GvHD example data: two samples, logicle on two channels.

skip_if_not_installed("flowWorkspace")
skip_if_not_installed("flowCore")

make_gatingset <- function() {
  data_env <- new.env()
  utils::data("GvHD", package = "flowCore", envir = data_env)
  gs <- flowWorkspace::GatingSet(data_env$GvHD[1:2])
  flowWorkspace::transform(gs, flowWorkspace::transformerList(
    c("FL1-H", "FL2-H"),
    flowWorkspace::logicle_trans(w = 0.5, t = 262144, m = 4.5, a = 0)
  ))
  gs
}

logicle_spec <- function(W = 0.5) list(kind = "logicle", T = 262144, W = W, M = 4.5, A = 0)

transformed_values <- function(gs, index) {
  flowCore::exprs(flowWorkspace::gh_pop_get_data(gs[[index]], "root"))
}

# The membership of every event of every sample, in sample order, packed as the SCE host packs it.
packed_mask <- function(masks) GateLabR:::.gatelabr_pack_bits(unlist(masks, use.names = FALSE))

test_that("a GatingSet is served as an SCE of its compensated linear values", {
  gs <- make_gatingset()
  sce <- GateLabR:::.gatelabr_gatingset_sce(gs)
  data_env <- new.env()
  utils::data("GvHD", package = "flowCore", envir = data_env)
  raw1 <- flowCore::exprs(data_env$GvHD[[1]])
  raw2 <- flowCore::exprs(data_env$GvHD[[2]])
  n1 <- nrow(raw1)
  n2 <- nrow(raw2)

  expect_identical(SummarizedExperiment::assayNames(sce), "compensated")
  expect_identical(dim(sce), c(8L, n1 + n2))
  expect_identical(rownames(sce), unname(colnames(raw1)))
  expect_identical(SummarizedExperiment::rowData(sce)$gatelabr_pnn, unname(colnames(raw1)))
  expect_identical(SummarizedExperiment::rowData(sce)$gatelabr_pns[[3]], "CD15 FITC")
  sample_id <- SummarizedExperiment::colData(sce)$sample_id
  expect_identical(unique(sample_id), c("s5a01", "s5a02"))
  expect_identical(sum(sample_id == "s5a01"), n1)
  # pData columns reach every event of their sample.
  pd <- flowWorkspace::pData(gs)
  expect_identical(unique(SummarizedExperiment::colData(sce)$Patient[sample_id == "s5a02"]),
                   pd$Patient[[2]])
  # A transformed channel comes back linear, within the logicle's round trip; an untransformed
  # one is the stored value.
  values <- SummarizedExperiment::assay(sce, "compensated")
  expect_equal(values["FL1-H", seq_len(n1)], unname(raw1[, "FL1-H"]), tolerance = 1e-3,
               ignore_attr = TRUE)
  expect_identical(values["FSC-H", n1 + seq_len(n2)], unname(raw2[, "FSC-H"]), ignore_attr = TRUE)

  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce)
  expect_identical(descriptor$assays[[1]]$role, "compensated")
  expect_identical(descriptor$assays[[1]]$coordinateSpace, "linear")
  expect_identical(descriptor$defaultAssayId, "compensated")
  expect_identical(descriptor$instrument, "flow")
  expect_length(descriptor$samples, 2L)
  expect_identical(descriptor$samples[[2]]$label, "s5a02")
  expect_identical(descriptor$samples[[2]]$metadata$Patient, pd$Patient[[2]])
  expect_null(S4Vectors::metadata(sce)$gatelab_workspace)
})

test_that("the workspace record lives in a keyword on every sample and survives save_gs", {
  gs <- make_gatingset()
  record <- list(format = "gatelab-sce-workspace", version = 1L, revision = 3L,
                 saved_at = "2026-01-01T00:00:00.000+0000", reason = "autosave",
                 workspace_json = "{\"format\":\"gatelab-workspace\"}",
                 memberships = list(revision = 3L))
  GateLabR:::.gatelabr_gatingset_store_record(gs, record)
  for (index in 1:2) {
    text <- flowWorkspace::keyword(flowWorkspace::gs_cyto_data(gs)[[index]])[["GATELAB_WORKSPACE"]]
    expect_true(is.character(text) && grepl("gatelab-workspace", text, fixed = TRUE))
    expect_false(grepl("memberships", text, fixed = TRUE))
  }
  read <- GateLabR:::.gatelabr_gatingset_record(gs)
  expect_identical(read$revision, 3L)
  expect_identical(read$workspace_json, record$workspace_json)
  expect_identical(S4Vectors::metadata(GateLabR:::.gatelabr_gatingset_sce(gs))$gatelab_workspace$revision, 3L)
  # A second store replaces the keyword; the record is read back from a saved and reloaded object.
  record$revision <- 4L
  GateLabR:::.gatelabr_gatingset_store_record(gs, record)
  dir <- withr::local_tempdir()
  flowWorkspace::save_gs(gs, dir)
  reloaded <- flowWorkspace::load_gs(dir)
  expect_identical(GateLabR:::.gatelabr_gatingset_record(reloaded)$revision, 4L)
})

test_that("a GateLab transform spec is matched to the GatingSet's own transform numerically", {
  gs <- make_gatingset()
  matches <- function(channel, spec) GateLabR:::.gatelabr_gatingset_transform_matches(gs, channel, spec)
  expect_true(matches("FL1-H", logicle_spec()))
  expect_false(matches("FL1-H", logicle_spec(W = 0.6)))
  expect_false(matches("FL1-H", list(kind = "asinh", cofactor = 5)))
  expect_false(matches("FL1-H", list(kind = "identity")))
  expect_true(matches("FSC-H", list(kind = "identity")))
  expect_false(matches("FSC-H", logicle_spec()))
  expect_false(matches("FL1-H", NULL))
})

# A workspace of two populations under root: P1 from a rectangle in display space under the
# GatingSet's own logicle on both axes, and P2 beneath it from a polygon drawn in raw space on
# the scatter channels with P1's gate excluded, which has no single gate to be written as.
gatingset_workspace <- function(gs) {
  gates <- list(
    `gate-rect` = list(
      gate_id = "gate-rect", name = "FL1 FL2 box", gate_type = "rectangle",
      x_channel = "FL1-H", y_channel = "FL2-H",
      vertices = list(list(1.5, 1.0), list(3.5, 3.0)),
      space = "display", transforms = list(`FL1-H` = logicle_spec(), `FL2-H` = logicle_spec())
    ),
    `gate-poly` = list(
      gate_id = "gate-poly", name = "scatter", gate_type = "polygon",
      x_channel = "FSC-H", y_channel = "SSC-H",
      vertices = list(list(100, 50), list(800, 50), list(800, 600), list(100, 600))
    )
  )
  populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), parent_id = NULL),
    `pop-1` = list(population_id = "pop-1", name = "box cells", parent_id = "pop-root",
                   gate_refs = list(list(gate_id = "gate-rect", include = TRUE))),
    `pop-2` = list(population_id = "pop-2", name = "scatter not box", parent_id = "pop-1",
                   gate_refs = list(list(gate_id = "gate-poly", include = TRUE),
                                    list(gate_id = "gate-rect", include = FALSE)))
  )
  json <- jsonlite::toJSON(list(format = "gatelab-workspace", version = 2L,
                                gating = list(gates = gates, populations = populations,
                                              root_population_id = "pop-root")),
                           auto_unbox = TRUE, null = "null", digits = NA)
  # The memberships as flowWorkspace will evaluate the rectangle (closed bounds in logicle
  # space) and as GateLab evaluates a raw-space polygon.
  masks <- lapply(1:2, function(index) {
    values <- transformed_values(gs, index)
    in_box <- values[, "FL1-H"] >= 1.5 & values[, "FL1-H"] <= 3.5 &
      values[, "FL2-H"] >= 1.0 & values[, "FL2-H"] <= 3.0
    in_poly <- sp::point.in.polygon(values[, "FSC-H"], values[, "SSC-H"],
                                    c(100, 800, 800, 100), c(50, 50, 600, 600)) > 0
    list(p1 = in_box, p2 = in_box & in_poly & !in_box)
  })
  p1 <- lapply(masks, `[[`, "p1")
  # P2 holds events of its parent P1 that the polygon keeps and the box does not: none, since the
  # box is P1 itself; give it a membership of its own so the node is checked for what it holds.
  p2 <- lapply(masks, function(sample) sample$p1 & seq_along(sample$p1) %% 2L == 0L)
  hierarchies <- data.frame(hierarchy_id = "h1", hierarchy = "Main", active = TRUE,
                            root_population_id = "pop-root", stringsAsFactors = FALSE)
  populations_df <- data.frame(
    hierarchy_id = "h1",
    population_id = c("pop-root", "pop-1", "pop-2"),
    population = c("root", "box cells", "scatter not box"),
    parent_id = c(NA, "pop-root", "pop-1"),
    parent = c(NA, "root", "box cells"),
    depth = c(0L, 1L, 2L),
    path = c("root", "root > box cells", "root > box cells > scatter not box"),
    gate_logic = "and",
    gates = c("", "FL1 FL2 box", "scatter AND NOT FL1 FL2 box"),
    event_count = c(sum(lengths(p1)), sum(unlist(p1)), sum(unlist(p2))),
    stringsAsFactors = FALSE
  )
  root_mask <- lapply(p1, function(mask) rep(TRUE, length(mask)))
  list(
    json = as.character(json),
    p1 = p1,
    p2 = p2,
    record = list(
      format = "gatelab-sce-workspace", version = 1L, revision = 2L, client_revision = 2L,
      writer_id = NA_character_, saved_at = "2026-01-01T00:00:00.000+0000", reason = "explicit",
      dataset_id = "sce-gs", sample_column = "sample_id", event_count = sum(lengths(p1)),
      workspace_json = as.character(json),
      memberships = list(
        format = "gatelab-sce-population-memberships", version = 3L, revision = 2L,
        saved_at = "2026-01-01T00:00:00.000+0000", event_count = sum(lengths(p1)),
        hierarchies = hierarchies, populations = populations_df,
        masks = list(`h1/pop-root` = packed_mask(root_mask), `h1/pop-1` = packed_mask(p1),
                     `h1/pop-2` = packed_mask(p2))
      )
    )
  )
}

test_that("an explicit save writes every population back to the hierarchy, as a gate where exact", {
  gs <- make_gatingset()
  sce <- GateLabR:::.gatelabr_gatingset_sce(gs)
  ws <- gatingset_workspace(gs)
  S4Vectors::metadata(sce)$gatelab_workspace <- ws$record

  report <- GateLabR:::.gatelabr_gatingset_apply(gs, sce)
  expect_identical(report$gates, "box cells")
  expect_identical(report$masks, "scatter not box")
  expect_identical(report$replaced, character(0))
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"),
                   c("root", "/box cells", "/box cells/scatter not box"))
  expect_s4_class(flowWorkspace::gh_pop_get_gate(gs[[1]], "/box cells"), "rectangleGate")
  for (index in 1:2) {
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/box cells")), ws$p1[[index]])
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/box cells/scatter not box")), ws$p2[[index]])
  }
  # The record on the object says the hierarchy was written, and the readers read the hierarchy.
  expect_true(isTRUE(GateLabR:::.gatelabr_gatingset_record(gs)$hierarchy_written))
  expect_identical(GateLabR:::.gatelabr_memberships_status(gs), "current")
  hierarchy <- GateLabR::gatelabHierarchy(gs)
  expect_identical(hierarchy$population, c("box cells", "scatter not box"))
  expect_identical(hierarchy$parent, c(NA, "box cells"))
  expect_identical(hierarchy$depth, c(1L, 2L))
  expect_identical(hierarchy$gates, c("rectangleGate", "booleanFilter"))
  expect_identical(hierarchy$event_count, c(sum(unlist(ws$p1)), sum(unlist(ws$p2))))
  members <- GateLabR::gatelabPopulations(gs)
  expect_identical(dim(members), c(ncol(sce), 2L))
  expect_identical(unname(members[, "box cells"]), unlist(ws$p1, use.names = FALSE))
  expect_identical(rownames(members)[1:2], c("s5a01_1", "s5a01_2"))
  leaves <- GateLabR::gatelabLeafPopulation(gs)
  expect_identical(levels(leaves), c("box cells", "scatter not box", "ungated"))
  expect_identical(sum(leaves == "scatter not box"), sum(unlist(ws$p2)))
  expect_identical(sum(leaves == "box cells"), sum(unlist(ws$p1)) - sum(unlist(ws$p2)))
  expect_identical(GateLabR::gatelabHierarchies(gs)$populations, 2L)

  # The written hierarchy survives save_gs() and load_gs().
  dir <- withr::local_tempdir()
  flowWorkspace::save_gs(gs, dir)
  reloaded <- flowWorkspace::load_gs(dir)
  expect_equal(flowWorkspace::gh_pop_get_count(reloaded[[1]], "/box cells/scatter not box"), sum(ws$p2[[1]]))

  # An autosave carries the previous memberships under an older revision: the record is stored,
  # the hierarchy left alone.
  later <- ws$record
  later$revision <- 3L
  later$reason <- "autosave"
  S4Vectors::metadata(sce)$gatelab_workspace <- later
  expect_null(GateLabR:::.gatelabr_gatingset_apply(gs, sce))
  expect_identical(GateLabR:::.gatelabr_gatingset_record(gs)$revision, 3L)
  expect_length(flowWorkspace::gs_get_pop_paths(gs), 3L)

  # A save whose tree lost a population removes its node: the tree in GateLab is the tree.
  trimmed <- ws$record
  trimmed$revision <- 4L
  trimmed$memberships$revision <- 4L
  trimmed$memberships$populations <- trimmed$memberships$populations[1:2, ]
  trimmed$memberships$masks[["h1/pop-2"]] <- NULL
  S4Vectors::metadata(sce)$gatelab_workspace <- trimmed
  report <- GateLabR:::.gatelabr_gatingset_apply(gs, sce)
  expect_identical(report$gates, "box cells")
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/box cells"))
})

test_that("a gate flowWorkspace evaluates differently is written as its membership instead", {
  gs <- make_gatingset()
  sce <- GateLabR:::.gatelabr_gatingset_sce(gs)
  ws <- gatingset_workspace(gs)
  # GateLab's membership of the box differs from the closed rectangle by one event.
  flipped <- ws$p1
  first_in <- which(flipped[[1]])[[1]]
  flipped[[1]][[first_in]] <- FALSE
  ws$record$memberships$masks[["h1/pop-1"]] <- packed_mask(flipped)
  ws$record$memberships$populations <- ws$record$memberships$populations[1:2, ]
  ws$record$memberships$masks[["h1/pop-2"]] <- NULL
  S4Vectors::metadata(sce)$gatelab_workspace <- ws$record
  report <- GateLabR:::.gatelabr_gatingset_apply(gs, sce)
  expect_identical(report$gates, character(0))
  expect_identical(report$masks, "box cells")
  expect_identical(report$replaced, "box cells")
  expect_s4_class(flowWorkspace::gh_pop_get_gate(gs[[1]], "/box cells"), "booleanFilter")
  expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[1]], "/box cells")), flipped[[1]])
})

test_that("the launcher serves a GatingSet and every write reaches it in place", {
  gs <- make_gatingset()
  name <- ".gatelabr_gatingset_launch_test_gs"
  assign(name, gs, envir = .GlobalEnv)
  on.exit(if (exists(name, envir = .GlobalEnv, inherits = FALSE)) rm(list = name, envir = .GlobalEnv), add = TRUE)
  live <- GateLabR:::.gatelabr_live
  on.exit(rm(list = ls(live, all.names = TRUE), envir = live), add = TRUE)
  starts <- list()
  handle <- list(stop = function() invisible(NULL), url = function() "http://127.0.0.1:4283")
  start_app <- function(appDir, port = NULL, launch.browser = TRUE, ...) {
    starts[[length(starts) + 1L]] <<- list(app = appDir, port = port)
    handle
  }
  assets <- withr::local_tempdir()
  testthat::local_mocked_bindings(
    .gatelabr_react_asset_dir = function() assets,
    .gatelabr_start_compensation_backend = function() "backend",
    .gatelabr_stop_compensation_backend = function(backend) invisible(NULL),
    .gatelabr_warn_memberships_at_stop = function(sce_name) invisible(NULL),
    .gatelabr_start_app_fn = function() start_app,
    .package = "GateLabR"
  )
  expect_message(
    GateLabR::launchReactGateLab(gs, sce_name = name, launch.browser = FALSE, blocking = FALSE),
    "GatingSet"
  )
  expect_length(starts, 1L)
  expect_identical(live$gatingset, gs)
  expect_identical(live$sce_name, name)
  served <- live$get_sce()
  expect_identical(SummarizedExperiment::assayNames(served), "compensated")
  # The global name still holds the GatingSet, and a write-back reaches it: the record lands in
  # its keyword, and the binding is not replaced by the app's SCE.
  expect_true(GateLabR:::.gatelabr_is_gatingset(get(name, envir = .GlobalEnv)))
  written <- served
  ws <- gatingset_workspace(gs)
  S4Vectors::metadata(written)$gatelab_workspace <- ws$record
  expect_message(GateLabR:::.gatelabr_write_back(live, name, written), "2 population")
  expect_true(GateLabR:::.gatelabr_is_gatingset(get(name, envir = .GlobalEnv)))
  expect_identical(GateLabR:::.gatelabr_gatingset_record(gs)$revision, 2L)
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"),
                   c("root", "/box cells", "/box cells/scatter not box"))
  expect_null(GateLabR:::.gatelabr_check_write_back(live, name))

  # The console rebinds the name to another object: the next write is refused until
  # gatelabSync() hands that object over, which must hold the same samples and events.
  dir <- withr::local_tempdir()
  flowWorkspace::save_gs(gs, dir)
  other <- flowWorkspace::load_gs(dir)
  assign(name, other, envir = .GlobalEnv)
  expect_match(GateLabR:::.gatelabr_check_write_back(live, name), "gatelabSync")
  expect_message(GateLabR::gatelabSync(name), "now works on")
  expect_identical(live$gatingset, other)
  expect_null(GateLabR:::.gatelabr_check_write_back(live, name))
  smaller <- flowWorkspace::load_gs(dir)[1]
  assign(name, smaller, envir = .GlobalEnv)
  expect_error(GateLabR::gatelabSync(name), "relaunch")
})
