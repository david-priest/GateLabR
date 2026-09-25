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
  expect_identical(first$gatelab_event_id, c(1001, 1003, 1005))

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
  # Subset back to the events of one save, each reads that save's memberships, as it did before
  # the objects were combined.
  expect_identical(unname(gatelabPopulations(cbind(first, second)[, 1:3])[, "CD3+"]), saved_cd3)
  expect_identical(
    as.character(gatelabLeafPopulation(cbind(first, second)[, c(6L, 4L)])),
    saved_leaf[c(3L, 1L)]
  )
  # With only the first object's metadata left, the second's events are still recognised as foreign.
  combined <- cbind(first, second)
  S4Vectors::metadata(combined) <- S4Vectors::metadata(first)
  expect_error(gatelabPopulations(combined), "3 of this SCE's 6 events are not among")
})

# The payload the browser sends for an object whose events are copies of the fixture's: `source`
# names, for each event, the fixture event (1 to 3) it is, and the event keeps that one's
# memberships.
payload_for <- function(sce, source) {
  partition <- GateLabR:::.gatelabr_sample_partition(sce, include_metadata = FALSE)
  masks <- function(bits) lapply(seq_along(partition$samples), function(index) {
    rows <- partition$event_indices[[index]]
    list(
      sampleId = partition$samples[[index]]$id,
      eventCount = length(rows),
      membershipBitsBase64 = base64enc::base64encode(GateLabR:::.gatelabr_pack_bits(bits[source][rows]))
    )
  })
  fixture_bits <- list(
    c(TRUE, TRUE, TRUE), saved_cd3, c(FALSE, FALSE, TRUE), c(TRUE, TRUE, TRUE), c(FALSE, TRUE, FALSE)
  )
  payload <- memberships_payload()
  for (index in seq_along(payload$populations)) {
    payload$populations[[index]]$sampleMasks <- masks(fixture_bits[[index]])
  }
  payload
}

test_that("Save to SCE on a combined object replaces the records cbind() brought with it", {
  local_mocked_bindings(
    .gatelabr_event_id_offset = local({
      offsets <- c(1000, 5000, 9000)
      calls <- 0L
      function(...) {
        calls <<- calls + 1L
        offsets[[calls]]
      }
    }),
    .package = "GateLabR"
  )
  cbind <- SingleCellExperiment::cbind
  combined <- cbind(store_with_memberships()$sce, store_with_memberships()$sce)
  expect_error(gatelabPopulations(combined), "saved separately")
  # The refusal asks for "Save to SCE" on the combined object. That save rewrote only the first
  # of the two records cbind() kept, so the second still stood and the refusal never cleared.
  resaved <- GateLabR:::.gatelabr_store_host_workspace(
    combined,
    dataset_id = "test-sce",
    expected_revision = 1L,
    client_revision = 4L,
    reason = "explicit",
    workspace_json = memberships_workspace_json(),
    memberships = payload_for(combined, rep(1:3, 2L))
  )$sce
  md <- S4Vectors::metadata(resaved)
  expect_identical(sum(names(md) == "gatelab_workspace"), 1L)
  expect_identical(sum(names(md) == "gating_workspace"), 1L)
  expect_identical(resaved$gatelab_event_id, 9000 + c(1, 3, 5, 7, 9, 11))
  expect_identical(unname(gatelabPopulations(resaved)[, "CD3+"]), rep(saved_cd3, 2L))
  order <- c(6L, 1L, 4L, 3L, 5L, 2L)
  expect_identical(
    as.character(gatelabLeafPopulation(resaved[, order])),
    rep(saved_leaf, 2L)[order]
  )
})

test_that("a record that carries no event ids does not block reading the saved events", {
  cbind <- SingleCellExperiment::cbind
  first <- store_with_memberships()$sce
  # Gated in GateLabR and autosaved, but never saved with memberships: its record has no ids.
  gated_only <- GateLabR:::.gatelabr_store_host_workspace(
    make_memberships_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "autosave",
    workspace_json = memberships_workspace_json()
  )$sce
  gated_only$gatelab_event_id <- NA_real_
  combined <- cbind(first, gated_only)
  # Its events are the ones without memberships, and the refusal says so rather than calling the
  # two objects separately saved.
  expect_error(gatelabPopulations(combined), "3 of this SCE's 6 events are not among the 3 events")
  back <- combined[, !is.na(combined$gatelab_event_id)]
  expect_identical(unname(gatelabPopulations(back)[, "CD3+"]), saved_cd3)
  expect_identical(as.character(gatelabLeafPopulation(back)), saved_leaf)
  # The other order: the record `$` reaches first is the one without memberships, and the object
  # was refused as though none were stored. Autosaved once more, its workspace is at revision 2,
  # which says nothing about memberships saved with another object's workspace at revision 1.
  gated_twice <- GateLabR:::.gatelabr_store_host_workspace(
    gated_only,
    dataset_id = "test-sce",
    expected_revision = 1L,
    client_revision = 2L,
    reason = "autosave",
    workspace_json = memberships_workspace_json()
  )$sce
  reversed <- cbind(gated_twice, first)
  expect_error(gatelabPopulations(reversed), "3 of this SCE's 6 events are not among the 3 events")
  expect_identical(unname(gatelabPopulations(reversed[, 4:6])[, "CD3+"]), saved_cd3)
  expect_identical(gatelabHierarchy(reversed[, 6:4])$event_count, c(3L, 2L, 1L))

  # The same for memberships saved before event ids existed.
  legacy <- store_with_memberships()$sce
  workspace <- S4Vectors::metadata(legacy)$gatelab_workspace
  workspace$memberships$event_ids <- NULL
  workspace$memberships$version <- 1L
  S4Vectors::metadata(legacy)$gatelab_workspace <- workspace
  legacy$gatelab_event_id <- NA_real_
  expect_identical(
    unname(gatelabPopulations(cbind(first, legacy)[, 1:3])[, "CD3+"]),
    saved_cd3
  )
  expect_identical(
    unname(gatelabPopulations(cbind(legacy, first)[, 4:6])[, "CD3+"]),
    saved_cd3
  )
})

test_that("the documented way to cbind() a saved SCE keeps its memberships readable", {
  cbind <- SingleCellExperiment::cbind
  first <- store_with_memberships()$sce
  # cbind() needs the id column on both objects. Given to the other object as NA, the saved events
  # read again once the combined object is subset back to them.
  other <- make_memberships_sce()
  other$gatelab_event_id <- NA_real_
  expect_identical(unname(gatelabPopulations(cbind(first, other)[, 1:3])[, "CD3+"]), saved_cd3)
  # Dropped from the saved object instead, which the README advised, the memberships are lost.
  dropped <- first
  dropped$gatelab_event_id <- NULL
  expect_error(
    gatelabPopulations(cbind(dropped, make_memberships_sce())[, 1:3]),
    "no `gatelab_event_id` column"
  )

  sources <- c(
    README = testthat::test_path("..", "..", "README.md"),
    Rd = testthat::test_path("..", "..", "man", "gatelabMemberships.Rd")
  )
  # R CMD check runs the tests against the installed package, which carries neither file.
  testthat::skip_if_not(all(file.exists(sources)), "README.md and man/ are only in the source tree")
  for (name in names(sources)) {
    text <- paste(readLines(sources[[name]], warn = FALSE, encoding = "UTF-8"), collapse = "\n")
    expect_false(grepl("gatelab_event_id <- NULL", text, fixed = TRUE), label = paste(name, "advises dropping the column"))
    expect_true(grepl("gatelab_event_id <- NA_real_", text, fixed = TRUE), label = paste(name, "advises NA on the other object"))
  }
})

test_that("an explicit save writes the event ids without touching the random number stream", {
  set.seed(20260924)
  seed_before <- .Random.seed
  saved <- store_with_memberships()$sce
  expect_identical(.Random.seed, seed_before)
  ids <- saved$gatelab_event_id
  expect_true(is.double(ids))
  expect_identical(diff(ids), c(2, 2))
  record <- S4Vectors::metadata(saved)$gatelab_workspace$memberships
  expect_identical(record$event_ids$column, "gatelab_event_id")
  expect_identical(record$event_ids$stride, 2)
  expect_identical(ids - record$event_ids$offset, c(1, 3, 5))
  # A per-event id is not a sample attribute: a one-event sample must not offer it as a chip.
  partition <- GateLabR:::.gatelabr_sample_partition(saved)
  expect_false("gatelab_event_id" %in% names(partition$samples[[2L]]$metadata))
})

test_that("every id a save writes is odd, and every id that lost precision is even", {
  # FCS stores every parameter as a 32-bit float, so an id exported as a channel and read back has
  # 24 significant bits; a table printed or written with fewer than 15 significant digits rounds
  # it to a multiple of ten. Both grids are even, and no save writes an even id.
  f32 <- function(x) readBin(writeBin(x, raw(), size = 4L), "double", size = 4L, n = length(x))
  for (event_count in c(1, 3, 1e5, 2^25 - 1, 2^25, 1e8)) {
    odd <- in_range <- exact <- float32_even <- rounded_even <- logical(0)
    for (draw in 1:25) {
      offset <- GateLabR:::.gatelabr_event_id_offset(paste0("draw ", draw), draw, event_count)
      positions <- unique(round(c(1, 2, seq(1, event_count, length.out = 200), event_count - 1, event_count)))
      positions <- positions[positions >= 1 & positions <= event_count]
      ids <- offset + 2 * positions - 1
      odd <- c(odd, ids %% 2 == 1)
      in_range <- c(in_range, ids > 2^48 & ids < 2^49)
      # 15 significant digits, as write.csv() writes a double, carry every id exactly.
      exact <- c(exact, as.numeric(format(ids, digits = 15)) == ids)
      float32_even <- c(float32_even, f32(ids) %% 2 == 0)
      rounded_even <- c(rounded_even, vapply(1:14, function(digits) all(signif(ids, digits) %% 2 == 0), logical(1)))
    }
    label <- paste("a save of", event_count, "events")
    expect_true(all(odd), label = paste("ids of", label, "are odd"))
    expect_true(all(in_range), label = paste("ids of", label, "lie between 2^48 and 2^49"))
    expect_true(all(exact), label = paste("ids of", label, "are exact in 15 digits"))
    expect_true(all(float32_even), label = paste("float32-rounded ids of", label, "are even"))
    expect_true(all(rounded_even), label = paste("ids of", label, "rounded to 1 to 14 digits are even"))
  }

  saved <- store_with_memberships()$sce
  saved$gatelab_event_id <- f32(saved$gatelab_event_id)
  expect_error(gatelabPopulations(saved), "lost precision")
})

test_that("an id rounded to fewer significant digits is refused, not read as another event", {
  # Consecutive ids put an id rounded to 14 significant digits (a multiple of ten) on another event
  # of the same save, and away from the ends of the saved range nothing noticed: the event read
  # that one's memberships with no error.
  source <- rep(1:3, 20L)
  sce <- make_memberships_sce()[, source]
  colnames(sce) <- paste0("event", seq_along(source))
  saved <- GateLabR:::.gatelabr_store_host_workspace(
    sce,
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 3L,
    reason = "explicit",
    workspace_json = memberships_workspace_json(),
    memberships = payload_for(sce, source)
  )$sce
  middle <- saved[, 11:50]
  expect_identical(unname(gatelabPopulations(middle)[, "CD3+"]), saved_cd3[source[11:50]])
  for (digits in c(14, 13, 12)) {
    rounded <- middle
    rounded$gatelab_event_id <- signif(rounded$gatelab_event_id, digits)
    expect_error(gatelabPopulations(rounded), "lost precision", label = paste(digits, "significant digits"))
  }
  # A whole-number round trip through text keeps every id.
  exact <- middle
  exact$gatelab_event_id <- as.numeric(format(exact$gatelab_event_id, digits = 15))
  expect_identical(unname(gatelabPopulations(exact)[, "CD3+"]), saved_cd3[source[11:50]])
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

  # Consecutive ids, as a development build of 1.4.8 wrote them, are not read by an odd-id rule.
  consecutive <- sce
  workspace <- S4Vectors::metadata(consecutive)$gatelab_workspace
  workspace$memberships$event_ids$stride <- NULL
  S4Vectors::metadata(consecutive)$gatelab_workspace <- workspace
  expect_error(gatelabPopulations(consecutive), "event ids in a form this version of GateLabR does not read")
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

# A population the tree a sample is gated under has no counterpart for arrives as not evaluated:
# no bits and a note. Here CD3+CD19- is not evaluated for Donor A (events 1-2).
not_evaluated_note <- paste(
  "'CD3+CD19-' of 'Main' was not evaluated for Donor A:",
  "the tree it is gated under, 'Main copy', has no such population."
)

not_evaluated_payload <- function() {
  payload <- memberships_payload()
  payload$populations[[3]]$sampleMasks[[1]] <- list(
    sampleId = "sample-0",
    eventCount = 2L,
    membershipBitsBase64 = "",
    notEvaluated = not_evaluated_note
  )
  payload
}

store_not_evaluated <- function(memberships) {
  GateLabR:::.gatelabr_store_host_workspace(
    make_memberships_sce(),
    dataset_id = "test-sce",
    expected_revision = 0L,
    client_revision = 1L,
    reason = "explicit",
    workspace_json = memberships_workspace_json(),
    memberships = memberships
  )
}

test_that("a population not evaluated for a sample is NA for its events, never outside", {
  expect_warning(
    written <- store_not_evaluated(not_evaluated_payload()),
    "Population 'CD3\\+CD19-' was not evaluated for 1 sample.*sample 'Donor A' \\(2 events\\)"
  )
  expect_identical(written$result$memberships, list(hierarchies = 2L, populations = 5L))
  sce <- written$sce
  # The count is of the events known to be inside.
  expect_identical(gatelabHierarchy(sce)$event_count, c(3L, 2L, 1L))

  expect_warning(
    members <- gatelabPopulations(sce),
    "Population 'CD3\\+CD19-' is NA for 2 of this object's events.*sample 'Donor A'.*has no such population"
  )
  expect_identical(unname(members[, "CD3+"]), c(TRUE, FALSE, TRUE))
  expect_identical(unname(members[, "CD3+CD19-"]), c(NA, NA, TRUE))

  # Event 1 is in CD3+ and may be in CD3+CD19- below it, so its deepest population is unknown.
  # Event 2 is outside CD3+, so it is outside CD3+CD19- too, and stays ungated.
  expect_warning(leaf <- gatelabLeafPopulation(sce), "sample 'Donor A'")
  expect_identical(as.character(leaf), c(NA, "ungated", "CD3+CD19-"))
  expect_identical(levels(leaf), c("CD3+", "CD3+CD19-", "ungated"))

  # Populations evaluated for every sample, and objects without the unevaluated events, read
  # without a warning.
  expect_no_warning(gatelabPopulations(sce, populations = "CD3+"))
  expect_no_warning(gatelabPopulations(sce, hierarchy = "Barcodes"))
  expect_no_warning(subset <- gatelabPopulations(sce[, 3]))
  expect_identical(unname(subset[, "CD3+CD19-"]), TRUE)
  expect_no_warning(expect_identical(as.character(gatelabLeafPopulation(sce[, 3])), "CD3+CD19-"))

  # The NA follows the events through a reorder.
  reordered <- sce[, c(3, 1, 2)]
  expect_warning(members <- gatelabPopulations(reordered, populations = "CD3+CD19-"), "Donor A")
  expect_identical(unname(members[, 1]), c(TRUE, NA, NA))
})

test_that("a not-evaluated mask that also carries bits, or a malformed note, is refused", {
  with_bits <- not_evaluated_payload()
  with_bits$populations[[3]]$sampleMasks[[1]]$membershipBitsBase64 <-
    base64enc::base64encode(as.raw(0L))
  expect_error(store_not_evaluated(with_bits), "not evaluated for sample 'Donor A' but carries membership bits")

  blank_note <- not_evaluated_payload()
  blank_note$populations[[3]]$sampleMasks[[1]]$notEvaluated <- ""
  expect_error(store_not_evaluated(blank_note), "malformed not-evaluated note for sample 'Donor A'")

  # Empty bits without a note are still a short payload.
  no_note <- not_evaluated_payload()
  no_note$populations[[3]]$sampleMasks[[1]]$notEvaluated <- NULL
  expect_error(store_not_evaluated(no_note), "has 0 bytes; expected 1")
})
