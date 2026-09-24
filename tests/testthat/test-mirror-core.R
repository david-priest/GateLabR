# The metadata(sce)$gating_workspace mirror is what the embedded GateLab core reloads when the
# canonical record is gone. These tests serve one SCE to the real embedded core, in node, the way
# the app does when it opens an SCE, restore the canonical record and the mirror alone, and require
# the core to end up with the same gates from either. The core selects events from a gate's
# geometry, space and transforms only, so the same gates select the same events.

mirror_core_sce <- function(instrument = NULL) {
  n <- 40L
  index <- seq_len(n)
  # Half the events near zero, half bright, on every channel; no random numbers.
  mixed <- function(phase) {
    ifelse(index %% 2L == 0L, 150 * sin(index * phase), 6000 * exp(0.8 * cos(index * phase)))
  }
  counts <- rbind(CD3 = mixed(0.7), CD19 = mixed(1.3), CD4 = mixed(2.1))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts),
    colData = S4Vectors::DataFrame(sample_id = rep(c("D1", "D2"), each = n / 2L))
  )
  if (!is.null(instrument)) {
    S4Vectors::metadata(sce)$instrument_type <- instrument
    S4Vectors::metadata(sce)$instrument_type_source <- "user"
  }
  sce
}

mirror_core_workspace_json <- function(sce, dataset_id, instrument_mode, gate_ids) {
  partition <- GateLabR:::.gatelabr_sample_partition(sce, include_metadata = FALSE)
  samples <- vapply(seq_along(partition$samples), function(index) {
    sprintf(
      paste0(
        '{"sampleId":"%s:%s","fileName":"%s","dataPath":"data/sce-%d.fcs","logicleW":{},',
        '"scatterCofactor":{},"cytofCofactor":5,"compensationOn":false,',
        '"instrumentMode":"%s","labels":{},"metadata":{}}'
      ),
      dataset_id, partition$samples[[index]]$id, partition$levels[[index]], index,
      instrument_mode
    )
  }, character(1))
  logicle <- '{"kind":"logicle","T":262144,"W":0.5,"M":4.5,"A":0}'
  transforms <- paste0('{"CD3":', logicle, ',"CD19":', logicle, '}')
  gate <- function(id, type, geometry, space = NULL) {
    paste0(
      '"', id, '":{"gate_id":"', id, '","name":"', id, '","gate_type":"', type, '",',
      '"x_channel":"CD3","y_channel":"CD19",', geometry, ',"color":"#e41a1c",',
      '"label_offset":null',
      if (is.null(space)) "" else if (space == "raw") ',"space":"raw"' else
        paste0(',"space":"display","transforms":', transforms),
      "}"
    )
  }
  gates <- c(
    rawRect = gate("rawRect", "rectangle", '"vertices":[[1000,-1000],[262144,1000]]', "raw"),
    dispRect = gate("dispRect", "rectangle", '"vertices":[[0.62,0.0],[1.0,0.45]]', "display"),
    dispPoly = gate(
      "dispPoly", "polygon",
      '"vertices":[[0.55,0.55],[0.95,0.55],[0.95,0.95],[0.55,0.95]]', "display"
    ),
    dispEllipse = gate(
      "dispEllipse", "ellipse",
      '"mean":[0.75,0.2],"covariance":[[0.01,0],[0,0.01]],"distance_square":1', "display"
    )
  )
  population <- function(id) {
    paste0(
      '"', id, '":{"population_id":"', id, '","name":"', id, '","gate_refs":[{"gate_id":"',
      id, '","include":true}],"gate_logic":"and","parent_id":"root","children":[],',
      '"event_count":0,"percent_of_parent":0}'
    )
  }
  ids <- if (is.null(gate_ids)) names(gates) else gate_ids
  gates <- gates[ids]
  paste0(
    '{"format":"gatelab-workspace","version":2,"workspaceId":"w",',
    '"savedAt":"2026-09-24T00:00:00Z","app":"GateLab","samples":[',
    paste(samples, collapse = ","), '],"activeSample":0,"gating":{"gates":{',
    paste(gates, collapse = ","), '},"gate_order":["', paste(ids, collapse = '","'), '"],',
    '"populations":{"root":{"population_id":"root","name":"All Events","gate_refs":[],',
    '"gate_logic":"and","parent_id":null,"children":["', paste(ids, collapse = '","'), '"],',
    '"event_count":0,"percent_of_parent":100},',
    paste(vapply(ids, population, character(1)), collapse = ","),
    '},"root_population_id":"root","active_population_id":"root","selected_gate_id":null},',
    '"scales":{"globalScales":{}},"display":{"xChannel":"CD3","yChannel":"CD19",',
    '"mode":"pseudocolor","maxEvents":50000,"contourThreshold":5}}'
  )
}

# Write what the host serves for this SCE: the dataset, each sample's events, and the envelope the
# host sends with the canonical record and with the mirror alone.
mirror_core_fixture <- function(sce, instrument_mode, gate_ids = NULL) {
  dataset_id <- "mirror-sce"
  written <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = dataset_id,
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = mirror_core_workspace_json(sce, dataset_id, instrument_mode, gate_ids)
  )$sce
  mirror_only <- written
  S4Vectors::metadata(mirror_only)$gatelab_workspace <- NULL

  dir <- tempfile("mirror-core-")
  dir.create(dir)
  to_json <- function(value, file) {
    writeLines(
      jsonlite::toJSON(value, auto_unbox = TRUE, null = "null", na = "null", digits = NA),
      file.path(dir, file)
    )
  }
  to_json(GateLabR:::.gatelabr_sce_dataset_descriptor(sce, dataset_id = dataset_id), "dataset.json")
  to_json(GateLabR:::.gatelabr_host_workspace_envelope(written, dataset_id), "canonical.json")
  to_json(GateLabR:::.gatelabr_host_workspace_envelope(mirror_only, dataset_id), "mirror.json")
  partition <- GateLabR:::.gatelabr_sample_partition(sce, include_metadata = FALSE)
  for (index in seq_along(partition$samples)) {
    rows <- partition$event_indices[[index]]
    id <- partition$samples[[index]]$id
    GateLabR:::.gatelabr_write_assay_payload(sce, "counts", file.path(dir, paste0(id, "-counts.bin")), rows)
    GateLabR:::.gatelabr_write_event_index_payload(rows, file.path(dir, paste0(id, "-index.bin")))
  }
  list(
    dir = dir,
    instrument = GateLabR:::.gatelabr_sce_instrument(sce),
    mirror_space = S4Vectors::metadata(written)$gating_workspace$gate_value_space
  )
}

# Restore both envelopes in the embedded core and return the core's result for each.
mirror_core_restore <- function(fixture) {
  on.exit(unlink(fixture$dir, recursive = TRUE), add = TRUE)
  node <- Sys.which("node")
  testthat::skip_if_not(nzchar(node), "node is needed to run the embedded GateLab core")
  script <- testthat::test_path("mirror-core-restore.mjs")
  bundle <- file.path(GateLabR:::.gatelabr_react_asset_dir(), "gatelab-embed.js")
  output <- suppressWarnings(system2(
    node,
    c(shQuote(script), shQuote(bundle), shQuote(fixture$dir), "canonical.json", "mirror.json"),
    stdout = TRUE,
    stderr = TRUE
  ))
  status <- attr(output, "status")
  if (!is.null(status) && status != 0L) {
    stop("node failed:\n", paste(output, collapse = "\n"), call. = FALSE)
  }
  restored <- jsonlite::fromJSON(paste(output, collapse = "\n"), simplifyVector = FALSE)
  list(canonical = restored[["canonical.json"]], mirror = restored[["mirror.json"]])
}

# What the core selects events by: geometry, the space it lives in and the transforms it was drawn
# under.
selecting_fields <- function(gate) {
  geometry <- switch(
    gate$gate_type,
    ellipse = c("mean", "covariance", "distance_square"),
    quadrant = "center",
    "vertices"
  )
  gate[intersect(c("gate_type", "x_channel", "y_channel", "space", "transforms", geometry), names(gate))]
}

expect_mirror_restores_like_canonical <- function(restored) {
  expect_null(restored$canonical$error)
  expect_null(restored$mirror$error, label = "restoring the mirror alone")
  if (!is.null(restored$mirror$error)) return(invisible())
  expect_identical(names(restored$mirror$gates), names(restored$canonical$gates))
  for (gate_id in names(restored$canonical$gates)) {
    expect_equal(
      selecting_fields(restored$mirror$gates[[gate_id]]),
      selecting_fields(restored$canonical$gates[[gate_id]]),
      tolerance = 1e-9,
      label = paste0("gate '", gate_id, "' restored from the mirror")
    )
  }
}

test_that("a mirror of an SCE whose instrument R cannot tell restores the same gates in the core", {
  # Plain marker names and no instrument metadata: R says "unknown" and the core falls back to
  # flow. The mirror declared its gates "display", so the core converted every non-ellipse gate
  # from display to raw, including gates whose own space already said display: the display
  # rectangle and polygon then selected no events, and the raw rectangle failed to load at all.
  fixture <- mirror_core_fixture(mirror_core_sce(), instrument_mode = "auto")
  expect_identical(fixture$instrument, "unknown")
  expect_null(fixture$mirror_space)
  restored <- mirror_core_restore(fixture)
  expect_identical(restored$canonical$gatingSpace, "raw")
  expect_mirror_restores_like_canonical(restored)

  # Without the raw rectangle the mirror loaded, but its display gates had moved.
  display_only <- mirror_core_restore(mirror_core_fixture(
    mirror_core_sce(),
    instrument_mode = "auto",
    gate_ids = c("dispRect", "dispPoly", "dispEllipse")
  ))
  expect_mirror_restores_like_canonical(display_only)
})

test_that("a mirror of a flow or CyTOF SCE restores the same gates in the core", {
  flow <- mirror_core_fixture(mirror_core_sce("flow"), instrument_mode = "flow")
  expect_identical(flow$mirror_space, "raw")
  expect_mirror_restores_like_canonical(mirror_core_restore(flow))

  cytof <- mirror_core_fixture(mirror_core_sce("cytof"), instrument_mode = "cytof")
  expect_identical(cytof$mirror_space, "display")
  restored <- mirror_core_restore(cytof)
  expect_identical(restored$canonical$gatingSpace, "display")
  expect_mirror_restores_like_canonical(restored)
})
