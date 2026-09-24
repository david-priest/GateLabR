# Gating-ML files as GateLab writes them from 2026-09 (format mark version 2), and as GateLab 0.8.3
# wrote them before. The fixtures under fixtures/gatingml/ are GateLab's own exports of synthetic
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

test_that("polygons with slanted edges on a logicle or arcsinh axis are refused by name", {
  # The file declares those edges straight on the axes they were drawn on, where GateLab evaluates
  # them. GateLabR joins inverted vertices with straight edges in raw values, where they are
  # curves, so it would select different events.
  for (name in c("slanted-standard.xml", "slanted-cytobank.xml")) {
    err <- tryCatch(gml_import(gml_fixture(name)), error = function(e) conditionMessage(e))
    expect_type(err, "character")
    expect_match(err, 'Gate "Slant_FL_gate" (', fixed = TRUE, info = name)
    expect_match(err, 'Gate "Slant_scatter_gate" (', fixed = TRUE, info = name)
    # Edges parallel to an axis, and a polygon in raw values, are the same gate in raw values.
    expect_no_match(err, 'Gate "L_gate"', fixed = TRUE, info = name)
    expect_no_match(err, 'Gate "Poly_gate"', fixed = TRUE, info = name)
  }
})

test_that("an ellipse is refused in both formats, by name", {
  expect_error(
    gml_import(gml_fixture("ellipse-standard.xml")),
    "EllipsoidGate [^ ]+ \\(Ellipse_gate\\) is not supported"
  )
  # The Cytobank format writes the ellipse as its boundary, a polygon on arcsinh axes.
  expect_error(
    gml_import(gml_fixture("ellipse-cytobank.xml")),
    'Gate "Ellipse_gate" (', fixed = TRUE
  )
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

  # The Cytobank format carries the same matrix, referenced by no dimension, and GateLab's
  # compensation record.
  cytobank <- gml_import(gml_fixture("matrix-cytobank.xml"))
  expect_null(cytobank$spectrum_matrix)
  expect_true("FCS" %in% cytobank$compensation_refs)
  gml_expect_membership(gml_membership(cytobank, compensated), info$populations$matrix)
  expect_error(
    resolve_gatingml_compensation(cytobank$compensation, cytobank$compensation_refs, TRUE, fcs),
    "different FCS spillover matrix"
  )
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

test_that("a population cannot reference a gate that parent_id restricts", {
  population <- '  <gating:BooleanGate gating:id="P1" gating:name="Pop">
    <gating:and><gating:gateReference gating:ref="Inner"/><gating:gateReference gating:ref="Inner"/></gating:and>
  </gating:BooleanGate>'
  expect_error(
    gml_import(gml_write(gml_doc(gml_rect("Outer", 0, 50000), gml_rect("Inner", 1000, 1e6, parent = "Outer"), population))),
    "Inner has a parent_id; GateLabR places only Boolean populations by parent_id"
  )
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
    later <- gml_variant(name, function(lines) sub('{"version":2,', '{"version":3,', lines, fixed = TRUE))
    expect_error(gml_import(later), "format mark has version 3;", fixed = TRUE, info = name)
  }
  unversioned <- gml_variant("tree-standard.xml", function(lines) {
    sub('{"version":2,', "{", lines, fixed = TRUE)
  })
  expect_error(gml_import(unversioned), "format mark has no version;", fixed = TRUE)
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
