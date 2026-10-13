# A flowWorkspace GatingSet served from its own parts (R/gatingset_host.R) and written back
# to in place (R/gatingset.R). Built from flowCore's GvHD example data: two samples, every
# transform kind the host maps, and every node kind flowWorkspace returns.

skip_if_not_installed("flowWorkspace")
skip_if_not_installed("flowCore")

gvhd <- function() {
  data_env <- new.env()
  utils::data("GvHD", package = "flowCore", envir = data_env)
  data_env$GvHD[1:2]
}

# Logicle on FL1-H and FL2-H, as flowWorkspace's logicle_trans sets it.
make_gatingset <- function() {
  gs <- flowWorkspace::GatingSet(gvhd())
  flowWorkspace::transform(gs, flowWorkspace::transformerList(
    c("FL1-H", "FL2-H"),
    flowWorkspace::logicle_trans(w = 0.5, t = 262144, m = 4.5, a = 0)
  ))
  gs
}

# One channel under each transform kind the host maps: logicle, FlowJo fasinh, FlowJo log and
# FlowJo biexponential; FSC-H, SSC-H, FL2-A and Time stay linear.
make_mixed_gatingset <- function() {
  gs <- flowWorkspace::GatingSet(gvhd())
  flowWorkspace::transform(gs, flowWorkspace::transformerList(
    c("FL1-H", "FL2-H", "FL3-H", "FL4-H"),
    list(
      flowWorkspace::logicle_trans(w = 0.5, t = 262144, m = 4.5, a = 0),
      flowWorkspace::flowjo_fasinh_trans(m = 4.5, t = 262144, a = 0, length = 256),
      flowWorkspace::flowjo_log_trans(decade = 4.5, offset = 1),
      flowWorkspace::flowjo_biexp_trans(maxValue = 262144, widthBasis = -10, pos = 4.5, neg = 0)
    )
  ))
  gs
}

logicle_spec <- function(W = 0.5) list(kind = "logicle", T = 262144, W = W, M = 4.5, A = 0)
# flowjo_fasinh(m = 4.5, t = 262144) is GateLab's asinh at this cofactor, times 256 / (4.5 ln10).
fasinh_cofactor <- 262144 / sinh(4.5 * log(10))
fasinh_scale <- 4.5 * log(10) / 256
asinh_spec <- function() list(kind = "asinh", cofactor = fasinh_cofactor)

transformed_values <- function(gs, index) {
  flowCore::exprs(flowWorkspace::gh_pop_get_data(gs[[index]], "root"))
}

raw_values <- function(index) flowCore::exprs(gvhd()[[index]])

packed_sample <- function(mask) base64enc::base64encode(GateLabR:::.gatelabr_pack_bits(mask))

# The app's memberships payload (workspaceContract.ts) for the populations given as
# list(id, name, parent, masks per sample), with the root over every event.
memberships_payload <- function(gs, populations) {
  samples <- flowWorkspace::sampleNames(gs)
  counts <- GateLabR:::.gatelabr_gatingset_event_counts(gs)
  masks_of <- function(masks) lapply(seq_along(samples), function(index) {
    list(sampleId = samples[[index]], eventCount = unname(counts[[index]]),
         membershipBitsBase64 = packed_sample(masks[[index]]))
  })
  root <- list(hierarchyId = "h1", populationId = "pop-root", populationName = "root",
               parentId = NULL, gateLogic = "and", gates = list(),
               sampleMasks = masks_of(lapply(counts, function(n) rep(TRUE, n))))
  list(
    hierarchies = list(list(id = "h1", name = "Main", active = TRUE, rootPopulationId = "pop-root")),
    populations = c(list(root), lapply(populations, function(population) {
      list(hierarchyId = "h1", populationId = population$id, populationName = population$name,
           parentId = population$parent, gateLogic = "and", gates = list(),
           sampleMasks = masks_of(population$masks))
    }))
  )
}

workspace_json <- function(gates, populations) {
  as.character(jsonlite::toJSON(
    list(format = "gatelab-workspace", version = 2L,
         gating = list(gates = gates, populations = populations, root_population_id = "pop-root")),
    auto_unbox = TRUE, null = "null", digits = NA
  ))
}

write_request <- function(json, memberships = NULL, expected_revision = 0L, reason = "explicit",
                          dataset_id = "gatingset-gs") {
  payload <- list(datasetId = dataset_id, expectedRevision = expected_revision,
                  clientRevision = expected_revision + 1L, reason = reason, workspaceJson = json,
                  writerId = "test")
  if (!is.null(memberships)) payload$memberships <- memberships
  list(operation = "write-workspace", payload = payload)
}

# ── the dataset ───────────────────────────────────────────────────────────────

test_that("the descriptor is built from the object's parts, each channel carrying the object's transform", {
  gs <- make_mixed_gatingset()
  flowWorkspace::pData(gs)$group <- c("treated", "control")
  descriptor <- GateLabR:::.gatelabr_gatingset_dataset_descriptor(gs, dataset_id = "gatingset-gs")
  expect_identical(descriptor$id, "gatingset-gs")
  expect_identical(descriptor$instrument, "flow")
  expect_identical(descriptor$eventCount, nrow(raw_values(1)) + nrow(raw_values(2)))
  expect_identical(vapply(descriptor$channels, `[[`, character(1), "id"), unname(colnames(raw_values(1))))
  expect_identical(descriptor$channels[[3]]$pns, "CD15 FITC")
  expect_identical(descriptor$channels[[3]]$label, "CD15 FITC")
  transforms <- lapply(descriptor$channels, `[[`, "transform")
  expect_null(transforms[[1]])
  expect_identical(transforms[[3]], logicle_spec())
  expect_equal(transforms[[4]], asinh_spec())
  expect_identical(transforms[[5]], list(kind = "wsplog", offset = 1, decades = 4.5))
  expect_identical(transforms[[7]], list(kind = "biex", maxValue = 262144, pos = 4.5, neg = 0,
                                         widthBasis = -10, channelRange = 4096, tableChannels = 4096L))
  expect_null(transforms[[8]])
  # One assay, named for what the values are: no matrix was applied here.
  expect_length(descriptor$assays, 1L)
  expect_identical(descriptor$assays[[1]]$id, "counts")
  expect_identical(descriptor$assays[[1]]$role, "counts")
  expect_identical(descriptor$assays[[1]]$coordinateSpace, "linear")
  expect_identical(descriptor$defaultAssayId, "counts")
  expect_null(descriptor$compensationMatrix)
  # Samples in the object's order, with the pData columns as metadata and as colData.
  expect_identical(vapply(descriptor$samples, `[[`, character(1), "id"), c("s5a01", "s5a02"))
  expect_identical(descriptor$samples[[1]]$eventCount, nrow(raw_values(1)))
  expect_identical(descriptor$samples[[2]]$metadata$group, "control")
  expect_true("group" %in% descriptor$colDataColumns)
  expect_false("name" %in% descriptor$colDataColumns)
  expect_true(any(vapply(descriptor$colDataCategorical, function(column) column$name == "group", logical(1))))
  expect_identical(descriptor$rowDataRevision, 0)
})

test_that("a compensated GatingSet is served as compensated, with its matrix shown", {
  gs <- flowWorkspace::GatingSet(gvhd())
  spill <- matrix(c(1, 0.1, 0.05, 1), 2L, dimnames = list(c("FL1-H", "FL2-H"), c("FL1-H", "FL2-H")))
  flowWorkspace::compensate(gs, spill)
  descriptor <- GateLabR:::.gatelabr_gatingset_dataset_descriptor(gs)
  expect_identical(descriptor$assays[[1]]$id, "compensated")
  expect_identical(descriptor$assays[[1]]$role, "compensated")
  expect_identical(descriptor$compensationMatrix$kind, "flow-spillover")
  expect_identical(as.character(descriptor$compensationMatrix$receiverChannels), c("FL1-H", "FL2-H"))
  # matrix() fills by column: row 1 is (1, 0.05), the FL1-H source into both receivers.
  expect_equal(as.numeric(descriptor$compensationMatrix$matrix[[1]]), c(1, 0.05))
})

test_that("a sample's values are served from its cytoframe through the inverse transforms, one channel at a time", {
  gs <- make_mixed_gatingset()
  channels <- unname(colnames(raw_values(1)))
  for (index in 1:2) {
    path <- withr::local_tempfile(fileext = ".f32")
    GateLabR:::.gatelabr_write_gatingset_assay_payload(gs, flowWorkspace::sampleNames(gs)[[index]], channels, path)
    raw <- raw_values(index)
    expect_identical(file.info(path)$size, as.double(length(channels)) * nrow(raw) * 4)
    served <- matrix(readBin(path, "numeric", n = length(channels) * nrow(raw), size = 4L, endian = "little"),
                     ncol = length(channels), dimnames = list(NULL, channels))
    # Linear channels exactly; transformed ones within the transform's own round trip.
    expect_identical(served[, "FSC-H"], unname(raw[, "FSC-H"]))
    expect_identical(served[, "Time"], unname(raw[, "Time"]))
    for (channel in c("FL1-H", "FL2-H", "FL3-H", "FL4-H")) {
      expect_equal(served[, channel], unname(raw[, channel]), tolerance = 1e-3, label = channel)
    }
  }
})

# ── transforms ────────────────────────────────────────────────────────────────

test_that("each transform kind maps to GateLab's by parameters, with the affine map where the functions differ by one", {
  gs <- make_mixed_gatingset()
  raw <- GateLabR:::.gatelabr_gatingset_raw_transforms(gs)
  expect_setequal(names(raw), c("FL1-H", "FL2-H", "FL3-H", "FL4-H"))
  axes <- GateLabR:::.gatelabr_gatingset_axes(gs, unname(colnames(raw_values(1))))
  x <- c(1, 10, 100, 1000, 9000)
  stored <- flowWorkspace::gh_get_transformations(gs[[1]])
  # fasinh: the object's value, through forward, is GateLab's asinh at the cofactor.
  expect_equal(axes[["FL2-H"]]$forward(stored[["FL2-H"]](x)), asinh(x / fasinh_cofactor))
  expect_equal(axes[["FL2-H"]]$backward(asinh(x / fasinh_cofactor)), stored[["FL2-H"]](x))
  # log: the object's value is GateLab's wsplog times the scale (1 here).
  expect_equal(axes[["FL3-H"]]$forward(stored[["FL3-H"]](x)), log10(pmax(x, 1)) / 4.5)
  # logicle and biexp are the same function: the maps are the identity.
  expect_identical(axes[["FL1-H"]]$forward(2.5), 2.5)
  expect_identical(axes[["FL4-H"]]$backward(1000), 1000)
  expect_true(is.function(axes[["FL1-H"]]$transform))
  expect_null(axes[["FSC-H"]]$transform)
  expect_null(axes[["FSC-H"]]$spec)
  # What the host cannot map is named.
  expect_match(GateLabR:::.gatelabr_gatingset_axis(list(type = "caltbl"))$unsupported, "calibration table")
  expect_match(GateLabR:::.gatelabr_gatingset_axis(list(type = "fasinh", T = 1))$unsupported, "missing parameters")
  expect_match(GateLabR:::.gatelabr_gatingset_axis(list(type = "logtGml2", t = 262144, m = 4.5))$spec$kind, "flog")
  # The inverse of a GateLab spec, for the write-back.
  expect_equal(GateLabR:::.gatelabr_spec_inverse(logicle_spec())(stored[["FL1-H"]](x)), x)
  expect_equal(GateLabR:::.gatelabr_spec_inverse(asinh_spec())(asinh(x / fasinh_cofactor)), x)
  expect_equal(GateLabR:::.gatelabr_spec_inverse(list(kind = "wsplog", offset = 1, decades = 4.5))(log10(x) / 4.5), x)
  expect_equal(GateLabR:::.gatelabr_spec_inverse(list(kind = "flog", T = 262144, M = 4.5, standard = TRUE))(log10(x / 262144) / 4.5 + 1), x)
  expect_null(GateLabR:::.gatelabr_spec_inverse(list(kind = "flowjoChannels")))
})

# ── the hierarchy, for the app ────────────────────────────────────────────────

add_every_node_kind <- function(gs) {
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate("FL1-H" = c(1, 3), "FL2-H" = c(0.5, 2.5), filterId = "rect"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowCore::polygonGate(
    .gate = matrix(c(1, 1, 3, 3, 0.5, 2.5, 2.5, 0.5), ncol = 2, dimnames = list(NULL, c("FL3-H", "FL4-H"))),
    filterId = "poly"), parent = "rect")
  flowWorkspace::gs_pop_add(gs, flowCore::ellipsoidGate(
    .gate = matrix(c(0.2, 0.05, 0.05, 0.2), 2, dimnames = list(c("FL1-H", "FL3-H"), c("FL1-H", "FL3-H"))),
    mean = c("FL1-H" = 2, "FL3-H" = 2), distance = 1.5, filterId = "ell"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(rect & !ell, filterId = "bool"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowCore::quadGate("FL1-H" = 2, "FL2-H" = 1.5, filterId = "quad"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate("FSC-H" = c(200, Inf), filterId = "oneD"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate("FL1-H" = c(1, 3), "FL2-H" = c(0.5, 2.5), filterId = "neg"), parent = "root", negated = TRUE)
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(rect | ell, filterId = "either"), parent = "root")
  flowWorkspace::recompute(gs)
  gs
}

test_that("the hierarchy reaches the app with every node kind in the space the object evaluates it in", {
  gs <- add_every_node_kind(make_mixed_gatingset())
  payload <- GateLabR:::.gatelabr_gatingset_hierarchy_payload(gs)
  expect_identical(payload$contractVersion, 1L)
  nodes <- payload$nodes
  names(nodes) <- vapply(nodes, `[[`, character(1), "path")
  expect_identical(names(nodes), c("/rect", "/rect/poly", "/ell", "/bool", "/FL1-H x FL2-H quadrants", "/oneD", "/neg", "/either"))
  expect_identical(unname(vapply(nodes, `[[`, character(1), "parent")), c("root", "/rect", "root", "root", "root", "root", "root", "root"))

  # A rectangle on a logicle and a fasinh axis: the logicle bound as stored, the fasinh bound
  # in GateLab's asinh space by the affine map.
  rect <- nodes[["/rect"]]$gate
  expect_identical(rect$kind, "rectangle")
  expect_identical(rect$axes[[1]]$transform, logicle_spec())
  expect_equal(rect$axes[[2]]$transform, asinh_spec())
  expect_equal(as.numeric(rect$min), c(1, 0.5 * fasinh_scale))
  expect_equal(as.numeric(rect$max), c(3, 2.5 * fasinh_scale))
  expect_false(isTRUE(nodes[["/rect"]]$negated))
  # A polygon on a log and a biex axis keeps its vertices (both maps are the identity at scale 1).
  poly <- nodes[["/rect/poly"]]$gate
  expect_identical(poly$kind, "polygon")
  expect_identical(poly$axes[[1]]$transform$kind, "wsplog")
  expect_identical(poly$axes[[2]]$transform$kind, "biex")
  expect_equal(poly$vertices, matrix(c(1, 1, 3, 3, 0.5, 2.5, 2.5, 0.5), ncol = 2))
  # An ellipse carries flowCore's distance; the app squares it.
  ell <- nodes[["/ell"]]$gate
  expect_identical(ell$kind, "ellipse")
  expect_equal(as.numeric(ell$mean), c(2, 2))
  expect_equal(ell$covariance, matrix(c(0.2, 0.05, 0.05, 0.2), 2))
  expect_identical(ell$distance, 1.5)
  # A boolean of & and ! becomes references by path.
  bool <- nodes[["/bool"]]$boolean
  expect_identical(bool$operator, "and")
  expect_identical(bool$refs, list(list(path = "/rect", include = TRUE), list(path = "/ell", include = FALSE)))
  # The four quadrant children become one quadrant gate, its members numbered as the app
  # numbers quadrants (1 = x-/y+, 2 = x+/y+, 3 = x+/y-, 4 = x-/y-), the centre mapped.
  quad <- nodes[["/FL1-H x FL2-H quadrants"]]$gate
  expect_identical(quad$kind, "quadrant")
  expect_equal(as.numeric(quad$center), c(2, 1.5 * fasinh_scale))
  members <- quad$members
  numbers <- vapply(members, `[[`, integer(1), "quadrant")
  names(numbers) <- vapply(members, `[[`, character(1), "name")
  expect_identical(numbers[["CD15 FITC-CD45 PE+"]], 1L)
  expect_identical(numbers[["CD15 FITC+CD45 PE+"]], 2L)
  expect_identical(numbers[["CD15 FITC+CD45 PE-"]], 3L)
  expect_identical(numbers[["CD15 FITC-CD45 PE-"]], 4L)
  expect_true(all(startsWith(vapply(members, `[[`, character(1), "path"), "/CD15")))
  # A range gate has one axis and an open bound.
  one <- nodes[["/oneD"]]$gate
  expect_length(one$axes, 1L)
  expect_identical(one$axes[[1]]$channel, "FSC-H")
  expect_identical(as.numeric(one$min), 200)
  expect_true(is.na(one$max))
  # A negated node says so.
  expect_true(nodes[["/neg"]]$negated)
  # An OR is sent as one; the app leaves it out by name, as its Gating-ML importer does.
  expect_identical(nodes[["/either"]]$boolean$operator, "or")
  expect_length(payload$leftOut, 0L)

  # The envelope carries it as JSON the app's contract reads, with open bounds as null.
  envelope <- GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gatingset-gs")
  expect_identical(envelope$sourceFormat, "gatingset-hierarchy")
  expect_identical(envelope$revision, 0L)
  parsed <- jsonlite::fromJSON(envelope$workspaceJson, simplifyVector = FALSE)
  expect_length(parsed$nodes, 8L)
  expect_null(parsed$nodes[[6]]$gate$max[[1]])
  expect_identical(parsed$nodes[[1]]$gate$axes[[1]]$transform$kind, "logicle")
  expect_true(is.list(parsed$nodes[[2]]$gate$vertices[[1]]))

  # An object with no node sends no envelope.
  expect_null(GateLabR:::.gatelabr_gatingset_workspace_envelope(make_gatingset(), "gatingset-gs"))
})

test_that("a node on a channel the host cannot map is left out with the reason; booleans naming it are the app's to drop", {
  gs <- make_gatingset()
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate("FL1-H" = c(1, 3), filterId = "a"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate("FL2-H" = c(1, 3), filterId = "b"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(a | b, filterId = "either"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(a & b, filterId = "both"), parent = "root")
  flowWorkspace::recompute(gs)
  axes <- GateLabR:::.gatelabr_gatingset_axes(gs, c("FL1-H", "FL2-H"))
  axes[["FL2-H"]] <- GateLabR:::.gatelabr_gatingset_axis(list(type = "caltbl"))
  payload <- GateLabR:::.gatelabr_gatingset_hierarchy_payload(gs, axes)
  expect_identical(vapply(payload$nodes, `[[`, character(1), "path"), c("/a", "/either", "/both"))
  expect_length(payload$leftOut, 1L)
  expect_identical(payload$leftOut[[1]]$path, "/b")
  expect_match(payload$leftOut[[1]]$reason, "calibration table")
  # The booleans still name /b by path; the app, which knows /b was left out, drops them and says so.
  expect_identical(payload$nodes[[3]]$boolean$refs[[2]]$path, "/b")
})

# ── the record ────────────────────────────────────────────────────────────────

test_that("the workspace record lives in a keyword on every sample and survives save_gs", {
  gs <- make_gatingset()
  expect_null(GateLabR:::.gatelabr_gatingset_record(gs))
  record <- list(format = "gatelab-gatingset-workspace", version = 1L, revision = 3L,
                 workspace_json = "{\"format\":\"gatelab-workspace\"}", hierarchy_written = FALSE)
  GateLabR:::.gatelabr_gatingset_store_record(gs, record)
  for (index in 1:2) {
    keyword <- flowWorkspace::keyword(flowWorkspace::gs_cyto_data(gs)[[index]])[["GATELAB_WORKSPACE"]]
    expect_true(is.character(keyword) && nzchar(keyword))
  }
  read <- GateLabR:::.gatelabr_gatingset_record(gs)
  expect_identical(read$revision, 3L)
  expect_identical(read$workspace_json, record$workspace_json)
  dir <- withr::local_tempdir()
  flowWorkspace::save_gs(gs, dir)
  reloaded <- flowWorkspace::load_gs(dir)
  expect_identical(GateLabR:::.gatelabr_gatingset_record(reloaded)$revision, 3L)
  GateLabR:::.gatelabr_gatingset_store_record(gs, utils::modifyList(record, list(revision = 4L)))
  expect_identical(GateLabR:::.gatelabr_gatingset_record(gs)$revision, 4L)
  envelope <- GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gatingset-gs")
  expect_identical(envelope$sourceFormat, "gatelab-workspace")
  expect_identical(envelope$revision, 4L)
})

# ── populations to the hierarchy ──────────────────────────────────────────────

# A workspace on the mixed GatingSet: a rectangle in the object's logicle space over the
# fasinh channel in GateLab's asinh space, a rectangle stated in no space on linear channels,
# a polygon in that same linear space, a polygon in a space the object does not have (asinh
# over the logicle channel), a population of two gates, and a rectangle with open bounds.
mixed_workspace <- function(gs) {
  gates <- list(
    `g-box` = list(gate_id = "g-box", name = "box", gate_type = "rectangle", x_channel = "FL1-H", y_channel = "FL2-H",
                   vertices = list(list(1.5, 0.1), list(3.5, 0.1), list(3.5, 0.3), list(1.5, 0.3)),
                   space = "display", transforms = list(`FL1-H` = logicle_spec(), `FL2-H` = asinh_spec())),
    `g-raw` = list(gate_id = "g-raw", name = "scatter box", gate_type = "rectangle", x_channel = "FSC-H", y_channel = "SSC-H",
                   vertices = list(list(100, 50), list(800, 50), list(800, 600), list(100, 600))),
    `g-poly` = list(gate_id = "g-poly", name = "scatter poly", gate_type = "polygon", x_channel = "FSC-H", y_channel = "SSC-H",
                    vertices = list(list(100, 50), list(900, 100), list(500, 700))),
    `g-other` = list(gate_id = "g-other", name = "other space", gate_type = "polygon", x_channel = "FL1-H", y_channel = "FL2-H",
                     vertices = list(list(0.5, 0.1), list(3, 0.1), list(3, 0.3)),
                     space = "display", transforms = list(`FL1-H` = list(kind = "asinh", cofactor = 150), `FL2-H` = asinh_spec())),
    `g-open` = list(gate_id = "g-open", name = "open", gate_type = "rectangle", x_channel = "FL1-H", y_channel = "FL2-H",
                    vertices = list(list(2, -1.7976931348623157e308), list(1.7976931348623157e308, -1.7976931348623157e308),
                                    list(1.7976931348623157e308, 1.7976931348623157e308), list(2, 1.7976931348623157e308)),
                    space = "display", transforms = list(`FL1-H` = logicle_spec(), `FL2-H` = asinh_spec()))
  )
  populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), parent_id = NULL),
    `pop-box` = list(population_id = "pop-box", name = "box cells", parent_id = "pop-root",
                     gate_refs = list(list(gate_id = "g-box", include = TRUE))),
    `pop-raw` = list(population_id = "pop-raw", name = "scatter box", parent_id = "pop-box",
                     gate_refs = list(list(gate_id = "g-raw", include = TRUE))),
    `pop-poly` = list(population_id = "pop-poly", name = "scatter poly", parent_id = "pop-root",
                      gate_refs = list(list(gate_id = "g-poly", include = TRUE))),
    `pop-other` = list(population_id = "pop-other", name = "other space", parent_id = "pop-root",
                       gate_refs = list(list(gate_id = "g-other", include = TRUE))),
    `pop-two` = list(population_id = "pop-two", name = "box not poly", parent_id = "pop-root",
                     gate_refs = list(list(gate_id = "g-box", include = TRUE), list(gate_id = "g-poly", include = FALSE))),
    `pop-open` = list(population_id = "pop-open", name = "open box", parent_id = "pop-root",
                      gate_refs = list(list(gate_id = "g-open", include = TRUE)))
  )
  masks <- lapply(1:2, function(index) {
    values <- transformed_values(gs, index)
    fl2_app <- values[, "FL2-H"] * fasinh_scale
    box <- values[, "FL1-H"] >= 1.5 & values[, "FL1-H"] <= 3.5 & fl2_app >= 0.1 & fl2_app <= 0.3
    raw_box <- values[, "FSC-H"] >= 100 & values[, "FSC-H"] <= 800 & values[, "SSC-H"] >= 50 & values[, "SSC-H"] <= 600
    poly <- sp::point.in.polygon(values[, "FSC-H"], values[, "SSC-H"], c(100, 900, 500), c(50, 100, 700)) > 0
    fl1_app <- asinh(flowWorkspace::gh_get_transformations(gs[[index]], inverse = TRUE)[["FL1-H"]](values[, "FL1-H"]) / 150)
    other <- sp::point.in.polygon(fl1_app, fl2_app, c(0.5, 3, 3), c(0.1, 0.1, 0.3)) > 0
    open <- values[, "FL1-H"] >= 2
    list(box = box, raw = box & raw_box, poly = poly, other = other, two = box & !poly, open = open)
  })
  pick <- function(name) lapply(masks, `[[`, name)
  list(
    json = workspace_json(gates, populations),
    masks = list(box = pick("box"), raw = pick("raw"), poly = pick("poly"), other = pick("other"),
                 two = pick("two"), open = pick("open")),
    populations = list(
      list(id = "pop-box", name = "box cells", parent = "pop-root", masks = pick("box")),
      list(id = "pop-raw", name = "scatter box", parent = "pop-box", masks = pick("raw")),
      list(id = "pop-poly", name = "scatter poly", parent = "pop-root", masks = pick("poly")),
      list(id = "pop-other", name = "other space", parent = "pop-root", masks = pick("other")),
      list(id = "pop-two", name = "box not poly", parent = "pop-root", masks = pick("two")),
      list(id = "pop-open", name = "open box", parent = "pop-root", masks = pick("open"))
    )
  )
}

test_that("an explicit save writes every population to the hierarchy: gates where the space allows, exact memberships otherwise", {
  gs <- make_mixed_gatingset()
  ws <- mixed_workspace(gs)
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(ws$json, memberships_payload(gs, ws$populations)), dataset_id = "gatingset-gs"
  )
  expect_identical(handled$result$revision, 1L)
  expect_identical(handled$result$memberships, list(hierarchies = 1L, populations = 6L))
  report <- handled$report
  expect_identical(report$gates, c("box cells", "scatter box", "scatter poly", "open box"))
  expect_identical(report$masks, c("other space", "box not poly"))
  expect_identical(report$replaced, character(0))
  paths <- flowWorkspace::gs_get_pop_paths(gs, path = "full")
  expect_setequal(paths, c("root", "/box cells", "/box cells/scatter box", "/scatter poly", "/other space",
                           "/box not poly", "/open box"))
  gate_of <- function(path) flowWorkspace::gh_pop_get_gate(gs[[1]], path)
  # The rectangle over the fasinh channel is written in the object's own units.
  box <- gate_of("/box cells")
  expect_s4_class(box, "rectangleGate")
  expect_equal(unname(box@min), c(1.5, 0.1 / fasinh_scale))
  expect_equal(unname(box@max), c(3.5, 0.3 / fasinh_scale))
  expect_s4_class(gate_of("/box cells/scatter box"), "rectangleGate")
  expect_s4_class(gate_of("/scatter poly"), "polygonGate")
  expect_s4_class(gate_of("/other space"), "booleanFilter")
  expect_s4_class(gate_of("/box not poly"), "booleanFilter")
  open <- gate_of("/open box")
  expect_s4_class(open, "rectangleGate")
  expect_identical(unname(open@max), c(Inf, Inf))
  expect_identical(unname(open@min)[[2]], -Inf)
  # Every node holds exactly GateLab's events, whichever way it was written.
  for (index in 1:2) {
    for (pair in list(c("/box cells", "box"), c("/box cells/scatter box", "raw"), c("/scatter poly", "poly"),
                      c("/other space", "other"), c("/box not poly", "two"), c("/open box", "open"))) {
      expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], pair[[1]])),
                       ws$masks[[pair[[2]]]][[index]], label = pair[[1]])
    }
  }
  # The record says the hierarchy was written, and the readers read it.
  record <- GateLabR:::.gatelabr_gatingset_record(gs)
  expect_true(isTRUE(record$hierarchy_written))
  expect_identical(record$hierarchy_revision, 1L)
  expect_identical(GateLabR:::.gatelabr_memberships_status(gs), "current")
  hierarchy <- GateLabR::gatelabHierarchy(gs)
  expect_identical(hierarchy$population[1:2], c("box cells", "scatter box"))
  expect_identical(hierarchy$event_count[[1]], sum(unlist(ws$masks$box)))
  members <- GateLabR::gatelabPopulations(gs, c("box cells", "other space"))
  expect_identical(unname(members[, "other space"]), unlist(ws$masks$other, use.names = FALSE))
  # The envelope is now the record, and the written hierarchy survives save_gs() and load_gs().
  expect_identical(GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gatingset-gs")$sourceFormat, "gatelab-workspace")
  dir <- withr::local_tempdir()
  flowWorkspace::save_gs(gs, dir)
  reloaded <- flowWorkspace::load_gs(dir)
  expect_equal(flowWorkspace::gh_pop_get_count(reloaded[[2]], "/box not poly"), sum(ws$masks$two[[2]]))
  expect_identical(GateLabR:::.gatelabr_gatingset_record(reloaded)$revision, 1L)

  # An autosave stores the record and leaves the hierarchy alone; a stale revision is refused.
  autosaved <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(ws$json, expected_revision = 1L, reason = "autosave"), dataset_id = "gatingset-gs"
  )
  expect_identical(autosaved$result$revision, 2L)
  expect_null(autosaved$report)
  expect_setequal(flowWorkspace::gs_get_pop_paths(gs, path = "full"), paths)
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(ws$json, expected_revision = 1L, reason = "autosave"), dataset_id = "gatingset-gs"
  ), "revision")

  # A save whose tree lost populations removes their nodes: the tree in GateLab is the tree.
  trimmed <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(ws$json, memberships_payload(gs, ws$populations[1:2]), expected_revision = 2L),
    dataset_id = "gatingset-gs"
  )
  expect_identical(trimmed$report$gates, c("box cells", "scatter box"))
  expect_setequal(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/box cells", "/box cells/scatter box"))
})

test_that("a gate flowWorkspace evaluates differently is written as its membership instead", {
  gs <- make_mixed_gatingset()
  ws <- mixed_workspace(gs)
  flipped <- ws$populations[[1]]
  first_in <- which(flipped$masks[[1]])[[1]]
  flipped$masks[[1]][[first_in]] <- FALSE
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(ws$json, memberships_payload(gs, list(flipped))), dataset_id = "gatingset-gs"
  )
  expect_identical(handled$report$gates, character(0))
  expect_identical(handled$report$masks, "box cells")
  expect_identical(handled$report$replaced, "box cells")
  expect_s4_class(flowWorkspace::gh_pop_get_gate(gs[[1]], "/box cells"), "booleanFilter")
  expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[1]], "/box cells")), flipped$masks[[1]])
})

test_that("an ellipse in the object's own space is written as an ellipsoidGate", {
  gs <- make_gatingset()
  gates <- list(`g-ell` = list(
    gate_id = "g-ell", name = "blob", gate_type = "ellipse", x_channel = "FL1-H", y_channel = "FL2-H",
    mean = list(2, 2), covariance = list(list(0.25, 0.05), list(0.05, 0.3)), distance_square = 2.25,
    space = "display", transforms = list(`FL1-H` = logicle_spec(), `FL2-H` = logicle_spec())
  ))
  populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), parent_id = NULL),
    `pop-ell` = list(population_id = "pop-ell", name = "blob", parent_id = "pop-root",
                     gate_refs = list(list(gate_id = "g-ell", include = TRUE)))
  )
  masks <- lapply(1:2, function(index) {
    values <- transformed_values(gs, index)[, c("FL1-H", "FL2-H")]
    stats::mahalanobis(values, c(2, 2), matrix(c(0.25, 0.05, 0.05, 0.3), 2)) <= 2.25
  })
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(workspace_json(gates, populations),
                      memberships_payload(gs, list(list(id = "pop-ell", name = "blob", parent = "pop-root", masks = masks)))),
    dataset_id = "gatingset-gs"
  )
  expect_identical(handled$report$gates, "blob")
  gate <- flowWorkspace::gh_pop_get_gate(gs[[1]], "/blob")
  expect_s4_class(gate, "ellipsoidGate")
  expect_equal(unname(gate@distance), 1.5)
  expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[1]], "/blob")), masks[[1]])
})

# ── the other dialogs ─────────────────────────────────────────────────────────

test_that("the colData export writes populations as nodes under the root", {
  gs <- make_gatingset()
  ws_masks <- lapply(1:2, function(index) transformed_values(gs, index)[, "FL1-H"] > 2)
  counts <- GateLabR:::.gatelabr_gatingset_event_counts(gs)
  masks_payload <- lapply(1:2, function(index) list(
    sampleId = flowWorkspace::sampleNames(gs)[[index]], eventCount = unname(counts[[index]]),
    membershipBitsBase64 = packed_sample(ws_masks[[index]])
  ))
  column <- list(columnName = "bright/cells", populationId = "p", populationName = "bright",
                 inLabel = "in", outLabel = "out", sampleMasks = masks_payload)
  request <- list(operation = "write-coldata", payload = list(
    datasetId = "gatingset-gs", contractVersion = 1L, workspaceRevision = 0L, columns = list(column), overwrite = FALSE
  ))
  handled <- GateLabR:::.gatelabr_handle_host_request(gs, request, dataset_id = "gatingset-gs")
  expect_identical(handled$result$columns[[1]]$columnName, "bright-cells")
  expect_identical(handled$result$columns[[1]]$memberCount, as.numeric(sum(unlist(ws_masks))))
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/bright-cells"))
  expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[2]], "/bright-cells")), ws_masks[[2]])
  expect_error(GateLabR:::.gatelabr_handle_host_request(gs, request, dataset_id = "gatingset-gs"), "already has a node")
  request$payload$overwrite <- TRUE
  GateLabR:::.gatelabr_handle_host_request(gs, request, dataset_id = "gatingset-gs")
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/bright-cells"))
  categorical <- list(operation = "write-categorical-coldata", payload = list(
    datasetId = "gatingset-gs", contractVersion = 1L, columns = list(), overwrite = FALSE
  ))
  expect_error(GateLabR:::.gatelabr_handle_host_request(gs, categorical, dataset_id = "gatingset-gs"), "no per-event columns")
})

test_that("a pData column colours plots with one code per sample", {
  gs <- make_gatingset()
  flowWorkspace::pData(gs)$group <- factor(c("treated", "control"), levels = c("control", "treated"))
  request <- list(operation = "read-categorical-coldata", payload = list(
    datasetId = "gatingset-gs", contractVersion = 1L, columnName = "group"
  ))
  handled <- GateLabR:::.gatelabr_handle_host_request(gs, request, dataset_id = "gatingset-gs")
  expect_identical(as.character(handled$result$levels), c("control", "treated"))
  expect_identical(handled$result$sampleValues[[1]]$constantCode, 1L)
  expect_identical(handled$result$sampleValues[[2]]$constantCode, 0L)
  expect_identical(handled$result$sampleValues[[2]]$sampleId, "s5a02")
  # cytolib keeps pData as text, so a number put there comes back as a string and colours too.
  flowWorkspace::pData(gs)$score <- c(1.5, 2.5)
  request$payload$columnName <- "score"
  scored <- GateLabR:::.gatelabr_handle_host_request(gs, request, dataset_id = "gatingset-gs")
  expect_identical(as.character(scored$result$levels), c("1.5", "2.5"))
  request$payload$columnName <- "name"
  expect_error(GateLabR:::.gatelabr_handle_host_request(gs, request, dataset_id = "gatingset-gs"), "no column")
})

test_that("the panel dialog writes the object's marker names", {
  gs <- make_gatingset()
  request <- function(changes, expected = 0) list(operation = "write-rowdata-labels", payload = list(
    datasetId = "gatingset-gs", contractVersion = 1L, expectedRevision = expected, changes = changes
  ))
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, request(list(list(channelId = "FL1-H", label = "CD15"), list(channelId = "FL2-H", label = "CD45 PE"))),
    dataset_id = "gatingset-gs"
  )
  expect_identical(handled$result$changedChannelIds, "FL1-H")
  expect_identical(handled$result$revision, 1)
  expect_identical(unname(flowWorkspace::markernames(gs)[["FL1-H"]]), "CD15")
  expect_identical(GateLabR:::.gatelabr_gatingset_dataset_descriptor(gs)$rowDataRevision, 1)
  expect_identical(GateLabR:::.gatelabr_gatingset_dataset_descriptor(gs)$channels[[3]]$pns, "CD15")
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    gs, request(list(list(channelId = "FL1-H", label = "x"))), dataset_id = "gatingset-gs"
  ), "reopen")
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    gs, request(list(list(channelId = "FL1-H", label = "")), expected = 1), dataset_id = "gatingset-gs"
  ), "markernames")
})

test_that("compensation from the app is refused with the reason", {
  transformed <- make_gatingset()
  request <- list(operation = "apply-compensation", payload = list(
    datasetId = "gatingset-gs", contractVersion = 1L, profileJson = "{}", targets = list()
  ))
  expect_error(GateLabR:::.gatelabr_handle_host_request(transformed, request, dataset_id = "gatingset-gs"),
               "compensation precedes transformation")
  compensated <- flowWorkspace::GatingSet(gvhd())
  spill <- matrix(c(1, 0.1, 0.05, 1), 2L, dimnames = list(c("FL1-H", "FL2-H"), c("FL1-H", "FL2-H")))
  flowWorkspace::compensate(compensated, spill)
  expect_error(GateLabR:::.gatelabr_handle_host_request(compensated, request, dataset_id = "gatingset-gs"),
               "cannot uncompensate")
  plain <- flowWorkspace::GatingSet(gvhd())
  request$operation <- "adopt-compensated-assay"
  expect_error(GateLabR:::.gatelabr_handle_host_request(plain, request, dataset_id = "gatingset-gs"),
               "compensate\\(\\)")
})

# ── the manifest and the launcher ─────────────────────────────────────────────

test_that("the manifest registers one lazy resource per sample and the hierarchy envelope", {
  gs <- add_every_node_kind(make_mixed_gatingset())
  registered <- list()
  sent <- list()
  session <- list(
    registerDataObj = function(name, data, filterFunc) {
      registered[[name]] <<- list(data = data, filter = filterFunc)
      paste0("session/", name)
    },
    sendCustomMessage = function(type, message) sent[[type]] <<- message
  )
  manifest <- GateLabR:::.gatelabr_register_host_manifest(session, gs, dataset_id = "gatingset-gs", label = "gs")
  expect_identical(names(sent), "gatelabr-host-manifest")
  expect_identical(manifest$datasets[[1]]$id, "gatingset-gs")
  expect_identical(manifest$datasets[[1]]$label, "gs")
  expect_length(manifest$resources, 2L)
  expect_identical(manifest$resources[[2]]$sampleId, "s5a02")
  expect_identical(names(manifest$resources[[1]]$assayUrls), "counts")
  expect_identical(manifest$workspace$sourceFormat, "gatingset-hierarchy")
  expect_identical(manifest$compensationApplications, list())
  # The assay resource serves the sample on request.
  response <- registered[["gatelabr-gs-1-gatingsetgs-assay"]]$filter(
    registered[["gatelabr-gs-1-gatingsetgs-assay"]]$data, list(REQUEST_METHOD = "GET")
  )
  expect_identical(response$status, 200L)
})

test_that("the launcher serves a GatingSet from the object, and every write reaches it in place", {
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
    "Save to GatingSet"
  )
  expect_length(starts, 1L)
  expect_identical(live$gatingset, gs)
  expect_identical(live$sce_name, name)
  # The app is served the object itself, not a copy.
  expect_true(GateLabR:::.gatelabr_is_gatingset(live$get_sce()))
  expect_identical(live$get_sce(), gs)
  expect_true(GateLabR:::.gatelabr_is_gatingset(get(name, envir = .GlobalEnv)))
  # A write reaches the object in place, and the write-back guard sees the same object.
  ws_gates <- list(`g` = list(gate_id = "g", name = "box", gate_type = "rectangle", x_channel = "FL1-H", y_channel = "FL2-H",
                              vertices = list(list(1.5, 1), list(3.5, 1), list(3.5, 3), list(1.5, 3)),
                              space = "display", transforms = list(`FL1-H` = logicle_spec(), `FL2-H` = logicle_spec())))
  ws_populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), parent_id = NULL),
    `pop-box` = list(population_id = "pop-box", name = "box cells", parent_id = "pop-root",
                     gate_refs = list(list(gate_id = "g", include = TRUE)))
  )
  masks <- lapply(1:2, function(index) {
    values <- transformed_values(gs, index)
    values[, "FL1-H"] >= 1.5 & values[, "FL1-H"] <= 3.5 & values[, "FL2-H"] >= 1 & values[, "FL2-H"] <= 3
  })
  handled <- GateLabR:::.gatelabr_handle_host_request(
    live$get_sce(),
    write_request(workspace_json(ws_gates, ws_populations),
                  memberships_payload(gs, list(list(id = "pop-box", name = "box cells", parent = "pop-root", masks = masks)))),
    dataset_id = "gatingset-gs"
  )
  GateLabR:::.gatelabr_write_back(live, name, handled$sce)
  expect_match(GateLabR:::.gatelabr_gatingset_write_report(handled$report, name), "1 as flowWorkspace gates")
  expect_true(GateLabR:::.gatelabr_is_gatingset(get(name, envir = .GlobalEnv)))
  expect_identical(GateLabR:::.gatelabr_gatingset_record(gs)$revision, 1L)
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/box cells"))
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
  expect_identical(live$get_sce(), other)
  expect_null(GateLabR:::.gatelabr_check_write_back(live, name))
  smaller <- flowWorkspace::load_gs(dir)[1]
  assign(name, smaller, envir = .GlobalEnv)
  expect_error(GateLabR::gatelabSync(name), "relaunch")
})

test_that("the launch note and the UI name the object", {
  gs <- make_mixed_gatingset()
  note <- GateLabR:::.gatelabr_gatingset_launch_note(gs)
  expect_match(note, "2 samples")
  expect_match(note, "1 logicle, 1 arcsinh, 1 FlowJo log, 1 biexponential")
  expect_match(note, "no compensation applied")
  ui <- as.character(GateLabR:::.gatelabr_react_ui("prefix", list(hostVersion = "1.6.0"), object_kind = "GatingSet"))
  expect_match(ui, "\"objectKind\":\"GatingSet\"", fixed = TRUE)
  expect_match(ui, "\"hostVersion\":\"1.6.0\"", fixed = TRUE)
})
