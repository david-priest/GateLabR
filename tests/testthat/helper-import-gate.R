# Fixtures for gatelabImportGate(). Self-contained rather than borrowed from
# test-memberships.R, because testthat gives each test file its own environment and only
# helper-*.R is shared. A two-sample SCE with a saved workspace holding one rectangle gate,
# plus a memberships record, is what an import has to insert into without disturbing.

import_sce <- function() {
  counts <- matrix(
    c(1.25, 2.5, 3.75, -4.5, 0, 8.25),
    nrow = 2, byrow = TRUE,
    dimnames = list(c("CD3", "CD19"), paste0("event", 1:3))
  )
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(sample_id = c("Donor A", "Donor A", "Donor B"))
  )
  S4Vectors::metadata(sce)$instrument_type <- "cytof"
  sce
}

import_workspace_json <- function() {
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

import_memberships_payload <- function() {
  encode <- function(bits) {
    base64enc::base64encode(
      packBits(c(as.logical(bits), logical(8 - length(bits))), type = "raw"))
  }
  masks <- function(a, b) list(
    list(sampleId = "sample-0", eventCount = 2L, membershipBitsBase64 = encode(a)),
    list(sampleId = "sample-1", eventCount = 1L, membershipBitsBase64 = encode(b))
  )
  list(
    hierarchies = list(
      list(id = "main", name = "Main", active = TRUE, rootPopulationId = "root")),
    populations = list(
      list(hierarchyId = "main", populationId = "root", populationName = "All Events",
           parentId = NULL, gateLogic = "and", gates = list(),
           sampleMasks = masks(c(1, 1), 1)),
      list(hierarchyId = "main", populationId = "child", populationName = "CD3+",
           parentId = "root", gateLogic = "and",
           gates = list(list(gateId = "gate-1", gateName = "CD3 positive", include = TRUE)),
           sampleMasks = masks(c(1, 0), 1))
    )
  )
}

import_ready_sce <- function() {
  GateLabR:::.gatelabr_store_host_workspace(
    import_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 3L,
    reason = "explicit",
    workspace_json = import_workspace_json(),
    memberships = import_memberships_payload()
  )$sce
}

import_gating <- function(sce) {
  jsonlite::fromJSON(
    S4Vectors::metadata(sce)$gatelab_workspace$workspace_json,
    simplifyVector = FALSE
  )$gating
}
