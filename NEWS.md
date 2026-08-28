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
