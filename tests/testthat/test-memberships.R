make_memberships_sce <- function() {
  counts <- matrix(
    c(1.25, 2.5, 3.75, -4.5, 0, 8.25),
    nrow = 2,
    byrow = TRUE,
    dimnames = list(c("CD3", "CD19"), paste0("event", 1:3))
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(sample_id = c("Donor A", "Donor A", "Donor B"))
  )
  S4Vectors::metadata(sce)$instrument_type <- "cytof"
  sce
}

memberships_workspace_json <- function() {
  paste0(
    '{"format":"gatelab-workspace","version":2,',
    '"workspaceId":"sce-workspace","savedAt":"2026-09-07T00:00:00Z",',
    '"app":"GateLab","samples":[',
    '{"sampleId":"test-sce:sample-0","fileName":"Donor A",',
    '"dataPath":"data/sce-1.fcs","logicleW":{},"scatterCofactor":{},',
    '"cytofCofactor":5,"compensationOn":false,"instrumentMode":"cytof",',
    '"labels":{},"metadata":{}},',
    '{"sampleId":"test-sce:sample-1","fileName":"Donor B",',
    '"dataPath":"data/sce-2.fcs","logicleW":{},"scatterCofactor":{},',
    '"cytofCofactor":5,"compensationOn":false,"instrumentMode":"cytof",',
    '"labels":{},"metadata":{}}],',
    '"activeSample":0,"gating":{"gates":{"gate-1":{',
    '"gate_id":"gate-1","name":"CD3 positive","gate_type":"rectangle",',
    '"x_channel":"CD3","y_channel":"CD19","vertices":[[1,2],[3,4]],',
    '"color":"#e41a1c","label_offset":null}},',
    '"gate_order":["gate-1"],"populations":{"root":{',
    '"population_id":"root","name":"All Events","gate_refs":[],',
    '"gate_logic":"and","parent_id":null,"children":["child"],',
    '"event_count":3,"percent_of_parent":100},"child":{',
    '"population_id":"child","name":"CD3+","gate_refs":[',
    '{"gate_id":"gate-1","include":true}],"gate_logic":"and",',
    '"parent_id":"root","children":[],"event_count":2,',
    '"percent_of_parent":66.7}},"root_population_id":"root",',
    '"active_population_id":"child","selected_gate_id":"gate-1"},',
    '"scales":{"globalScales":{"CD3":[0,10],"CD19":[0,20]}},',
    '"display":{"xChannel":"CD3","yChannel":"CD19",',
    '"mode":"pseudocolor","maxEvents":50000,"contourThreshold":5}}'
  )
}

# Two samples: Donor A holds events 1-2 (sample-0), Donor B holds event 3 (sample-1).
mask_pair <- function(a, b) {
  encode <- function(bits) base64enc::base64encode(packBits(c(as.logical(bits), logical(8 - length(bits))), type = "raw"))
  list(
    list(sampleId = "sample-0", eventCount = 2L, membershipBitsBase64 = encode(a)),
    list(sampleId = "sample-1", eventCount = 1L, membershipBitsBase64 = encode(b))
  )
}

memberships_payload <- function() {
  gate <- function(name, include = TRUE, quadrant = NULL) {
    out <- list(gateId = tolower(name), gateName = name, include = include)
    if (!is.null(quadrant)) out$quadrant <- quadrant
    out
  }
  list(
    hierarchies = list(
      list(id = "main", name = "Main", active = TRUE, rootPopulationId = "root"),
      list(id = "bc", name = "Barcodes", active = FALSE, rootPopulationId = "root2")
    ),
    populations = list(
      list(hierarchyId = "main", populationId = "root", populationName = "All Events",
           parentId = NULL, gateLogic = "and", gates = list(),
           sampleMasks = mask_pair(c(1, 1), 1)),
      list(hierarchyId = "main", populationId = "child", populationName = "CD3+",
           parentId = "root", gateLogic = "and", gates = list(gate("CD3 positive")),
           sampleMasks = mask_pair(c(1, 0), 1)),
      list(hierarchyId = "main", populationId = "grandchild", populationName = "CD3+CD19-",
           parentId = "child", gateLogic = "and",
           gates = list(gate("CD3 positive"), gate("CD19 positive", include = FALSE)),
           sampleMasks = mask_pair(c(0, 0), 1)),
      list(hierarchyId = "bc", populationId = "root2", populationName = "All Events",
           parentId = NULL, gateLogic = "and", gates = list(),
           sampleMasks = mask_pair(c(1, 1), 1)),
      list(hierarchyId = "bc", populationId = "s01", populationName = "Sample 01",
           parentId = "root2", gateLogic = "and", gates = list(gate("Quad", quadrant = 2L)),
           sampleMasks = mask_pair(c(0, 1), 0))
    )
  )
}

store_with_memberships <- function(sce = make_memberships_sce()) {
  GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 3L,
    reason = "explicit",
    workspace_json = memberships_workspace_json(),
    memberships = memberships_payload()
  )
}

test_that("an explicit save stores every population packed beside the workspace", {
  written <- store_with_memberships()
  expect_identical(written$result$memberships, list(hierarchies = 2L, populations = 5L))
  record <- S4Vectors::metadata(written$sce)$gatelab_workspace$memberships
  expect_identical(record$format, "gatelab-sce-memberships")
  expect_identical(record$revision, 1L)
  expect_identical(record$event_count, 3L)
  expect_identical(names(record$masks), c("main/root", "main/child", "main/grandchild", "bc/root2", "bc/s01"))
  expect_true(is.raw(record$masks[["main/child"]]))
  expect_identical(length(record$masks[["main/child"]]), 1L)
  expect_identical(record$populations$event_count, c(3L, 2L, 1L, 3L, 1L))
})

test_that("the hierarchy table carries parents, depth, path and gate text", {
  sce <- store_with_memberships()$sce
  hierarchies <- gatelabHierarchies(sce)
  expect_identical(hierarchies$hierarchy, c("Main", "Barcodes"))
  expect_identical(hierarchies$active, c(TRUE, FALSE))
  expect_identical(hierarchies$populations, c(3L, 2L))

  tree <- gatelabHierarchy(sce)
  expect_identical(tree$population, c("All Events", "CD3+", "CD3+CD19-"))
  expect_identical(tree$parent, c(NA, "All Events", "CD3+"))
  expect_identical(tree$depth, c(0L, 1L, 2L))
  expect_identical(tree$path[[3]], "All Events > CD3+ > CD3+CD19-")
  expect_identical(tree$gates, c("", "CD3 positive", "CD3 positive and not CD19 positive"))

  barcodes <- gatelabHierarchy(sce, "Barcodes")
  expect_identical(barcodes$population, c("All Events", "Sample 01"))
  expect_identical(barcodes$gates[[2]], "Quad Q2")
  expect_error(gatelabHierarchy(sce, "Nope"), "Stored hierarchies: Main, Barcodes")
})

test_that("memberships come back in SCE event order, by population or as a leaf factor", {
  sce <- store_with_memberships()$sce
  members <- gatelabPopulations(sce)
  expect_identical(dim(members), c(3L, 3L))
  expect_identical(colnames(members), c("All Events", "CD3+", "CD3+CD19-"))
  expect_identical(rownames(members), paste0("event", 1:3))
  expect_identical(unname(members[, "CD3+"]), c(TRUE, FALSE, TRUE))
  expect_identical(unname(members[, "CD3+CD19-"]), c(FALSE, FALSE, TRUE))

  picked <- gatelabPopulations(sce, populations = c("CD3+CD19-", "child"))
  expect_identical(colnames(picked), c("CD3+CD19-", "CD3+"))
  expect_error(gatelabPopulations(sce, populations = "Sample 01"), "Populations: All Events, CD3\\+, CD3\\+CD19-")

  barcodes <- gatelabPopulations(sce, hierarchy = "bc")
  expect_identical(unname(barcodes[, "Sample 01"]), c(FALSE, TRUE, FALSE))

  leaf <- gatelabLeafPopulation(sce)
  expect_identical(as.character(leaf), c("CD3+", "ungated", "CD3+CD19-"))
  expect_identical(levels(leaf), c("CD3+", "CD3+CD19-", "ungated"))
  expect_identical(
    as.character(gatelabLeafPopulation(sce, hierarchy = "Barcodes", ungated = "unassigned")),
    c("unassigned", "Sample 01", "unassigned")
  )
})

test_that("an autosave keeps the memberships but marks them stale until the next explicit save", {
  first <- store_with_memberships()
  autosaved <- GateLabR:::.gatelabr_store_host_workspace(
    first$sce,
    dataset_id = "test-sce",
    expected_revision = 1L,
    client_revision = 4L,
    reason = "autosave",
    workspace_json = memberships_workspace_json()
  )
  expect_null(autosaved$result$memberships)
  expect_identical(
    S4Vectors::metadata(autosaved$sce)$gatelab_workspace$memberships$revision, 1L
  )
  expect_error(gatelabPopulations(autosaved$sce), "saved at workspace revision 1 but the workspace is now at revision 2")
  expect_identical(
    unname(gatelabPopulations(autosaved$sce, allow_stale = TRUE)[, "CD3+"]),
    c(TRUE, FALSE, TRUE)
  )

  refreshed <- GateLabR:::.gatelabr_store_host_workspace(
    autosaved$sce,
    dataset_id = "test-sce",
    expected_revision = 2L,
    client_revision = 5L,
    reason = "explicit",
    workspace_json = memberships_workspace_json(),
    memberships = memberships_payload()
  )
  expect_identical(
    S4Vectors::metadata(refreshed$sce)$gatelab_workspace$memberships$revision, 3L
  )
  expect_silent(gatelabHierarchy(refreshed$sce))
})

test_that("an explicit save that brought no memberships is reported as a stale core", {
  saved <- GateLabR:::.gatelabr_store_host_workspace(
    make_memberships_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "explicit",
    workspace_json = memberships_workspace_json()
  )
  expect_identical(S4Vectors::metadata(saved$sce)$gatelab_workspace$explicit_without_memberships, 1L)
  expect_error(gatelabPopulations(saved$sce), "revision 1\\) reached R without any")
  refreshed <- GateLabR:::.gatelabr_store_host_workspace(
    saved$sce,
    dataset_id = "test-sce",
    expected_revision = 1L,
    client_revision = 2L,
    reason = "explicit",
    workspace_json = memberships_workspace_json(),
    memberships = memberships_payload()
  )
  expect_null(S4Vectors::metadata(refreshed$sce)$gatelab_workspace$explicit_without_memberships)
  expect_silent(gatelabHierarchy(refreshed$sce))
})

test_that("memberships are refused on an object that never had them", {
  expect_error(gatelabPopulations(make_memberships_sce()), "No population memberships")
})

# Saved memberships: events 1 and 3 are CD3+, event 3 alone is CD3+CD19-, event 2 is Sample 01.
saved_cd3 <- c(TRUE, FALSE, TRUE)
saved_leaf <- c("CD3+", "ungated", "CD3+CD19-")

test_that("memberships follow the events through a reorder, not their positions", {
  sce <- store_with_memberships()$sce
  order <- c(3L, 1L, 2L)
  reordered <- sce[, order]
  # The bitsets were positional and only the column count was compared, so this read each
  # position's bit: event 3 was given event 1's membership, and so on.
  expect_identical(unname(gatelabPopulations(reordered)[, "CD3+"]), saved_cd3[order])
  expect_identical(rownames(gatelabPopulations(reordered)), paste0("event", order))
  expect_identical(as.character(gatelabLeafPopulation(reordered)), saved_leaf[order])
  expect_identical(
    unname(gatelabPopulations(reordered, hierarchy = "Barcodes")[, "Sample 01"]),
    c(FALSE, FALSE, TRUE)
  )
})

test_that("a shuffle within one sample is followed when the SCE has no column names", {
  # CATALYST::prepData() builds its SCE without column names, and a digest of names and of the
  # sample partition does not change when two events of one sample swap places.
  unnamed <- make_memberships_sce()
  colnames(unnamed) <- NULL
  sce <- store_with_memberships(unnamed)$sce
  swapped <- sce[, c(2L, 1L, 3L)]
  expect_identical(swapped$sample_id, sce$sample_id)
  expect_identical(unname(gatelabPopulations(swapped)[, "CD3+"]), c(FALSE, TRUE, TRUE))
  expect_identical(as.character(gatelabLeafPopulation(swapped)), saved_leaf[c(2L, 1L, 3L)])
})

test_that("a subset reads the memberships of the events it kept", {
  sce <- store_with_memberships()$sce
  kept <- sce[, c(3L, 1L)]
  expect_identical(unname(gatelabPopulations(kept)[, "CD3+"]), c(TRUE, TRUE))
  expect_identical(as.character(gatelabLeafPopulation(kept)), c("CD3+CD19-", "CD3+"))
  # The hierarchy table counts the events of this object, not of the one that was saved.
  expect_identical(gatelabHierarchy(kept)$event_count, c(2L, 2L, 1L))
  expect_identical(gatelabHierarchy(sce)$event_count, c(3L, 2L, 1L))
})

test_that("cbind maps events of the saved object and refuses events from anywhere else", {
  offsets <- c(1000, 5000)
  calls <- 0L
  local_mocked_bindings(
    .gatelabr_event_id_offset = function(...) {
      calls <<- calls + 1L
      offsets[[calls]]
    },
    .package = "GateLabR"
  )
  first <- store_with_memberships()$sce
  second <- store_with_memberships()$sce
  expect_identical(first$gatelab_event_id, c(1001, 1002, 1003))

  # base::cbind() does not reach the SCE method unless SingleCellExperiment is attached.
  cbind <- SingleCellExperiment::cbind
  # The saved object's own events, repeated, map to their own memberships.
  doubled <- cbind(first, first[, 3L])
  expect_identical(unname(gatelabPopulations(doubled)[, "CD3+CD19-"]), c(FALSE, FALSE, TRUE, TRUE))

  # Events from an object with no memberships: cbind() needs the column, and an NA is refused.
  other <- make_memberships_sce()
  other$gatelab_event_id <- NA_real_
  expect_error(
    gatelabPopulations(cbind(first, other)),
    "3 of this SCE's 6 events are not among the 3 events"
  )

  # Two objects saved separately: cbind() keeps both records, and neither covers every event.
  expect_error(gatelabPopulations(cbind(first, second)), "saved separately")
  # With only the first object's metadata left, the second's events are still recognised as foreign.
  combined <- cbind(first, second)
  S4Vectors::metadata(combined) <- S4Vectors::metadata(first)
  expect_error(gatelabPopulations(combined), "3 of this SCE's 6 events are not among")
})

test_that("an explicit save writes the event ids without touching the random number stream", {
  set.seed(20260924)
  seed_before <- .Random.seed
  saved <- store_with_memberships()$sce
  expect_identical(.Random.seed, seed_before)
  ids <- saved$gatelab_event_id
  expect_true(is.double(ids))
  expect_identical(diff(ids), c(1, 1))
  record <- S4Vectors::metadata(saved)$gatelab_workspace$memberships
  expect_identical(record$event_ids$column, "gatelab_event_id")
  expect_identical(ids - record$event_ids$offset, c(1, 2, 3))
  # A per-event id is not a sample attribute: a one-event sample must not offer it as a chip.
  partition <- GateLabR:::.gatelabr_sample_partition(saved)
  expect_false("gatelab_event_id" %in% names(partition$samples[[2L]]$metadata))
})

test_that("memberships whose events cannot be identified are refused, not read by position", {
  sce <- store_with_memberships()$sce
  dropped <- sce
  dropped$gatelab_event_id <- NULL
  expect_error(gatelabPopulations(dropped), "no `gatelab_event_id` column")

  # A record written before event ids existed (GateLabR 1.4.6 and 1.4.7) carries none.
  legacy <- sce
  workspace <- S4Vectors::metadata(legacy)$gatelab_workspace
  workspace$memberships$event_ids <- NULL
  workspace$memberships$version <- 1L
  S4Vectors::metadata(legacy)$gatelab_workspace <- workspace
  expect_error(gatelabPopulations(legacy), "saved by an earlier version of GateLabR")
  expect_error(gatelabLeafPopulation(legacy), "saved by an earlier version of GateLabR")
})

test_that("a malformed memberships payload is refused before anything is stored", {
  broken <- memberships_payload()
  broken$populations[[2]]$sampleMasks <- broken$populations[[2]]$sampleMasks[1]
  expect_error(
    GateLabR:::.gatelabr_store_host_workspace(
      make_memberships_sce(),
      dataset_id = "test-sce",
      expected_revision = 0L,
      client_revision = 1L,
      reason = "explicit",
      workspace_json = memberships_workspace_json(),
      memberships = broken
    ),
    "one membership mask per SCE sample"
  )
  orphan <- memberships_payload()
  orphan$populations[[3]]$parentId <- "missing"
  expect_error(
    GateLabR:::.gatelabr_store_host_workspace(
      make_memberships_sce(),
      dataset_id = "test-sce",
      expected_revision = 0L,
      client_revision = 1L,
      reason = "explicit",
      workspace_json = memberships_workspace_json(),
      memberships = orphan
    ),
    "parent outside its hierarchy"
  )
})
