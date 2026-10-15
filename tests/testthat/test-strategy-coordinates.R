# Uniform analytical samples are independent of the adaptive subdivision's chosen points.
# Measure distance to the drawn segments, normalized separately by each axis's full span.
strategy_outline_error <- function(vertices, drawn, map) {
  mapped <- map(vertices[, 1], vertices[, 2])
  spans <- apply(mapped, 2, function(v) diff(range(v)))
  worst <- 0
  for (edge in seq_len(nrow(vertices))) {
    a <- vertices[edge, ]; b <- vertices[if (edge == nrow(vertices)) 1L else edge + 1L, ]
    t <- (0:8191) / 8191 # not the subdivision's dyadic sample positions
    points <- map(a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)
    nearest <- rep(Inf, nrow(points))
    for (j in seq_len(nrow(drawn))) {
      start <- drawn[j, ]; end <- drawn[if (j == nrow(drawn)) 1L else j + 1L, ]
      delta <- (end - start) / spans
      p <- sweep(sweep(points, 2, start), 2, spans, `/`)
      length_square <- sum(delta^2)
      along <- if (length_square > 0) pmin(1, pmax(0, as.vector(p %*% delta) / length_square)) else rep(0, nrow(p))
      distance <- sqrt((p[, 1] - along * delta[1])^2 + (p[, 2] - along * delta[2])^2)
      nearest <- pmin(nearest, distance)
    }
    worst <- max(worst, nearest)
  }
  worst
}

test_that("saved transforms reconstruct negative, zero and large values in the embedded core's units", {
  trans <- GateLabR:::.gatelabr_strategy_transform
  x <- c(-1000, -10, 0, 10, 1000, 1e6)
  expect_equal(trans(list(kind = "identity"))$forward(x), x)
  expect_equal(trans(list(kind = "asinh", cofactor = 5))$forward(x), asinh(x / 5))
  expect_equal(trans(list(kind = "asinh", cofactor = 5))$inverse(asinh(x / 5)), x)
  expect_equal(trans(list(kind = "wsplog", offset = 10, decades = 2))$forward(x), c(0, 0, 0, 0, 1, 2.5))
  expect_equal(trans(list(kind = "flog", T = 1000, M = 3))$forward(x), c(0, 0, 0, 1 / 3, 1, 2))
  standard <- trans(list(kind = "flog", T = 1000, M = 3, standard = TRUE))$forward(x)
  expect_true(all(is.nan(standard[1:2])))
  expect_equal(standard[3:6], c(-Inf, 1 / 3, 1, 2))
  bounded <- trans(list(kind = "asinh", cofactor = 5, bounds = list(min = 0, max = 2)))
  expect_equal(bounded$forward(x), pmin(2, pmax(0, asinh(x / 5))))
  expect_equal(bounded$inverse(c(-1, 3)), 5 * sinh(c(-1, 3))) # bounds constrain events, not inverse vertices

  # Numeric oracle from the embedded source f040e5d, engine/transforms.ts's exported Logicle.
  # These constants are independent of the R forward implementation (flowCore).
  logicle <- trans(list(kind = "logicle", T = 262144, W = 0.5, M = 4.5, A = 0))
  raw <- c(-1e6, -1000, -10, 0, 10, 1000, 1e6)
  expected <- c(-0.90702048634541, -0.23211535395017646, 0.099917946544774,
                0.1111111111111111, 0.12230427567744821, 0.45433757617239867, 1.1292427085676322)
  expect_equal(logicle$forward(raw), expected, tolerance = 1e-10)
  expect_equal(logicle$inverse(expected), raw, tolerance = 1e-9)
  # A changes the negative range but flowCore's scale factor is still M, not M + A.
  # Forward oracles from the same embedded Logicle export; both signs of A are valid here.
  expected_shifted <- list(
    c(-0.6345889882960657, -0.05609887481443698, 0.2285010970383777, 0.23809523809523808,
      0.24768937915209846, 0.5322893510049131, 1.1107794644865419),
    c(-1.019198162012787, -0.30459272771195156, 0.04697194340034895, 0.058823529411764705,
      0.07067511542318046, 0.42223978653548094, 1.1368452208363165))
  for (i in 1:2) {
    A <- c(0.75, -0.25)[i]
    shifted <- trans(list(kind = "logicle", T = 262144, W = 0.5, M = 4.5, A = A))
    expect_equal(shifted$forward(raw), expected_shifted[[i]], tolerance = 1e-10)
    expect_equal(shifted$inverse(expected_shifted[[i]]), raw, tolerance = 1e-9)
    expect_equal(shifted$forward(c(0, 262144)), c((0.5 + A) / (4.5 + A), 1), tolerance = 1e-10)
  }
  expect_error(trans(list(kind = "unknown")), "Cannot reconstruct saved transform kind")
  expect_error(trans(list()), "without its kind")
  expect_error(trans(list(kind = "asinh", cofactor = 0)), "invalid 'cofactor'")
  expect_error(trans(list(kind = "identity", bounds = list(min = 3, max = 1))), "invalid bounds")
})

test_that("normalized logicle gate coordinates draw and count known events", {
  values <- c(-1e6, -1000, -10, 0, 10, 1000, 1e6)
  sce <- SingleCellExperiment::SingleCellExperiment(assays = list(counts = rbind(CD4 = values, CD8 = values)))
  spec <- list(kind = "logicle", T = 262144, W = 0.5, M = 4.5, A = 0.75)
  gating <- list(workspace = list(hostedChannelTransforms = list(CD4 = spec, CD8 = spec)))
  coordinates <- GateLabR:::.gatelabr_strategy_coordinates(sce, gating, "counts")
  gate <- GateLabR:::.gatelabr_strategy_gate(list(
    gate_id = "g", name = "CD4_positive", gate_type = "rectangle", x_channel = "CD4", y_channel = "CD8",
    vertices = list(list(0, 0), list(0.5, 0.5)), space = "display", transforms = list(CD4 = spec, CD8 = spec)))
  drawn <- GateLabR:::.gatelabr_strategy_gate_display(gate, coordinates)
  expect_equal(drawn$vertices, rbind(c(0, 0), c(0.5, 0), c(0.5, 0.5), c(0, 0.5)), tolerance = 1e-10)
  expect_equal(GateLabR:::.gatelabr_strategy_gate_membership(gate, coordinates), c(FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE))
})

test_that("biex reconstructs the saved table resolution and spline choice separately", {
  trans <- GateLabR:::.gatelabr_strategy_transform
  base <- list(kind = "biex", maxValue = 262144, pos = 4.5, neg = 0, widthBasis = -10, channelRange = 256)
  raw <- c(-1000, -10, 0, 10, 1000, 100000, 1e6)
  # Exported biexTransform() at embedded core f040e5d: frozen forward and inverse values,
  # including clamped ends for linear interpolation and extrapolation for the natural spline.
  legacy <- trans(base)
  expect_equal(legacy$forward(raw), c(0, 24.663212011151185, 28, 31.336787988848815,
                                     119.21457936753282, 233.4428093489241, 256), tolerance = 1e-10)
  expect_equal(legacy$inverse(c(0, 20, 100, 200, 256)),
               c(-93.49809945251306, -24.13243365378306, 484.83122752616, 25477.90504609153, 251716.54911695892),
               tolerance = 1e-10)
  modern <- trans(c(base, list(tableChannels = 4096)))
  expect_equal(modern$forward(raw), c(0, 25.565970183993223, 28.4375, 31.309029816006777,
                                     116.36594411628286, 232.2257738150399, 256), tolerance = 1e-10)
  expect_equal(modern$inverse(c(0, 20, 100, 200, 256)),
               c(-110.59753674183438, -29.61607415098521, 545.5340844030526, 27210.143960550522, 261589.91899050146),
               tolerance = 1e-10)
  spline <- trans(c(base, list(spline = TRUE)))
  expect_equal(spline$forward(raw), c(-221.5462232701421, 24.662927239217527, 28, 31.337072760782473,
                                     119.21800526436171, 233.44787056638646, 329.44464271113605), tolerance = 1e-10)
  expect_true(all(is.na(legacy$forward(c(NA, Inf, -Inf)))))
  expect_error(trans(utils::modifyList(base, list(widthBasis = 1))), "Invalid saved biex")
})

test_that("FlowJo channel grids preserve rounding, floors, endpoints and inverse centres", {
  trans <- GateLabR:::.gatelabr_strategy_transform
  linear <- trans(list(kind = "flowjoChannels", channels = 256,
                       axis = list(kind = "linear", minRange = 0, maxRange = 256)))
  expect_equal(linear$forward(c(-1, 0, 0.49, 0.5, 1.5, 255, 256, 1e6)), c(0, 0, 0, 1, 2, 255, 255, 255))
  expect_equal(linear$inverse(c(-1, 0, 128, 256)), c(-1, 0, 128, 256))
  log <- trans(list(kind = "flowjoChannels", channels = 100,
                    axis = list(kind = "wsplog", offset = 10, decades = 2)))
  expect_equal(log$forward(c(-10, 0, 10, 100, 1000, 1e6)), c(0, 0, 0, 50, 99, 99))
  expect_equal(log$inverse(c(0, 50, 100)), c(10, 100, 1000))
  biex <- trans(list(kind = "flowjoChannels", channels = 256,
                     axis = list(kind = "biex", maxValue = 262144, pos = 4.5, neg = 0,
                                 widthBasis = -10, channelRange = 256)))
  expect_equal(biex$forward(c(-1000, -10, 0, 10, 1000, 100000, 1e6)), c(0, 25, 28, 31, 116, 232, 256))
  expect_equal(biex$inverse(256), 261589.91899050146, tolerance = 1e-10)
  expect_equal(biex$forward(biex$inverse(c(0, 28, 116, 255, 256))), c(0, 28, 116, 255, 256))
})

# Twelve synthetic events, two samples with different gate bounds and quadrant centres. The
# parent masks intentionally exclude one event per sample that its rectangle geometrically
# contains, so replacing a named population with a new geometric count fails this fixture.
strategy_coordinates_fixture <- function(label_offsets = list()) {
  counts <- rbind(CD4 = rep(c(0, 5, 15, 30, 60, 100), 2), CD8 = rep(c(0, 5, 15, 5, 15, 30), 2))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(sample_id = rep(c("D1", "D2"), each = 6)))
  S4Vectors::metadata(sce) <- list(instrument_type = "flow", cofactor = 5)
  specs <- list(CD4 = list(kind = "asinh", cofactor = 5), CD8 = list(kind = "asinh", cofactor = 5))
  rectangle <- function(id, low, high, ymin = 0, ymax = 20) list(
    gate_id = id, name = id, gate_type = "rectangle", x_channel = "CD4", y_channel = "CD8",
    vertices = list(list(low, ymin), list(high, ymax)), space = "raw", bounds = "half-open", color = "#e41a1c")
  tree <- function(prefix = "", second = FALSE) {
    id <- function(x) paste0(prefix, x)
    gate <- rectangle(id("g"), if (second) 15 else 5, if (second) 100 else 60)
    gate$label_offset <- label_offsets[[if (second) "D2" else "D1"]]
    quadrant <- list(gate_id = id("q"), name = "quadrant", gate_type = "quadrant", x_channel = "CD4", y_channel = "CD8",
                     center = list(if (second) 20 else 10, 10), space = "raw", color = "#377eb8")
    gates <- list(gate, quadrant, rectangle(id("r1"), 10, 50, 0, 50), rectangle(id("r2"), 0, 200, 10, 30))
    names(gates) <- vapply(gates, `[[`, character(1), "gate_id")
    ref <- function(g, q = NULL) {
      out <- list(gate_id = id(g), include = TRUE)
      if (!is.null(q)) out$quadrant <- q
      out
    }
    pop <- function(key, name, parent, refs, children = list()) list(
      population_id = id(key), name = name, parent_id = if (is.null(parent)) NULL else id(parent),
      gate_refs = refs, gate_logic = "and", children = lapply(children, id))
    populations <- list(
      pop("root", "All Events", NULL, list(), list("p")),
      pop("p", "CD4_positive", "root", list(ref("g")), list("p_q2", "p_and")),
      pop("p_q2", "CD8_positive", "p", list(ref("q", 2L))),
      pop("p_and", "treated", "p", if (second) list(ref("r2"), ref("r1")) else list(ref("r1"), ref("r2"))))
    names(populations) <- vapply(populations, `[[`, character(1), "population_id")
    list(gates = gates, populations = populations, root_population_id = id("root"), gate_order = as.list(names(gates)))
  }
  main <- tree(); copy <- tree("D2:", TRUE)
  ref <- list(id = "tailored", name = "D2", owner_sample_id = "strategy-fixture:sample-1", structure_locked = TRUE,
              source_hierarchy_id = "main",
              source_gate_ids = stats::setNames(as.list(names(main$gates)), names(copy$gates)),
              source_population_ids = stats::setNames(as.list(names(main$populations)), names(copy$populations)))
  none <- structure(list(), names = character(0))
  ws <- list(format = "gatelab-workspace", version = 2L, workspaceId = "strategy-fixture", savedAt = "2026-01-01T00:00:00Z",
             app = "GateLab", hostedAssayId = "counts", hostedChannelTransforms = specs,
             samples = list(
               list(sampleId = "strategy-fixture:sample-0", fileName = "D1", logicleW = none, compensationOn = FALSE, instrumentMode = "flow"),
               list(sampleId = "strategy-fixture:sample-1", fileName = "D2", logicleW = none, compensationOn = FALSE,
                    instrumentMode = "flow", hierarchyId = "tailored")),
             activeSample = 0L,
             gating = c(main, list(active_hierarchy_id = "main", hierarchies = list(list(id = "main", name = "Main"), ref),
                                   stored_hierarchies = list(c(ref, copy)), perFileHierarchies = TRUE)),
             scales = list(globalScales = list(CD4 = list(0, 5), CD8 = list(0, 5))), display = none)
  bits <- list(root = rep(TRUE, 12), p = seq_len(12) %in% c(2, 3, 9, 10),
               p_q2 = seq_len(12) %in% 3, p_and = seq_len(12) %in% c(3, 9))
  masks <- function(values) lapply(1:2, function(i) list(
    sampleId = paste0("sample-", i - 1), eventCount = 6L,
    membershipBitsBase64 = base64enc::base64encode(GateLabR:::.gatelabr_pack_bits(values[((i - 1) * 6 + 1):(i * 6)]))))
  payload <- list(
    hierarchies = list(list(id = "main", name = "Main", active = TRUE, rootPopulationId = "root"),
                       list(id = "tailored", name = "D2", active = FALSE, rootPopulationId = "D2:root")),
    populations = lapply(names(bits), function(id) list(
      hierarchyId = "main", populationId = id, populationName = main$populations[[id]]$name,
      parentId = main$populations[[id]]$parent_id, gateLogic = "and", gates = list(), sampleMasks = masks(bits[[id]]))))
  saved <- GateLabR:::.gatelabr_store_host_workspace(
    sce, dataset_id = "strategy-fixture", expected_revision = 0L, client_revision = 1L, reason = "explicit",
    workspace_json = as.character(jsonlite::toJSON(ws, auto_unbox = TRUE, null = "null", digits = I(17))),
    memberships = payload)$sce
  list(sce = saved, workspace = ws, bits = bits)
}

strategy_find_panel <- function(plot, title) {
  for (wrapper in plot$children) for (panel in wrapper$children) {
    if (!inherits(panel, "gatelab_panel")) next
    if (any(vapply(panel$children, function(child) inherits(child, "text") && identical(child$label, title), logical(1)))) return(panel)
  }
  stop("Panel not drawn: ", title)
}

test_that("raw-assay strategies draw both samples' saved outlines and keep named counts from stored masks", {
  fixture <- strategy_coordinates_fixture(); sce <- fixture$sce; original <- sce
  plot <- gatelabStrategyPlot(sce, c("CD8_positive", "treated"), max_events = 0)
  rows <- attr(plot, "panels")
  parent <- rows[rows$population == "CD4_positive", ]
  expect_equal(parent$events, c(2, 2))
  expect_equal(parent$parent_events, c(6, 6))
  expect_equal(parent$samples, c("D1", "D2"))
  expect_equal(parent$percent_of_parent, c(33.3, 33.3))
  expect_equal(sum(gatelabPopulations(sce, populations = "CD4_positive")), 4)

  panel <- strategy_find_panel(plot, "All Events (12)")
  outlines <- Filter(function(child) inherits(child, "polygon"), panel$children)
  expect_length(outlines, 2L)
  geo <- attr(panel, "geometry")
  data_x <- function(grob) (as.numeric(grob$x) - geo$margin[["left"]]) / geo$W * 5
  data_y <- function(grob) (geo$margin[["top"]] + geo$H - as.numeric(grob$y)) / geo$H * 5
  expect_equal(data_x(outlines[[1]]), asinh(c(5, 60, 60, 5) / 5))
  expect_equal(data_x(outlines[[2]]), asinh(c(15, 100, 100, 15) / 5))
  expect_equal(data_y(outlines[[1]]), asinh(c(0, 0, 20, 20) / 5))
  labels <- unlist(lapply(panel$children, function(child) if (inherits(child, "text")) child$label))
  expect_true(all(c("CD4_positive (D1)", "CD4_positive (D2)") %in% labels))
  names <- Filter(function(child) inherits(child, "text") && child$label %in%
                    c("CD4_positive (D1)", "CD4_positive (D2)"), panel$children)
  # Two lines of 12 px text plus their backing must fit between the sample labels.
  expect_gt(as.numeric(names[[1]]$y) - as.numeric(names[[2]]$y), 30)

  # Each component of the AND is counted separately within the stored parent, even though
  # D2's references are saved in reverse order. Its conjunction's stored count is only two.
  expect_equal(rows$events[rows$population == "treated"], c(3, 2))
  expect_equal(rows$parent_events[rows$population == "treated"], c(4, 4))
  # Quadrants without a saved population use each sample's own centre and stored parent.
  q <- rows[rows$population %in% c("quadrant 1", "CD8_positive", "quadrant 3", "quadrant 4"), ]
  expect_equal(q$events[q$samples == "D1"], c(0, 1, 0, 1))
  expect_equal(q$events[q$samples == "D2"], c(1, 0, 1, 0))
  parent_panel <- strategy_find_panel(plot, "CD4_positive (4)")
  shares <- Filter(function(child) inherits(child, "text") && grepl("% \\(D[12]\\)$", child$label), parent_panel$children)
  expect_length(shares, 8L)
  expect_true(all(c("0.0% (D1)", "50.0% (D1)", "0.0% (D2)", "50.0% (D2)") %in%
                    vapply(shares, `[[`, character(1), "label")))
  expect_false(isTRUE(all.equal(as.numeric(shares[[1]]$y), as.numeric(shares[[5]]$y))))
  expect_identical(sce, original)
  expect_equal(attr(gatelabStrategyPlot(sce[, 12:1], c("CD8_positive", "treated"), max_events = 0), "panels"), rows)

  # A sample subset keeps D2's outline, even when D2 has become the object's first sample.
  subset_plot <- gatelabStrategyPlot(sce[, 7:12], "CD4_positive", max_events = 0)
  expect_equal(attr(subset_plot, "panels")$events, 2)
  subset_panel <- strategy_find_panel(subset_plot, "All Events (6)")
  subset_outline <- Filter(function(child) inherits(child, "polygon"), subset_panel$children)
  expect_length(subset_outline, 1L)
  expect_equal(data_x(subset_outline[[1]]), asinh(c(15, 100, 100, 15) / 5))
})

test_that("sample label stacking preserves explicitly saved display offsets", {
  fixture <- strategy_coordinates_fixture(list(D1 = c(0.2, 0.4), D2 = c(-0.1, 0.4)))
  plot <- gatelabStrategyPlot(fixture$sce, "CD4_positive", max_events = 0)
  panel <- strategy_find_panel(plot, "All Events (12)")
  labels <- Filter(function(child) inherits(child, "text") && child$label %in%
                     c("CD4_positive (D1)", "CD4_positive (D2)"), panel$children)
  expect_length(labels, 2L)
  geo <- attr(panel, "geometry")
  # Both outlines have the same transformed y centre. Equal saved y offsets stay equal,
  # even though automatic labels for those same outlines would occupy separate rows.
  expected <- geo$margin[["top"]] + (5 - (mean(asinh(c(0, 20) / 5)) + 0.4)) / 5 * geo$H - 0.55 * 12
  expect_equal(unname(vapply(labels, function(label) as.numeric(label$y), numeric(1))), rep(expected, 2))
})

test_that("display assays are not transformed twice and raw channels require explicit saved transforms", {
  fixture <- strategy_coordinates_fixture()
  gating <- GateLabR:::.gatelabr_strategy_gating(fixture$sce)
  coords <- GateLabR:::.gatelabr_strategy_coordinates(fixture$sce, gating, "counts")
  display <- GateLabR:::.gatelabr_strategy_coordinates(fixture$sce, gating, "exprs")
  expect_equal(coords$display("CD4"), asinh(rep(c(0, 5, 15, 30, 60, 100), 2) / 5))
  expect_equal(display$display("CD4"), SummarizedExperiment::assay(fixture$sce, "exprs")["CD4", ])
  expect_equal(attr(gatelabStrategyPlot(fixture$sce, "CD4_positive", assay = "exprs"), "panels"),
               attr(gatelabStrategyPlot(fixture$sce, "CD4_positive", assay = "counts"), "panels"))
  gating$workspace$hostedChannelTransforms <- NULL
  SummarizedExperiment::rowData(fixture$sce)$gatelab_transform <- NULL
  missing <- GateLabR:::.gatelabr_strategy_coordinates(fixture$sce, gating, "counts")
  expect_error(missing$display("CD4"), "No saved display transform for channel 'CD4'")
  legacy <- GateLabR:::.gatelabr_strategy_coordinates(fixture$sce, gating, "exprs")
  expect_equal(legacy$display("CD4"), SummarizedExperiment::assay(fixture$sce, "exprs")["CD4", ])
})

test_that("sample-specific outlines require exact sample and gate provenance", {
  fixture <- strategy_coordinates_fixture()
  gating <- GateLabR:::.gatelabr_strategy_gating(fixture$sce)
  coordinates <- GateLabR:::.gatelabr_strategy_coordinates(fixture$sce, gating, "counts")
  variants <- GateLabR:::.gatelabr_strategy_sample_gates
  expect_error(variants(fixture$sce, gating, coordinates, rep(c("D1", "D3"), each = 6), rep(TRUE, 12)),
               "Cannot match saved sample-specific gates to: D3")
  # A genuinely absent counterpart cannot be drawn using the active sample's geometry.
  gating$workspace$gating$stored_hierarchies[[1]]$populations[["D2:p"]] <- NULL
  get <- variants(fixture$sce, gating, coordinates, rep(c("D1", "D2"), each = 6), rep(TRUE, 12))
  expect_error(get(list(gate = gating$gates$g, population = "p", include = TRUE)),
               "No saved gate counterpart for population 'p' on sample 'D2'")
})

test_that("gate-specific transforms move outlines and individual counts in the same coordinates", {
  sce <- SingleCellExperiment::SingleCellExperiment(assays = list(counts = rbind(CD4 = c(5 * sinh(1), 5 * sinh(1), 5 * sinh(3)),
                                                                                CD8 = c(1.5, 0.5, 1.5))))
  gating <- list(workspace = list(hostedChannelTransforms = list(CD4 = list(kind = "identity"), CD8 = list(kind = "identity"))))
  coordinates <- GateLabR:::.gatelabr_strategy_coordinates(sce, gating, "counts")
  gate <- GateLabR:::.gatelabr_strategy_gate(list(
    gate_id = "g", name = "CD4_positive", gate_type = "polygon", x_channel = "CD4", y_channel = "CD8",
    vertices = list(list(0, 0), list(2, 2), list(0, 2)), space = "display",
    transforms = list(CD4 = list(kind = "asinh", cofactor = 5), CD8 = list(kind = "identity"))))
  gate$label_offset <- c(0.2, -0.3) # offsets are display deltas even for a gate in another space
  drawn <- GateLabR:::.gatelabr_strategy_gate_display(gate, coordinates)
  expect_lte(strategy_outline_error(gate$vertices, drawn$vertices, function(x, y) cbind(5 * sinh(x), y)), 0.002)
  midpoint <- drawn$vertices[drawn$vertices[, 2] == 1, ]
  expect_equal(midpoint, c(5 * sinh(1), 1))
  expect_false(isTRUE(all.equal(midpoint[1], 5 * sinh(2) / 2))) # bowed, not a straight raw chord
  expect_equal(drawn$label_offset, c(0.2, -0.3))
  expect_equal(GateLabR:::.gatelabr_strategy_gate_membership(gate, coordinates), c(TRUE, FALSE, FALSE))

  rectangle <- gate
  rectangle$type <- "rectangle"
  rectangle$vertices <- rbind(c(1, 0), c(3, 0), c(3, 2), c(1, 2))
  rectangle$bounds <- "half-open"
  expect_equal(GateLabR:::.gatelabr_strategy_gate_membership(rectangle, coordinates), c(TRUE, TRUE, FALSE))
  rectangle$bounds <- "closed"
  expect_equal(GateLabR:::.gatelabr_strategy_gate_membership(rectangle, coordinates), c(TRUE, TRUE, TRUE))
})

test_that("individual geometric counts keep polygon edges and unbounded rectangle sides", {
  in_gate <- GateLabR:::.gatelabr_strategy_in_gate
  polygon <- list(type = "polygon", vertices = rbind(c(0, 0), c(2, 0), c(2, 2), c(0, 2)))
  expect_equal(in_gate(polygon, c(0, 2, 1, 1, 0, 1, 2.1, NA), c(1, 1, 0, 2, 0, 1, 1, 1)),
               c(TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE))
  rectangle <- list(type = "rectangle", bounds = "half-open",
                    vertices = rbind(c(-.Machine$double.xmax, 0), c(.Machine$double.xmax, 2)))
  expect_equal(in_gate(rectangle, c(-Inf, 0, Inf), c(1, 1, 1)), c(TRUE, TRUE, TRUE))
  expect_equal(in_gate(rectangle, c(0, 0), c(0, 2)), c(TRUE, FALSE))
})

test_that("nonlinear outlines meet their tolerance across inflections on either axis", {
  triangle <- rbind(c(-2, 0), c(2, 2), c(-2, 2))
  cases <- list(
    list(vertices = triangle, map = function(x, y) cbind(5 * sinh(x), y)),
    list(vertices = triangle[, 2:1], map = function(x, y) cbind(x, 150 * sinh(y))),
    list(vertices = rbind(c(-1000, 0), c(1000, 100000), c(-1000, 100000)), map = function(x, y) cbind(asinh(x / 5), y)),
    list(vertices = rbind(c(0, -1000), c(100000, 1000), c(100000, -1000)), map = function(x, y) cbind(x, asinh(y / 5))),
    list(vertices = rbind(c(-2, -1), c(2, 3), c(-2, 3)), map = function(x, y) cbind(150 * sinh(x), 5 * sinh(y))),
    list(vertices = rbind(c(1, -2), c(10000, 2), c(1, 2)), map = function(x, y) cbind(log10(x), 10^y)),
    list(vertices = rbind(c(-1e6, 0), c(1e6, 2), c(-1e6, 2)), map = function(x, y) cbind(asinh(x / 5), y))
  )
  for (case in cases) {
    vertices <- case$vertices; map <- case$map
    mapped <- map(vertices[, 1], vertices[, 2])
    drawn <- GateLabR:::.gatelabr_strategy_polygon_outline(vertices, mapped, function(v) as.numeric(map(v[1], v[2])))
    expect_lte(strategy_outline_error(vertices, drawn, map), 0.002)
  }
  # At y=0.5 the true first edge has x=-5*sinh(1), not the endpoint chord's x=-5*sinh(2)/2.
  expect_equal(as.numeric(cases[[1]]$map(0, 1)), c(0, 1))
  expect_gt(abs(5 * sinh(1) - 5 * sinh(2) / 2) / (10 * sinh(2)), 0.08)
})
