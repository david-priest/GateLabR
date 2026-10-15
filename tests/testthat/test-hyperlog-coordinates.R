test_that("saved Hyperlog coordinates agree with independent FlowUtils vectors", {
  oracle <- jsonlite::fromJSON(test_path("fixtures", "hyperlog-oracle.json"), simplifyVector = FALSE)
  expect_identical(oracle$flowutils, "1.2.2")
  for (case in oracle$cases) {
    p <- case$params
    spec <- list(kind = "hyperlog", T = p$t, W = p$w, M = p$m, A = p$a)
    tx <- GateLabR:::.gatelabr_strategy_transform(spec)
    raw <- unlist(case$raw); saved <- raw + 0
    expect_equal(tx$forward(raw), unlist(case$forward), tolerance = 1e-10)
    expect_equal(tx$inverse(unlist(case$display)), unlist(case$inverse), tolerance = 1e-10)
    expect_equal(GateLabR:::.gatelabr_spec_inverse(spec)(unlist(case$display)),
                 unlist(case$inverse), tolerance = 1e-10)
    expect_identical(raw, saved)
    expect_equal(tx$forward(c(0, p$t)), c((p$a + p$w) / (p$m + p$a), 1), tolerance = 1e-12)
  }
})

test_that("missing native Hyperlog support is refused", {
  local_mocked_bindings(.gatelabr_hyperlog_kernel = function() NULL, .package = "GateLabR")
  spec <- list(kind = "hyperlog", T = 262144, W = 0.5, M = 4.5, A = 0)
  expect_error(GateLabR:::.gatelabr_strategy_transform(spec), "native kernel is unavailable")
  expect_null(GateLabR:::.gatelabr_spec_inverse(spec))
})

test_that("Hyperlog strategy drawing and membership retain saved unit coordinates", {
  values <- c(-1e6, -1000, -10, 0, 10, 1000, 1e6)
  sce <- SingleCellExperiment::SingleCellExperiment(assays = list(counts = rbind(CD4 = values, CD8 = values)))
  spec <- list(kind = "hyperlog", T = 262144, W = 0.5, M = 4.5, A = 0.75)
  gating <- list(workspace = list(hostedChannelTransforms = list(CD4 = spec, CD8 = spec)))
  coordinates <- GateLabR:::.gatelabr_strategy_coordinates(sce, gating, "counts")
  gate <- GateLabR:::.gatelabr_strategy_gate(list(
    gate_id = "g", name = "CD4_positive", gate_type = "rectangle", x_channel = "CD4", y_channel = "CD8",
    vertices = list(list(0.2, 0.2), list(0.8, 0.8)), space = "display", transforms = list(CD4 = spec, CD8 = spec)))
  drawn <- GateLabR:::.gatelabr_strategy_gate_display(gate, coordinates)
  expect_equal(drawn$vertices, rbind(c(0.2, 0.2), c(0.8, 0.2), c(0.8, 0.8), c(0.2, 0.8)), tolerance = 1e-10)
  expect_equal(GateLabR:::.gatelabr_strategy_gate_membership(gate, coordinates),
               c(FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE))
  # flowWorkspace has no native Hyperlog transformer. Unsupported native geometry
  # therefore follows the existing exact-membership fallback instead of being relabelled.
  expect_null(GateLabR:::.gatelabr_transformer_list(list(CD4 = spec), "CD4"))
})

test_that("Hyperlog bounds and invalid domains are handled explicitly", {
  trans <- GateLabR:::.gatelabr_strategy_transform
  base <- list(kind = "hyperlog", T = 262144, W = 0.5, M = 4.5, A = 0)
  tx <- trans(base)
  expect_identical(tx$forward(c(NA_real_, NaN, -Inf, Inf)), c(NA_real_, NaN, -Inf, Inf))
  bounded <- trans(c(base, list(bounds = list(min = 0, max = 1))))
  expect_equal(bounded$forward(c(-1e6, 1e6)), c(0, 1))
  expect_equal(bounded$inverse(c(-1, 2)), tx$inverse(c(-1, 2)))
  for (bad in list(list(T = 0), list(W = 0), list(M = 0), list(W = 3), list(A = -0.6),
                   list(A = 4), list(T = Inf), list(A = NA_real_))) {
    invalid <- utils::modifyList(base, bad)
    expect_error(trans(invalid), "Invalid saved Hyperlog")
    expect_null(GateLabR:::.gatelabr_spec_inverse(invalid))
  }
})
