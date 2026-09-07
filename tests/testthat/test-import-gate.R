# gatelabImportGate() -- putting a gate that already exists into a workspace.
#
# The fixtures here are the memberships ones: a two-sample SCE with a saved workspace holding
# one rectangle gate. That gives an import something real to insert into and a memberships
# record to check is left alone.

# ---- what it writes ---------------------------------------------------------------------

test_that("an imported polygon lands in the workspace with its channels", {
  sce <- import_ready_sce()
  out <- suppressMessages(gatelabImportGate(
    sce, name = "CD3 high", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5))))

  ws <- import_gating(out)
  gate <- ws$gates[[setdiff(names(ws$gates), "gate-1")]]
  expect_identical(gate$name, "CD3 high")
  expect_identical(gate$gate_type, "polygon")
  expect_identical(gate$x_channel, "CD3")
  expect_identical(gate$y_channel, "CD19")
  expect_length(gate$vertices, 3L)
})

test_that("the gate gets a population under the root, linked both ways", {
  out <- suppressMessages(gatelabImportGate(
    import_ready_sce(), name = "CD3 high", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5))))

  ws <- import_gating(out)
  pid <- setdiff(names(ws$populations), c("root", "child"))
  expect_identical(ws$populations[[pid]]$parent_id, "root")
  expect_true(pid %in% unlist(ws$populations$root$children))
  expect_identical(ws$populations[[pid]]$gate_refs[[1]]$gate_id,
                   ws$gates[[setdiff(names(ws$gates), "gate-1")]]$gate_id)
})

test_that("a named parent is resolved, so you need not know population ids", {
  out <- suppressMessages(gatelabImportGate(
    import_ready_sce(), name = "CD3 high", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5)), parent = "CD3+"))
  ws <- import_gating(out)
  pid <- setdiff(names(ws$populations), c("root", "child"))
  expect_identical(ws$populations[[pid]]$parent_id, "child")
})

test_that("a rectangle takes two opposite corners", {
  out <- suppressMessages(gatelabImportGate(
    import_ready_sce(), name = "box", x_channel = "CD3", y_channel = "CD19",
    vertices = rbind(c(0, 0), c(4, 4)), gate_type = "rectangle"))
  gate <- import_gating(out)$gates[[setdiff(names(import_gating(out)$gates), "gate-1")]]
  expect_identical(gate$gate_type, "rectangle")
  expect_length(gate$vertices, 2L)
})

# ---- membership is the app's job, never this function's ---------------------------------

test_that("importing leaves memberships alone and puts the revisions out of step", {
  sce <- import_ready_sce()
  before <- S4Vectors::metadata(sce)$gatelab_workspace
  out <- suppressMessages(gatelabImportGate(
    sce, name = "CD3 high", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5))))
  after <- S4Vectors::metadata(out)$gatelab_workspace

  # Untouched, deliberately: which events fall inside a gate is decided in the browser.
  expect_identical(after$memberships, before$memberships)
  # Ahead by one, so the existing staleness check fires instead of a stale mask being read.
  expect_identical(after$revision, before$revision + 1L)
  expect_gt(after$revision, after$memberships$revision)
})

test_that("gatelabPopulations refuses a stale mask after an import", {
  out <- suppressMessages(gatelabImportGate(
    import_ready_sce(), name = "CD3 high", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5))))
  expect_error(gatelabPopulations(out), regexp = "Save to SCE|stale|revision")
})

# ---- what it refuses --------------------------------------------------------------------

test_that("a channel absent from the SCE is refused, with near misses named", {
  expect_error(
    gatelabImportGate(import_ready_sce(), name = "g", x_channel = "cd3", y_channel = "CD19",
                      vertices = cbind(c(1, 5, 5), c(1, 1, 5))),
    regexp = "did you mean: CD3")
  expect_error(
    gatelabImportGate(import_ready_sce(), name = "g", x_channel = "CD4", y_channel = "CD19",
                      vertices = cbind(c(1, 5, 5), c(1, 1, 5))),
    regexp = "not in this SCE")
})

test_that("a two-vertex polygon and a three-vertex rectangle are refused", {
  expect_error(
    gatelabImportGate(import_ready_sce(), name = "g", x_channel = "CD3", y_channel = "CD19",
                      vertices = rbind(c(0, 0), c(1, 1))),
    regexp = "at least 3 vertices")
  expect_error(
    gatelabImportGate(import_ready_sce(), name = "g", x_channel = "CD3", y_channel = "CD19",
                      vertices = cbind(c(1, 5, 5), c(1, 1, 5)), gate_type = "rectangle"),
    regexp = "exactly two opposite corners")
})

test_that("a duplicate name is refused, and the object is left untouched", {
  sce <- import_ready_sce()
  expect_error(
    gatelabImportGate(sce, name = "CD3 positive", x_channel = "CD3", y_channel = "CD19",
                      vertices = cbind(c(1, 5, 5), c(1, 1, 5))),
    regexp = "already in this workspace")
  expect_identical(S4Vectors::metadata(sce)$gatelab_workspace$revision, 1L)
})

test_that("overwrite = TRUE replaces the gate and its population", {
  out <- suppressMessages(gatelabImportGate(
    import_ready_sce(), name = "CD3 positive", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5)), overwrite = TRUE))
  ws <- import_gating(out)
  expect_false("gate-1" %in% names(ws$gates))
  expect_false("child" %in% names(ws$populations))
  expect_false("child" %in% unlist(ws$populations$root$children))
  expect_length(ws$gates, 1L)
})

test_that("an SCE with no workspace says how to make one rather than synthesising it", {
  expect_error(
    gatelabImportGate(import_sce(), name = "g", x_channel = "CD3",
                      y_channel = "CD19", vertices = cbind(c(1, 5, 5), c(1, 1, 5))),
    regexp = "no GateLab workspace")
})

test_that("an unknown parent names the populations that do exist", {
  expect_error(
    gatelabImportGate(import_ready_sce(), name = "g", x_channel = "CD3", y_channel = "CD19",
                      vertices = cbind(c(1, 5, 5), c(1, 1, 5)), parent = "Nope"),
    regexp = "All Events")
})

test_that("non-finite vertices are refused", {
  expect_error(
    gatelabImportGate(import_ready_sce(), name = "g", x_channel = "CD3", y_channel = "CD19",
                      vertices = cbind(c(1, 5, NA), c(1, 1, 5))),
    regexp = "non-finite")
})

# ---- the round trip that matters ---------------------------------------------------------

test_that("the imported workspace still parses and validates as a workspace", {
  out <- suppressMessages(gatelabImportGate(
    import_ready_sce(), name = "CD3 high", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5))))
  json <- S4Vectors::metadata(out)$gatelab_workspace$workspace_json
  parsed <- jsonlite::fromJSON(json, simplifyVector = FALSE)

  # Round-tripping through toJSON must not turn arrays into scalars: gate_order and children
  # are string arrays, and a single-element array collapsing to a bare string is the failure
  # this test exists to catch.
  expect_true(is.list(parsed$gating$gate_order) || is.character(parsed$gating$gate_order))
  expect_length(unlist(parsed$gating$gate_order), 2L)
  expect_silent(GateLabR:::.gatelabr_legacy_workspace_from_canonical(parsed, import_ready_sce()))
})

test_that("two imports in a row both survive", {
  sce <- suppressMessages(gatelabImportGate(
    import_ready_sce(), name = "first", x_channel = "CD3", y_channel = "CD19",
    vertices = cbind(c(1, 5, 5), c(1, 1, 5))))
  sce <- suppressMessages(gatelabImportGate(
    sce, name = "second", x_channel = "CD19", y_channel = "CD3",
    vertices = cbind(c(0, 2, 2), c(0, 0, 2))))
  ws <- import_gating(sce)
  expect_length(ws$gates, 3L)
  expect_length(unlist(ws$gate_order), 3L)
  expect_identical(S4Vectors::metadata(sce)$gatelab_workspace$revision, 3L)
})
