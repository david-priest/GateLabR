# GateLabR

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20404387.svg)](https://doi.org/10.5281/zenodo.20404387)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Interactive manual gating for `SingleCellExperiment` objects in R / Shiny.**

GateLabR is a desktop-style Shiny application for hand-gating flow cytometry
and mass cytometry (CyTOF) data directly on
[`SingleCellExperiment`](https://bioconductor.org/packages/SingleCellExperiment/)
objects. It slots into Bioconductor-based analysis pipelines (e.g. CATALYST,
diffcyt) where the events already live in R as an SCE and you want a fast,
reproducible alternative to round-tripping through FlowJo or Cytobank just to
draw a few gates.

Gates are drawn on an interactive D3.js canvas, and gates, populations, scales
and illustration settings are persisted inside the SCE itself via `metadata()`,
so loading the SCE again restores the entire workspace.

## Features

- **Draw and edit gates interactively.** Polygon and rectangle gates on any
  pair of channels, with click-and-drag vertex editing, snap-to-grid, undo /
  redo, and per-gate colour and label.
- **Boolean population trees.** Build hierarchies of populations from gate
  references with AND / OR logic; counts and percentages update live.
- **Flow and CyTOF modes.** Auto-detects the instrument type from channel
  names. Flow uses per-channel logicle for fluorescence and arcsinh for
  FSC / SSC scatter, with editable W and cofactor; CyTOF channels use arcsinh
  (cofactor 5).
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

1. Get your events into the app, either way:
   - **Import `.fcs` files** directly in the app — it builds the SCE and
     auto-detects flow vs CyTOF (and the per-channel transforms).
   - Or **load an existing `SingleCellExperiment`** — e.g. from CATALYST
     `prepData()` (CyTOF) or one you've built from `flowCore` / your own
     pipeline.
2. `launchGatingApp()` (then pick a loaded SCE or Import FCS), or
   `launchGatingApp(sce)` to start from an object already in your session.
3. Draw gates on the central plot; the gate list and population tree update
   live.
4. Build populations by referencing gates with AND / OR logic.
5. Export results for downstream work — populations as new `colData` columns
   on the SCE (`Export Population`, e.g. for `diffcyt`, `CATALYST`, or any
   SCE-aware analysis), or gated events back out as `.fcs`.
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
the Immunology Frontier Research Center (IFReC), Osaka University.

Built on top of the Bioconductor stack
(`SingleCellExperiment`, `SummarizedExperiment`, `flowCore`), the
[Shiny](https://shiny.posit.co/) web framework, and
[D3.js](https://d3js.org/) for the interactive plot.

## Issues and contributions

If you run into a bug, or there's a feature you'd find useful, please
[open an issue](https://github.com/david-priest/GateLabR/issues) or get in
touch — I'm happy to take a look and would be glad to implement it.

**A note on `.fcs` import:** import has been thoroughly tested on files from a
BD spectral flow cytometer, but not yet on files from other vendors (Beckman
Coulter, Cytek, Sony, Thermo, Miltenyi, …). Channel and instrument detection
is designed to be vendor-agnostic, but if a file imports incorrectly — missing
markers, wrong channels, or a mis-detected flow/CyTOF mode — please let me
know (ideally with the file's channel names) and I'll get it sorted.
