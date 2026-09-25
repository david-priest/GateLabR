# GateLabR 1.4.8

- Population memberships follow the events, not their positions. "Save to SCE" now writes each event's id to `colData(sce)$gatelab_event_id`, and `gatelabPopulations()`, `gatelabLeafPopulation()` and `gatelabHierarchy()` find every event's saved membership through it. The stored bitsets used to be read by position, with only the column count compared, so a reordered SCE read other events' memberships with no error; so did two events of one sample swapping places in an object without column names, which is how CATALYST's `prepData()` builds one. A subset now reads the memberships of the events it kept, and an object that repeats saved events reads each copy's own.
- An event that cannot be traced to the save is refused rather than guessed: one added by `cbind()` from another object, one in an object whose `gatelab_event_id` column was removed, or one whose id lost precision, by passing through a 32-bit float as an FCS channel does or by being written with fewer than 15 significant digits. Every id a save writes is odd, and an id that loses precision becomes even, so it is never read as another event's id.
- `cbind()` needs `gatelab_event_id` on both objects. Give the object that lacks it the column as `NA` (`other$gatelab_event_id <- NA_real_`) rather than dropping it from the saved one; the saved events then read again once the combined object is subset back to them. A cbind of two separately saved SCEs is refused until it is subset back to the events of one save, which then read that save's memberships, or until "Save to SCE" is pressed on the combined object; that save now replaces the records `cbind()` kept from both. The memberships are read from whichever record `cbind()` kept them in, so a saved object combined after one that was never saved with memberships reads as it does in the other order, where it had been refused as holding none.
- Memberships saved by 1.4.6 or 1.4.7 carry no event ids and are refused until "Save to SCE" is pressed again.
- A population can now arrive from GateLab as not evaluated for a file: the tree that file is gated under, a copy whose structure was changed, has no counterpart for it, so GateLab sends no bits for the file's events and a note naming the file, the population and the file's tree. GateLabR refused such a mask as a short payload ("Population membership payload has 0 bytes"), which failed the whole "Save to SCE" or colData export. The file's events are now `NA` in that population, never `FALSE`: in the stored memberships, so `gatelabPopulations()` returns `NA` and `gatelabLeafPopulation()` returns `NA` for an event whose deepest population it could be; and in an exported `colData` column, under neither label. The save, the export and every read that returns such an `NA` warn with the note. `gatelabHierarchy()` counts only the events a population was evaluated for. This prepares GateLabR for the next GateLab embed, whose host sends these masks.
- The sample metadata sent to the app keeps `colData` names exactly. The partition converted `colData` with `as.data.frame()`, which runs `make.names()`, so a column GateLab had written under a population's own name, such as `CD4-CD8+ T cells`, reached the app as `CD4.CD8..T.cells`, a field no `colData` column has, and a second such name as `CD4.CD8..T.cells.1`.
- A workspace GateLab saves as version 4 is stored. GateLab writes version 4, the version 2 layout with a list of `requiredFeatures`, for a workspace holding something an older GateLab would read wrongly: a polygon on FlowJo's gate grid, a biex axis on FlowJo's 4,096-channel table, a file compensated with a matrix a FlowJo workspace supplied, or a half-open rectangle, which every rectangle drawn in the next GateLab is. GateLabR stored versions 2 and 3 only, so "Save to SCE" and every autosave of such a workspace would have been refused. The JSON is stored as GateLab wrote it, and the `metadata(sce)$gating_workspace` mirror now keeps each gate's edge rule (`bounds`) and the FlowJo definition a gate imported from a FlowJo workspace carries (`flowjo_vertices`, `flowjo_axes`, `flowjo_bounds`, `flowjo_polygon`), so a half-open rectangle reloaded from the mirror alone no longer counts an event on its upper edge. A workspace R writes for the app, the mirror among them, is now written with 17 significant digits, which name every double exactly. It was written with 15, so the largest double, which GateLab writes for an unbounded edge, became `1.79769313486232e+308`, a number both R and JavaScript read as infinite: GateLab refused every gate with an open edge reloaded from the mirror alone, and a vertex or transform parameter needing 16 or 17 digits came back as another number. A workspace's version must be the number 2, 3 or 4: it was read with `as.integer()`, so 4.5 and the string `"4"` were stored as version 4, and 2.5 and 3.5 as versions 2 and 3. This prepares GateLabR for the next GateLab embed.
- Channel identities are read from `rowData` columns named `$pnn` and `$pns`. `rowData` was converted with `as.data.frame()`, which renamed them `X.pnn` and `X.pns`, so they were never found: the channels reached the app without their $PnN and $PnS, and instrument detection lost the $PnN evidence.
- The `metadata(sce)$gating_workspace` mirror now keeps each gate's coordinate space and transforms. On a flow object, a workspace reloaded from the mirror alone, with no canonical record, read an ellipse, a gate drawn in display space and a FlowJo biex or log gate as raw values, so the gate selected other events. The mirror of an object whose instrument GateLabR cannot tell from its channels or metadata no longer declares one space for all its gates: the core, which gates such an object as flow unless its channels say otherwise, took that declaration as a reason to convert every gate, including those whose own space it had just been given, so display-space rectangles and polygons reloaded from the mirror selected no events.
- The README now describes the Gating-ML importer that `launchGatingApp()` runs, which is the embedded GateLab core's and not the retired R one: it reads rectangle, range, polygon and ellipse gates and AND populations, and refuses OR populations. It reads a population's excluded gate only in the form GateLab writes, `gating:complement="true"`, which is outside the Gating-ML 2.0 schema; a reference carrying the schema's `gating:use-as-complement="true"` is imported as an included gate, with no warning, so a population that excludes a gate is not claimed to cross to Cytobank.

# GateLabR 1.4.7

- The embedded GateLab core is 0.7.7 (GateLab master at 7b99de0), up from the 0.7.6 build. The change that matters for an SCE is that samples can now be selected by their `colData`. GateLabR already collapsed every column constant within a sample and sent one value per sample; the samples panel now draws those as a row of value chips per column, so a sixty-sample object is picked over by donor, condition or batch rather than by hunting through sixty checkboxes.
- A chip is a bulk checkbox over the checked set rather than a filter: clicking one checks every sample carrying that value, or unchecks them when they are all checked already, and a partly checked chip is filled to the fraction that is checked. The sample list itself is never narrowed.
- Each chip row carries a padlock. Holding one row fixed bounds every later chip click to the samples that row holds, so a cell type can be held while the stimulation is switched — which the chips alone cannot express, since a checked set does not record why the other files are out. What is held is written on the row, because the checked set feeds the pooled display, Statistics and Proportions.
- A `colData` column without a value for every sample is not treated as sample metadata. A gate written back into `colData` is per-event, so it reaches the app only for samples whose events were entirely `TRUE` or entirely `FALSE`; such a column is kept out of the automatic chip rows and, where it is chosen by hand, marked with the number of samples it actually reaches.
- Also from the core: files can be assigned per hierarchy, marked by a numbered colour badge, and a FlowJo workspace import now brings in every tree rather than the first.

# GateLabR 1.4.6

- "Save to SCE" now stores which events every population holds, for every hierarchy, beside the workspace in `metadata(sce)$gatelab_workspace$memberships`, as one packed bitset per population. Four functions read it back without re-gating in R: `gatelabHierarchies()`, `gatelabHierarchy()` (one row per population with parent, depth, path, gates and count), `gatelabPopulations()` (a logical events-by-populations matrix) and `gatelabLeafPopulation()` (each event's deepest population as a factor, or "ungated"). The memberships remember the workspace revision they were computed at; after an autosave has moved the workspace on they are refused until the next explicit save, unless `allow_stale = TRUE`. Reading them on a subset SCE is refused, since the masks assume the original event order.
- "Colour by" now offers the SCE's categorical `colData` columns: any factor, character or logical column with at most 254 levels, such as a FlowSOM or CATALYST merge level, so cluster composition can be watched while a gate is drawn. The dataset payload carries only the column names and level counts; a column's values are fetched when it is chosen, once, in the per-sample coded form the categorical export already uses. A named colour vector in `metadata(sce)$gatelab_palettes[[column]]` fixes the colours so the app matches the analysis figures.
- Running from a clone with `source("launch.R")` now sources every file under `R/`, so functions added in new files are defined the same way as in the installed package.
- The embedded GateLab core is GateLab-dev master at 7883c8a (0.7.5 plus the pooled gate label, memberships on explicit save, and Colour by colData), which sends the memberships with an explicit save and, when the plot pools several checked files, labels gate counts pooled over the same files.

# GateLabR 1.4.5

- The embedded GateLab core is 0.7.5 (GateLab-dev master at c415f99), up from 0.7.2. What that brings into the R host:
- Several population hierarchies over one shared gate table. The menu at the top of the populations list switches between them and can create an empty one, duplicate the current one, rename it or delete it; the gates stay when a hierarchy goes. Undo works across a switch. A workspace saved into the SCE with several hierarchies now reloads with all of them; the first build of this core restored only the active one, which is fixed in the same commit.
- A hierarchy you can write by hand. Import hierarchy CSV reads gate lines and population lines, with parents and NOT references, and for a CyTOF debarcoding scheme a sample table beneath them; Save hierarchy CSV writes any workspace the same way. The barcode scheme import builds a debarcoding strategy from the run's sample table, with the QC populations from a template or from the file, and can send a second scheme into its own hierarchy while reusing the gates already present.
- In the population tree the blue highlight is a selection: shift-click a range, Cmd or Ctrl-click to add or remove a row, shift-drag to move the highlighted rows together. The checkboxes keep their old role, with All and None above the list.
- Fixed: the four handles of an ellipse gate sit at the ellipse's on-screen vertices; before, two of them sat off the drawn shape whenever the axes had different pixel scales.
- Fixed: a workspace saved by 0.7.0 or later could not be reopened by the file reader, which had not been told about two per-sample scale lists.
- Fixed: three FlowJo workspace conventions that imported wrong without error: a parameter written with an underscore for its slash, Time gates stored in seconds, and leaf names that recur under several parents.
- Every open, folder and save dialog starts in the folder the user last opened or saved from.

# GateLabR 1.4.4

- Fixed: an assay whose name says it is uncompensated could still be reported to the app as compensated. The bridge decides whether a display-space assay already carries compensation by trying to reproduce it as `asinh(counts / cofactor)` and treating a mismatch as evidence, and that inference was allowed to overrule the name — so an assay called `exprs_uncomp` arrived marked compensated. A probe that cannot reproduce a transform has other explanations besides compensation: a different cofactor, a different transform family, a scaled or corrected assay. The name now wins where it explicitly says uncompensated. A neutral name such as `exprs` is still decided from the data, which is the case that detection exists for.
- The R test suite passes again. Two host-bridge tests had been failing since the compensation detector was added on 2026-08-04, and were released red in 1.4.0 through 1.4.3; one was this defect, the other a fixture whose `exprs` was a plain rescale rather than a transform.
- The embedded GateLab core is unchanged at 0.7.2.

# GateLabR 1.4.3

- Added: the manage dialog can reorder the loaded files by name, in either direction. Sorting is numeric-aware, so exp10 follows exp9 rather than exp1, and case-insensitive. This is the workspace's own sample order, so it also drives the samples panel and is saved with the workspace.
- Changed: on the Illustration tab the contour bandwidth is now always shown, rather than appearing only after switching off automatic smoothing. It reads "auto" while automatic and can be set by hand once automatic is off. Nothing about the rendering changes, but the automatic value depends on the plotted event count and the panel size, so being able to see and pin it is what lets a contour here be matched to the same population in the gating plot.
- The embedded GateLab core is 0.7.2.

# GateLabR 1.4.2

- Fixed: a gate could quietly change meaning when a workspace was reopened from the SCE. Each gate records the coordinate space its numbers live in, and the axis transforms it was drawn under, and both survive the SCE untouched — but reading the workspace back dropped them, so a gate saved in display space came back read in the sample's default. The same coordinates then selected a different set of events, with nothing on screen to say so. Ellipses were affected every time, because a drawn ellipse is always created in display space: an ellipse on screen is not an ellipse in raw space, so converting it would bend it into something else. The fields are now restored for every gate type, and a workspace carrying a transform GateLabR cannot read is refused rather than loaded as though the gate had none.
- Added: FCS files can be dragged onto the samples panel to load them, which does the same thing as the "+ Files…" button. Folders still go through "+ Folder…".
- Faster: editing a gate on a large workspace. On four files totalling 6.2 million events, moving a gate near the top of the hierarchy took about 790 ms of work before the interface could respond, and now takes about 300 ms. Gates whose shape did not change are no longer re-measured, each population is examined only over the events its parent holds rather than the whole file, and the Illustration tab's per-sample figures are no longer rebuilt while that tab is closed.
- The embedded GateLab core is 0.7.1.

# GateLabR 1.4.1

- Fixed: saving into the SCE could fail permanently with a workspace revision conflict, reporting
  that the browser expected one revision while the SCE was at the next, and recovering only when
  the user reloaded. The SCE advances on every accepted write, but the browser learns the new
  revision only from that write's reply, so a reply lost to a closing session, a reconnect or a
  replaced tab left the browser a revision behind for good and every later save was rejected.
  Because exporting populations saves the workspace first, this also blocked writing populations
  to `colData` before any of that work began. Writes now record which browser made them, and a
  conflict reports the stored revision and its writer, so a browser that recognises its own lost
  write resyncs and retries instead of stalling. A conflict raised by a genuinely different
  session still stops and says so, rather than overwriting that session's work.

# GateLabR 1.4.0

- **Breaking:** `launchGatingApp()` now starts the shared GateLab TypeScript/React interface and
  is the single supported entry point. `launchLegacyGateLabR()` is defunct and the previous
  GateLabR-specific Shiny interface is no longer reachable; calling it signals an error
  explaining the change. The former Shiny-only UMAP view goes with it and is not yet available
  in the React interface.
- SCE assays are streamed lazily through a thin R host with explicit linear versus
  display-coordinate contracts. Compensation Apply runs in a cancellable background R process and
  installs revisioned assays atomically. Panel labels, population memberships, division calls and
  editable sample annotations have explicit `rowData()` / `colData()` write-back actions, and
  canonical workspaces, compensation provenance and assay bindings persist inside the SCE and
  restore without recomputation.
- Gates carry the coordinate space they were drawn in. A flow gate records whether its vertices
  are straight in raw channel values or in the transform it was drawn under, so moving a display
  control can no longer move an event in or out of a gate. Two letters on each gate label name
  the space of its x and y axes. Older workspaces are unaffected: a gate with no recorded space
  resolves to what that sample did before the field existed.
- Elliptical gates can be drawn, resized and rotated. An ellipse is dragged out from its centre
  and carries four handles at its axis ends; dragging one sets that axis and turns the ellipse to
  follow the cursor, so rotation needs no separate control. Ellipses are stored the way Gating-ML
  stores them, as a mean, a covariance matrix and the squared distance its boundary sits at, and
  membership is evaluated from those numbers rather than from a sampled outline.
- Gates that belong to no population stay visible, controlled by an Unowned gates checkbox beside
  Branch gates. Such a gate sits in no branch, so branch scoping could only hide it by accident.
- FlowJo `.wsp` workspaces open directly, with their own compensation matrix and a picker when the
  workspace is ambiguous. FlowJo's biex and log transforms are implemented, so imported gates land
  where FlowJo evaluates them.
- BD FACSDiva experiment XML can be imported, bringing across the gate tree, the per-tube
  compensation matrices and Diva's biexponential display, which is a Logicle in disguise.
- Gating-ML export declares the transform each gate's vertices are actually straight in, and
  import reads `transformation-ref` the way the specification means it. Cytobank export carries
  the compensation matrix as a spectrumMatrix block, derives each channel's scale range from the
  data rather than assuming one, and collapses the extra vertices that densifying a curved edge
  adds.
- Fluorescence channels can be displayed with arcsinh instead of logicle, with an adjustable
  cofactor. Gate edges can be drawn straight, straight with a grey true edge, or bowed. Channels
  can be named with their detector as well as their marker, throughout the interface.
- Plots draw at the display's resolution rather than in CSS pixels, and the Strategy,
  Illustration and Compensation grids colour by the same quantile rank the gating plot uses.
- Fixed: a polygon with a repeated vertex selected every event in its bounding box. The repeated
  point produced a zero-length edge, which the crossing test read as lying on the boundary, so the
  gate quietly reported far more events than it contained. Any polygon whose outline had been
  densified and read back in was affected.
- Fixed: a workspace holding an elliptical gate aborted the SCE autosave, reporting that the gate
  had invalid vertices. An ellipse has no vertices, but the workspace mirror required them of
  every gate that was not a quadrant. The mirror now records the ellipse parameters and adds a
  sampled boundary alongside them, so anything reading vertices still receives the correct
  geometry while membership stays defined by the covariance.
- Fixed: CyTOF Gaussian channels such as Width keep their declared arcsinh space on Gating-ML
  import, instead of being read as raw and landing far below the data.
- Fixed: dragging a gate that was not already selected no longer snaps it back, so moving a gate
  no longer takes two attempts.
- Fixed: exporting a gating strategy to FCS no longer loses sibling populations to a file-name
  collision. `CD45RB+IgD+` and `CD45RB-IgD+` both sanitised to one name and each later export
  overwrote the earlier one.
- Older workspaces with list-encoded gate coordinates are normalized without changing their
  geometry. The core sync no longer copies GateLab's local development sample data into this
  package.
