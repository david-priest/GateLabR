# GateLabR — dependency installer
# Run this script once before launching the app for the first time.
# Source it with: source("path/to/GateLabR/install_dependencies.R")

# ── CRAN packages ─────────────────────────────────────────────────────────────
cran_pkgs <- c(
  "shiny",      # web application framework
  "DT",         # interactive data tables
  "jsonlite",   # JSON serialisation (workspace save/load)
  "base64enc",  # base64 encoding (GatingML export)
  "uuid",       # unique gate/population IDs
  "sp",         # polygon point-in-polygon (polygon gates)
  "gridSVG",    # SVG export with proper group structure for Illustrator
  "png"         # raster data layer in SVG export
)

# ── Bioconductor packages ─────────────────────────────────────────────────────
bioc_pkgs <- c(
  "SingleCellExperiment",  # core data structure
  "SummarizedExperiment",  # SCE base class
  "S4Vectors",             # metadata containers
  "flowCore",              # FCS file import / export
  "xml2"                   # GatingML XML parsing
)

# ── Install missing CRAN packages ─────────────────────────────────────────────
missing_cran <- cran_pkgs[!vapply(cran_pkgs, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_cran) > 0) {
  message("Installing CRAN packages: ", paste(missing_cran, collapse = ", "))
  install.packages(missing_cran)
} else {
  message("All CRAN packages already installed.")
}

# ── Install missing Bioconductor packages ─────────────────────────────────────
missing_bioc <- bioc_pkgs[!vapply(bioc_pkgs, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_bioc) > 0) {
  if (!requireNamespace("BiocManager", quietly = TRUE)) install.packages("BiocManager")
  message("Installing Bioconductor packages: ", paste(missing_bioc, collapse = ", "))
  BiocManager::install(missing_bioc)
} else {
  message("All Bioconductor packages already installed.")
}

message("\nDone. You can now launch the app — see README or the instructions below.")
