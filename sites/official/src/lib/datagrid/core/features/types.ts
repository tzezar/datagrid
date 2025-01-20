import type { ColumnFacetingFeature } from "./column-faceting.svelte";
import type { ColumnFilteringFeature } from "./column-filtering.svelte";
import type { ColumnGroupingFeature } from "./column-grouping.svelte";
import type { ColumnOrderingFeature } from "./column-ordering.svelte";
import type { ColumnPinningFeature } from "./column-pinning.svelte";
import type { ColumnSizingFeature } from "./column-sizing.svelte";
import type { ColumnVisibilityFeature } from "./column-visibility.svelte";
import type { GlobalSearchFeature } from "./global-search.svelte";
import type { GroupingFeature } from "./grouping.svelte";
import type { PaginationFeature } from "./pagination.svelte";
import type { RowExpandingFeature } from "./row-expanding.svelte";
import type { RowPinningFeature } from "./row-pinning.svelte";
import type { RowSelectionFeature } from "./row-selection.svelte";
import type { SortingFeature } from "./sorting.svelte";

export type BuiltInFeature = ColumnFacetingFeature | ColumnFilteringFeature |
    ColumnGroupingFeature | ColumnOrderingFeature | ColumnPinningFeature |
    ColumnSizingFeature | ColumnVisibilityFeature | GlobalSearchFeature | GroupingFeature |
    PaginationFeature | RowExpandingFeature | RowPinningFeature | RowSelectionFeature |
    SortingFeature