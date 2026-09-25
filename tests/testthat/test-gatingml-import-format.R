# Gating-ML files as GateLab writes them from 2026-09 (format mark version 3; version 2 before it),
# and as GateLab 0.8.3 wrote them before the mark. The fixtures under fixtures/gatingml/ are GateLab's own exports of synthetic
# strategies over synthetic events, written by tools/gatingml-fixtures.ts, which also records the
# events GateLab places in each population. See fixtures/gatingml/README.md.

sys.source(file.path(app_r_dir, "gatingml_import.R"), envir = globalenv())

gml_fixture <- function(name) testthat::test_path("fixtures", "gatingml", name)

gml_events <- local({
  events <- as.matrix(utils::read.csv(gml_fixture("events.csv"), check.names = FALSE))
  storage.mode(events) <- "double"
  events
})
gml_channels <- colnames(gml_events)
gml_identity_map <- stats::setNames(as.list(gml_channels), gml_channels)

gml_expected <- function(version = "") {
  jsonlite::fromJSON(gml_fixture(paste0("membership", version, ".json")), simplifyVector = FALSE)
}

# FlowKit's populations for its own files (fixtures/gatingml/flowkit-*.xml), by strategy.
gml_flowkit <- function(strategy) {
  jsonlite::fromJSON(gml_fixture("flowkit-membership.json"), simplifyVector = FALSE)[[strategy]]
}

gml_spillover <- function(entry) {
  m <- do.call(rbind, lapply(entry$matrix, as.numeric))
  channels <- unlist(entry$channels)
  dimnames(m) <- list(channels, channels)
  m
}

gml_import <- function(path, instrument = "flow") {
  import_gatingml_from_cytobank(path, gml_channels, gml_identity_map, instrument = instrument)
}

# Write a variant of a fixture: `edit` takes and returns the file's lines.
gml_variant <- function(name, edit) {
  path <- tempfile(fileext = ".xml")
  writeLines(edit(readLines(gml_fixture(name), warn = FALSE)), path, useBytes = TRUE)
  path
}

gml_write <- function(text) {
  path <- tempfile(fileext = ".xml")
  writeLines(text, path, useBytes = TRUE)
  path
}

# Each population's events (1-based indices), keyed by its name path from the root, in tree order.
gml_membership <- function(parsed, data = gml_events) {
  masks <- apply_gating_strategy(
    parsed$gates, parsed$populations, parsed$root_population_id, data
  )$masks
  out <- list()
  walk <- function(id, path) {
    for (child in parsed$populations[[id]]$children) {
      child_path <- paste0(path, "/", parsed$populations[[child]]$name)
      out[[child_path]] <<- which(masks[[child]])
      walk(child, child_path)
    }
  }
  walk(parsed$root_population_id, "")
  out
}

gml_expect_membership <- function(actual, expected) {
  expect_identical(names(actual), names(expected))
  for (path in names(expected)) {
    expect_identical(actual[[path]], as.integer(unlist(expected[[path]])), info = path)
  }
}

test_that("GateLab's standard format places populations by parent_id, with logicle on Gating-ML's scale", {
  expected <- gml_expected()$populations$tree
  parsed <- gml_import(gml_fixture("tree-standard.xml"))

  # Same populations, same parents, same sibling order, same events as GateLab.
  gml_expect_membership(gml_membership(parsed), expected)
  expect_identical(parsed$compensation_refs, "uncompensated")
  expect_null(parsed$spectrum_matrix)

})

test_that("GateLab's Cytobank format places populations by the tree in its mark", {
  expected <- gml_expected()$populations$tree
  parsed <- gml_import(gml_fixture("tree-cytobank.xml"))
  gml_expect_membership(gml_membership(parsed), expected)

  # Both_positive ANDs a chain that contains FL1_positive's and FL3_positive's. Without the
  # tree, its parent is inferred from those chains and it lands under one of them.
  untreed <- gml_import(gml_variant("tree-cytobank.xml", function(lines) {
    lines[!grepl("<gatelab_format>", lines, fixed = TRUE)]
  }))
  untreed_paths <- names(gml_membership(untreed))
  expect_false("/Cells/Both_positive" %in% untreed_paths)
  expect_true(any(grepl("/Both_positive$", untreed_paths)))
})

test_that("a population whose gates are all in its parent's chain keeps its place and its subtree", {
  # Cells_again gates on Cells's gate again and FL1_again on FL1_positive's, so in the Cytobank
  # format each one's chain is its parent's.
  expected <- gml_expected()$populations$repeated
  for (name in c("repeated-standard.xml", "repeated-cytobank.xml")) {
    parsed <- gml_import(gml_fixture(name))
    gml_expect_membership(gml_membership(parsed), expected)
    # Every entry is a named population reachable from the root, and nothing else.
    expect_length(parsed$populations, length(expected) + 1L)
    expect_true(all(vapply(parsed$populations, function(pop) {
      is.character(pop$name) && length(pop$name) == 1L && nzchar(pop$name)
    }, logical(1))), info = name)
  }
})

test_that("flow fluorescence gates under arcsinh are inverted only when the caller says the data are flow", {
  # Cytobank has no logicle, so GateLab's Cytobank format writes flow fluorescence gates under
  # arcsinh. Without instrument = "flow" the importer inverts scatter only, as it always did,
  # and leaves those gates at their arcsinh coordinates.
  expected <- gml_expected()$populations$tree
  as_before <- gml_import(gml_fixture("tree-cytobank.xml"), instrument = NULL)
  expect_false(identical(
    gml_membership(as_before)[["/Cells/FL1_positive"]],
    as.integer(unlist(expected[["/Cells/FL1_positive"]]))
  ))
})

test_that("polygons with slanted edges on a logicle or arcsinh axis select the events of the declared polygon", {
  # The file declares those edges straight on the axes they were drawn on, where GateLab and
  # FlowKit evaluate them; in raw values, where GateLabR gates flow data, they are curves. Each
  # slanted edge is split finely enough on its own axes that GateLabR's straight pieces follow it.
  expected <- gml_expected()$populations$slanted
  for (name in c("slanted-standard.xml", "slanted-cytobank.xml")) {
    parsed <- gml_import(gml_fixture(name))
    gml_expect_membership(gml_membership(parsed), expected)
    vertices <- vapply(parsed$gates, function(g) length(g$vertices), integer(1))
    names(vertices) <- vapply(parsed$gates, `[[`, "", "name")
    # Edges parallel to an axis, and a polygon in raw values, stay as they were drawn.
    expect_identical(vertices[["Poly_gate"]], 4L, info = name)
    expect_identical(vertices[["L_gate"]], if (name == "slanted-standard.xml") 6L else 7L, info = name)
    expect_gt(vertices[["Slant_FL_gate"]], 25L)
  }
  parsed <- gml_import(gml_fixture("flowkit-slanted.xml"))
  gml_expect_membership(gml_membership(parsed), gml_flowkit("slanted"))

  # Joining the inverted vertices with straight edges, as the importer did before it refused
  # these polygons, selects different events.
  xml <- xml2::xml_root(xml2::read_xml(gml_fixture("flowkit-slanted.xml")))
  corners <- xml2::xml_find_all(xml, "(.//*[local-name()='PolygonGate'])[1]/*[local-name()='vertex']")
  declared <- lapply(corners, function(v) as.numeric(xml2::xml_attr(xml2::xml_children(v), "value")))
  expect_length(declared, 4L)
  map <- .gml_axis_map("FL1-A", "Logicle", .gml_parse_transforms(xml), TRUE, "flow")
  chords <- lapply(declared, function(v) c(map$inverse(v[1]), map$inverse(v[2])))
  straight <- which(gate_mask_polygon(gml_events[, "FL1-A"], gml_events[, "FL2-A"], chords))
  expect_false(identical(straight, as.integer(unlist(gml_flowkit("slanted")[["/Slant_logicle"]]))))
})

test_that("a polygon with a vertex far beyond the data is followed as finely where the data are", {
  # The slanted edges were followed to a fraction of the polygon's extent in the declared space
  # only. A raw-value wedge out to 1e7 on mass cytometry data has an extent of 1e7 raw units, so
  # near zero, where the data's arcsinh bends most, its edges were followed in chords about 10 raw
  # units long, and 13 events were placed differently from FlowKit at cofactor 5, in a population
  # of 42.
  events <- as.matrix(utils::read.csv(gml_fixture("cytof-events.csv"), check.names = FALSE))
  storage.mode(events) <- "double"
  channels <- colnames(events)
  for (cofactor in c(5, 15)) {
    data <- transform_matrix_by_instrument(events, channels, "cytof", cofactor = cofactor)
    parsed <- import_gatingml_from_cytobank(gml_fixture("flowkit-far-vertex-cytof.xml"), channels,
                                            stats::setNames(as.list(channels), channels),
                                            instrument = "cytof", cytof_cofactor = cofactor)
    gml_expect_membership(gml_membership(parsed, data), gml_flowkit("far-vertex-cytof"))
  }
  # On flow data the declared logicle axis is the compressed one, and a polygon reaching past the
  # top of scale is followed there.
  parsed <- gml_import(gml_fixture("flowkit-far-vertex.xml"))
  gml_expect_membership(gml_membership(parsed), gml_flowkit("far-vertex"))
})

test_that("a polygon GateLabR cannot follow on its axes is refused by name", {
  # A vertex beyond what its transformation can invert.
  beyond <- gml_variant("flowkit-slanted.xml", function(lines) {
    hit <- grep("<gating:coordinate", lines)[1]
    lines[hit] <- sub('data-type:value="[^"]+"', 'data-type:value="1e308"', lines[hit])
    lines
  })
  expect_error(gml_import(beyond), 'Gate "Slant_logicle" (Slant_logicle) is a polygon GateLabR cannot reproduce',
               fixed = TRUE)
  # An edge that cannot be followed within the limit on vertices.
  xml <- xml2::xml_root(xml2::read_xml(gml_fixture("flowkit-slanted.xml")))
  map <- .gml_axis_map("FL1-A", "Logicle", .gml_parse_transforms(xml), TRUE, "flow")
  square <- list(c(0.1, 0.2), c(0.9, 0.3), c(0.8, 0.9), c(0.2, 0.7))
  expect_match(.gml_polygon_vertices(square, map, map, max_vertices = 20L)$problem, "within 20 vertices")
  expect_null(.gml_polygon_vertices(square, map, map)$problem)
})

test_that("a slanted edge to a vertex that cannot be inverted is refused for the vertex", {
  # A coordinate of 80 under an arcsinh with T = 262144, M = 4.5 and A = 1 is beyond the largest
  # double in raw values. Both edges at that vertex are slanted, and the refusal names the vertex,
  # not the limit on vertices that following those edges was said to exceed.
  beyond <- gml_variant("flowkit-slanted.xml", function(lines) {
    start <- grep('gating:id="Slant_asinh"', lines, fixed = TRUE)
    hit <- start + grep("<gating:coordinate", lines[-seq_len(start)])[1]
    lines[hit] <- sub('data-type:value="[^"]+"', 'data-type:value="80"', lines[hit])
    lines
  })
  expect_error(gml_import(beyond), paste0(
    'Gate "Slant_asinh" (Slant_asinh) is a polygon GateLabR cannot reproduce in the values it ',
    "gates on: a vertex lies where its axis's transformation cannot be inverted."
  ), fixed = TRUE)
  xml <- xml2::xml_root(xml2::read_xml(gml_fixture("flowkit-slanted.xml")))
  map <- .gml_axis_map("FSC-A", "Asinh_A1", .gml_parse_transforms(xml), TRUE, "flow")
  expect_identical(map$kind, "curved")
  square <- list(c(0.1, 0.2), c(80, 0.3), c(0.8, 0.9), c(0.2, 0.7))
  expect_identical(.gml_polygon_vertices(square, map, map)$problem,
                   "a vertex lies where its axis's transformation cannot be inverted")
})

test_that("an ellipse is read as its boundary, followed onto raw values, in both formats", {
  # The standard format writes an EllipsoidGate on logicle axes; its boundary becomes a polygon on
  # those axes, followed onto raw values like any other. The Cytobank format writes the ellipse as
  # a polygon on arcsinh axes already, which GateLab reads as that polygon.
  for (name in c("ellipse-standard.xml", "ellipse-cytobank.xml")) {
    parsed <- gml_import(gml_fixture(name))
    gml_expect_membership(gml_membership(parsed), gml_expected()$populations$ellipse)
  }
  # An EllipsoidGate GateLabR cannot read is refused by name.
  singular <- gml_variant("ellipse-standard.xml", function(lines) {
    lines <- sub('data-type:value="0.012"', 'data-type:value="0.03"', lines, fixed = TRUE)
    lines
  })
  expect_error(gml_import(singular), "(Ellipse_gate) is not an ellipse GateLabR can read: its covariance matrix is not positive definite",
               fixed = TRUE)
})

test_that("GateLabR's own exports keep polygons straight in raw values, as GateLabR drew them", {
  sys.source(file.path(app_r_dir, "gatingml_export.R"), envir = globalenv())
  counts <- gml_events[, c("FSC-A", "SSC-A", "FL1-A", "FL2-A")]
  channels <- colnames(counts)
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = t(counts), exprs = t(counts))
  )
  rownames(sce) <- channels
  S4Vectors::metadata(sce)$instrument_type <- "flow"
  S4Vectors::metadata(sce)$channel_to_pnn <- stats::setNames(as.list(channels), channels)

  # GateLabR stores flow gates in raw values and writes their vertices on the display axes.
  slanted <- new_gate(
    "Slanted", "polygon", "FL1-A", "FL2-A",
    list(c(-400, 200), c(30000, -600), c(45000, 30000), c(1500, 20000))
  )
  root <- new_root_population(nrow(counts))
  pop <- new_population("Slanted", list(new_gate_ref(slanted$gate_id)), root$population_id)
  populations <- stats::setNames(list(root, pop), c(root$population_id, pop$population_id))
  populations <- link_child_to_parent(populations, pop$population_id, root$population_id)
  gates <- stats::setNames(list(slanted), slanted$gate_id)
  drawn <- which(apply_gating_strategy(gates, populations, root$population_id, counts)$masks[[pop$population_id]])

  for (format in c("standard", "cytobank")) {
    out <- tempfile(fileext = ".xml")
    suppressMessages(export_gatingml_to_cytobank(
      gates, names(gates), populations, root$population_id, sce, out,
      format = format, counts_mat = counts
    ))
    expect_true(any(grepl("transformation-ref", readLines(out, warn = FALSE))), info = format)
    # GateLabR writes flowCore's logicle scale, so never the words that say a file is on Gating-ML's.
    expect_false(any(grepl(.GML_ABOUT_LOGICLE_SCALE, readLines(out, warn = FALSE), fixed = TRUE)), info = format)
    parsed <- import_gatingml_from_cytobank(out, channels, stats::setNames(as.list(channels), channels),
                                            instrument = "flow")
    expect_identical(gml_membership(parsed, counts)[["/Slanted"]], drawn, info = format)
  }
})

test_that("exclusions are refused and name the populations, never read as inclusions", {
  for (name in c("exclusion-standard.xml", "exclusion-cytobank.xml",
                 "exclusion-standard-0.8.3.xml", "exclusion-cytobank-0.8.3.xml")) {
    err <- tryCatch(gml_import(gml_fixture(name)), error = function(e) conditionMessage(e))
    expect_type(err, "character")
    expect_match(err, 'Population "FL1_not_FL3" uses NOT logic', fixed = TRUE, info = name)
    expect_match(err, 'Population "FL1_negative" uses NOT logic', fixed = TRUE, info = name)
    # The standard format's operand gate is not a population and is not named as one.
    expect_no_match(err, "Not_Gate", fixed = TRUE, info = name)
  }

  # use-as-complement is an xs:boolean, so "1" excludes too.
  one <- gml_variant("exclusion-cytobank.xml", function(lines) {
    gsub('use-as-complement="true"', 'use-as-complement="1"', lines, fixed = TRUE)
  })
  expect_error(gml_import(one), 'Population "FL1_not_FL3" uses NOT logic', fixed = TRUE)
})

test_that("a spillover matrix the file defines is read, and applied only when it is the data's own", {
  info <- gml_expected()
  external <- gml_spillover(info$external_spillover)
  fcs <- gml_spillover(info$fcs_spillover)
  compensated <- compensate_matrix(gml_events, external)

  parsed <- gml_import(gml_fixture("matrix-standard.xml"))
  expect_setequal(parsed$compensation_refs, c("uncompensated", "matrix"))
  expect_identical(parsed$spectrum_matrix$id, "Spill_1")
  expect_identical(parsed$spectrum_matrix$channels, c("FL1-A", "FL2-A", "FL3-A"))
  expect_equal(parsed$spectrum_matrix$matrix, external)
  gml_expect_membership(gml_membership(parsed, compensated), info$populations$matrix)

  # With GateLab's own compensation record, which names the same matrix.
  expect_identical(
    resolve_gatingml_compensation(parsed$compensation, parsed$compensation_refs, TRUE,
                                  external, parsed$spectrum_matrix)$target,
    TRUE
  )
  expect_error(
    resolve_gatingml_compensation(parsed$compensation, parsed$compensation_refs, TRUE,
                                  fcs, parsed$spectrum_matrix),
    "different FCS spillover matrix"
  )

  # Without it, as a file from another writer would come.
  bare <- resolve_gatingml_compensation(NULL, parsed$compensation_refs, TRUE,
                                        external, parsed$spectrum_matrix)
  expect_identical(bare$target, TRUE)
  expect_identical(bare$source, "matrix")
  expect_error(
    resolve_gatingml_compensation(NULL, parsed$compensation_refs, TRUE,
                                  fcs, parsed$spectrum_matrix),
    "spillover matrix it defines"
  )
  expect_error(
    resolve_gatingml_compensation(NULL, parsed$compensation_refs, TRUE,
                                  NULL, parsed$spectrum_matrix),
    "no spillover matrix"
  )

  # The Cytobank format writes compensation-ref="FCS" on every compensated dimension, as Cytobank
  # does, and names the matrix in each gate's compensation_id: 1 is the spectrumMatrix whose
  # cytobank_compensation_id is 1, the same matrix. Read as "FCS", the gates were evaluated with
  # the FCS file's matrix.
  cytobank <- gml_import(gml_fixture("matrix-cytobank.xml"))
  expect_identical(cytobank$spectrum_matrix$id, "Spill_1")
  expect_equal(cytobank$spectrum_matrix$matrix, external)
  expect_setequal(cytobank$compensation_refs, c("uncompensated", "matrix"))
  gml_expect_membership(gml_membership(cytobank, compensated), info$populations$matrix)
  expect_identical(
    resolve_gatingml_compensation(cytobank$compensation, cytobank$compensation_refs, TRUE,
                                  external, cytobank$spectrum_matrix)$target,
    TRUE
  )
  expect_error(
    resolve_gatingml_compensation(cytobank$compensation, cytobank$compensation_refs, TRUE, fcs,
                                  cytobank$spectrum_matrix),
    "different FCS spillover matrix"
  )
  expect_error(
    resolve_gatingml_compensation(NULL, cytobank$compensation_refs, TRUE, fcs, cytobank$spectrum_matrix),
    "spillover matrix it defines"
  )

  # A compensation_id naming a matrix the file does not carry is refused by name, never read as
  # the FCS file's own.
  missing <- gml_variant("matrix-cytobank.xml", function(lines) {
    sub("<cytobank_compensation_id>1</cytobank_compensation_id>",
        "<cytobank_compensation_id>7</cytobank_compensation_id>", lines, fixed = TRUE)
  })
  expect_error(gml_import(missing), paste0(
    'Gate "FL1_gate" (Gate_180000002_RkwxX2dhdGU.) was drawn under Cytobank compensation 1, which ',
    "the file does not carry as a spectrumMatrix"
  ), fixed = TRUE)
})

test_that("a spillover matrix GateLabR cannot apply is refused when a dimension references it", {
  unmixing <- gml_variant("matrix-standard.xml", function(lines) {
    # Drop the third fluorochrome: three detectors, two fluorochromes.
    lines[!grepl('<data-type:fcs-dimension data-type:name="Comp_FL3-A" />', lines, fixed = TRUE)]
  })
  expect_error(gml_import(unmixing), "square spillover matrix only")

  two_matrices <- gml_variant("matrix-standard.xml", function(lines) {
    hit <- grep('compensation-ref="Spill_1"', lines, fixed = TRUE)[1]
    lines[hit] <- sub('compensation-ref="Spill_1"', 'compensation-ref="FCS"', lines[hit], fixed = TRUE)
    lines[hit + 1L] <- sub("Comp_FL1-A", "FL1-A", lines[hit + 1L], fixed = TRUE)
    lines
  })
  expect_error(gml_import(two_matrices), "more than one spillover matrix")
})

test_that("files GateLab 0.8.3 wrote read as they did", {
  info <- gml_expected("-0.8.3")
  external <- gml_spillover(info$external_spillover)

  # Standard format: a GatingHierarchy, logicle on flowCore's scale, no format mark. (0.8.3's
  # Cytobank format wrote gates drawn on a logicle axis at the wrong coordinates, which GateLab
  # has since fixed, so those files are not fixtures; see fixtures/gatingml/README.md.)
  standard <- gml_import(gml_fixture("tree-standard-0.8.3.xml"))
  gml_expect_membership(gml_membership(standard), info$populations$tree)

  matrix <- gml_import(gml_fixture("matrix-standard-0.8.3.xml"))
  expect_null(matrix$spectrum_matrix)
  gml_expect_membership(
    gml_membership(matrix, compensate_matrix(gml_events, external)),
    info$populations$matrix
  )
})

gml_logicle_file <- function(min, root_info = "") {
  gml_write(sprintf('<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  %s
  <transforms:transformation transforms:id="L1">
    <transforms:logicle transforms:T="262144" transforms:W="0.5" transforms:M="4.5" transforms:A="1" />
  </transforms:transformation>
  <gating:RectangleGate gating:id="R1" gating:name="FL1_range">
    <gating:dimension gating:transformation-ref="L1" gating:min="%s" gating:max="0.9">
      <data-type:fcs-dimension data-type:name="FL1-A"/>
    </gating:dimension>
  </gating:RectangleGate>
</gating:Gating-ML>', root_info, min))
}

test_that("logicle is on Gating-ML's scale unless the file says otherwise or GateLab wrote it", {
  lg <- flowCore::logicleTransform("lg", w = 0.5, t = 262144, m = 4.5, a = 1)
  inverse <- flowCore::inverseLogicleTransform(lg, transformationId = "inv")
  lower_bound <- function(parsed) parsed$gates[[1]]$vertices[[1]][1]
  # flowCore's logicle value is Gating-ML's times M, whatever A is.
  expected <- as.numeric(inverse(0.4 * 4.5))

  # Another writer, no mark: the standard's scale.
  expect_equal(lower_bound(gml_import(gml_logicle_file(0.4))), expected)
  # GateLab or GateLabR wrote it, no mark: flowCore's scale.
  about <- "<data-type:custom_info><cytobank><about>Gating-ML 2.0 export from GateLabR (standard / re-importable)</about></cytobank></data-type:custom_info>"
  expect_equal(lower_bound(gml_import(gml_logicle_file(0.4 * 4.5, about))), expected)
  # The mark decides either way.
  flowcore <- '<data-type:custom_info><gatelab_format>{"version":2,"logicle":"flowcore","hierarchy":"parent_id"}</gatelab_format></data-type:custom_info>'
  expect_equal(lower_bound(gml_import(gml_logicle_file(0.4 * 4.5, flowcore))), expected)
  gating_ml <- sub("<about>", '<about>', about, fixed = TRUE)
  gating_ml <- sub("</cytobank>", '</cytobank><gatelab_format>{"version":2,"logicle":"gating-ml","hierarchy":"parent_id"}</gatelab_format>', gating_ml, fixed = TRUE)
  expect_equal(lower_bound(gml_import(gml_logicle_file(0.4, gating_ml))), expected)
})

gml_rect <- function(id, x0, x1, parent = NULL) {
  sprintf('  <gating:RectangleGate gating:id="%s" gating:name="%s"%s>
    <gating:dimension gating:min="%s" gating:max="%s"><data-type:fcs-dimension data-type:name="FL1-A"/></gating:dimension>
    <gating:dimension gating:min="-1e6" gating:max="1e6"><data-type:fcs-dimension data-type:name="FL2-A"/></gating:dimension>
  </gating:RectangleGate>', id, id,
    if (is.null(parent)) "" else sprintf(' gating:parent_id="%s"', parent), x0, x1)
}

gml_doc <- function(...) {
  paste0('<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
', paste(c(...), collapse = "\n"), '
</gating:Gating-ML>')
}

test_that("geometric gates are placed under the gate their parent_id names", {
  parsed <- gml_import(gml_write(gml_doc(
    gml_rect("Outer", 0, 50000),
    gml_rect("Inner", 1000, 1e6, parent = "Outer")
  )))
  membership <- gml_membership(parsed)
  expect_identical(names(membership), c("/Outer", "/Outer/Inner"))
  fl1 <- gml_events[, "FL1-A"]
  expect_identical(membership[["/Outer/Inner"]], which(fl1 >= 1000 & fl1 <= 50000))

  expect_error(
    gml_import(gml_write(gml_doc(gml_rect("Inner", 1000, 1e6, parent = "Absent")))),
    "references missing parent gate Absent"
  )
  expect_error(
    gml_import(gml_write(gml_doc(gml_rect("A", 0, 1, parent = "B"), gml_rect("B", 0, 1, parent = "A")))),
    "is its own ancestor through parent_id"
  )
})

test_that("in GateLab's standard format a population cannot reference a gate that parent_id restricts", {
  # GateLab's model makes only BooleanGates populations and never writes parent_id on a geometric
  # gate, so a marked file that does is refused; Gating-ML's own model reads it (below).
  population <- '  <gating:BooleanGate gating:id="P1" gating:name="Pop">
    <gating:and><gating:gateReference gating:ref="Inner"/><gating:gateReference gating:ref="Inner"/></gating:and>
  </gating:BooleanGate>'
  mark <- '<data-type:custom_info><gatelab_format>{"version":2,"logicle":"gating-ml","hierarchy":"parent_id"}</gatelab_format></data-type:custom_info>'
  expect_error(
    gml_import(gml_write(gml_doc(mark, gml_rect("Outer", 0, 50000), gml_rect("Inner", 1000, 1e6, parent = "Outer"), population))),
    "Inner has a parent_id; GateLabR places only Boolean populations by parent_id"
  )
})

test_that("Gating-ML's own model: every gate is a population placed by parent_id, a BooleanGate's operands keep their parents", {
  # FlowKit's file: geometric gates and AND BooleanGates, each placed by parent_id, one BooleanGate
  # nested in another and one at the root whose operands have a parent of their own.
  parsed <- gml_import(gml_fixture("flowkit-boolean.xml"))
  gml_expect_membership(gml_membership(parsed), gml_flowkit("boolean"))
  pops <- stats::setNames(parsed$populations, vapply(parsed$populations, `[[`, "", "name"))
  gate_names <- function(pop) {
    vapply(pop$gate_refs, function(ref) parsed$gates[[ref$gate_id]]$name, "")
  }
  # Both_anywhere sits at the root and takes its operands' parent, Cells, with them; Deep, under
  # Both, adds only what Both does not already apply.
  expect_setequal(gate_names(pops$Both_anywhere), c("Cells", "FL1_pos", "FL3_pos"))
  expect_setequal(gate_names(pops$Deep), "FL2_box")
  expect_length(parsed$gates, 5L)

  # The same file, hand-written: a BooleanGate referencing a gate that parent_id restricts.
  population <- '  <gating:BooleanGate gating:id="P1" gating:name="Pop">
    <gating:and><gating:gateReference gating:ref="Inner"/><gating:gateReference gating:ref="Inner"/></gating:and>
  </gating:BooleanGate>'
  parsed <- gml_import(gml_write(gml_doc(gml_rect("Outer", 0, 50000), gml_rect("Inner", 1000, 1e6, parent = "Outer"), population)))
  membership <- gml_membership(parsed)
  expect_identical(names(membership), c("/Outer", "/Outer/Inner", "/Pop"))
  fl1 <- gml_events[, "FL1-A"]
  expect_identical(membership[["/Pop"]], which(fl1 >= 1000 & fl1 <= 50000))

  # BooleanGates that reference each other have no population.
  loop <- '  <gating:BooleanGate gating:id="A1"><gating:and><gating:gateReference gating:ref="Outer"/><gating:gateReference gating:ref="B1"/></gating:and></gating:BooleanGate>
  <gating:BooleanGate gating:id="B1"><gating:and><gating:gateReference gating:ref="A1"/></gating:and></gating:BooleanGate>'
  expect_error(gml_import(gml_write(gml_doc(gml_rect("Outer", 0, 50000), loop))),
               "its own ancestor or operand through parent_id and BooleanGate references")
})

test_that("Gating-ML's own model refuses NOT and OR by name", {
  err <- tryCatch(gml_import(gml_fixture("flowkit-not-or.xml")), error = function(e) conditionMessage(e))
  expect_type(err, "character")
  expect_match(err, 'Population "FL1_neg" uses NOT logic', fixed = TRUE)
  expect_match(err, 'Population "Either" uses OR logic', fixed = TRUE)
  expect_match(err, 'Population "FL1_not_FL3" uses NOT logic', fixed = TRUE)
  expect_no_match(err, 'Population "FL1_pos"', fixed = TRUE)

  # A population that ANDs a NOT or an OR population is named too, with the operand it uses them
  # through; only the operand had been named.
  nested <- gml_variant("flowkit-not-or.xml", function(lines) {
    and_gate <- function(id, a, b) c(
      sprintf('  <gating:BooleanGate gating:id="%s" gating:parent_id="Cells">', id), "    <gating:and>",
      sprintf('      <gating:gateReference gating:ref="%s"/>', c(a, b)), "    </gating:and>",
      "  </gating:BooleanGate>"
    )
    end <- grep("</gating:Gating-ML>", lines, fixed = TRUE)
    c(lines[seq_len(end - 1L)], and_gate("FL3_and_neg", "FL3_pos", "FL1_neg"),
      and_gate("FL3_and_either", "FL3_pos", "Either"), and_gate("Deeper", "FL1_pos", "FL3_and_neg"),
      lines[end:length(lines)])
  })
  err <- tryCatch(gml_import(nested), error = function(e) conditionMessage(e))
  expect_type(err, "character")
  expect_match(err, 'Population "FL3_and_neg" uses NOT logic through "FL1_neg"', fixed = TRUE)
  expect_match(err, 'Population "FL3_and_either" uses OR logic through "Either"', fixed = TRUE)
  expect_match(err, 'Population "Deeper" uses NOT logic through "FL3_and_neg"', fixed = TRUE)
  expect_match(err, 'Population "FL1_neg" uses NOT logic;', fixed = TRUE)
})

test_that("a gateReference that names no gate is refused, naming its BooleanGate", {
  # A gateReference without a ref, or with an empty one, was passed over, so Both became Cells and
  # FL1_pos alone (227 events, where FlowKit selects 124 with the reference intact), and Deep under
  # it changed with it (130, not 73).
  for (reference in c("<gating:gateReference/>", '<gating:gateReference gating:ref=""/>')) {
    unnamed <- gml_variant("flowkit-boolean.xml", function(lines) {
      hit <- grep('<gating:gateReference gating:ref="FL3_pos"/>', lines, fixed = TRUE)[1]
      lines[hit] <- sub('<gating:gateReference gating:ref="FL3_pos"/>', reference, lines[hit], fixed = TRUE)
      lines
    })
    err <- tryCatch(gml_import(unnamed), error = function(e) conditionMessage(e))
    expect_type(err, "character")
    expect_match(err, "BooleanGate Both has a gateReference that names no gate (its ref is missing or empty)",
                 fixed = TRUE, info = reference)
    # Only the BooleanGate itself is reported, not the gates that reference it.
    expect_no_match(err, "missing gate", fixed = TRUE, info = reference)
  }
})

test_that("a GateLab Cytobank-format tree that does not describe the file is refused", {
  incomplete <- gml_variant("tree-cytobank.xml", function(lines) {
    sub(',{"id":"GateSet_36000005","parent":"GateSet_36000000"}', "", lines, fixed = TRUE)
  })
  expect_error(gml_import(incomplete), "does not list the population GateSet_36000005")

  out_of_order <- gml_variant("tree-cytobank.xml", function(lines) {
    sub('{"id":"GateSet_36000000","parent":null}', '{"id":"GateSet_36000000","parent":"GateSet_36000001"}', lines, fixed = TRUE)
  })
  expect_error(gml_import(out_of_order), "which is not a population listed before it")
})

test_that("a GateLab tree that contradicts the file's BooleanGates is refused, naming the population", {
  # A hand edit places Poly_subset, whose BooleanGate ANDs Cells_gate, FL1_gate and Poly_gate,
  # under FL3_positive, whose BooleanGate ANDs Cells_gate and FL3_gate.
  moved <- gml_variant("tree-cytobank.xml", function(lines) {
    sub('{"id":"GateSet_36000004","parent":"GateSet_36000003"}',
        '{"id":"GateSet_36000004","parent":"GateSet_36000001"}', lines, fixed = TRUE)
  })
  expect_error(
    gml_import(moved),
    'places the population "Poly_subset" (GateSet_36000004) under "FL3_positive" (GateSet_36000001)',
    fixed = TRUE
  )

  # A tree the BooleanGates allow is read. Both_positive's BooleanGate includes FL1_positive's
  # gates, so under FL1_positive it selects the same events as under Cells.
  expected <- gml_expected()$populations$tree
  nested <- gml_variant("tree-cytobank.xml", function(lines) {
    sub('{"id":"GateSet_36000005","parent":"GateSet_36000000"}',
        '{"id":"GateSet_36000005","parent":"GateSet_36000003"}', lines, fixed = TRUE)
  })
  expect_identical(
    gml_membership(gml_import(nested))[["/Cells/FL1_positive/Both_positive"]],
    as.integer(unlist(expected[["/Cells/Both_positive"]]))
  )
})

test_that("a format mark of a version GateLabR does not read is refused", {
  for (name in c("tree-standard.xml", "tree-cytobank.xml")) {
    later <- gml_variant(name, function(lines) sub('{"version":3,', '{"version":4,', lines, fixed = TRUE))
    expect_error(gml_import(later), "format mark has version 4;", fixed = TRUE, info = name)
  }
  unversioned <- gml_variant("tree-standard.xml", function(lines) {
    sub('{"version":3,', "{", lines, fixed = TRUE)
  })
  expect_error(gml_import(unversioned), "format mark has no version;", fixed = TRUE)
  # Version 2, which GateLab wrote before version 3, still reads.
  earlier <- gml_variant("tree-standard.xml", function(lines) {
    sub('{"version":3,"logicle":"gating-ml","hierarchy":"parent_id","time":"seconds","gain":"gating-ml"}',
        '{"version":2,"logicle":"gating-ml","hierarchy":"parent_id"}', lines, fixed = TRUE)
  })
  gml_expect_membership(gml_membership(gml_import(earlier)), gml_expected()$populations$tree)
})

test_that("an arcsinh with A other than 0 is inverted as Gating-ML defines it", {
  # fasinh(x) = (asinh(x sinh(M ln 10) / T) + A ln 10) / ((M + A) ln 10). With the sign of the A
  # term reversed, FlowKit's rectangles (A = 1) sat a factor of 10^(2A) too high in raw values.
  parsed <- gml_import(gml_fixture("flowkit-fasinh.xml"))
  gml_expect_membership(gml_membership(parsed), gml_flowkit("fasinh"))
  # The inversion itself, against the forward transform at A = 1.
  forward <- function(x) (asinh(x * sinh(4.5 * log(10)) / 262144) + log(10)) / (5.5 * log(10))
  inverse <- .gml_make_inverter("FL1-A", "Asinh_A1",
                                list(Asinh_A1 = list(type = "fasinh", T = 262144, M = 4.5, A = 1)),
                                instrument = "flow")
  expect_equal(inverse(forward(c(-250, 0, 1000, 150000))), c(-250, 0, 1000, 150000))
})

test_that("a logicle or arcsinh whose parameters give no inverse is refused by name", {
  # Such a logicle, which flowCore refuses to build, was read as the identity, and such an arcsinh
  # as the identity or, with M + A not positive, as a constant or decreasing map: the range below
  # was compared with raw values, or turned into an empty one.
  range_on <- function(transform) {
    gml_write(sprintf('<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <transforms:transformation transforms:id="Tr">
    %s
  </transforms:transformation>
  <gating:RectangleGate gating:id="R1" gating:name="FL1_range">
    <gating:dimension gating:transformation-ref="Tr" gating:min="0.2" gating:max="0.9">
      <data-type:fcs-dimension data-type:name="FL1-A"/>
    </gating:dimension>
  </gating:RectangleGate>
</gating:Gating-ML>', transform))
  }
  logicle <- function(t, w, m, a) {
    sprintf('<transforms:logicle transforms:T="%s" transforms:W="%s" transforms:M="%s" transforms:A="%s"/>', t, w, m, a)
  }
  fasinh <- function(t, m, a) {
    sprintf('<transforms:fasinh transforms:T="%s" transforms:M="%s" transforms:A="%s"/>', t, m, a)
  }
  refused <- list(
    list(logicle(0, 0.5, 4.5, 0), "a logicle with T = 0, W = 0.5, M = 4.5 and A = 0, whose T is not positive"),
    list(logicle(262144, 0.5, 0, 0), "a logicle with T = 262144, W = 0.5, M = 0 and A = 0, whose M is not positive"),
    list(logicle(262144, -0.1, 4.5, 0), "a logicle with T = 262144, W = -0.1, M = 4.5 and A = 0, whose W is negative"),
    list(logicle(262144, 3, 4.5, 0), "a logicle with T = 262144, W = 3, M = 4.5 and A = 0, whose W is greater than M / 2"),
    list(logicle(262144, 0.5, 4.5, -1), "a logicle with T = 262144, W = 0.5, M = 4.5 and A = -1, whose A is less than -W"),
    list(logicle(262144, 0.5, 4.5, 4), "a logicle with T = 262144, W = 0.5, M = 4.5 and A = 4, whose A is greater than M - 2W"),
    list(fasinh(-1, 4.5, 0), "an arcsinh (fasinh) with T = -1, M = 4.5 and A = 0, whose T is not positive"),
    list(fasinh(262144, 0, 0), "an arcsinh (fasinh) with T = 262144, M = 0 and A = 0, whose M is not positive"),
    list(fasinh(262144, 1, -1), "an arcsinh (fasinh) with T = 262144, M = 1 and A = -1, whose M + A is not positive"),
    list(fasinh(262144, 1, -2), "an arcsinh (fasinh) with T = 262144, M = 1 and A = -2, whose M + A is not positive")
  )
  for (case in refused) {
    expect_error(gml_import(range_on(case[[1]])),
                 paste0('Gate "FL1_range" (R1) is on transformation Tr, ', case[[2]], ", so GateLabR cannot"),
                 fixed = TRUE, info = case[[1]])
  }
  # The limits are the parameters' own: W = M / 2, A = -W, A = M - 2W and a negative arcsinh A with
  # M + A positive give an inverse, and read.
  lower <- function(parsed) parsed$gates[[1]]$vertices[[1]][1]
  for (p in list(c(262144, 2.25, 4.5, 0), c(262144, 0.5, 4.5, -0.5), c(262144, 0.5, 4.5, -0.25),
                 c(262144, 0.5, 4.5, 3.5))) {
    lg <- flowCore::logicleTransform("lg", w = p[2], t = p[1], m = p[3], a = p[4])
    inverse <- flowCore::inverseLogicleTransform(lg, transformationId = "inv")
    expect_equal(lower(gml_import(range_on(logicle(p[1], p[2], p[3], p[4])))), as.numeric(inverse(0.2 * p[3])),
                 info = paste(p, collapse = " "))
  }
  forward <- function(x) (asinh(x * sinh(2 * log(10)) / 1000) - 0.5 * log(10)) / (1.5 * log(10))
  expect_equal(forward(lower(gml_import(range_on(fasinh(1000, 2, -0.5))))), 0.2)
})

test_that("flin, Gating-ML's linear scale, is read", {
  # flin(x) = (x + A) / (T + A) is affine, so a polygon on it has the same straight edges in raw
  # values and needs nothing more than its vertices inverted.
  parsed <- gml_import(gml_fixture("flowkit-flin.xml"))
  gml_expect_membership(gml_membership(parsed), gml_flowkit("flin"))
  box <- parsed$gates[[which(vapply(parsed$gates, `[[`, "", "name") == "Lin_box")]]
  lower <- as.numeric(sub('.*gating:min="([^"]+)".*', "\\1",
                          grep('gating:min=', readLines(gml_fixture("flowkit-flin.xml")), value = TRUE)[1]))
  expect_equal(box$vertices[[1]][1], lower * (262144 + 1000) - 1000)
})

test_that("a GateLab format mark that is present but cannot be read refuses the file", {
  # Read as no mark, GateLab's standard file would have its logicle coordinates put on flowCore's
  # scale, 4.5 times too high.
  mark_as <- function(name, text) {
    gml_variant(name, function(lines) {
      sub("<gatelab_format>[^<]*</gatelab_format>", paste0("<gatelab_format>", text, "</gatelab_format>"), lines)
    })
  }
  for (name in c("tree-standard.xml", "tree-cytobank.xml")) {
    expect_error(gml_import(mark_as(name, '{"version":2,"logicle":"gating-ml",')), "is not a JSON object", info = name)
    expect_error(gml_import(mark_as(name, "[2]")), "is not a JSON object", info = name)
    expect_error(gml_import(mark_as(name, "")), "gatelab_format) is empty", fixed = TRUE, info = name)
    expect_error(gml_import(mark_as(name, "  ")), "gatelab_format) is empty", fixed = TRUE, info = name)
    # jsonlite reads JSON behind a byte order mark, with a warning; GateLab's JSON.parse does not.
    behind_bom <- gml_variant(name, function(lines) {
      sub("<gatelab_format>", "<gatelab_format>\ufeff", lines, fixed = TRUE)
    })
    expect_error(gml_import(behind_bom), "gatelab_format) begins with a byte order mark", fixed = TRUE,
                 info = name)
    expect_error(gml_import(mark_as(name, '{"version":2,"logicle":"gating-ml","hierarchy":"nested"}')),
                 "gives no hierarchy GateLabR knows", info = name)
    expect_error(gml_import(mark_as(name, '{"version":2,"logicle":"flowCore","hierarchy":"parent_id"}')),
                 "gives no logicle scale GateLabR knows", info = name)
  }
  expect_error(
    gml_import(gml_variant("tree-cytobank.xml", function(lines) {
      sub('{"id":"GateSet_36000003","parent":"GateSet_36000000"}', '{"id":"GateSet_36000003"}', lines, fixed = TRUE)
    })),
    "lists a tree that is not a list of populations"
  )

  # The mark removed from GateLab's standard format, which it has written with the mark and without
  # a GatingHierarchy since 2026-09: its parent_id and BooleanGates say it is that format.
  removed <- gml_variant("tree-standard.xml", function(lines) {
    lines[!grepl("<gatelab_format>", lines, fixed = TRUE)]
  })
  expect_error(gml_import(removed), "carries its marked format's structures (gating:parent_id", fixed = TRUE)
  # GateLab's Cytobank format without its mark is the format GateLab wrote before the mark, whose
  # parents are inferred, and reads as it; see the Cytobank-format test above.
})

test_that("a GateLab format mark that names a key twice refuses the file", {
  # JSON leaves a repeated key to the reader: jsonlite keeps the first value and GateLab's
  # JSON.parse the last, so the two would read the file on different logicle scales, or place its
  # populations under different parents. GateLab never writes a key twice.
  for (name in c("tree-standard.xml", "tree-cytobank.xml")) {
    twice <- gml_variant(name, function(lines) {
      sub('{"version":3,', '{"version":3,"logicle":"flowcore",', lines, fixed = TRUE)
    })
    expect_error(gml_import(twice), 'gatelab_format) names the key "logicle" more than once', fixed = TRUE,
                 info = name)
  }
  reparented <- gml_variant("tree-cytobank.xml", function(lines) {
    sub('{"id":"GateSet_36000003","parent":"GateSet_36000000"}',
        '{"id":"GateSet_36000003","parent":"GateSet_36000001","parent":"GateSet_36000000"}', lines, fixed = TRUE)
  })
  expect_error(gml_import(reparented), 'gatelab_format) names the key "parent" more than once', fixed = TRUE)
})

test_that("a GateLab format mark with a comment refuses the file", {
  # jsonlite::fromJSON reads past a /* */ or // comment before, inside or after the object, where
  # GateLab's JSON.parse refuses the mark, so the two would read the file by different rules.
  # GateLab never writes a comment.
  edits <- list(
    c("<gatelab_format>", "<gatelab_format>/* GateLab */"),
    c('{"version":3,', '{"version":3,/* GateLab */'),
    c("</gatelab_format>", "// GateLab</gatelab_format>")
  )
  for (name in c("tree-standard.xml", "tree-cytobank.xml")) {
    for (edit in edits) {
      commented <- gml_variant(name, function(lines) sub(edit[[1]], edit[[2]], lines, fixed = TRUE))
      expect_true(any(grepl(edit[[2]], readLines(commented, warn = FALSE), fixed = TRUE)))
      expect_error(gml_import(commented), "gatelab_format) is not valid JSON", fixed = TRUE,
                   info = paste(name, edit[[2]]))
    }
  }
})

test_that("a PopulationGatePair written complement=\"1\" or \" true\" is refused as NOT logic", {
  # complement is an xs:boolean, as use-as-complement on a gateReference is, so "1" and a value
  # with surrounding space exclude too; read as an inclusion, FL1_positive would select the events
  # it is meant to exclude.
  for (value in c("1", " true", "TRUE ")) {
    pair <- gml_variant("tree-standard-0.8.3.xml", function(lines) {
      sub('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU.">',
          sprintf('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU." gating:complement="%s">', value),
          lines, fixed = TRUE)
    })
    expect_error(gml_import(pair), 'Population "FL1_positive" uses NOT logic', fixed = TRUE, info = value)
    use_as <- gml_variant("tree-standard-0.8.3.xml", function(lines) {
      sub('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU.">',
          sprintf('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU." gating:use-as-complement="%s">', value),
          lines, fixed = TRUE)
    })
    expect_error(gml_import(use_as), 'Population "FL1_positive" uses NOT logic', fixed = TRUE, info = value)
  }
  # "false" and "0" include, as before.
  for (value in c("false", " 0")) {
    pair <- gml_variant("tree-standard-0.8.3.xml", function(lines) {
      sub('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU.">',
          sprintf('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU." gating:complement="%s">', value),
          lines, fixed = TRUE)
    })
    gml_expect_membership(gml_membership(gml_import(pair)), gml_expected("-0.8.3")$populations$tree)
  }
})

test_that("a complement value that is not an xs:boolean is refused, naming the population", {
  # "yes", "no", "2" or an empty value is neither true nor false, and was read as an inclusion.
  for (value in c("yes", "", "no", "2")) {
    pair <- gml_variant("tree-standard-0.8.3.xml", function(lines) {
      sub('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU.">',
          sprintf('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU." gating:complement="%s">', value),
          lines, fixed = TRUE)
    })
    expect_error(gml_import(pair), sprintf(
      'Population "FL1_positive" gives its gate the complement value "%s", which is not an xs:boolean', value
    ), fixed = TRUE, info = value)
    reference <- gml_variant("flowkit-boolean.xml", function(lines) {
      hit <- grep('<gating:gateReference gating:ref="FL3_pos"/>', lines, fixed = TRUE)[1]
      lines[hit] <- sprintf('<gating:gateReference gating:ref="FL3_pos" gating:use-as-complement="%s"/>', value)
      lines
    })
    expect_error(gml_import(reference), sprintf(
      'Population "Both" gives its gate the complement value "%s", which is not an xs:boolean', value
    ), fixed = TRUE, info = value)
  }
})

test_that("use-as-complement and complement that disagree are refused, naming the population", {
  # use-as-complement was read and complement ignored, so a PopulationGatePair written
  # use-as-complement="false" complement="true" was read as an inclusion, which the older spelling
  # says is an exclusion.
  with_pair <- function(attrs) {
    gml_variant("tree-standard-0.8.3.xml", function(lines) {
      sub('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU.">',
          sprintf('<gating:PopulationGatePair gating:gate-ref="Gate_180000002_RkwxX2dhdGU." %s>', attrs),
          lines, fixed = TRUE)
    })
  }
  for (values in list(c("false", "true"), c("true", "false"), c("0", " 1"))) {
    pair <- with_pair(sprintf('gating:use-as-complement="%s" gating:complement="%s"', values[[1]], values[[2]]))
    expect_error(gml_import(pair), sprintf(
      'Population "FL1_positive" gives its gate use-as-complement="%s" and complement="%s", which disagree',
      values[[1]], values[[2]]
    ), fixed = TRUE, info = paste(values, collapse = " / "))
  }
  # On a gateReference too.
  reference <- gml_variant("flowkit-boolean.xml", function(lines) {
    hit <- grep('<gating:gateReference gating:ref="FL3_pos"/>', lines, fixed = TRUE)[1]
    lines[hit] <- '<gating:gateReference gating:ref="FL3_pos" gating:use-as-complement="false" gating:complement="true"/>'
    lines
  })
  expect_error(gml_import(reference), paste0(
    'Population "Both" gives its gate use-as-complement="false" and complement="true", which disagree'
  ), fixed = TRUE)
  # Two spellings that agree read as their one value.
  agree <- with_pair('gating:use-as-complement="false" gating:complement="0"')
  gml_expect_membership(gml_membership(gml_import(agree)), gml_expected("-0.8.3")$populations$tree)
})

test_that("mass cytometry gates in raw values, or under another arcsinh, are converted to the data's arcsinh", {
  # GateLabR gates mass cytometry on arcsinh(x / cofactor), Time and the event geometry raw. A
  # dimension with no transformation is raw values, and one under an arcsinh of another cofactor
  # is on another scale; compared unconverted with the data, both selected other events.
  events <- as.matrix(utils::read.csv(gml_fixture("cytof-events.csv"), check.names = FALSE))
  storage.mode(events) <- "double"
  channels <- colnames(events)
  identity_map <- stats::setNames(as.list(channels), channels)
  expected <- gml_flowkit("cytof")
  for (cofactor in c(5, 15)) {
    data <- transform_matrix_by_instrument(events, channels, "cytof", cofactor = cofactor)
    parsed <- import_gatingml_from_cytobank(gml_fixture("flowkit-cytof.xml"), channels, identity_map,
                                            instrument = "cytof", cytof_cofactor = cofactor)
    gml_expect_membership(gml_membership(parsed, data), expected)
    gates <- stats::setNames(parsed$gates, vapply(parsed$gates, `[[`, "", "name"))
    # A raw rectangle's bounds convert exactly.
    xml <- xml2::xml_root(xml2::read_xml(gml_fixture("flowkit-cytof.xml")))
    box <- xml2::xml_find_first(xml, ".//*[local-name()='RectangleGate'][@*[local-name()='id']='Raw_box']/*[local-name()='dimension']")
    bounds <- as.numeric(c(xml2::xml_attr(box, "min"), xml2::xml_attr(box, "max")))
    expect_equal(range(vapply(gates$Raw_box$vertices, `[`, 0, 1)), asinh(bounds / cofactor), info = cofactor)
    # A polygon in raw values is followed on the data's arcsinh; on the data's own arcsinh it is
    # taken as it is; Time is raw.
    expect_gt(length(gates$Raw_slant$vertices), 4L)
    if (cofactor == 5) {
      expect_length(gates$Arcsinh_slant$vertices, 4L)
    } else {
      expect_gt(length(gates$Arcsinh_slant$vertices), 4L)
    }
    expect_equal(range(vapply(gates$Time_window$vertices, `[`, 0, 1)), c(100.5, 450.5))
  }
})

test_that("a gate on a derived dimension, such as a ratio, is refused by name", {
  # As FlowKit writes a ratio of two parameters: a transforms:fratio and a data-type:new-dimension.
  # The importer dropped that dimension, leaving a range gate on FSC-A alone.
  ratio <- gml_write('<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <transforms:transformation transforms:id="Area_to_height">
    <transforms:fratio transforms:A="1.0" transforms:B="0.0" transforms:C="0.0">
      <data-type:fcs-dimension data-type:name="FSC-A"/>
      <data-type:fcs-dimension data-type:name="SSC-A"/>
    </transforms:fratio>
  </transforms:transformation>
  <gating:RectangleGate gating:id="Singlets">
    <gating:dimension gating:compensation-ref="uncompensated" gating:min="20000" gating:max="200000">
      <data-type:fcs-dimension data-type:name="FSC-A"/>
    </gating:dimension>
    <gating:dimension gating:compensation-ref="uncompensated" gating:min="0.8" gating:max="1.4">
      <data-type:new-dimension data-type:transformation-ref="Area_to_height"/>
    </gating:dimension>
  </gating:RectangleGate>
</gating:Gating-ML>')
  expect_error(gml_import(ratio), "RectangleGate Singlets has a dimension that is not an FCS parameter", fixed = TRUE)
})

test_that("a transformation declared on Time or Event_length is inverted to their raw values", {
  # GateLabR keeps Time, Event_length and Cell_length raw on every instrument, and took a gate on
  # them as raw values whatever its dimension declared: FlowKit's gates on flin, arcsinh and
  # logicle Time and Event_length selected no events.
  parsed <- gml_import(gml_fixture("flowkit-raw-channels.xml"))
  gml_expect_membership(gml_membership(parsed), gml_flowkit("raw-channels"))
  # These channels are raw whichever the data, so without the instrument argument too.
  parsed <- import_gatingml_from_cytobank(gml_fixture("flowkit-raw-channels.xml"), gml_channels, gml_identity_map)
  gml_expect_membership(gml_membership(parsed), gml_flowkit("raw-channels"))

  events <- as.matrix(utils::read.csv(gml_fixture("cytof-events.csv"), check.names = FALSE))
  storage.mode(events) <- "double"
  channels <- colnames(events)
  for (cofactor in c(5, 15)) {
    data <- transform_matrix_by_instrument(events, channels, "cytof", cofactor = cofactor)
    parsed <- import_gatingml_from_cytobank(gml_fixture("flowkit-raw-channels-cytof.xml"), channels,
                                            stats::setNames(as.list(channels), channels),
                                            instrument = "cytof", cytof_cofactor = cofactor)
    gml_expect_membership(gml_membership(parsed, data), gml_flowkit("raw-channels-cytof"))
  }

  # Flow data hold every channel raw, so an arcsinh on a QC channel such as Width is inverted
  # like one on scatter or fluorescence; file_number is raw on every instrument, like Time.
  asinh <- list(Asinh = list(type = "fasinh", T = 1000, M = 4, A = 0.5))
  forward <- function(x) (asinh(x * sinh(4 * log(10)) / 1000) + 0.5 * log(10)) / (4.5 * log(10))
  width <- .gml_axis_map("Width", "Asinh", asinh, instrument = "flow")
  expect_equal(width$inverse(forward(c(10, 200, 900))), c(10, 200, 900))
  file_number <- .gml_axis_map("file_number", "Asinh", asinh)
  expect_equal(file_number$inverse(forward(c(1, 2, 7))), c(1, 2, 7))
})

test_that("a gate on a barcode channel is converted like one on any other channel", {
  # A barcode channel was taken as it is, whatever the data held and whatever its dimension
  # declared. Mass cytometry data hold it as arcsinh(x / cofactor), so a raw-value range of 100 to
  # 1000 selected nothing there, and flow data hold it in raw values, so a flin or logicle range
  # was compared with raw values.
  barcode <- gml_write('<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <transforms:transformation transforms:id="Lin">
    <transforms:flin transforms:T="1000" transforms:A="0"/>
  </transforms:transformation>
  <gating:RectangleGate gating:id="Raw_range">
    <gating:dimension gating:compensation-ref="uncompensated" gating:min="100" gating:max="1000">
      <data-type:fcs-dimension data-type:name="barcode"/>
    </gating:dimension>
  </gating:RectangleGate>
  <gating:RectangleGate gating:id="Lin_range">
    <gating:dimension gating:compensation-ref="uncompensated" gating:transformation-ref="Lin"
      gating:min="0.1" gating:max="0.9">
      <data-type:fcs-dimension data-type:name="barcode"/>
    </gating:dimension>
  </gating:RectangleGate>
</gating:Gating-ML>')
  channels <- c("barcode", "Nd142Di")
  map <- stats::setNames(as.list(channels), channels)
  bounds <- function(parsed, name) {
    gate <- Filter(function(g) identical(g$name, name), parsed$gates)[[1]]
    range(vapply(gate$vertices, `[`, 0, 1))
  }
  for (cofactor in c(5, 15)) {
    parsed <- import_gatingml_from_cytobank(barcode, channels, map, instrument = "cytof",
                                            cytof_cofactor = cofactor)
    info <- paste("cofactor", cofactor)
    expect_equal(bounds(parsed, "Raw_range"), asinh(c(100, 1000) / cofactor), info = info)
    expect_equal(bounds(parsed, "Lin_range"), asinh(c(100, 900) / cofactor), info = info)
  }
  for (instrument in list("flow", NULL)) {
    parsed <- import_gatingml_from_cytobank(barcode, channels, map, instrument = instrument)
    expect_equal(bounds(parsed, "Raw_range"), c(100, 1000))
    expect_equal(bounds(parsed, "Lin_range"), c(100, 900))
  }
  logicle <- list(Logicle = list(type = "logicle", T = 262144, W = 0.5, M = 4.5, A = 0))
  axis <- .gml_axis_map("barcode", "Logicle", logicle, logicle_unit = TRUE, instrument = "flow")
  expect_identical(axis$kind, "curved")
  expect_equal(axis$inverse(axis$forward(c(-50, 10, 5000))), c(-50, 10, 5000))
})

test_that("GateLab's files from FlowJo gates read as ordinary gates: grid rings, skirted polygons and clamp rectangles", {
  # A polygon on FlowJo's gate grid is written as the union of its grid cells, a rectilinear ring
  # in raw values whose outer edge is the largest float32, with GateLab's own mark beside it. A
  # continuous polygon on a biex or log axis reaching past the table's end or the floor is written
  # in raw values, clipped there, with skirt loops out to 1e15 that hold the events beyond. A
  # rectangle edge at a clamp is written raw with that bound left out, and a range over both ends
  # of a biex table with gating:min at the largest negative double, which is no bound.
  expected <- gml_expected()$populations$flowjo
  for (name in c("flowjo-standard.xml", "flowjo-cytobank.xml")) {
    parsed <- gml_import(gml_fixture(name))
    gml_expect_membership(gml_membership(parsed), expected)
    gates <- stats::setNames(parsed$gates, vapply(parsed$gates, `[[`, "", "name"))
    # The ring is read as it is, vertex for vertex: nothing to follow on raw axes.
    ring <- unlist(gates$Grid_cells$vertices)
    expect_gte(max(abs(ring)), 3.4028234663852886e38)
    xml <- xml2::xml_root(xml2::read_xml(gml_fixture(name)))
    grid <- xml2::xml_find_first(xml, ".//*[local-name()='PolygonGate'][.//*[local-name()='gatelab_flowjo_grid']]")
    expect_length(gates$Grid_cells$vertices, length(xml2::xml_find_all(grid, "./*[local-name()='vertex']")))
    # Edges with no bound are stored beyond every value.
    span <- range(vapply(gates$Biex_span_gate$vertices, `[`, 0, 1))
    expect_identical(span, c(-.Machine$double.xmax, .Machine$double.xmax), info = name)
    floor <- range(vapply(gates$Biex_floor_gate$vertices, `[`, 0, 1))
    expect_identical(floor[[1]], -.Machine$double.xmax, info = name)
  }
})

test_that("an edge with no bound holds values past 1e9, where the importer's stand-in had stopped", {
  # A missing bound was held at -1e9 or 1e9, which real raw values pass: a detector width reaches
  # beyond 2e9 on some instruments.
  events <- cbind(`FL1-A` = c(-3e9, -2e3, 5e2, 3e9), `FL2-A` = c(0, 0, 0, 0))
  open_range <- gml_write(gml_doc(
    '  <gating:RectangleGate gating:id="Below" gating:name="Below"><gating:dimension gating:max="1000"><data-type:fcs-dimension data-type:name="FL1-A"/></gating:dimension></gating:RectangleGate>',
    '  <gating:RectangleGate gating:id="Any" gating:name="Any"><gating:dimension gating:min="-1.7976931348623157e+308"><data-type:fcs-dimension data-type:name="FL1-A"/></gating:dimension></gating:RectangleGate>'
  ))
  membership <- gml_membership(gml_import(open_range), events)
  expect_identical(membership[["/Below"]], 1:3)
  expect_identical(membership[["/Any"]], 1:4)
})

test_that("Time in seconds and Gating-ML scale values are taken back to the stored values", {
  # GateLab's standard format writes Time in seconds, stored ticks times $TIMESTEP, and every other
  # coordinate as a Gating-ML scale value, stored value / $PnG; its mark says so ("time":
  # "seconds", "gain": "gating-ml"). The Cytobank format writes both as stored.
  info <- gml_expected()
  expected <- info$populations$timegain
  gains <- unlist(info$gains)
  standard <- import_gatingml_from_cytobank(gml_fixture("timegain-standard.xml"), gml_channels,
                                            gml_identity_map, instrument = "flow",
                                            timestep = info$timestep, gains = gains)
  gml_expect_membership(gml_membership(standard), expected)
  cytobank <- gml_import(gml_fixture("timegain-cytobank.xml"))
  gml_expect_membership(gml_membership(cytobank), expected)
  # Early is half-open on whole-number ticks and Late closed: tick 300 is in Late alone.
  early <- gml_events[unlist(expected[["/Cells/Early"]]), "Time"]
  expect_true(all(early >= 100 & early < 300))
  expect_true(299 %in% early)
  expect_true(300 %in% gml_events[unlist(expected[["/Cells/Late"]]), "Time"])

  # Without the data's $TIMESTEP a gate on Time in seconds is refused by name.
  expect_error(
    import_gatingml_from_cytobank(gml_fixture("timegain-standard.xml"), gml_channels, gml_identity_map,
                                  instrument = "flow", gains = gains),
    'Gate "Time_early_gate" (Gate_180000002_VGltZV9lYXJseV9nYXRl) is on Time, which the file\'s GateLab format mark says is in seconds',
    fixed = TRUE
  )
  # Without the gains, the gates on FL1-A and FL2-A select other events.
  ungained <- import_gatingml_from_cytobank(gml_fixture("timegain-standard.xml"), gml_channels,
                                            gml_identity_map, instrument = "flow", timestep = info$timestep)
  expect_false(identical(gml_membership(ungained)[["/FL1_raw"]], as.integer(unlist(expected[["/FL1_raw"]]))))
  # Gains apply only where the mark says the file is on scale values.
  gml_expect_membership(gml_membership(import_gatingml_from_cytobank(
    gml_fixture("timegain-cytobank.xml"), gml_channels, gml_identity_map, instrument = "flow",
    timestep = info$timestep, gains = gains
  )), expected)
})

test_that("a rectangle edge on a raw axis in seconds lands on the stored tick exactly", {
  # 10.052100219726563 s is the tick 1005.2100219726562 times 0.01 as a reader computes it, and the
  # edge divided by 0.01 rounds one step past that tick, leaving it out of a range it starts.
  scale <- list(to_stored = function(v) v / 0.01, to_file = function(x) x * 0.01)
  map <- .gml_axis_map("Time", NULL, list(), instrument = "flow", scale = scale)
  tick <- 1005.2100219726562
  expect_identical(tick * 0.01, 10.052100219726563)
  expect_gt(10.052100219726563 / 0.01, tick)
  lower <- .gml_rectangle_range(list(channel = "Time", min = 10.052100219726563), map)$range[[1]]
  expect_identical(lower, tick)
  # A closed upper edge there holds the tick, and nothing a reader puts above the edge.
  upper <- .gml_rectangle_range(list(channel = "Time", max = 10.052100219726563), map)$range[[2]]
  expect_gte(upper, tick)
  expect_lte(upper * 0.01, 10.052100219726563)
  expect_gt(.gml_next_double(upper, 1) * 0.01, 10.052100219726563)
})

test_that("Gating-ML's flog is read, with an event at zero only in a range with no lower bound", {
  # flog(x) = log10(x / T) / M + 1 is -Inf at zero and undefined below; FlowKit and flowCore do not
  # test an absent bound, so a range open below holds an event at zero and none below it.
  expected <- gml_expected()$populations$flog
  for (name in c("flog-standard.xml", "flog-cytobank.xml")) {
    parsed <- gml_import(gml_fixture(name))
    gml_expect_membership(gml_membership(parsed), expected)
  }
  fl1 <- gml_events[, "FL1-A"]
  open_below <- unlist(expected[["/FL1_log_open"]])
  expect_true(which(fl1 == 0) %in% open_below)
  expect_false(any(fl1[open_below] < 0))
  # GateLab's own flog gates from FlowJo's log axes, in a version 3 file, read the same way.
  flowjo <- gml_expected()$populations$flowjo
  expect_identical(gml_membership(gml_import(gml_fixture("flowjo-standard.xml")))[["/Log_poly"]],
                   as.integer(unlist(flowjo[["/Log_poly"]])))

  # A file GateLab wrote before its mark reached version 3 used its older flog, which holds every
  # value below T 10^-M at 0; such a gate is refused by name.
  older <- gml_variant("flowjo-standard.xml", function(lines) {
    sub('{"version":3,"logicle":"gating-ml","hierarchy":"parent_id","time":"seconds","gain":"gating-ml"}',
        '{"version":2,"logicle":"gating-ml","hierarchy":"parent_id"}', lines, fixed = TRUE)
  })
  expect_error(gml_import(older), paste0(
    'Gate "Log_poly_gate" (Gate_180000012_TG9nX3BvbHlfZ2F0ZQ..) is on transformation Tr_Log_262144_5, ',
    "a flog GateLab wrote before its format mark reached version 3"
  ), fixed = TRUE)
})

test_that("a transformation's boundMin and boundMax are applied, and what GateLabR cannot hold of them is refused", {
  # A value beyond a bound is held at the bound before the gate is tested: a lower edge at or below
  # boundMin holds every value below it, and an upper edge at or above boundMax every value above.
  expected <- gml_expected()$populations$bounds
  parsed <- gml_import(gml_fixture("bounds-standard.xml"))
  gml_expect_membership(gml_membership(parsed), expected)
  box <- Filter(function(g) identical(g$name, "Bounded_rect"), parsed$gates)[[1]]
  expect_identical(min(vapply(box$vertices, `[`, 0, 1)), -.Machine$double.xmax)
  expect_identical(max(vapply(box$vertices, `[`, 0, 2)), .Machine$double.xmax)

  # A polygon reaching a bound would hold the events held there.
  reaching <- gml_variant("bounds-standard.xml", function(lines) {
    hit <- grep("<gating:coordinate", lines)[1]
    lines[hit] <- sub('data-type:value="[^"]+"', 'data-type:value="0.05"', lines[hit])
    lines
  })
  expect_error(gml_import(reaching), "is a polygon that reaches its transformation's boundMin 0.1", fixed = TRUE)
  # A range wholly beyond a bound holds no event, which a rectangle cannot state.
  beyond <- gml_variant("bounds-standard.xml", function(lines) {
    sub('gating:min="0.5" gating:max="0.9999999999999"', 'gating:min="0.95" gating:max="0.9999999999999"', lines, fixed = TRUE)
  })
  expect_error(gml_import(beyond), "holds no event: its range on FL2-A starts at 0.95, above the transformation's boundMax 0.9",
               fixed = TRUE)
  # Bounds that cannot be read are refused, naming the transformation.
  for (edit in list(c('transforms:boundMin="0.1"', 'transforms:boundMin="low"', 'whose boundMin is "low", which is not a number'),
                    c('transforms:boundMin="0.1"', 'transforms:boundMin="0.95"', "whose boundMin 0.95 is above its boundMax 0.9"))) {
    bad <- gml_variant("bounds-standard.xml", function(lines) sub(edit[[1]], edit[[2]], lines, fixed = TRUE))
    expect_error(gml_import(bad), edit[[3]], fixed = TRUE, info = edit[[2]])
  }
})

test_that("a transformation parameter that is not a number is refused by name, not given its default", {
  # A parameter the file writes but that is not a finite number was read as absent, so a logicle
  # with M="abc" was read at M = 4.5 and an arcsinh with M="abc" at log10(e).
  range_on <- function(transform) {
    gml_write(sprintf('<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <transforms:transformation transforms:id="Tr">%s</transforms:transformation>
  <gating:RectangleGate gating:id="R1" gating:name="FL1_range">
    <gating:dimension gating:transformation-ref="Tr" gating:min="0.2" gating:max="0.9">
      <data-type:fcs-dimension data-type:name="FL1-A"/>
    </gating:dimension>
  </gating:RectangleGate>
</gating:Gating-ML>', transform))
  }
  refused <- list(
    list('<transforms:logicle transforms:T="262144" transforms:W="0.5" transforms:M="abc" transforms:A="0"/>',
         'a logicle whose M is "abc", which is not a finite number'),
    list('<transforms:logicle transforms:T="262144" transforms:W="" transforms:M="4.5" transforms:A="0"/>',
         'a logicle whose W is "", which is not a finite number'),
    list('<transforms:logicle transforms:T="262144" transforms:M="4.5" transforms:A="0"/>',
         "a logicle gives no W"),
    list('<transforms:fasinh transforms:T="262144" transforms:M="abc" transforms:A="0"/>',
         'an arcsinh (fasinh) whose M is "abc", which is not a finite number'),
    list('<transforms:fasinh transforms:T="0x10" transforms:M="4" transforms:A="0"/>',
         'an arcsinh (fasinh) whose T is "0x10", which is not a finite number'),
    list('<transforms:fasinh transforms:T="262144" transforms:M="4" transforms:A="Inf"/>',
         'an arcsinh (fasinh) whose A is "Inf", which is not a finite number'),
    list('<transforms:flog transforms:T="262144" transforms:M="five"/>',
         'a flog whose M is "five", which is not a finite number'),
    list('<transforms:flin transforms:T="262144" transforms:A="abc"/>',
         'a flin whose A is "abc", which is not a finite number'),
    # sinh(M ln 10) overflows double precision past M = 308.25, and the inverse is then 0 everywhere;
    # it was read as the identity.
    list('<transforms:fasinh transforms:T="262144" transforms:M="310" transforms:A="0"/>',
         "an arcsinh (fasinh) with T = 262144, M = 310 and A = 0, whose sinh(M ln 10) overflows double precision")
  )
  for (case in refused) {
    expect_error(gml_import(range_on(case[[1]])),
                 paste0('Gate "FL1_range" (R1) is on transformation Tr, ', case[[2]], ", so GateLabR cannot"),
                 fixed = TRUE, info = case[[1]])
  }
  # A parameter the file leaves out still takes its default, as GateLab gives it.
  lg <- flowCore::logicleTransform("lg", w = 0.5, t = 262144, m = 4.5, a = 0)
  inverse <- flowCore::inverseLogicleTransform(lg, transformationId = "inv")
  default_m <- gml_import(range_on('<transforms:logicle transforms:T="262144" transforms:W="0.5"/>'))
  expect_equal(default_m$gates[[1]]$vertices[[1]][1], as.numeric(inverse(0.2 * 4.5)))
  # M = 308 is below the overflow and reads.
  forward <- function(x) asinh(x * sinh(308 * log(10)) / 262144) / (308 * log(10))
  high_m <- gml_import(range_on('<transforms:fasinh transforms:T="262144" transforms:M="308" transforms:A="0"/>'))
  expect_equal(forward(high_m$gates[[1]]$vertices[[1]][1]), 0.2)
})

test_that("GateLab's compensation record of version 4 names its reference by the gates' dimensions", {
  # From gatelabr_scales version 4 the reference is always "dimensions": enabled says whether the
  # gates were drawn on compensated values, read as "FCS" when they were and "uncompensated" when
  # not. A reference GateLabR does not know is refused, as before.
  expect_identical(gml_import(gml_fixture("tree-standard.xml"))$compensation$reference, "uncompensated")
  matrix <- gml_import(gml_fixture("matrix-standard.xml"))$compensation
  expect_identical(matrix$reference, "FCS")
  expect_true(matrix$enabled)
  older <- gml_variant("tree-standard.xml", function(lines) {
    sub('{"version":4,"channels"', '{"version":3,"channels"', lines, fixed = TRUE)
  })
  expect_error(gml_import(older), "unsupported matrix reference")
  unknown <- gml_variant("tree-standard.xml", function(lines) {
    sub('"reference":"dimensions"', '"reference":"workspace"', lines, fixed = TRUE)
  })
  expect_error(gml_import(unknown), "unsupported matrix reference")
})

test_that("a file on Gating-ML's logicle scale says so in its about text or its scales version, without the mark", {
  lg <- flowCore::logicleTransform("lg", w = 0.5, t = 262144, m = 4.5, a = 1)
  inverse <- flowCore::inverseLogicleTransform(lg, transformationId = "inv")
  lower_bound <- function(parsed) parsed$gates[[1]]$vertices[[1]][1]
  expected <- as.numeric(inverse(0.4 * 4.5))
  words <- "<data-type:custom_info><cytobank><about>Gating-ML 2.0 export from GateLab (standard / re-importable; logicle on the Gating-ML 2.0 scale, T at 1)</about></cytobank></data-type:custom_info>"
  expect_equal(lower_bound(gml_import(gml_logicle_file(0.4, words))), expected)
  scales_v4 <- '<data-type:custom_info><gatelabr_scales><definition>{"version":4,"channels":{}}</definition></gatelabr_scales></data-type:custom_info>'
  expect_equal(lower_bound(gml_import(gml_logicle_file(0.4, scales_v4))), expected)
  # GateLab's older about text still reads on flowCore's scale.
  older <- sub("; logicle on the Gating-ML 2.0 scale, T at 1", "", words, fixed = TRUE)
  expect_equal(lower_bound(gml_import(gml_logicle_file(0.4 * 4.5, older))), expected)

  # Without the mark, a gate on Time in such a file could be in seconds or ticks, and is refused.
  on_time <- gml_write(gml_doc(
    words,
    '  <gating:RectangleGate gating:id="Window" gating:name="Window"><gating:dimension gating:min="1" gating:max="3"><data-type:fcs-dimension data-type:name="Time"/></gating:dimension></gating:RectangleGate>'
  ))
  expect_error(gml_import(on_time), "a gate on Time, whose unit, seconds or ticks, only the mark states", fixed = TRUE)
})

test_that("a GateLab format mark with a Time unit or gain convention GateLabR does not know is refused", {
  for (edit in list(c('"time":"seconds"', '"time":"minutes"', "gives no Time unit GateLabR knows"),
                    c('"gain":"gating-ml"', '"gain":"divided"', "gives no gain convention GateLabR knows"))) {
    bad <- gml_variant("tree-standard.xml", function(lines) sub(edit[[1]], edit[[2]], lines, fixed = TRUE))
    expect_error(gml_import(bad), edit[[3]], fixed = TRUE, info = edit[[2]])
  }
})
