# Population hierarchies stored in a gated SingleCellExperiment

An explicit “Save to SCE” in GateLabR stores, beside the workspace,
which events every population holds, for every hierarchy. These
functions read that back without re-gating in R.

## Usage

``` r
gatelabHierarchies(sce, allow_stale = FALSE)

gatelabHierarchy(sce, hierarchy = NULL, allow_stale = FALSE)

gatelabPopulations(
  sce,
  populations = NULL,
  hierarchy = NULL,
  allow_stale = FALSE
)

gatelabLeafPopulation(
  sce,
  hierarchy = NULL,
  ungated = "ungated",
  allow_stale = FALSE
)
```

## Arguments

- sce:

  A `SingleCellExperiment` gated with GateLabR and saved with “Save to
  SCE”.

- allow_stale:

  Read memberships whose workspace revision is behind the stored
  workspace.

- hierarchy:

  A hierarchy name or id. `NULL` means the hierarchy that was active
  when the memberships were saved.

- populations:

  Population names (or ids) to return; `NULL` means every population of
  the hierarchy, root included.

- ungated:

  Label for events that fall in no population below the root.

## Value

`gatelabHierarchies`: a data frame with one row per hierarchy
(`hierarchy_id`, `hierarchy`, `active`, `populations`).

`gatelabHierarchy`: a data frame with one row per population of one
hierarchy, parents before children: `population_id`, `population`,
`parent`, `depth`, `path` (names from the root joined by `" > "`),
`gates` (the gate names the population is defined by, `not` marking an
excluded gate), and `event_count`.

`gatelabPopulations`: a logical matrix with one row per SCE column
(event) and one column per population, named by population; a name
shared by two populations of the hierarchy is suffixed with the
population id.

`gatelabLeafPopulation`: a factor with one level per population of the
hierarchy in tree order plus `ungated`, giving each event its deepest
population. Where two populations of equal depth both hold an event, the
one earlier in the tree wins.

## Details

Memberships are tied to the workspace revision they were computed at. If
gates or populations changed since (an autosave moved the revision on),
reading them is refused unless `allow_stale = TRUE`; press “Save to SCE”
again to refresh them. They are also refused on an object with a
different number of columns, since a subset SCE keeps the metadata but
not the event order the masks assume.

## Examples

``` r
if (FALSE) { # \dontrun{
gatelabHierarchies(sce)
gatelabHierarchy(sce)
members <- gatelabPopulations(sce)
colSums(members)
sce$population <- gatelabLeafPopulation(sce)
table(sce$population, sce$sample_id)
} # }
```
