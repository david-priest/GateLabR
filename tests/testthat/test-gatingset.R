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
  # No tableChannels, and spline: the app then builds cytolib's own table and evaluates it as R's
  # natural spline, which is flowWorkspace's function.
  expect_identical(transforms[[7]], list(kind = "biex", maxValue = 262144, pos = 4.5, neg = 0,
                                         widthBasis = -10, channelRange = 4096, spline = TRUE))
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
  expect_identical(payload$contractVersion, 2L)
  nodes <- payload$nodes
  names(nodes) <- vapply(nodes, `[[`, character(1), "path")
  expect_identical(names(nodes), c("/rect", "/rect/poly", "/ell", "/bool", "/FL1-H x FL2-H quadrants", "/oneD", "/neg"))
  expect_identical(unname(vapply(nodes, `[[`, character(1), "parent")), c("root", "/rect", "root", "root", "root", "root", "root"))
  # Both samples hold the same gates, so no node carries a tailoring.
  expect_true(all(vapply(nodes, function(node) is.null(node$tailored), logical(1))))

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
  # An OR is left out by name, as the app's Gating-ML importer does; the host leaves it out
  # itself, so that what it sent is what the app holds, and a save keeps the node.
  expect_identical(payload$leftOut, list(list(path = "/either", reason = "an OR of other nodes, which GateLab does not hold")))
  expect_identical(sort(attr(payload, "received")), sort(c(setdiff(names(nodes), "/FL1-H x FL2-H quadrants"),
    vapply(nodes[["/FL1-H x FL2-H quadrants"]]$gate$members, `[[`, character(1), "path"))))

  # The envelope carries it as JSON the app's contract reads, with open bounds as null.
  envelope <- GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gatingset-gs")
  expect_identical(envelope$sourceFormat, "gatingset-hierarchy")
  expect_identical(envelope$revision, 0L)
  parsed <- jsonlite::fromJSON(envelope$workspaceJson, simplifyVector = FALSE)
  expect_length(parsed$nodes, 7L)
  expect_null(parsed$nodes[[6]]$gate$max[[1]])
  expect_identical(parsed$nodes[[1]]$gate$axes[[1]]$transform$kind, "logicle")
  expect_true(is.list(parsed$nodes[[2]]$gate$vertices[[1]]))

  # An object with no node sends no envelope.
  expect_null(GateLabR:::.gatelabr_gatingset_workspace_envelope(make_gatingset(), "gatingset-gs"))
})

test_that("a node on a channel the host cannot map is left out with the reason, and so are the booleans naming it", {
  gs <- make_gatingset()
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate("FL1-H" = c(1, 3), filterId = "a"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate("FL2-H" = c(1, 3), filterId = "b"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(a | b, filterId = "either"), parent = "root")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(a & b, filterId = "both"), parent = "root")
  flowWorkspace::recompute(gs)
  axes <- GateLabR:::.gatelabr_gatingset_axes(gs, c("FL1-H", "FL2-H"))
  axes[["FL2-H"]] <- GateLabR:::.gatelabr_gatingset_axis(list(type = "caltbl"))
  payload <- GateLabR:::.gatelabr_gatingset_hierarchy_payload(gs, axes)
  expect_identical(vapply(payload$nodes, `[[`, character(1), "path"), "/a")
  expect_identical(vapply(payload$leftOut, `[[`, character(1), "path"), c("/b", "/either", "/both"))
  expect_match(payload$leftOut[[1]]$reason, "calibration table")
  expect_identical(payload$leftOut[[2]]$reason, "an OR of other nodes, which GateLab does not hold")
  # The app would drop a boolean naming a node left out; the host does, by the same words.
  expect_identical(payload$leftOut[[3]]$reason, "names '/b', which was left out")
  expect_identical(attr(payload, "received"), "/a")
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
  # The two kept are unchanged, and left exactly as the first save wrote them.
  expect_identical(trimmed$report$kept, c("box cells", "scatter box"))
  expect_identical(trimmed$report$gates, character(0))
  expect_setequal(trimmed$report$removed, c("/scatter poly", "/other space", "/box not poly", "/open box"))
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

# The app's compensation profile record (compensationProfileRecord.ts), as test-host-compensation.R
# builds it, on channels of the GvHD files.
gatingset_compensation_profile <- function(kind = c("flow-spillover", "cytof-spillover"),
                                           channels = c("FL1-H", "FL2-H"),
                                           spill = matrix(c(1, 0.1, 0.05, 1), nrow = 2, byrow = TRUE),
                                           purpose = c("apply", "adopt")) {
  kind <- match.arg(kind)
  purpose <- match.arg(purpose)
  scientific <- list(
    schema = "gatelab.compensation-profile.v1",
    kind = kind,
    method = if (kind == "cytof-spillover") "nnls" else "matrix-inverse",
    solverVersion = if (purpose == "adopt") "r-external-precomputed-v1" else if (kind == "cytof-spillover") "r-nnls-v1" else "r-matrix-inverse-v1",
    solverSettings = if (kind == "cytof-spillover") {
      list(list(key = "adaptationVersion", value = "identity-backed-v1"), list(key = "kktTolerance", value = 1e-9),
           list(key = "maxIterations", value = 1000), list(key = "tolerance", value = 1e-10))
    } else {
      list(list(key = "conditionWarningThreshold", value = 1e8), list(key = "singularTolerance", value = 1e-12))
    },
    matrix = list(
      schema = "gatelab.compensation-matrix.v1",
      orientation = "source-rows-receiver-columns",
      sourceChannels = channels,
      receiverChannels = channels,
      matrix = lapply(seq_len(nrow(spill)), function(row) unname(as.numeric(spill[row, ])))
    ),
    includedChannels = if (kind == "cytof-spillover") channels else list()
  )
  matrix_record <- GateLabR:::.gatelabr_comp_matrix_record(scientific)
  matrix_hash <- GateLabR:::.gatelabr_comp_matrix_hash(matrix_record)
  profile_hash <- GateLabR:::.gatelabr_comp_profile_hash(scientific, matrix_hash)
  profile <- list(
    schema = "gatelab.compensation-profile-record.v1", recordType = "baseline",
    profileId = paste0("gs-test-", purpose), name = "GatingSet compensation test",
    createdAt = "2026-10-13T00:00:00.000Z", note = NULL, scientific = scientific,
    matrixHash = matrix_hash, profileHash = profile_hash,
    origin = list(type = "uploaded", fileName = "test.csv", format = "csv", sourceColumnHeader = ""),
    provenance = NULL, baselineProfileId = paste0("gs-test-", purpose), baselineMatrixHash = matrix_hash,
    baselineProfileHash = profile_hash, parentProfileId = NULL, revisionReason = NULL
  )
  as.character(jsonlite::toJSON(profile, auto_unbox = TRUE, digits = NA, null = "null", na = "null",
                                dataframe = "rows", matrix = "rowmajor"))
}

compensation_request <- function(operation, profile_json, samples, output = NULL) {
  payload <- list(
    datasetId = "gatingset-gs", contractVersion = 1L, profileJson = profile_json,
    targets = lapply(samples, function(sample) list(sampleId = sample, sourceAssayId = "counts",
                                                   expectedAssayRevision = 0, activeLayer = "compensated"))
  )
  if (!is.null(output)) { payload$outputAssayId <- output; payload$expectedOutputAssayRevision <- 1 }
  list(operation = operation, payload = payload)
}

test_that("a matrix from the app is applied to a writable, uncompensated, untransformed GatingSet in place", {
  gs <- flowWorkspace::GatingSet(gvhd())
  samples <- flowWorkspace::sampleNames(gs)
  spill <- matrix(c(1, 0.1, 0.05, 1), nrow = 2, byrow = TRUE, dimnames = list(c("FL1-H", "FL2-H"), c("FL1-H", "FL2-H")))
  registered <- list()
  session <- list(
    registerDataObj = function(name, data, filterFunc) { registered[[name]] <<- list(data = data, filter = filterFunc); paste0("session/", name) },
    sendCustomMessage = function(type, message) invisible(NULL)
  )
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, compensation_request("apply-compensation", gatingset_compensation_profile(), samples[[1]]),
    dataset_id = "gatingset-gs", session = session
  )
  application <- handled$result$application
  expect_identical(application$execution, "computed")
  expect_identical(application$sourceAssayId, "counts")
  expect_identical(application$outputAssay$id, "compensated")
  # The object is compensated as a whole, whatever the request named.
  expect_identical(as.character(application$targetSampleIds), samples)
  expect_identical(as.character(application$activeSampleIds), samples[[1]])
  expect_length(handled$result$targets, 2L)
  expect_identical(handled$result$targets[[2]]$sampleId, samples[[2]])
  # flowWorkspace holds the matrix, and the served values are flowCore's compensation of the files.
  expect_equal(unname(flowWorkspace::gh_get_compensations(gs[[1]])@spillover), unname(spill))
  expected <- flowCore::exprs(flowCore::compensate(gvhd()[[2]], spill))
  path <- withr::local_tempfile(fileext = ".f32")
  channels <- unname(colnames(expected))
  GateLabR:::.gatelabr_write_gatingset_assay_payload(gs, samples[[2]], channels, path)
  served <- matrix(readBin(path, "numeric", n = length(channels) * nrow(expected), size = 4L, endian = "little"),
                   ncol = length(channels), dimnames = list(NULL, channels))
  expect_equal(served[, "FL1-H"], unname(expected[, "FL1-H"]), tolerance = 1e-6)
  expect_identical(served[, "FSC-H"], unname(expected[, "FSC-H"]))
  # The descriptor now says compensated, with the matrix; the manifest reports the application.
  descriptor <- GateLabR:::.gatelabr_gatingset_dataset_descriptor(gs, dataset_id = "gatingset-gs")
  expect_identical(descriptor$assays[[1]]$id, "compensated")
  expect_identical(descriptor$assays[[1]]$revision, 1L)
  expect_identical(as.character(descriptor$compensationMatrix$sourceChannels), c("FL1-H", "FL2-H"))
  applications <- GateLabR:::.gatelabr_gatingset_compensation_applications(gs, "gatingset-gs")
  expect_length(applications, 1L)
  expect_identical(applications[[1]]$execution, "adopted-existing-assay")
  expect_identical(jsonlite::fromJSON(applications[[1]]$profileJson)$profileId, "gs-test-apply")
  # The record survives save_gs(); a second matrix is refused.
  dir <- withr::local_tempdir()
  flowWorkspace::save_gs(gs, dir)
  reloaded <- flowWorkspace::load_gs(dir)
  expect_identical(GateLabR:::.gatelabr_gatingset_compensation_record(reloaded)$execution, "computed")
  expect_length(GateLabR:::.gatelabr_gatingset_compensation_applications(reloaded, "gatingset-gs"), 1L)
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    gs, compensation_request("apply-compensation", gatingset_compensation_profile(), samples), dataset_id = "gatingset-gs"
  ), "compensated already")
  # Adoption records a profile for the compensation the object carries.
  adopted <- GateLabR:::.gatelabr_handle_host_request(
    gs, compensation_request("adopt-compensated-assay", gatingset_compensation_profile(purpose = "adopt"), samples, output = "compensated"),
    dataset_id = "gatingset-gs"
  )
  expect_identical(adopted$result$application$execution, "adopted-existing-assay")
  expect_identical(jsonlite::fromJSON(GateLabR:::.gatelabr_gatingset_compensation_record(gs)$profile_json)$profileId, "gs-test-adopt")
})

test_that("compensation from the app is refused with the reason where flowWorkspace cannot do it in place", {
  samples <- c("s5a01", "s5a02")
  transformed <- make_gatingset()
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    transformed, compensation_request("apply-compensation", gatingset_compensation_profile(), samples), dataset_id = "gatingset-gs"
  ), "compensation precedes transformation")
  plain <- flowWorkspace::GatingSet(gvhd())
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    plain, compensation_request("apply-compensation", gatingset_compensation_profile("cytof-spillover"), samples), dataset_id = "gatingset-gs"
  ), "NNLS")
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    plain, compensation_request("apply-compensation", gatingset_compensation_profile(channels = c("FL1-H", "FL9-H")), samples), dataset_id = "gatingset-gs"
  ), "FL9-H")
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    plain, compensation_request("adopt-compensated-assay", gatingset_compensation_profile(purpose = "adopt"), samples, output = "compensated"), dataset_id = "gatingset-gs"
  ), "no compensation")
  # A GatingSet opened with load_gs() is read-only on its data.
  dir <- withr::local_tempdir()
  flowWorkspace::save_gs(plain, dir)
  loaded <- flowWorkspace::load_gs(dir)
  expect_error(GateLabR:::.gatelabr_handle_host_request(
    loaded, compensation_request("apply-compensation", gatingset_compensation_profile(), samples), dataset_id = "gatingset-gs"
  ), "read-only")
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

test_that("a range gate, which the app holds on one channel twice, is written as a one-dimensional rectangleGate", {
  # Found by the headless check on CytoML's GatingSet (2026-10-13): its 'not debris' and 'HLA
  # range' nodes came back as memberships because the open second axis overwrote the first.
  gs <- make_gatingset()
  huge <- 1.7976931348623157e308
  gates <- list(`g-range` = list(
    gate_id = "g-range", name = "bright", gate_type = "rectangle", x_channel = "FL1-H", y_channel = "FL1-H",
    vertices = list(list(2, -huge), list(3.5, -huge), list(3.5, huge), list(2, huge)),
    space = "display", transforms = list(`FL1-H` = logicle_spec())
  ))
  populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), parent_id = NULL),
    `pop-range` = list(population_id = "pop-range", name = "bright", parent_id = "pop-root",
                       gate_refs = list(list(gate_id = "g-range", include = TRUE)))
  )
  masks <- lapply(1:2, function(index) {
    values <- transformed_values(gs, index)[, "FL1-H"]
    values >= 2 & values <= 3.5
  })
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(workspace_json(gates, populations),
                      memberships_payload(gs, list(list(id = "pop-range", name = "bright", parent = "pop-root", masks = masks)))),
    dataset_id = "gatingset-gs"
  )
  expect_identical(handled$report$gates, "bright")
  gate <- flowWorkspace::gh_pop_get_gate(gs[[1]], "/bright")
  expect_s4_class(gate, "rectangleGate")
  expect_identical(as.character(flowCore::parameters(gate)), "FL1-H")
  expect_equal(unname(gate@min), 2)
  expect_equal(unname(gate@max), 3.5)
  expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[2]], "/bright")), masks[[2]])
})

test_that("a launch with no argument finds a GatingSet, after any SingleCellExperiment", {
  env <- new.env()
  assign("notes", data.frame(x = 1), envir = env)
  assign("my_gs", make_gatingset(), envir = env)
  expect_identical(GateLabR:::.gatelabr_launch_candidates(env), "my_gs")
  assign("an_sce", SingleCellExperiment::SingleCellExperiment(assays = list(counts = matrix(1:4, 2L))), envir = env)
  expect_identical(GateLabR:::.gatelabr_launch_candidates(env), c("an_sce", "my_gs"))
  expect_identical(GateLabR:::.gatelabr_launch_candidates(new.env()), character(0))
})

test_that("a boolean's terms resolve as cytolib stores them: relative to the root, then under the parent", {
  paths <- c("/debris", "/R5", "/R5/debris", "/debris-", "/debris-/CD45", "/debris-/CD45/dead")
  resolve <- GateLabR:::.gatelabr_gatingset_resolve_term
  # Found by check C on a FlowJo workspace: `!debris` at the root with two nodes named debris.
  expect_identical(resolve("debris", paths, "root"), "/debris")
  expect_identical(resolve("debris-/CD45/dead", paths, "/debris-/CD45"), "/debris-/CD45/dead")
  expect_identical(resolve("debris", paths, "/R5"), "/debris")
  expect_identical(resolve("dead", paths, "/debris-/CD45"), "/debris-/CD45/dead")
  expect_identical(resolve("/R5/debris", paths, "root"), "/R5/debris")
  expect_identical(resolve("CD45", paths, "root"), "/debris-/CD45")
  expect_null(resolve("nothere", paths, "root"))
})

test_that("a half-open rectangle is written closed just below its upper edge, so events on the edge stay out", {
  gs <- make_gatingset()
  # An edge exactly on a value many events share: FSC-H is integer-valued in GvHD.
  edge <- as.numeric(stats::median(transformed_values(gs, 1)[, "FSC-H"]))
  gates <- list(`g-half` = list(gate_id = "g-half", name = "half", gate_type = "rectangle", x_channel = "FSC-H", y_channel = "SSC-H",
                                vertices = list(list(100, 0), list(edge, 0), list(edge, 1e4), list(100, 1e4)), bounds = "half-open"))
  populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), parent_id = NULL),
    `pop-half` = list(population_id = "pop-half", name = "half", parent_id = "pop-root", gate_refs = list(list(gate_id = "g-half", include = TRUE)))
  )
  masks <- lapply(1:2, function(index) {
    v <- transformed_values(gs, index)
    v[, "FSC-H"] >= 100 & v[, "FSC-H"] < edge & v[, "SSC-H"] >= 0 & v[, "SSC-H"] < 1e4
  })
  expect_true(any(transformed_values(gs, 1)[, "FSC-H"] == edge))
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(workspace_json(gates, populations),
                      memberships_payload(gs, list(list(id = "pop-half", name = "half", parent = "pop-root", masks = masks)))),
    dataset_id = "gatingset-gs"
  )
  expect_identical(handled$report$gates, "half")
  gate <- flowWorkspace::gh_pop_get_gate(gs[[1]], "/half")
  expect_s4_class(gate, "rectangleGate")
  expect_lt(unname(gate@max)[[1]], edge)
  expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[1]], "/half")), masks[[1]])
})

test_that("a population excluding its one gate is written as that gate, negated", {
  # FlowJo's NOT gate, which CytoML parses as a negated node: the parent's events outside the gate.
  gs <- make_gatingset()
  gates <- list(`g-box` = list(gate_id = "g-box", name = "box", gate_type = "rectangle", x_channel = "FL1-H", y_channel = "FL2-H",
                               vertices = list(list(1.5, 1), list(3.5, 1), list(3.5, 3), list(1.5, 3)),
                               space = "display", transforms = list(`FL1-H` = logicle_spec(), `FL2-H` = logicle_spec())))
  populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), parent_id = NULL),
    `pop-not` = list(population_id = "pop-not", name = "not box", parent_id = "pop-root",
                     gate_refs = list(list(gate_id = "g-box", include = FALSE)))
  )
  masks <- lapply(1:2, function(index) {
    v <- transformed_values(gs, index)
    !(v[, "FL1-H"] >= 1.5 & v[, "FL1-H"] <= 3.5 & v[, "FL2-H"] >= 1 & v[, "FL2-H"] <= 3)
  })
  handled <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(workspace_json(gates, populations),
                      memberships_payload(gs, list(list(id = "pop-not", name = "not box", parent = "pop-root", masks = masks)))),
    dataset_id = "gatingset-gs"
  )
  expect_identical(handled$report$gates, "not box")
  expect_s4_class(flowWorkspace::gh_pop_get_gate(gs[[1]], "/not box"), "rectangleGate")
  expect_true(flowWorkspace::gh_pop_is_negated(gs[[1]], "/not box"))
  expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[2]], "/not box")), masks[[2]])
})

test_that("the transforms a save was drawn on stay on the SCE's rows, as a GatingSet keeps its own", {
  counts <- rbind(`FL1-H` = c(10, 400, 8000, 20), `FL2-H` = c(3, 70, 2, 1200), `FSC-H` = c(100, 101, 200, 201))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts),
    colData = S4Vectors::DataFrame(sample_id = c("D1", "D1", "D2", "D2")),
    rowData = S4Vectors::DataFrame(pnn = rownames(counts), row.names = rownames(counts))
  )
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  transforms <- list(`FL1-H` = logicle_spec(0.75), `FL2-H` = list(kind = "asinh", cofactor = 150), `FSC-H` = list(kind = "identity"))
  json <- as.character(jsonlite::toJSON(
    list(format = "gatelab-workspace", version = 2L, hostedAssayId = "counts", hostedChannelTransforms = transforms,
         samples = list(list(sampleId = "sce-gs:sample-0", fileName = "D1", dataPath = "data/sce-1.fcs", logicleW = list(), compensationOn = FALSE),
                        list(sampleId = "sce-gs:sample-1", fileName = "D2", dataPath = "data/sce-2.fcs", logicleW = list(), compensationOn = FALSE)),
         activeSample = 0L,
         gating = list(gates = list(), gate_order = list(),
                       populations = list(`pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), gate_logic = "and",
                                                            parent_id = NULL, children = list(), event_count = NULL, percent_of_parent = NULL)),
                       root_population_id = "pop-root", active_population_id = "pop-root", selected_gate_id = NULL),
         scales = list(globalScales = list()),
         display = list(xChannel = "FL1-H", yChannel = "FL2-H", mode = "pseudocolor", maxEvents = 50000L, contourThreshold = 5L)),
    auto_unbox = TRUE, null = "null", digits = NA
  ))
  stored <- GateLabR:::.gatelabr_store_host_workspace(
    sce, dataset_id = "sce-gs", expected_revision = 0L, client_revision = 1L, reason = "autosave",
    workspace_json = json, sample_column = "sample_id"
  )
  sce <- stored$sce
  column <- SummarizedExperiment::rowData(sce)$gatelab_transform
  expect_identical(jsonlite::fromJSON(column[[1]])$kind, "logicle")
  expect_identical(jsonlite::fromJSON(column[[1]])$W, 0.75)
  expect_identical(jsonlite::fromJSON(column[[3]])$kind, "identity")
  descriptor <- GateLabR:::.gatelabr_sce_dataset_descriptor(sce, dataset_id = "sce-gs")
  expect_equal(descriptor$channels[[1]]$transform, logicle_spec(0.75))
  expect_equal(descriptor$channels[[2]]$transform$cofactor, 150)
  read <- GateLabR::gatelabTransforms(sce)
  expect_identical(names(read), c("FL1-H", "FL2-H", "FSC-H"))
  expect_identical(read[["FL2-H"]]$kind, "asinh")
  # A GatingSet reports its own transforms the same way.
  gs <- make_mixed_gatingset()
  own <- GateLabR::gatelabTransforms(gs)
  expect_identical(names(own), c("FL1-H", "FL2-H", "FL3-H", "FL4-H"))
  expect_identical(own[["FL1-H"]], logicle_spec())
  expect_identical(own[["FL4-H"]]$kind, "biex")
  # A save that states no transforms leaves the rows as they were.
  again <- GateLabR:::.gatelabr_store_host_workspace(
    sce, dataset_id = "sce-gs", expected_revision = 1L, client_revision = 2L, reason = "autosave",
    workspace_json = sub(",\"hostedChannelTransforms\":\\{[^}]*\\}\\}\\}", "", json), sample_column = "sample_id"
  )
  expect_identical(SummarizedExperiment::rowData(again$sce)$gatelab_transform, column)
})

test_that("populations can be read by path, which is unique, on both objects", {
  gs <- add_every_node_kind(make_mixed_gatingset())
  by_path <- GateLabR::gatelabPopulations(gs, by = "path")
  expect_true(all(startsWith(colnames(by_path), "/")))
  expect_true("/rect/poly" %in% colnames(by_path))
  by_name <- GateLabR::gatelabPopulations(gs)
  expect_identical(unname(by_name[, "poly"]), unname(by_path[, "/rect/poly"]))
})

# ── an SCE's gating as a GatingSet ────────────────────────────────────────────

test_that("a gated SCE becomes a GatingSet whose nodes hold the stored memberships, with the object's transforms", {
  fs <- gvhd()
  raw <- lapply(1:2, function(index) flowCore::exprs(fs[[index]]))
  counts <- t(rbind(raw[[1]], raw[[2]]))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts),
    colData = S4Vectors::DataFrame(sample_id = rep(c("D1", "D2"), c(nrow(raw[[1]]), nrow(raw[[2]]))), group = rep(c("treated", "control"), c(nrow(raw[[1]]), nrow(raw[[2]])))),
    rowData = S4Vectors::DataFrame(pnn = rownames(counts), pns = c("", "", "CD15 FITC", "CD45 PE", "CD14 PerCP", "", "CD33 APC", ""), row.names = rownames(counts))
  )
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  # The app's workspace: a rectangle in logicle space on FL1-H x FL2-H, a raw polygon on scatter
  # under it, and the transforms each channel was drawn on.
  logicle <- function(x) flowCore::logicleTransform(w = 0.5, t = 262144, m = 4.5, a = 0)@.Data(x)
  gates <- list(
    `g-box` = list(gate_id = "g-box", name = "box", gate_type = "rectangle", x_channel = "FL1-H", y_channel = "FL2-H",
                   vertices = list(list(1.5, 1), list(3.5, 1), list(3.5, 3), list(1.5, 3)),
                   space = "display", transforms = list(`FL1-H` = logicle_spec(), `FL2-H` = logicle_spec())),
    `g-poly` = list(gate_id = "g-poly", name = "scatter", gate_type = "polygon", x_channel = "FSC-H", y_channel = "SSC-H",
                    vertices = list(list(100, 50), list(900, 100), list(500, 700)))
  )
  populations <- list(
    `pop-root` = list(population_id = "pop-root", name = "root", gate_refs = list(), gate_logic = "and", parent_id = NULL, children = list("pop-box"), event_count = NULL, percent_of_parent = NULL),
    `pop-box` = list(population_id = "pop-box", name = "box cells", gate_refs = list(list(gate_id = "g-box", include = TRUE)), gate_logic = "and", parent_id = "pop-root", children = list("pop-sc"), event_count = NULL, percent_of_parent = NULL),
    `pop-sc` = list(population_id = "pop-sc", name = "scatter", gate_refs = list(list(gate_id = "g-poly", include = TRUE)), gate_logic = "and", parent_id = "pop-box", children = list(), event_count = NULL, percent_of_parent = NULL)
  )
  transforms <- list(`FL1-H` = logicle_spec(), `FL2-H` = logicle_spec(), `FSC-H` = list(kind = "identity"), `SSC-H` = list(kind = "identity"))
  json <- as.character(jsonlite::toJSON(
    list(format = "gatelab-workspace", version = 2L, hostedAssayId = "counts", hostedChannelTransforms = transforms,
         samples = list(list(sampleId = "sce-gs:sample-0", fileName = "D1", dataPath = "data/sce-1.fcs", logicleW = list(), compensationOn = FALSE),
                        list(sampleId = "sce-gs:sample-1", fileName = "D2", dataPath = "data/sce-2.fcs", logicleW = list(), compensationOn = FALSE)),
         activeSample = 0L,
         gating = list(gates = gates, gate_order = list("g-box", "g-poly"), populations = populations,
                       root_population_id = "pop-root", active_population_id = "pop-root", selected_gate_id = NULL),
         scales = list(globalScales = list()),
         display = list(xChannel = "FSC-H", yChannel = "SSC-H", mode = "pseudocolor", maxEvents = 50000L, contourThreshold = 5L)),
    auto_unbox = TRUE, null = "null", digits = NA
  ))
  masks <- lapply(raw, function(m) {
    box <- logicle(m[, "FL1-H"]) >= 1.5 & logicle(m[, "FL1-H"]) <= 3.5 & logicle(m[, "FL2-H"]) >= 1 & logicle(m[, "FL2-H"]) <= 3
    poly <- sp::point.in.polygon(m[, "FSC-H"], m[, "SSC-H"], c(100, 900, 500), c(50, 100, 700)) > 0
    list(box = box, sc = box & poly)
  })
  packed <- function(index, name) base64enc::base64encode(GateLabR:::.gatelabr_pack_bits(masks[[index]][[name]]))
  sample_masks <- function(name) lapply(1:2, function(index) list(sampleId = paste0("sample-", index - 1L), eventCount = nrow(raw[[index]]), membershipBitsBase64 = packed(index, name)))
  memberships <- list(
    hierarchies = list(list(id = "h1", name = "Main", active = TRUE, rootPopulationId = "pop-root")),
    populations = list(
      list(hierarchyId = "h1", populationId = "pop-root", populationName = "root", parentId = NULL, gateLogic = "and", gates = list(),
           sampleMasks = lapply(1:2, function(index) list(sampleId = paste0("sample-", index - 1L), eventCount = nrow(raw[[index]]), membershipBitsBase64 = base64enc::base64encode(GateLabR:::.gatelabr_pack_bits(rep(TRUE, nrow(raw[[index]]))))))),
      list(hierarchyId = "h1", populationId = "pop-box", populationName = "box cells", parentId = "pop-root", gateLogic = "and", gates = list(), sampleMasks = sample_masks("box")),
      list(hierarchyId = "h1", populationId = "pop-sc", populationName = "scatter", parentId = "pop-box", gateLogic = "and", gates = list(), sampleMasks = sample_masks("sc"))
    )
  )
  stored <- GateLabR:::.gatelabr_store_host_workspace(
    sce, dataset_id = "sce-gs", expected_revision = 0L, client_revision = 1L, reason = "explicit",
    workspace_json = json, sample_column = "sample_id", memberships = memberships
  )
  sce <- stored$sce

  gs <- NULL
  expect_message(gs <- GateLabR::gatelabGatingSet(sce), "2 as flowWorkspace gates")
  expect_true(GateLabR:::.gatelabr_is_gatingset(gs))
  expect_identical(flowWorkspace::sampleNames(gs), c("D1", "D2"))
  expect_identical(flowWorkspace::pData(gs)$group, c("treated", "control"))
  expect_identical(unname(flowWorkspace::markernames(gs)[["FL1-H"]]), "CD15 FITC")
  # The transforms the object stated are the GatingSet's.
  own <- GateLabR::gatelabTransforms(gs)
  expect_identical(own[["FL1-H"]], logicle_spec())
  expect_null(own[["FSC-H"]])
  # The nodes hold exactly the stored memberships, as gates.
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/box cells", "/box cells/scatter"))
  expect_s4_class(flowWorkspace::gh_pop_get_gate(gs[[1]], "/box cells"), "rectangleGate")
  expect_s4_class(flowWorkspace::gh_pop_get_gate(gs[[1]], "/box cells/scatter"), "polygonGate")
  for (index in 1:2) {
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/box cells")), masks[[index]]$box)
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/box cells/scatter")), masks[[index]]$sc)
  }
  # The readers agree across the two objects, and the GatingSet opens in the host on the carried record.
  expect_identical(unname(GateLabR::gatelabPopulations(gs)[, "scatter"]), unname(GateLabR::gatelabPopulations(sce)[, "scatter"]))
  record <- GateLabR:::.gatelabr_gatingset_record(gs)
  expect_identical(record$revision, 1L)
  expect_true(isTRUE(record$hierarchy_written))
  expect_identical(GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gatingset-gs")$sourceFormat, "gatelab-workspace")
  # Without a stored save there is nothing to export.
  bare <- SingleCellExperiment::SingleCellExperiment(assays = list(counts = counts))
  expect_error(GateLabR::gatelabGatingSet(bare), "Save to SCE")
})

# ── gates tailored per sample ─────────────────────────────────────────────────

# Two samples, D1 and D2, whose "cells" rectangle differs, as a FlowJo workspace tailors a gate
# per sample, with a polygon under it that both share; on linear scatter, so that every
# expected membership is plain arithmetic on the files' values.
tailored_bounds <- list(D1 = list(fsc = c(100, 600), ssc = c(0, 500)), D2 = list(fsc = c(200, 700), ssc = c(0, 400)))
core_polygon <- matrix(c(150.5, 550.5, 550.5, 150.5, 50.5, 50.5, 350.5, 350.5), ncol = 2,
                       dimnames = list(NULL, c("FSC-H", "SSC-H")))

tailored_frames <- function() {
  fs <- gvhd()
  flowCore::sampleNames(fs) <- c("D1", "D2")
  fs
}

tailored_gatingset <- function() {
  gs <- flowWorkspace::GatingSet(tailored_frames())
  rectangles <- lapply(tailored_bounds, function(b) flowCore::rectangleGate(filterId = "cells", "FSC-H" = b$fsc, "SSC-H" = b$ssc))
  flowWorkspace::gs_pop_add(gs, rectangles, parent = "root", name = "cells")
  flowWorkspace::gs_pop_add(gs, flowCore::polygonGate(filterId = "core", .gate = core_polygon), parent = "/cells", name = "core")
  flowWorkspace::recompute(gs)
  gs
}

# Membership of a closed rectangle and of the polygon, from the values, per sample.
in_box <- function(values, b) {
  values[, "FSC-H"] >= b$fsc[[1]] & values[, "FSC-H"] <= b$fsc[[2]] & values[, "SSC-H"] >= b$ssc[[1]] & values[, "SSC-H"] <= b$ssc[[2]]
}
in_core <- function(values) {
  sp::point.in.polygon(values[, "FSC-H"], values[, "SSC-H"], core_polygon[, 1], core_polygon[, 2]) > 0
}

# The workspace the app holds after opening the GatingSet (hostedHierarchy.ts): the tree with the
# reference gates, and D2's tailored copy of it with its own "cells" rectangle, with provenance.
tailored_workspace <- function(bounds = tailored_bounds, extra = list(), sample_ids = c("gs:D1", "gs:D2")) {
  identity <- list(`FSC-H` = list(kind = "identity"), `SSC-H` = list(kind = "identity"))
  rectangle <- function(id, b) {
    list(gate_id = id, name = "cells", gate_type = "rectangle", x_channel = "FSC-H", y_channel = "SSC-H",
         vertices = list(list(b$fsc[[1]], b$ssc[[1]]), list(b$fsc[[2]], b$ssc[[1]]), list(b$fsc[[2]], b$ssc[[2]]), list(b$fsc[[1]], b$ssc[[2]])),
         space = "display", transforms = identity, bounds = "closed")
  }
  polygon <- function(id) {
    list(gate_id = id, name = "core", gate_type = "polygon", x_channel = "FSC-H", y_channel = "SSC-H",
         vertices = lapply(seq_len(nrow(core_polygon)), function(row) as.list(unname(core_polygon[row, ]))),
         space = "display", transforms = identity)
  }
  population <- function(id, name, parent, refs, children) {
    list(population_id = id, name = name, gate_refs = refs, gate_logic = "and", parent_id = parent,
         children = children, event_count = NULL, percent_of_parent = NULL)
  }
  tree <- function(prefix, b) {
    gates <- list(rectangle(paste0(prefix, "/cells"), b), polygon(paste0(prefix, "/cells/core")))
    names(gates) <- vapply(gates, `[[`, character(1), "gate_id")
    root <- paste0(prefix, "root")
    pops <- list(
      population(root, "All Events", NULL, list(), list(paste0(prefix, "/cells"))),
      population(paste0(prefix, "/cells"), "cells", root, list(list(gate_id = paste0(prefix, "/cells"), include = TRUE)), list(paste0(prefix, "/cells/core"))),
      population(paste0(prefix, "/cells/core"), "core", paste0(prefix, "/cells"), list(list(gate_id = paste0(prefix, "/cells/core"), include = TRUE)), list())
    )
    names(pops) <- vapply(pops, `[[`, character(1), "population_id")
    for (entry in extra) {
      gates[[paste0(prefix, entry$gate$gate_id)]] <- utils::modifyList(entry$gate, list(gate_id = paste0(prefix, entry$gate$gate_id)))
      refs <- lapply(entry$refs, function(ref) utils::modifyList(ref, list(gate_id = paste0(prefix, ref$gate_id))))
      pops[[paste0(prefix, entry$id)]] <- population(paste0(prefix, entry$id), entry$name, root, refs, list())
      pops[[root]]$children <- c(pops[[root]]$children, list(paste0(prefix, entry$id)))
    }
    list(gates = gates, populations = pops, root = root)
  }
  main <- tree("", bounds$D1)
  copy <- tree("D2:", bounds$D2)
  copy_id <- "gatingset-tailoring:D2"
  source_ids <- function(ids) stats::setNames(as.list(sub("^D2:", "", ids)), ids)
  ref <- list(id = copy_id, name = "D2 \u00b7 Main", owner_sample_id = sample_ids[[2]], structure_locked = TRUE,
              source_hierarchy_id = "main", source_gate_ids = source_ids(names(copy$gates)),
              source_population_ids = source_ids(names(copy$populations)))
  ref$source_population_ids[["D2:root"]] <- "root"
  as.character(jsonlite::toJSON(list(
    format = "gatelab-workspace", version = 2L,
    samples = list(list(sampleId = sample_ids[[1]], fileName = "D1", dataPath = "data/sce-1.fcs", logicleW = list(), compensationOn = FALSE),
                   list(sampleId = sample_ids[[2]], fileName = "D2", dataPath = "data/sce-2.fcs", logicleW = list(), compensationOn = FALSE,
                        hierarchyId = copy_id)),
    activeSample = 0L,
    gating = list(
      gates = main$gates, gate_order = as.list(names(main$gates)), populations = main$populations,
      root_population_id = "root", active_population_id = "root", selected_gate_id = NULL,
      hierarchies = list(list(id = "main", name = "Main"), ref), active_hierarchy_id = "main",
      stored_hierarchies = list(c(ref, list(gates = copy$gates, gate_order = as.list(names(copy$gates)),
                                            populations = copy$populations, root_population_id = "D2:root",
                                            active_population_id = "D2:root"))),
      perFileHierarchies = TRUE
    ),
    scales = list(globalScales = setNames(list(), character(0))),
    display = list(xChannel = "FSC-H", yChannel = "SSC-H", mode = "pseudocolor", maxEvents = 50000L, contourThreshold = 5L)
  ), auto_unbox = TRUE, null = "null", digits = NA))
}

# The memberships the app sends at Save to GatingSet: the active tree's populations, each
# sample's masks read under that sample's own tree.
tailored_memberships <- function(masks, extra = list()) {
  values <- lapply(1:2, function(index) flowCore::exprs(tailored_frames()[[index]]))
  population <- function(id, name, parent, per_sample) {
    list(hierarchyId = "main", populationId = id, populationName = name, parentId = parent, gateLogic = "and", gates = list(),
         sampleMasks = lapply(1:2, function(index) {
           list(sampleId = c("D1", "D2")[[index]], eventCount = nrow(values[[index]]), membershipBitsBase64 = packed_sample(per_sample[[index]]))
         }))
  }
  everything <- lapply(values, function(v) rep(TRUE, nrow(v)))
  list(
    hierarchies = list(list(id = "main", name = "Main", active = TRUE, rootPopulationId = "root"),
                       list(id = "gatingset-tailoring:D2", name = "D2 \u00b7 Main", active = FALSE, rootPopulationId = "D2:root")),
    populations = c(
      list(population("root", "All Events", NULL, everything),
           population("/cells", "cells", "root", masks$cells),
           population("/cells/core", "core", "/cells", masks$core)),
      lapply(extra, function(entry) population(entry$id, entry$name, "root", entry$masks))
    )
  )
}

tailored_masks <- function(bounds = tailored_bounds) {
  values <- lapply(1:2, function(index) flowCore::exprs(tailored_frames()[[index]]))
  cells <- lapply(1:2, function(index) in_box(values[[index]], bounds[[index]]))
  list(cells = cells, core = lapply(1:2, function(index) cells[[index]] & in_core(values[[index]])))
}

test_that("a node whose gate differs between samples reaches the app with each sample's own gate", {
  gs <- tailored_gatingset()
  payload <- GateLabR:::.gatelabr_gatingset_hierarchy_payload(gs)
  nodes <- payload$nodes
  names(nodes) <- vapply(nodes, `[[`, character(1), "path")
  expect_identical(names(nodes), c("/cells", "/cells/core"))
  expect_length(payload$leftOut, 0L)
  # The tree takes D1's gate (each is held by one sample, and the earliest wins the tie)...
  cells <- nodes[["/cells"]]
  expect_identical(as.numeric(cells$gate$min), c(100, 0))
  expect_identical(as.numeric(cells$gate$max), c(600, 500))
  # ... and D2 carries its own as its tailoring, in the same form.
  expect_length(cells$tailored, 1L)
  expect_identical(cells$tailored[[1]]$sample, "D2")
  expect_identical(cells$tailored[[1]]$gate$kind, "rectangle")
  expect_identical(as.numeric(cells$tailored[[1]]$gate$min), c(200, 0))
  expect_identical(as.numeric(cells$tailored[[1]]$gate$max), c(700, 400))
  # The polygon both share carries none.
  expect_null(nodes[["/cells/core"]]$tailored)
  json <- jsonlite::fromJSON(GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gs")$workspaceJson, simplifyVector = FALSE)
  expect_identical(json$contractVersion, 2L)
  expect_identical(json$nodes[[1]]$tailored[[1]]$sample, "D2")
  expect_equal(unlist(json$nodes[[1]]$tailored[[1]]$gate$max), c(700, 400))
  # The launch note says which nodes open tailored, and on which samples.
  expect_match(GateLabR:::.gatelabr_gatingset_launch_note(gs), "1 with a gate of their own on some samples, opened as those samples' tailoring: D2 1", fixed = TRUE)
})

test_that("Save to GatingSet keeps each sample's own gate, and a gate edited on one sample changes on that sample only", {
  gs <- tailored_gatingset()
  before <- lapply(c("D1", "D2"), function(sample) flowWorkspace::gh_pop_get_gate(gs[[sample]], "/cells"))
  counts_before <- flowWorkspace::gs_pop_get_count_fast(gs)
  masks <- tailored_masks()
  # The app's counts, from its per-sample masks, are flowWorkspace's on every sample.
  for (index in 1:2) {
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells")), masks$cells[[index]])
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells/core")), masks$core[[index]])
  }
  GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gs")
  saved <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(tailored_workspace(), tailored_memberships(masks), dataset_id = "gs"), dataset_id = "gs"
  )
  # Nothing changed, so both nodes are left exactly as they were, each sample's gate its own.
  expect_identical(saved$report$kept, c("cells", "core"))
  expect_identical(saved$report$gates, character(0))
  expect_identical(saved$report$masks, character(0))
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/cells", "/cells/core"))
  for (index in 1:2) {
    expect_identical(flowWorkspace::gh_pop_get_gate(gs[[index]], "/cells"), before[[index]])
  }
  expect_identical(flowWorkspace::gs_pop_get_count_fast(gs), counts_before)
  expect_identical(names(GateLabR:::.gatelabr_gatingset_record(gs)$nodes), c("/cells", "/cells/core"))

  # D2's gate moved in the app (its tailored copy): set on D2 only.
  edited <- tailored_bounds
  edited$D2$fsc <- c(250, 700)
  masks2 <- tailored_masks(edited)
  resaved <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(tailored_workspace(edited), tailored_memberships(masks2), expected_revision = 1L, dataset_id = "gs"),
    dataset_id = "gs"
  )
  expect_identical(resaved$report$gates, "cells")
  expect_identical(resaved$report$tailored, "cells")
  expect_identical(resaved$report$kept, "core")
  expect_identical(flowWorkspace::gh_pop_get_gate(gs[["D1"]], "/cells"), before[[1]])
  d2 <- flowWorkspace::gh_pop_get_gate(gs[["D2"]], "/cells")
  expect_s4_class(d2, "rectangleGate")
  expect_identical(unname(d2@min), c(250, 0))
  expect_identical(unname(d2@max), c(700, 400))
  after <- flowWorkspace::gs_pop_get_count_fast(gs)
  expect_identical(after[after$name == "D1", ]$Count, counts_before[counts_before$name == "D1", ]$Count)
  for (index in 1:2) {
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells")), masks2$cells[[index]])
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells/core")), masks2$core[[index]])
  }
  expect_true(sum(masks2$cells[[2]]) < sum(masks$cells[[2]]))
})

test_that("a GatingSet with no nodes gets each sample's own gate from the app's tailoring", {
  gs <- flowWorkspace::GatingSet(tailored_frames())
  masks <- tailored_masks()
  parsed <- jsonlite::fromJSON(tailored_workspace(), simplifyVector = FALSE)
  prepared <- GateLabR:::.gatelabr_gatingset_memberships(gs, tailored_memberships(masks))
  report <- GateLabR:::.gatelabr_gatingset_write_prepared(gs, parsed, prepared)
  expect_identical(report$gates, c("cells", "core"))
  expect_identical(report$tailored, "cells")
  for (index in 1:2) {
    gate <- flowWorkspace::gh_pop_get_gate(gs[[index]], "/cells")
    expect_identical(unname(gate@min), c(tailored_bounds[[index]]$fsc[[1]], tailored_bounds[[index]]$ssc[[1]]))
    expect_identical(unname(gate@max), c(tailored_bounds[[index]]$fsc[[2]], tailored_bounds[[index]]$ssc[[2]]))
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells")), masks$cells[[index]])
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells/core")), masks$core[[index]])
  }
})

test_that("nodes the app never held survive a save with their subtrees and counts, and the save says so", {
  gs <- tailored_gatingset()
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate(filterId = "big", "FSC-H" = c(300, 1000)), parent = "root", name = "big")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(cells | big), parent = "root", name = "either")
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate(filterId = "low", "SSC-H" = c(0, 200)), parent = "/either", name = "low")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(cells & big), parent = "root", name = "notboth", negated = TRUE)
  flowWorkspace::recompute(gs)
  counts_before <- flowWorkspace::gs_pop_get_count_fast(gs)
  payload <- GateLabR:::.gatelabr_gatingset_hierarchy_payload(gs)
  left <- stats::setNames(vapply(payload$leftOut, `[[`, character(1), "reason"), vapply(payload$leftOut, `[[`, character(1), "path"))
  expect_identical(left[["/either"]], "an OR of other nodes, which GateLab does not hold")
  expect_identical(left[["/either/low"]], "under '/either', which was left out")
  # NOT (cells AND big) is an OR of two NOTs, which no GateLab population holds.
  expect_identical(left[["/notboth"]], "a NOT of an AND of several nodes, which a GateLab population cannot hold")
  expect_match(GateLabR:::.gatelabr_gatingset_launch_note(gs), "not opened, and kept on the object at every save: /either (an OR", fixed = TRUE)

  GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gs")
  values <- lapply(1:2, function(index) flowCore::exprs(tailored_frames()[[index]]))
  big <- list(gate = list(gate_id = "/big", name = "big", gate_type = "rectangle", x_channel = "FSC-H", y_channel = "FSC-H",
                          vertices = list(list(300, -1.7976931348623157e308), list(1000, -1.7976931348623157e308),
                                          list(1000, 1.7976931348623157e308), list(300, 1.7976931348623157e308)),
                          space = "display", transforms = list(`FSC-H` = list(kind = "identity")), bounds = "closed"),
              id = "/big", name = "big", refs = list(list(gate_id = "/big", include = TRUE)))
  big_masks <- lapply(values, function(v) v[, "FSC-H"] >= 300 & v[, "FSC-H"] <= 1000)
  saved <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(tailored_workspace(extra = list(big)),
                      tailored_memberships(tailored_masks(), extra = list(list(id = "/big", name = "big", masks = big_masks))),
                      dataset_id = "gs"),
    dataset_id = "gs"
  )
  expect_setequal(flowWorkspace::gs_get_pop_paths(gs, path = "full"),
                  c("root", "/cells", "/cells/core", "/big", "/either", "/either/low", "/notboth"))
  expect_identical(flowWorkspace::gs_pop_get_count_fast(gs)[order(name, Population)], counts_before[order(name, Population)])
  kept <- vapply(saved$report$kept_nodes, `[[`, character(1), "path")
  expect_setequal(kept, c("/either", "/notboth"))
  expect_match(saved$result$notes[[1]], "Kept 2 nodes the app does not hold", fixed = TRUE)
  expect_match(GateLabR:::.gatelabr_gatingset_write_report(saved$report, "gs"), "/either (an OR of other nodes", fixed = TRUE)

  # A population the user deleted in the app goes. The OR and the NOT name it, so they cannot be
  # evaluated without it: they go too, and the save names them with the reason.
  removed <- GateLabR:::.gatelabr_handle_host_request(
    gs, write_request(tailored_workspace(), tailored_memberships(tailored_masks()), expected_revision = 1L, dataset_id = "gs"),
    dataset_id = "gs"
  )
  expect_identical(removed$report$removed, "/big")
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/cells", "/cells/core"))
  expect_identical(vapply(removed$report$lost, `[[`, character(1), "path"), c("/either", "/notboth"))
  expect_match(removed$result$notes[[1]], "Removed 2 nodes the app does not hold: /either (an OR of other nodes, which GateLab does not hold; it names a node the app's tree no longer has)", fixed = TRUE)
})

test_that("a boolean naming a node renamed in the app names it by its new path", {
  fs <- tailored_frames()
  gs <- flowWorkspace::GatingSet(fs)
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate(filterId = "debris", "FSC-H" = c(0, 150.5)), parent = "root", name = "debris")
  flowWorkspace::gs_pop_add(gs, flowWorkspace::booleanFilter(!debris), parent = "root", name = "not debris")
  flowWorkspace::recompute(gs)
  counts_before <- flowWorkspace::gs_pop_get_count_fast(gs)$Count
  values <- lapply(1:2, function(index) flowCore::exprs(fs[[index]]))
  debris <- lapply(values, function(v) v[, "FSC-H"] >= 0 & v[, "FSC-H"] <= 150.5)
  gate <- list(gate_id = "/debris", name = "debris", gate_type = "rectangle", x_channel = "FSC-H", y_channel = "FSC-H",
               vertices = list(list(0, -1.7976931348623157e308), list(150.5, -1.7976931348623157e308),
                               list(150.5, 1.7976931348623157e308), list(0, 1.7976931348623157e308)),
               space = "display", transforms = list(`FSC-H` = list(kind = "identity")), bounds = "closed")
  populations <- list(
    root = list(population_id = "root", name = "All Events", gate_refs = list(), parent_id = NULL),
    `/debris` = list(population_id = "/debris", name = "junk", parent_id = "root", gate_refs = list(list(gate_id = "/debris", include = TRUE))),
    `/not debris` = list(population_id = "/not debris", name = "not debris", parent_id = "root", gate_refs = list(list(gate_id = "/debris", include = FALSE)))
  )
  json <- as.character(jsonlite::toJSON(list(format = "gatelab-workspace", version = 2L,
    gating = list(gates = list(`/debris` = gate), populations = populations, root_population_id = "root")),
    auto_unbox = TRUE, null = "null", digits = NA))
  memberships <- memberships_payload(gs, list(
    list(id = "/debris", name = "junk", parent = "pop-root", masks = debris),
    list(id = "/not debris", name = "not debris", parent = "pop-root", masks = lapply(debris, `!`))
  ))
  GateLabR:::.gatelabr_gatingset_workspace_envelope(gs, "gs")
  saved <- GateLabR:::.gatelabr_handle_host_request(gs, write_request(json, memberships, dataset_id = "gs"), dataset_id = "gs")
  expect_identical(saved$report$renamed, "junk")
  expect_identical(flowWorkspace::gs_get_pop_paths(gs, path = "full"), c("root", "/junk", "/not debris"))
  # The NOT gate is still flowWorkspace's boolean, now naming junk (cytolib keeps a term without
  # its leading slash), and holds the same events.
  kept <- flowWorkspace::gh_pop_get_gate(gs[[1]], "/not debris")
  expect_s4_class(kept, "booleanFilter")
  expect_identical(GateLabR:::.gatelabr_gatingset_boolean_text(kept), "!junk")
  expect_identical(flowWorkspace::gs_pop_get_count_fast(gs)$Count, counts_before)
})

test_that("an SCE with a file tailored in the app becomes a GatingSet with that file's own gate on its sample", {
  fs <- tailored_frames()
  raw <- lapply(1:2, function(index) flowCore::exprs(fs[[index]]))
  counts <- t(rbind(raw[[1]], raw[[2]]))
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts),
    colData = S4Vectors::DataFrame(sample_id = rep(c("D1", "D2"), c(nrow(raw[[1]]), nrow(raw[[2]]))))
  )
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  json <- tailored_workspace(sample_ids = c("sce-gs:sample-0", "sce-gs:sample-1"))
  masks <- tailored_masks()
  sample_masks <- function(per_sample) lapply(1:2, function(index) {
    list(sampleId = paste0("sample-", index - 1L), eventCount = nrow(raw[[index]]), membershipBitsBase64 = packed_sample(per_sample[[index]]))
  })
  everything <- lapply(raw, function(v) rep(TRUE, nrow(v)))
  memberships <- list(
    hierarchies = list(list(id = "main", name = "Main", active = TRUE, rootPopulationId = "root")),
    populations = list(
      list(hierarchyId = "main", populationId = "root", populationName = "All Events", parentId = NULL, gateLogic = "and", gates = list(), sampleMasks = sample_masks(everything)),
      list(hierarchyId = "main", populationId = "/cells", populationName = "cells", parentId = "root", gateLogic = "and", gates = list(), sampleMasks = sample_masks(masks$cells)),
      list(hierarchyId = "main", populationId = "/cells/core", populationName = "core", parentId = "/cells", gateLogic = "and", gates = list(), sampleMasks = sample_masks(masks$core))
    )
  )
  stored <- GateLabR:::.gatelabr_store_host_workspace(
    sce, dataset_id = "sce-gs", expected_revision = 0L, client_revision = 1L, reason = "explicit",
    workspace_json = json, sample_column = "sample_id", memberships = memberships
  )
  gs <- NULL
  expect_message(gs <- GateLabR::gatelabGatingSet(stored$sce), "2 as flowWorkspace gates, 0 as exact memberships; 1 holds a gate of its own on some samples")
  for (index in 1:2) {
    gate <- flowWorkspace::gh_pop_get_gate(gs[[index]], "/cells")
    expect_s4_class(gate, "rectangleGate")
    expect_identical(unname(gate@max), c(tailored_bounds[[index]]$fsc[[2]], tailored_bounds[[index]]$ssc[[2]]))
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells")), masks$cells[[index]])
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/cells/core")), masks$core[[index]])
  }
})

test_that("a rectangle on the object's own biexponential comes back with the bounds it had, and the same events", {
  biexp <- flowWorkspace::flowjo_biexp_trans(maxValue = 262144, widthBasis = -10, pos = 4.5, neg = 0)
  build <- function() {
    gs <- flowWorkspace::GatingSet(tailored_frames())
    flowWorkspace::transform(gs, flowWorkspace::transformerList("FL1-H", biexp))
    gs
  }
  gs <- build()
  flowWorkspace::gs_pop_add(gs, flowCore::rectangleGate(filterId = "pos", "FL1-H" = c(1234.5678, 3456.789), "FSC-H" = c(100.25, 900.75)),
                            parent = "root", name = "pos")
  flowWorkspace::recompute(gs)
  original <- flowWorkspace::gh_pop_get_gate(gs[[1]], "/pos")
  # The app's gate is the host's description, in the object's space by parameters.
  node <- GateLabR:::.gatelabr_gatingset_hierarchy_payload(gs)$nodes[[1]]
  spec <- node$gate$axes[[1]]$transform
  expect_identical(spec$kind, "biex")
  gate <- list(gate_id = "/pos", name = "pos", gate_type = "rectangle", x_channel = "FL1-H", y_channel = "FSC-H",
               vertices = list(list(node$gate$min[[1]], node$gate$min[[2]]), list(node$gate$max[[1]], node$gate$min[[2]]),
                               list(node$gate$max[[1]], node$gate$max[[2]]), list(node$gate$min[[1]], node$gate$max[[2]])),
               space = "display", transforms = list(`FL1-H` = spec, `FSC-H` = list(kind = "identity")), bounds = "closed")
  populations <- list(
    root = list(population_id = "root", name = "All Events", gate_refs = list(), parent_id = NULL),
    `/pos` = list(population_id = "/pos", name = "pos", parent_id = "root", gate_refs = list(list(gate_id = "/pos", include = TRUE)))
  )
  json <- as.character(jsonlite::toJSON(list(format = "gatelab-workspace", version = 2L,
    gating = list(gates = list(`/pos` = gate), populations = populations, root_population_id = "root")),
    auto_unbox = TRUE, null = "null", digits = NA))
  masks <- lapply(1:2, function(index) as.logical(flowWorkspace::gh_pop_get_indices(gs[[index]], "/pos")))
  expect_true(all(vapply(masks, sum, numeric(1)) > 0))
  fresh <- build()
  prepared <- GateLabR:::.gatelabr_gatingset_memberships(fresh, memberships_payload(fresh, list(
    list(id = "/pos", name = "pos", parent = "pop-root", masks = masks))))
  report <- GateLabR:::.gatelabr_gatingset_write_prepared(fresh, jsonlite::fromJSON(json, simplifyVector = FALSE), prepared)
  expect_identical(report$gates, "pos")
  written <- flowWorkspace::gh_pop_get_gate(fresh[[1]], "/pos")
  # The same bounds to the last digit: not put through the biexponential and its inverse.
  expect_identical(unname(written@min), unname(original@min))
  expect_identical(unname(written@max), unname(original@max))
  for (index in 1:2) {
    expect_identical(as.logical(flowWorkspace::gh_pop_get_indices(fresh[[index]], "/pos")), masks[[index]])
  }
})
