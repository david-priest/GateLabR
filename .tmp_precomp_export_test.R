library(SingleCellExperiment)
library(S4Vectors)
source("R/models.R")
source("R/gate_engine.R")
source("R/fcs_export.R")

set.seed(42)
mat <- matrix(rexp(1000), nrow = 10, ncol = 100)
rownames(mat) <- paste0("ch", seq_len(nrow(mat)))
colnames(mat) <- paste0("cell", seq_len(ncol(mat)))
sce <- SingleCellExperiment(assays = list(exprs = mat))
SummarizedExperiment::colData(sce) <- S4Vectors::DataFrame(sample_id = rep(c("S1", "S2"), each = 50))

root <- new_population("All", gate_refs = list(), parent_id = NULL)
pops <- list()
pops[[root$population_id]] <- root

mask_list <- list()
mask_list[[root$population_id]] <- rep(TRUE, ncol(sce))

tmp <- tempfile("fcs_precomp_")
dir.create(tmp)
out <- export_population_as_fcs(
  sce = sce,
  population_id = root$population_id,
  populations = pops,
  gates = list(),
  root_population_id = root$population_id,
  output_dir = tmp,
  split_by_sample = TRUE,
  precomputed_masks = mask_list
)

cat("files_written=", length(out), "\n", sep = "")
cat("all_exist=", all(file.exists(out)), "\n", sep = "")
