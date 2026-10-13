# Getting started with GateLabR

GateLabR is a desktop-style Shiny app for **hand-gating flow and mass
cytometry (CyTOF) data directly on `SingleCellExperiment` objects** — a
free, MIT-licensed alternative to round-tripping through Cytobank or
FlowJo. Gates, populations, scales and figure settings live inside the
object’s `metadata()`, so your gated data *is* the record.

> 📸 *Screenshot: the full app with the gating biplot in the centre,
> gate/population lists on the right.* — add `man/figures/overview.png`

## 1. Install and launch

Install once as a package (Bioconductor dependencies are resolved
automatically; install `BiocManager` first if you don’t have it):

``` r

# install.packages(c("remotes", "BiocManager"))
remotes::install_github("david-priest/GateLabR")
library(GateLabR)
launchGatingApp()
```

Or run from a clone:

``` r

source("path/to/GateLabR/launch.R")
launchGatingApp()
```

[`launchGatingApp()`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
prints which copy it’s launching (installed package vs source clone). It
opens in your browser.

## 2. Get your data in

GateLabR opens on an R object, not on FCS files: a
`SingleCellExperiment` or a flowWorkspace `GatingSet`. Pass the object,
or call
[`launchGatingApp()`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
with no argument to pick from the SCEs in your session.

``` r

launchGatingApp(my_sce)          # a SingleCellExperiment
launchGatingApp(my_gs)           # a flowWorkspace GatingSet
launchGatingApp()                # pick from the SCEs in your session
```

A CyTOF `SingleCellExperiment` comes from CATALYST’s `prepData()`. FCS
files from a flow cytometer are assembled into either object with
flowCore and flowWorkspace:

``` r

library(flowCore)
library(flowWorkspace)
fs <- read.flowSet(path = "fcs/", pattern = "\\.fcs$", truncate_max_range = FALSE)

# A GatingSet keeps the files' events on disk, compensated and transformed in place.
# Compensate before transforming: a GatingSet cannot be uncompensated.
gs <- GatingSet(fs)
compensate(gs, spillover(fs[[1]])$SPILL)                # the matrix the files record
fluor <- grep("-A$", colnames(gs), value = TRUE)
fluor <- setdiff(fluor, grep("^(FSC|SSC)", fluor, value = TRUE))
transform(gs, estimateLogicle(gs[[1]], fluor))          # logicle per channel, W from the data
launchGatingApp(gs)

# A SingleCellExperiment holds the events as columns and the channels as rows. Keep the
# uncompensated values as `counts`; GateLabR compensates in the app and stores the result as
# a second assay.
library(SingleCellExperiment)
events <- do.call(rbind, lapply(seq_along(fs), function(i) exprs(fs[[i]])))
sample_id <- rep(sampleNames(fs), fsApply(fs, nrow))
sce <- SingleCellExperiment(
  assays = list(counts = t(events)),
  colData = DataFrame(sample_id = sample_id),
  rowData = DataFrame(channel_name = colnames(events),
                      marker_name = unname(markernames(fs[[1]])[colnames(events)]))
)
metadata(sce)$spillover <- spillover(fs[[1]])$SPILL     # offered in the Compensation tab
launchGatingApp(sce)
```

On a `GatingSet`, the hierarchy it holds opens as the app’s gates, drawn
in the transformed space the object evaluates them in, and “Save to
GatingSet” writes the populations back to the hierarchy in place (see
[`?launchReactGateLab`](https://david-priest.github.io/GateLabR/reference/launchReactGateLab.md)).
On an SCE, flow data is drawn on a per-channel **logicle** for
fluorescence and linear scatter (editable W and cofactor); CyTOF uses
arcsinh (cofactor 5).

## 3. The layout

| Panel | Contents |
|----|----|
| Left | Sample filter, scale controls, FCS / GatingML / workspace import-export, UMAP |
| Centre | Interactive plot — tabs: **Gating · Strategy · Illustration · Statistics · Panel** |
| Right | Gates list, population tree, bulk-rename |

## 4. Draw gates

On the **Gating** tab, pick the X/Y channels (click the axis labels) and
choose a tool from the toolbar:

- **Rect** — drag a rectangle.
- **Poly** — click vertices; click the first point (or near it) to
  close.
- **Quad** — click once to drop a **quadrant** crosshair (see below).

Drag a vertex to adjust it; a live `x, y` readout follows the cursor.
Gates get a name and an optional population on creation.

> 📸 *Screenshot: a polygon gate being drawn, with the live vertex
> readout.* — add `man/figures/draw-gate.png`

## 5. Build populations

Populations are boolean combinations of gates (AND / OR, include /
exclude), shown as a tree on the right with live counts and percentages.
Click a population to make it active (blue) and gate within it; the
biplot and counts follow.

Tips:

- **Arrow keys** move the active population up/down the list.
- The **left-column checkboxes** let you display *several* populations’
  events at once (a banner tells you which are shown); clicking a gate
  badge outlines that gate in every population it appears in.

> 📸 *Screenshot: the population tree with a small hierarchy and live
> counts.* — add `man/figures/population-tree.png`

## 6. Quadrant gates

The **Quad** tool drops a crosshair that splits the X/Y plane into four
populations at once (e.g. `CD4- CD8+`, `CD4+ CD8+`, `CD4+ CD8-`,
`CD4- CD8-`), each labelled with its count and %. Drag the centre to
move all four together; deleting the quadrant gate removes its four
populations (and vice-versa).

> 📸 *Screenshot: a quadrant gate with the four corner counts.* — add
> `man/figures/quadrant.png`

## 7. Compensation (flow)

For conventional flow data carrying a spillover matrix, toggle **Apply
compensation** to linearly compensate fluorescence channels from the
embedded `$SPILLOVER`. (CyTOF and pre-compensated/spectral data don’t
need it.)

On a `SingleCellExperiment` the matrix lives in
`metadata(sce)$spillover`, a numeric matrix with the source channels as
row names and the receiver channels as column names, as
[`flowCore::spillover()`](https://rdrr.io/pkg/flowCore/man/flowFrame-class.html)
returns it; that is the one documented name, read first (the older
`spillover_matrix`, `spilloverMatrix` and `sm` are still read after it);
a matrix applied in the app is kept with the workspace record, not
written back to this slot. A `GatingSet` carries its applied matrix
itself
([`gh_get_compensations()`](https://rdrr.io/pkg/flowWorkspace/man/gh_get_compensations.html)).

> 📸 *Screenshot: the compensation toggle + matrix viewer.* — add
> `man/figures/compensation.png`

## 8. Figures: Strategy & Illustration

- **Strategy** lays out your gating hierarchy as a multi-panel figure.
- **Illustration** renders a grid of biplots/histograms across
  populations and channels — including a **stacked ridgeline** mode with
  a black→yellow heat-gradient fill, adjustable overlap and column
  spacing. The **Heatmap** option summarizes median or mean transformed
  expression for each selected population (rows) and channel (columns),
  with no scaling, per-channel or per-population 0–1 scaling, or
  per-channel z-scores; black→yellow, viridis and blue→white→yellow→red
  palettes are available.

Both export to **SVG** (vector, Illustrator-friendly) and **PNG**.

> 📸 *Screenshot: a ridgeline illustration across markers.* — add
> `man/figures/ridgeline.png`

## 9. Export & persistence

- **Populations → `colData`** (`Export Population`) for downstream
  `diffcyt`, `CATALYST`, or any SCE-aware analysis.
- **FCS export** of gated events (defaults to the raw counts assay).
- **Gating-ML 2.0** import/export to exchange gates with Cytobank.
  FlowJo does not read Gating-ML; it uses its own `.wsp` format.
- **Workspace** is embedded in `metadata(sce)$gatelab_workspace`, with a
  `metadata(sce)$gating_workspace` mirror kept for the previous
  interface; [`saveRDS()`](https://rdrr.io/r/base/readRDS.html) the
  object (or export a portable `.rds`) and re-loading restores
  everything.
- **Axes** are kept on the rows: `rowData(sce)$gatelab_transform` holds
  the transform each channel was drawn on at the last save
  (`gatelabTransforms(sce)` reads it), as a GatingSet keeps its
  transforms with its data.

``` r

saveRDS(sce, "gated.rds")   # gates, populations, scales — all preserved
```

## 10. For flowWorkspace and openCyto users

A `GatingSet` is gated in the same app, and everything stays in
flowWorkspace’s terms. The hierarchy the object holds opens as the app’s
gates, each evaluated in the transformed space the object evaluates it
in (logicle, FlowJo’s biexponential and log, arcsinh), with the same
counts; the matrix the object carries is shown;
[`pData()`](https://rdrr.io/pkg/Biobase/man/phenoData.html) columns are
the sample metadata and colour the plots. “Save to GatingSet” writes the
populations back to the hierarchy, in place, and
[`save_gs()`](https://rdrr.io/pkg/flowWorkspace/man/save_gs.html) keeps
them.

``` r

library(flowWorkspace)
gs <- load_gs("gated/")                        # or CytoML::flowjo_to_gatingset(ws, name = 1),
                                               # cytobank_to_gatingset(...), or a GatingSet(fs)
                                               # you compensated and transformed yourself
launchGatingApp(gs)                            # draw, then "R host ▸ Save to GatingSet"

gs_get_pop_paths(gs)                           # the tree, the app's populations included
gh_pop_get_count(gs[[1]], "/Lymphocytes/CD4")  # counts as flowWorkspace computes them
gh_pop_get_gate(gs[[1]], "/Lymphocytes/CD4")   # a rectangleGate, polygonGate or ellipsoidGate
ggcyto::autoplot(gs[[1]], "/Lymphocytes/CD4")  # drawn by ggcyto as any other node
gatelabPopulations(gs)                         # or the GateLabR readers, as for an SCE
save_gs(gs, "gated/")                          # the hierarchy and the GateLab record together
```

What to expect:

- A rectangle drawn in the app returns as a `rectangleGate` whatever the
  axes’ transforms; a polygon or ellipse returns as its gate when it was
  drawn in the object’s own transform space (the app’s axes take the
  object’s transforms at the first open, so this is the usual case on a
  logicle or arcsinh object). A quadrant, a population excluding a gate,
  or a polygon drawn in another space returns as its exact per-sample
  membership: a `booleanFilter`-class node that
  [`gh_pop_get_indices()`](https://rdrr.io/pkg/flowWorkspace/man/gh_pop_get_indices.html)
  reads like any other, with GateLab’s count. The console says which
  populations went which way.
- Every gate written is recomputed by flowWorkspace and compared with
  the app’s membership; one that selects other events is replaced by the
  membership, so a node never holds different events in R than it showed
  in the app.
- The object is modified in place, as
  [`gs_pop_add()`](https://rdrr.io/pkg/flowWorkspace/man/gs_pop_add.html)
  modifies it. A matrix applied in the app’s Compensation tab is applied
  with
  [`flowWorkspace::compensate()`](https://rdrr.io/pkg/flowCore/man/compensation-class.html),
  in place and to the whole object, when the object is writable,
  uncompensated and untransformed — the uncompensated values are then
  gone from it, as after
  [`compensate()`](https://rdrr.io/pkg/flowCore/man/compensation-class.html)
  at the prompt. A `GatingSet` from
  [`load_gs()`](https://rdrr.io/pkg/flowWorkspace/man/save_gs.html) is
  read-only on its data, and compensation precedes transformation, so
  for those compensate in R before launching; the app says which
  applies.
- A FlowJo-derived object’s biexponential channels open on FlowJo’s
  biexponential at the object’s parameters (the Scales tab offers it
  beside logicle and arcsinh), built from cytolib’s own table, so the
  axis and the gates are flowWorkspace’s to five thousandths of a
  channel.
- Only the active tree is written to the hierarchy; parked hierarchies
  stay in the GateLab record (the `GATELAB_WORKSPACE` keyword on every
  sample).

The other direction is
[`gatelabGatingSet()`](https://david-priest.github.io/GateLabR/reference/gatelabGatingSet.md):
an SCE gated in the app becomes a `GatingSet`, its samples as cytoframes
from the assay the workspace was drawn on, its channels on the
transforms the object states, and every population of the active
hierarchy written as “Save to GatingSet” writes them, so flowWorkspace
recomputes the gates, `ggcyto` draws them and CytoML exports them. The
GateLab record goes along as the keyword, so
[`launchGatingApp()`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
on the result opens the same workspace.

``` r

gs <- gatelabGatingSet(sce)                    # after "Save to SCE"
gs_get_pop_paths(gs)                           # the SCE's populations as nodes
gatelabPopulations(gs)                         # the same memberships as gatelabPopulations(sce)
save_gs(gs, "from-sce/")
```

## Feedback

Found a bug or want a feature? Please [open an
issue](https://github.com/david-priest/GateLabR/issues) — contributions
and suggestions are very welcome.
