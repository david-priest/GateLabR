# The display transform of every channel, as the app drew it

A `SingleCellExperiment` gated in the app carries, in
`rowData(sce)$gatelab_transform`, the transform each channel was drawn
on at the last save, as a GatingSet carries its transforms: a logicle
with `T`, `W`, `M` and `A`, an arcsinh with its `cofactor`, or the
identity. A GatingSet reports its own transforms. Use it to draw the
object in R on the axes the app showed, or to build a `transformerList`
for flowWorkspace.

## Usage

``` r
gatelabTransforms(sce)
```

## Arguments

- sce:

  A `SingleCellExperiment` saved from the app, or a flowWorkspace
  `GatingSet`.

## Value

A named list, one entry per channel that states a transform: a list with
`kind` and the parameters of that kind.
