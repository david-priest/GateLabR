# GateLabR

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20404387.svg)](https://doi.org/10.5281/zenodo.20404387)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Interactive manual gating for `SingleCellExperiment` objects in R / Shiny.**

GateLabR is a desktop-style Shiny application for hand-gating mass cytometry
(CyTOF) and flow cytometry data directly on
[`SingleCellExperiment`](https://bioconductor.org/packages/SingleCellExperiment/)
objects. It is designed to slot into Bioconductor-based analysis pipelines
(e.g. CATALYST, diffcyt) where the events live in R as an SCE and you want a
fast, reproducible alternative to round-tripping through Cytobank or FlowJo
just to draw a few gates.

The interactive plot is rendered with D3.js for responsive zoom / pan and
on-canvas gate drawing; gates, populations, scales and illustration settings
are persisted inside the SCE itself via `metadata()`, so loading the SCE again
restores the entire workspace.

## Features

- **Draw and edit gates interactively.** Polygon and rectangle gates on any
  pair of channels, with click-and-drag vertex editing, snap-to-grid, undo /
  redo, and per-gate colour and label.
- **Boolean population trees.** Build hierarchies of populations from gate
  references with AND / OR logic; counts and percentages update live.
- **CyTOF and flow modes.** Auto-detects the instrument type from channel
  names. CyTOF channels use arcsinh (cofactor 5); flow uses per-channel
  logicle for fluorescence and arcsinh for FSC / SSC scatter, with editable W
  and cofactor.
- **Cytobank-compatible Gating-ML 2.0 import / export.** Round-trip gates
  through Cytobank, FlowJo and other ISAC-compliant tools.
- **Workspace persistence.** Gates, populations, scales and illustration
  settings are saved inside the SCE (`metadata(sce)$gating_workspace`) and
  re-loaded automatically.
- **FCS export.** Export gated populations as FCS files, optionally split by
  `sample_id`.
- **Sample filter and multi-sample overlay.** Filter by any `colData` column
  and overlay multiple samples with distinct colours.
- **Statistics tab.** Per-population, per-channel summary stats (count,
  % parent / total, median, mean, geometric mean, SD, CV) exportable to CSV.
- **UMAP tab.** Overlay any populations on a precomputed UMAP and export as
  SVG / PDF.
- **Figure export.** Strategy and Illustration tabs render publication-style
  multi-panel grids; SVG export uses `gridSVG` to produce Adobe Illustrator-
  friendly grouped vector files (rasterised data, vector axes / gates /
  labels).

## Installation

GateLabR is a Shiny project, not an installed R package. Clone the repository
and install dependencies once:

```r
# 1. Clone or download the repository
#    git clone https://github.com/david-priest/GateLabR.git

# 2. From an R session, install dependencies (CRAN + Bioconductor)
source("path/to/GateLabR/install_dependencies.R")
```

The installer pulls these packages:

- **CRAN:** `shiny`, `DT`, `jsonlite`, `base64enc`, `uuid`, `sp`, `gridSVG`,
  `png`
- **Bioconductor:** `SingleCellExperiment`, `SummarizedExperiment`,
  `S4Vectors`, `flowCore`, `xml2`

R ≥ 4.2 and Bioconductor ≥ 3.16 are recommended.

## Quick start

```r
# Source the launcher
source("path/to/GateLabR/launch.R")

# Option A: launch and pass an existing SCE
launchGatingApp(my_sce)

# Option B: launch with no SCE — the app scans the global environment
#           and lets you pick from any SingleCellExperiment objects present
launchGatingApp()
```

The app opens in your default browser. The three-column layout is:

| Panel | Content |
|------|---------|
| Left | Sample filter, scale controls, FCS / GatingML / workspace import-export, UMAP |
| Centre | Interactive plot (tabs: Gating &#124; Strategy &#124; Illustration &#124; Statistics &#124; Panel) |
| Right | Gates list, population tree, bulk-rename controls |

### Typical workflow

1. Load an SCE into your R session (e.g. from CATALYST `prepData()`).
2. `launchGatingApp(sce)`.
3. Draw gates on the central plot; the gate list and population tree update
   live.
4. Build populations by referencing gates with AND / OR logic.
5. Optionally export populations as new `colData` columns on the SCE
   (`Export Population` button) for downstream analysis with `diffcyt`,
   `CATALYST::plotAbundances`, etc.
6. Save the SCE (e.g. `saveRDS(sce, "gated.rds")`) — the workspace is embedded
   in `metadata()` and reloaded next time.

## Data persistence

GateLabR stores its state inside the SCE itself:

```r
metadata(sce)$gating_workspace
#> $gates             — list of gate objects
#> $populations       — list of population objects (hierarchy)
#> $gate_order        — display order
#> $root_population_id
#> $global_scale_ranges, $cytof_axis_range, $illust_settings, ...
```

You can also export a portable workspace as a standalone `.rds` (`Save
Workspace` button) and load it into a different SCE — channels are matched by
name, missing ones are skipped with a warning.

## File formats supported

- **Input:** FCS 3.0 / 3.1, Cytobank Gating-ML 2.0 XML, workspace `.rds`.
- **Output:** FCS, Gating-ML 2.0 (Cytobank-compatible *or* standard
  re-importable), workspace `.rds`, SCE `.rds` (with embedded workspace),
  per-population colData columns, CSV statistics, SVG / PDF figures.

## Citation

If you use GateLabR in published work, please cite the Zenodo archive:

> Priest, D. G. (2026). *GateLabR: Interactive manual gating for
> SingleCellExperiment objects.* Version 1.0.0. Zenodo.
> https://doi.org/10.5281/zenodo.20404387

BibTeX:

```bibtex
@software{priest_gatelabr_2026,
  author    = {Priest, David G.},
  title     = {GateLabR: Interactive manual gating for SingleCellExperiment objects},
  year      = {2026},
  version   = {1.0.0},
  doi       = {10.5281/zenodo.20404387},
  url       = {https://github.com/david-priest/GateLabR},
  publisher = {Zenodo}
}
```

GitHub's "Cite this repository" button (powered by [`CITATION.cff`](CITATION.cff))
renders formatted citations in several styles.

## License

MIT — see [`LICENSE`](LICENSE).

## Acknowledgements

GateLabR is developed in the [Wing Lab](https://www.ifrec.osaka-u.ac.jp/) at
the Immunology Frontier Research Center (IFReC), Osaka University. The
interaction model was prototyped in an earlier Python / Dash app
(`cytof-gating`) and ported to R / Shiny on `SingleCellExperiment` to fit
Bioconductor workflows.

Built on top of the Bioconductor stack
(`SingleCellExperiment`, `SummarizedExperiment`, `flowCore`), the
[Shiny](https://shiny.posit.co/) web framework, and
[D3.js](https://d3js.org/) for the interactive plot.

## Issues and contributions

Bug reports and feature requests:
[GitHub issues](https://github.com/david-priest/GateLabR/issues).
