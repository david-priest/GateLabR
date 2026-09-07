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

test_that("memberships are refused on an object they were not saved on", {
  expect_error(gatelabPopulations(make_memberships_sce()), "No population memberships")
  sce <- store_with_memberships()$sce
  expect_error(gatelabPopulations(sce[, 1:2]), "cover 3 events but this SCE has 2 columns")
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
