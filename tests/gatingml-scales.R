app_dir <- if (dir.exists(file.path("inst", "app"))) {
  normalizePath(file.path("inst", "app"))
} else {
  system.file("app", package = "GateLabR")
}
stopifnot(nzchar(app_dir))
source(file.path(app_dir, "R", "models.R"))
source(file.path(app_dir, "R", "fcs_import.R"))
source(file.path(app_dir, "R", "gatingml_import.R"))
source(file.path(app_dir, "R", "gatingml_export.R"))

make_strategy <- function(x_channel, y_channel, x_range, y_range, n_events) {
  gate <- new_gate(
    "Selected", "rectangle", x_channel, y_channel,
    list(
      c(x_range[1], y_range[1]), c(x_range[2], y_range[1]),
      c(x_range[2], y_range[2]), c(x_range[1], y_range[2])
    )
  )
  gates <- setNames(list(gate), gate$gate_id)
  root <- new_root_population(n_events)
  pop <- new_population("Selected", list(new_gate_ref(gate$gate_id)), root$population_id)
  populations <- setNames(list(root, pop), c(root$population_id, pop$population_id))
  populations <- link_child_to_parent(populations, pop$population_id, root$population_id)
  list(
    gates = gates,
    gate_order = gate$gate_id,
    populations = populations,
    root_population_id = root$population_id
  )
}

set.seed(431)
flow_counts <- cbind(
  `FSC-A` = runif(300, 1000, 100000),
  `SSC-A` = runif(300, 1000, 90000),
  `PE-A` = rnorm(300, 4000, 2500),
  `APC-A` = rnorm(300, 3000, 1800)
)
flow_channels <- colnames(flow_counts)
flow_sce <- SingleCellExperiment::SingleCellExperiment(
  assays = list(counts = t(flow_counts), exprs = t(flow_counts))
)
rownames(flow_sce) <- flow_channels
S4Vectors::metadata(flow_sce)$instrument_type <- "flow"
S4Vectors::metadata(flow_sce)$cofactor <- 5
S4Vectors::metadata(flow_sce)$channel_to_pnn <- setNames(as.list(flow_channels), flow_channels)

flow_w <- list(`PE-A` = 0.7, `APC-A` = 0.8)
flow_cf <- list(`FSC-A` = 300, `SSC-A` = 450)
pe_raw_range <- c(-500, 25000)
pe_display_range <- flow_transform_channel_values(
  pe_raw_range, "PE-A", flow_counts[, "PE-A"], flow_w, flow_cf
)
flow_ranges <- list(
  `FSC-A` = list(lo = -1, hi = 8),
  `PE-A` = list(lo = pe_display_range[1], hi = pe_display_range[2])
)
flow_strategy <- make_strategy("FSC-A", "SSC-A", c(10000, 80000), c(8000, 70000), nrow(flow_counts))
flow_out <- tempfile(fileext = ".xml")
export_gatingml_to_cytobank(
  gates = flow_strategy$gates,
  gate_order = flow_strategy$gate_order,
  populations = flow_strategy$populations,
  root_population_id = flow_strategy$root_population_id,
  sce = flow_sce,
  file_path = flow_out,
  format = "standard",
  logicle_w_params = flow_w,
  scatter_cofactor_params = flow_cf,
  counts_mat = flow_counts,
  global_scale_ranges = flow_ranges
)
flow_parsed <- import_gatingml_from_cytobank(
  flow_out, flow_channels, setNames(as.list(flow_channels), flow_channels)
)
stopifnot(
  isTRUE(all.equal(flow_parsed$scales[["FSC-A"]]$raw_lo, 300 * sinh(-1), tolerance = 1e-10)),
  isTRUE(all.equal(flow_parsed$scales[["FSC-A"]]$raw_hi, 300 * sinh(8), tolerance = 1e-10)),
  isTRUE(all.equal(flow_parsed$scales[["PE-A"]]$raw_lo, pe_raw_range[1], tolerance = 1e-7)),
  isTRUE(all.equal(flow_parsed$scales[["PE-A"]]$raw_hi, pe_raw_range[2], tolerance = 1e-7))
)

# Version 3 raw endpoints, not the producer's display numbers, determine the
# destination range. This is the cross-port compatibility invariant.
flow_scatter_entry <- flow_parsed$scales[["FSC-A"]]
flow_scatter_entry$lo <- 999
flow_scatter_entry$hi <- 1000
restored_scatter <- .gml_scale_range_to_display(
  flow_scatter_entry, "FSC-A", TRUE,
  raw_channel_vals = flow_counts[, "FSC-A"],
  logicle_w_params = flow_w,
  scatter_cofactor_params = flow_cf
)
restored_signal <- .gml_scale_range_to_display(
  flow_parsed$scales[["PE-A"]], "PE-A", TRUE,
  raw_channel_vals = flow_counts[, "PE-A"],
  logicle_w_params = flow_w,
  scatter_cofactor_params = flow_cf
)
stopifnot(
  isTRUE(all.equal(restored_scatter, c(-1, 8), tolerance = 1e-10)),
  isTRUE(all.equal(restored_signal, pe_display_range, tolerance = 1e-8))
)

cytof_counts <- cbind(
  Time = seq_len(120),
  CD3 = seq(0, 5000, length.out = 120),
  CD19 = seq(20, 9000, length.out = 120)
)
cytof_channels <- colnames(cytof_counts)
cytof_cofactor <- 10
cytof_exprs <- transform_matrix_by_instrument(
  cytof_counts, cytof_channels, "cytof", cofactor = cytof_cofactor
)
cytof_sce <- SingleCellExperiment::SingleCellExperiment(
  assays = list(counts = t(cytof_counts), exprs = t(cytof_exprs))
)
rownames(cytof_sce) <- cytof_channels
S4Vectors::metadata(cytof_sce)$instrument_type <- "cytof"
S4Vectors::metadata(cytof_sce)$cofactor <- cytof_cofactor
S4Vectors::metadata(cytof_sce)$channel_to_pnn <- setNames(as.list(cytof_channels), cytof_channels)
cytof_strategy <- make_strategy("CD3", "CD19", c(1, 5), c(1, 6), nrow(cytof_counts))
cytof_range <- c(-0.5, 6)
cytof_out <- tempfile(fileext = ".xml")
export_gatingml_to_cytobank(
  gates = cytof_strategy$gates,
  gate_order = cytof_strategy$gate_order,
  populations = cytof_strategy$populations,
  root_population_id = cytof_strategy$root_population_id,
  sce = cytof_sce,
  file_path = cytof_out,
  format = "standard",
  global_scale_ranges = list(CD3 = list(lo = cytof_range[1], hi = cytof_range[2]))
)
cytof_parsed <- import_gatingml_from_cytobank(
  cytof_out, cytof_channels, setNames(as.list(cytof_channels), cytof_channels)
)
restored_cytof <- .gml_scale_range_to_display(
  cytof_parsed$scales$CD3, "CD3", FALSE, cytof_cofactor = cytof_parsed$cytof_cofactor
)
stopifnot(
  identical(cytof_parsed$cytof_cofactor, cytof_cofactor),
  isTRUE(all.equal(cytof_parsed$scales$CD3$raw_lo, cytof_cofactor * sinh(cytof_range[1]), tolerance = 1e-10)),
  isTRUE(all.equal(cytof_parsed$scales$CD3$raw_hi, cytof_cofactor * sinh(cytof_range[2]), tolerance = 1e-10)),
  isTRUE(all.equal(restored_cytof, cytof_range, tolerance = 1e-10))
)

# Quadrant omission must be explicit and must prune descendants rather than
# silently re-parenting them to a representable ancestor.
ordinary <- flow_strategy$gates[[1]]
quadrant <- new_quadrant_gate("Quadrants", "FSC-A", "SSC-A", c(40000, 40000))
quadrant_gates <- setNames(list(ordinary, quadrant), c(ordinary$gate_id, quadrant$gate_id))
quadrant_root <- new_root_population(nrow(flow_counts))
quadrant_pop <- new_population(
  "Quadrant population", list(new_gate_ref(quadrant$gate_id, quadrant = 2L)),
  quadrant_root$population_id
)
quadrant_desc <- new_population(
  "Quadrant descendant", list(new_gate_ref(ordinary$gate_id)), quadrant_pop$population_id
)
quadrant_pops <- setNames(
  list(quadrant_root, quadrant_pop, quadrant_desc),
  c(quadrant_root$population_id, quadrant_pop$population_id, quadrant_desc$population_id)
)
quadrant_pops <- link_child_to_parent(
  quadrant_pops, quadrant_pop$population_id, quadrant_root$population_id
)
quadrant_pops <- link_child_to_parent(
  quadrant_pops, quadrant_desc$population_id, quadrant_pop$population_id
)
omissions <- .gml_ex_quadrant_omissions(quadrant_gates, quadrant_pops)
stopifnot(setequal(omissions$population_ids, c(quadrant_pop$population_id, quadrant_desc$population_id)))
blocked <- tempfile(fileext = ".xml")
blocked_message <- tryCatch({
  export_gatingml_to_cytobank(
    quadrant_gates, names(quadrant_gates), quadrant_pops, quadrant_root$population_id,
    flow_sce, blocked, format = "standard", counts_mat = flow_counts
  )
  NULL
}, error = conditionMessage)
stopifnot(!is.null(blocked_message), grepl("explicitly accepting their omission", blocked_message))
allowed <- tempfile(fileext = ".xml")
suppressWarnings(export_gatingml_to_cytobank(
  quadrant_gates, names(quadrant_gates), quadrant_pops, quadrant_root$population_id,
  flow_sce, allowed, format = "standard", counts_mat = flow_counts,
  allow_quadrant_omission = TRUE
))
allowed_parsed <- import_gatingml_from_cytobank(
  allowed, flow_channels, setNames(as.list(flow_channels), flow_channels)
)
allowed_names <- vapply(allowed_parsed$populations, `[[`, character(1), "name")
stopifnot(!any(grepl("^Quadrant", allowed_names)))

unlink(c(flow_out, cytof_out, blocked, allowed))
