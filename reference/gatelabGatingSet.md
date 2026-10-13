# Build a flowWorkspace GatingSet from a gated SingleCellExperiment

The samples and events of `sce` as a `GatingSet`, with the populations
the app stored at the last "Save to SCE" written to its hierarchy: a
rectangle, polygon or ellipse drawn in the space the object's transforms
give becomes that flowWorkspace gate, a negated gate a negated node, and
any other population its exact per-sample membership. Each gate written
is recomputed by flowWorkspace and replaced by the membership if it
selected other events, so every node holds the events the app showed.
The channels are transformed as the object states
([`gatelabTransforms`](https://david-priest.github.io/GateLabR/reference/gatelabTransforms.md)),
and the GateLab workspace is carried as a keyword, so
[`launchGatingApp()`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
on the result opens the same workspace.

## Usage

``` r
gatelabGatingSet(
  sce,
  assay = NULL,
  hierarchy = NULL,
  sample_column = NULL,
  allow_stale = FALSE
)
```

## Arguments

- sce:

  A `SingleCellExperiment` saved from the app with "Save to SCE".

- assay:

  The assay to take the events from: by default the one the workspace
  was drawn from, which for an assay in arcsinh units is put back to
  nominal linear values through the cofactor the app used, as the app
  does.

- hierarchy:

  Which hierarchy to write (`NULL` means the active one).

- sample_column:

  The colData column that defines samples, as for
  [`launchGatingApp`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md).

- allow_stale:

  Write memberships whose workspace revision is behind the stored
  workspace.

## Value

A `GatingSet`, invisibly; a message says which populations went as gates
and which as memberships. flowWorkspace is required.
