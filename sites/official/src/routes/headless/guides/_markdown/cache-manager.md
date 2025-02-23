---
title: Cache Manager
---

<script>
	import {exports} from './exports.ts'
</script>

# {title}

The **Cache Manager** handles caching for a data grid, optimizing performance by storing computed results for sorting, filtering, grouping, and pagination. It provides methods to invalidate and update caches when data changes, ensuring efficiency while maintaining data consistency.

## About Caching

The data grid caches data at several key points during data transformation. Some operations are computationally expensive, while others are less so. For example, sorting, filtering, and grouping operations are only performed when they are explicitly enabled or required. Pagination, on the other hand, does not require recalculating sorted or filtered data if the cache is valid.

### Types of Cache

The following caches are maintained to optimize performance:

- **Sorted Data** – Stores the result of sorting operations to avoid redundant computations.
- **Filtered Data** – Holds filtered datasets, reducing the need to reapply filters.
- **Paginated Data** – Caches paginated results to prevent unnecessary recomputation.
- **Rows** – Maintains a cached version of raw row data.
- **Hierarchical Rows** – Stores structured row data for tree-like data structures.

> **Note:** Invalidating cache does not automatically refresh the data grid. You must manually trigger a refresh by calling the data processor or using the `datagrid.refresh()` helper.

<exports.components.codeBlock lang='ts' code={exports.code.dataCaching1} />

## Usefull Method

### `invalidate(target: TargetType)`

Invalidates specific parts of the cache based on the provided `type` parameter. Available options:

- `'everything'`

  Clears all caches.

- `'sortedData'`
  Clears the sorted data cache.
- `'filteredData'`
  Clears the filtered data cache.
- `'hierarchicalRows'`
  Clears the hierarchical rows cache.
- `'rows'`

  Clears the base rows cache.

- `'paginatedRows'`

  Clears the paginated rows cache.


<exports.components.codeBlock lang='ts' code={exports.code.dataCaching2} />


## Best Practices

1. Invalidate only when necessary
   – Avoid clearing all caches unless absolutely required.
2. Use cache efficiently
   – Leverage cached results to optimize performance and minimize reprocessing.
3. Manually trigger updates
   – Ensure a proper refresh mechanism after invalidating cache.

## API Reference

For a complete list of available methods and usage details, refer to the API Reference documentation.
