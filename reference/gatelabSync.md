# Hand the console's object to the running app

While the app runs without blocking, the console can change the object
it was launched on (`sce <- ...`, a new `colData` column, a subset). The
app notices that the global binding is no longer the object it last
wrote and refuses to save until told which object to work on. This tells
it: the app takes the console's object as its own, and its next save
writes back to that.

## Usage

``` r
gatelabSync(sce_name = NULL)
```

## Arguments

- sce_name:

  The global name the app was launched on; the running app's name when
  omitted.

## Value

Invisibly the object handed over.
