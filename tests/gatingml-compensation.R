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

expect_error_matching <- function(expr, pattern) {
  msg <- tryCatch({ force(expr); NULL }, error = conditionMessage)
  stopifnot(!is.null(msg), grepl(pattern, msg))
}

set.seed(42)
channels <- c("FSC-A", "SSC-A", "PE-A", "APC-A")
counts <- cbind(
  `FSC-A` = runif(250, 10000, 100000),
  `SSC-A` = runif(250, 5000, 90000),
  `PE-A` = rnorm(250, 1200, 500),
  `APC-A` = rnorm(250, 900, 400)
)
spill <- matrix(c(1, 0.123456789012345, 0.0412345678901234, 1), nrow = 2L, byrow = TRUE,
                dimnames = list(c("PE-A", "APC-A"), c("PE-A", "APC-A")))
comp_counts <- compensate_matrix(counts, spill)

sce <- SingleCellExperiment::SingleCellExperiment(
  assays = list(counts = t(counts), exprs = t(counts))
)
rownames(sce) <- channels
S4Vectors::metadata(sce)$instrument_type <- "flow"
S4Vectors::metadata(sce)$cofactor <- 5
S4Vectors::metadata(sce)$channel_to_pnn <- setNames(as.list(channels), channels)

scatter <- new_gate(
  "Cells", "rectangle", "FSC-A", "SSC-A",
  list(c(15000, 10000), c(85000, 10000), c(85000, 80000), c(15000, 80000))
)
fluor <- new_gate(
  "PE APC", "polygon", "PE-A", "APC-A",
  list(c(-300, -300), c(2500, -300), c(2500, 2200), c(-300, 2200))
)
gates <- setNames(list(scatter, fluor), c(scatter$gate_id, fluor$gate_id))
gate_order <- names(gates)
root <- new_root_population(nrow(counts))
pop1 <- new_population("Cells", list(new_gate_ref(scatter$gate_id)), root$population_id)
pop2 <- new_population("PE APC", list(new_gate_ref(fluor$gate_id)), pop1$population_id)
populations <- setNames(list(root, pop1, pop2),
                        c(root$population_id, pop1$population_id, pop2$population_id))
populations <- link_child_to_parent(populations, pop1$population_id, root$population_id)
populations <- link_child_to_parent(populations, pop2$population_id, pop1$population_id)

out <- tempfile(fileext = ".xml")
export_gatingml_to_cytobank(
  gates, gate_order, populations, root$population_id, sce, out,
  format = "standard", counts_mat = comp_counts,
  compensation_on = TRUE, spillover_matrix = spill
)
xml <- paste(readLines(out, warn = FALSE), collapse = "\n")
stopifnot(grepl('compensation-ref="FCS"', xml, fixed = TRUE))
stopifnot(grepl('compensation-ref="uncompensated"', xml, fixed = TRUE))

parsed <- import_gatingml_from_cytobank(out, channels, setNames(as.list(channels), channels))
stopifnot(isTRUE(parsed$compensation$enabled))
stopifnot(identical(parsed$compensation$channels, c("PE-A", "APC-A")))
stopifnot(isTRUE(all.equal(unname(parsed$compensation$matrix), unname(spill), tolerance = 1e-12)))
stopifnot(setequal(parsed$compensation_refs, c("FCS", "uncompensated")))
resolution <- resolve_gatingml_compensation(
  parsed$compensation, parsed$compensation_refs, TRUE, spill
)
stopifnot(identical(resolution$target, TRUE), !isTRUE(resolution$requires_confirmation))

mismatch <- spill
mismatch[1, 2] <- mismatch[1, 2] + 0.01
expect_error_matching(
  resolve_gatingml_compensation(parsed$compensation, parsed$compensation_refs, TRUE, mismatch),
  "different FCS spillover matrix"
)

third_party_doc <- xml2::read_xml(out)
xml2::xml_remove(xml2::xml_find_first(
  third_party_doc, ".//*[local-name()='gatelabr_scales']"
))
third_party <- tempfile(fileext = ".xml")
xml2::write_xml(third_party_doc, third_party)
third_parsed <- import_gatingml_from_cytobank(
  third_party, channels, setNames(as.list(channels), channels)
)
third_resolution <- resolve_gatingml_compensation(
  third_parsed$compensation, third_parsed$compensation_refs, TRUE, spill
)
stopifnot(is.null(third_parsed$compensation))
stopifnot(identical(third_resolution$target, TRUE),
          isTRUE(third_resolution$requires_confirmation))

off <- tempfile(fileext = ".xml")
export_gatingml_to_cytobank(
  gates, gate_order, populations, root$population_id, sce, off,
  format = "standard", counts_mat = counts,
  compensation_on = FALSE, spillover_matrix = spill
)
off_xml <- paste(readLines(off, warn = FALSE), collapse = "\n")
stopifnot(!grepl('compensation-ref="FCS"', off_xml, fixed = TRUE))
off_parsed <- import_gatingml_from_cytobank(off, channels, setNames(as.list(channels), channels))
stopifnot(identical(off_parsed$compensation$enabled, FALSE))
stopifnot(identical(off_parsed$compensation_refs, "uncompensated"))

contradictory <- tempfile(fileext = ".xml")
writeLines(sub(
  'compensation-ref="uncompensated"', 'compensation-ref="FCS"',
  readLines(off, warn = FALSE), fixed = TRUE
), contradictory)
contradictory_parsed <- import_gatingml_from_cytobank(
  contradictory, channels, setNames(as.list(channels), channels)
)
expect_error_matching(
  resolve_gatingml_compensation(
    contradictory_parsed$compensation,
    contradictory_parsed$compensation_refs,
    TRUE,
    spill
  ),
  "contradicts"
)

unlink(c(out, third_party, off, contradictory))
