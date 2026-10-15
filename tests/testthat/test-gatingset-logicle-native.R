skip_if_not_installed("flowWorkspace")
skip_if_not_installed("flowCore")

native_logicle_fixture <- function(A = 0, M = 4.5) {
  raw <- c(-1000, -100, -10, 0, 10, 100, 1000, 262144)
  frames <- flowCore::flowSet(list(
    flowCore::flowFrame(cbind(CD4 = raw, EventID = seq_along(raw))),
    flowCore::flowFrame(cbind(CD4 = rev(raw), EventID = rev(seq_along(raw))))))
  flowCore::sampleNames(frames) <- c("D1", "D2")
  gs <- flowWorkspace::GatingSet(frames)
  transforms <- list(
    D1 = flowWorkspace::transformerList("CD4", flowWorkspace::logicle_trans(t = 262144, w = 0.5, m = M, a = A)),
    D2 = flowWorkspace::transformerList("CD4", flowWorkspace::logicleGml2_trans(T = 262144, W = 0.5, M = M, A = A)))
  flowWorkspace::transform(gs, transforms)
  list(gs = gs, raw = raw)
}

test_that("native legacy and GML2 logicle modes retain their own scales and raw events", {
  for (A in c(0, 0.75, -0.25)) {
    fixture <- native_logicle_fixture(A)
    gs <- fixture$gs
    before <- lapply(c("D1", "D2"), function(id) flowCore::exprs(flowWorkspace::gs_cyto_data(gs)[[id]]))
    keywords <- lapply(c("D1", "D2"), function(id) flowCore::keyword(flowWorkspace::gs_cyto_data(gs)[[id]]))
    # Independent frozen core values are tested elsewhere. These anchors exercise the
    # actual C++ modes, whose raw parameter records are identical in flowWorkspace 4.16.
    for (id in c("D1", "D2")) {
      axis <- GateLabR:::.gatelabr_gatingset_axes(gs, c("CD4", "EventID"), id)$CD4
      expected_scale <- if (id == "D1") 4.5 else 1
      expect_equal(axis$backward(c((0.5 + A) / (4.5 + A), 1)),
                   expected_scale * c((0.5 + A) / (4.5 + A), 1))
      expect_equal(axis$transform(c(0, 262144)),
                   expected_scale * c((0.5 + A) / (4.5 + A), 1), tolerance = 1e-9)
      path <- withr::local_tempfile(fileext = ".f32")
      GateLabR:::.gatelabr_write_gatingset_assay_payload(gs, id, c("CD4", "EventID"), path)
      actual <- matrix(readBin(path, "numeric", n = 16, size = 4, endian = "little"), ncol = 2)
      expect_equal(actual[, 1], if (id == "D1") fixture$raw else rev(fixture$raw), tolerance = 1e-6)
      expect_identical(actual[, 2], as.numeric(if (id == "D1") seq_along(fixture$raw) else rev(seq_along(fixture$raw))))
    }
    expect_identical(lapply(c("D1", "D2"), function(id) flowCore::exprs(flowWorkspace::gs_cyto_data(gs)[[id]])), before)
    expect_identical(lapply(c("D1", "D2"), function(id) flowCore::keyword(flowWorkspace::gs_cyto_data(gs)[[id]])), keywords)
    expect_identical(flowWorkspace::gs_get_pop_paths(gs), "root")
  }
})

test_that("native logicle discovery does not infer the mode from observed values or instrument ranges", {
  fixture <- native_logicle_fixture()
  gs <- fixture$gs
  # A valid change in instrument metadata must not select a different transform convention.
  for (id in c("D1", "D2")) {
    frame <- flowWorkspace::gs_cyto_data(gs)[[id]]
    flowWorkspace::cf_keyword_set(frame, "$P1R", "17")
    flowWorkspace::cf_keyword_insert(frame, "$P1G", "10")
  }
  expect_equal(GateLabR:::.gatelabr_gatingset_axes(gs, "CD4", "D1")$CD4$backward(1), 4.5)
  expect_equal(GateLabR:::.gatelabr_gatingset_axes(gs, "CD4", "D2")$CD4$backward(1), 1)
  # A reordered sample view keeps the native transform attached to its sample identity.
  reordered <- gs[c("D2", "D1")]
  expect_equal(GateLabR:::.gatelabr_gatingset_axes(reordered, "CD4")$CD4$backward(1), 1)
  expect_equal(GateLabR:::.gatelabr_gatingset_axes(reordered, "CD4", "D1")$CD4$backward(1), 4.5)
})

test_that("native logicle discovery preserves reopened read-only data and existing gates", {
  gs <- native_logicle_fixture()$gs
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate(filterId = "CD4_positive", CD4 = c(0.2, 0.8)))
  flowWorkspace::recompute(gs)
  archive <- withr::local_tempdir()
  suppressMessages(flowWorkspace::save_gs(gs, archive))
  reopened <- suppressMessages(flowWorkspace::load_gs(archive))
  before <- lapply(c("D1", "D2"), function(id) list(
    values = flowCore::exprs(flowWorkspace::gs_cyto_data(reopened)[[id]]),
    keywords = flowCore::keyword(flowWorkspace::gs_cyto_data(reopened)[[id]]),
    mask = flowWorkspace::gh_pop_get_indices(reopened[[id]], "/CD4_positive"),
    gate = flowWorkspace::gh_pop_get_gate(reopened[[id]], "/CD4_positive")))
  for (id in c("D1", "D2")) {
    expect_equal(GateLabR:::.gatelabr_gatingset_axes(reopened, "CD4", id)$CD4$backward(1),
                 if (id == "D1") 4.5 else 1)
  }
  after <- lapply(c("D1", "D2"), function(id) list(
    values = flowCore::exprs(flowWorkspace::gs_cyto_data(reopened)[[id]]),
    keywords = flowCore::keyword(flowWorkspace::gs_cyto_data(reopened)[[id]]),
    mask = flowWorkspace::gh_pop_get_indices(reopened[[id]], "/CD4_positive"),
    gate = flowWorkspace::gh_pop_get_gate(reopened[[id]], "/CD4_positive")))
  expect_identical(after, before)
  expect_identical(flowWorkspace::gs_get_pop_paths(reopened), c("root", "/CD4_positive"))
})

test_that("M equal to one gives equivalent native logicle conventions", {
  gs <- native_logicle_fixture(M = 1)$gs
  for (id in c("D1", "D2")) {
    axis <- GateLabR:::.gatelabr_gatingset_axes(gs, "CD4", id)$CD4
    expect_equal(axis$forward(c(0.5, 1)), c(0.5, 1))
    expect_equal(axis$transform(c(0, 262144)), c(0.5, 1), tolerance = 1e-9)
  }
})

test_that("native logicle discovery refuses an unavailable or ineffective native accessor", {
  gs <- native_logicle_fixture()$gs
  equivalent <- native_logicle_fixture(M = 1)$gs
  testthat::local_mocked_bindings(gs_transform_data = function(pointer) invisible(NULL), .package = "flowWorkspace")
  expect_error(GateLabR:::.gatelabr_gatingset_axes(gs, "CD4", "D2"), "native logicle convention")
  expect_error(GateLabR:::.gatelabr_gatingset_axes(equivalent, "CD4", "D2"), "native logicle convention")
})

test_that("native logicle discovery reports a missing native accessor", {
  gs <- native_logicle_fixture()$gs
  testthat::local_mocked_bindings(gs_transform_data = NULL, .package = "flowWorkspace")
  expect_error(GateLabR:::.gatelabr_gatingset_axes(gs, "CD4", "D2"), "native transform accessor is unavailable")
})
