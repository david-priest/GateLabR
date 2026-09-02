# Changelog

## GateLabR 1.4.4

- Fixed: an assay whose name says it is uncompensated could still be
  reported to the app as compensated. The bridge decides whether a
  display-space assay already carries compensation by trying to
  reproduce it as `asinh(counts / cofactor)` and treating a mismatch as
  evidence, and that inference was allowed to overrule the name — so an
  assay called `exprs_uncomp` arrived marked compensated. A probe that
  cannot reproduce a transform has other explanations besides
  compensation: a different cofactor, a different transform family, a
  scaled or corrected assay. The name now wins where it explicitly says
  uncompensated. A neutral name such as `exprs` is still decided from
  the data, which is the case that detection exists for.
- The R test suite passes again. Two host-bridge tests had been failing
  since the compensation detector was added on 2026-08-04, and were
  released red in 1.4.0 through 1.4.3; one was this defect, the other a
  fixture whose `exprs` was a plain rescale rather than a transform.
- The embedded GateLab core is unchanged at 0.7.2.

## GateLabR 1.4.3

- Added: the manage dialog can reorder the loaded files by name, in
  either direction. Sorting is numeric-aware, so exp10 follows exp9
  rather than exp1, and case-insensitive. This is the workspace’s own
  sample order, so it also drives the samples panel and is saved with
  the workspace.
- Changed: on the Illustration tab the contour bandwidth is now always
  shown, rather than appearing only after switching off automatic
  smoothing. It reads “auto” while automatic and can be set by hand once
  automatic is off. Nothing about the rendering changes, but the
  automatic value depends on the plotted event count and the panel size,
  so being able to see and pin it is what lets a contour here be matched
  to the same population in the gating plot.
- The embedded GateLab core is 0.7.2.

## GateLabR 1.4.2

- Fixed: a gate could quietly change meaning when a workspace was
  reopened from the SCE. Each gate records the coordinate space its
  numbers live in, and the axis transforms it was drawn under, and both
  survive the SCE untouched — but reading the workspace back dropped
  them, so a gate saved in display space came back read in the sample’s
  default. The same coordinates then selected a different set of events,
  with nothing on screen to say so. Ellipses were affected every time,
  because a drawn ellipse is always created in display space: an ellipse
  on screen is not an ellipse in raw space, so converting it would bend
  it into something else. The fields are now restored for every gate
  type, and a workspace carrying a transform GateLabR cannot read is
  refused rather than loaded as though the gate had none.
- Added: FCS files can be dragged onto the samples panel to load them,
  which does the same thing as the “+ Files…” button. Folders still go
  through “+ Folder…”.
- Faster: editing a gate on a large workspace. On four files totalling
  6.2 million events, moving a gate near the top of the hierarchy took
  about 790 ms of work before the interface could respond, and now takes
  about 300 ms. Gates whose shape did not change are no longer
  re-measured, each population is examined only over the events its
  parent holds rather than the whole file, and the Illustration tab’s
  per-sample figures are no longer rebuilt while that tab is closed.
- The embedded GateLab core is 0.7.1.

## GateLabR 1.4.1

- Fixed: saving into the SCE could fail permanently with a workspace
  revision conflict, reporting that the browser expected one revision
  while the SCE was at the next, and recovering only when the user
  reloaded. The SCE advances on every accepted write, but the browser
  learns the new revision only from that write’s reply, so a reply lost
  to a closing session, a reconnect or a replaced tab left the browser a
  revision behind for good and every later save was rejected. Because
  exporting populations saves the workspace first, this also blocked
  writing populations to `colData` before any of that work began. Writes
  now record which browser made them, and a conflict reports the stored
  revision and its writer, so a browser that recognises its own lost
  write resyncs and retries instead of stalling. A conflict raised by a
  genuinely different session still stops and says so, rather than
  overwriting that session’s work.

## GateLabR 1.4.0

- **Breaking:**
  [`launchGatingApp()`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
  now starts the shared GateLab TypeScript/React interface and is the
  single supported entry point.
  [`launchLegacyGateLabR()`](https://david-priest.github.io/GateLabR/reference/launchLegacyGateLabR.md)
  is defunct and the previous GateLabR-specific Shiny interface is no
  longer reachable; calling it signals an error explaining the change.
  The former Shiny-only UMAP view goes with it and is not yet available
  in the React interface.
- SCE assays are streamed lazily through a thin R host with explicit
  linear versus display-coordinate contracts. Compensation Apply runs in
  a cancellable background R process and installs revisioned assays
  atomically. Panel labels, population memberships, division calls and
  editable sample annotations have explicit `rowData()` / `colData()`
  write-back actions, and canonical workspaces, compensation provenance
  and assay bindings persist inside the SCE and restore without
  recomputation.
- Gates carry the coordinate space they were drawn in. A flow gate
  records whether its vertices are straight in raw channel values or in
  the transform it was drawn under, so moving a display control can no
  longer move an event in or out of a gate. Two letters on each gate
  label name the space of its x and y axes. Older workspaces are
  unaffected: a gate with no recorded space resolves to what that sample
  did before the field existed.
- Elliptical gates can be drawn, resized and rotated. An ellipse is
  dragged out from its centre and carries four handles at its axis ends;
  dragging one sets that axis and turns the ellipse to follow the
  cursor, so rotation needs no separate control. Ellipses are stored the
  way Gating-ML stores them, as a mean, a covariance matrix and the
  squared distance its boundary sits at, and membership is evaluated
  from those numbers rather than from a sampled outline.
- Gates that belong to no population stay visible, controlled by an
  Unowned gates checkbox beside Branch gates. Such a gate sits in no
  branch, so branch scoping could only hide it by accident.
- FlowJo `.wsp` workspaces open directly, with their own compensation
  matrix and a picker when the workspace is ambiguous. FlowJo’s biex and
  log transforms are implemented, so imported gates land where FlowJo
  evaluates them.
- BD FACSDiva experiment XML can be imported, bringing across the gate
  tree, the per-tube compensation matrices and Diva’s biexponential
  display, which is a Logicle in disguise.
- Gating-ML export declares the transform each gate’s vertices are
  actually straight in, and import reads `transformation-ref` the way
  the specification means it. Cytobank export carries the compensation
  matrix as a spectrumMatrix block, derives each channel’s scale range
  from the data rather than assuming one, and collapses the extra
  vertices that densifying a curved edge adds.
- Fluorescence channels can be displayed with arcsinh instead of
  logicle, with an adjustable cofactor. Gate edges can be drawn
  straight, straight with a grey true edge, or bowed. Channels can be
  named with their detector as well as their marker, throughout the
  interface.
- Plots draw at the display’s resolution rather than in CSS pixels, and
  the Strategy, Illustration and Compensation grids colour by the same
  quantile rank the gating plot uses.
- Fixed: a polygon with a repeated vertex selected every event in its
  bounding box. The repeated point produced a zero-length edge, which
  the crossing test read as lying on the boundary, so the gate quietly
  reported far more events than it contained. Any polygon whose outline
  had been densified and read back in was affected.
- Fixed: a workspace holding an elliptical gate aborted the SCE
  autosave, reporting that the gate had invalid vertices. An ellipse has
  no vertices, but the workspace mirror required them of every gate that
  was not a quadrant. The mirror now records the ellipse parameters and
  adds a sampled boundary alongside them, so anything reading vertices
  still receives the correct geometry while membership stays defined by
  the covariance.
- Fixed: CyTOF Gaussian channels such as Width keep their declared
  arcsinh space on Gating-ML import, instead of being read as raw and
  landing far below the data.
- Fixed: dragging a gate that was not already selected no longer snaps
  it back, so moving a gate no longer takes two attempts.
- Fixed: exporting a gating strategy to FCS no longer loses sibling
  populations to a file-name collision. `CD45RB+IgD+` and `CD45RB-IgD+`
  both sanitised to one name and each later export overwrote the earlier
  one.
- Older workspaces with list-encoded gate coordinates are normalized
  without changing their geometry. The core sync no longer copies
  GateLab’s local development sample data into this package.
