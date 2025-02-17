---
editUrl: false
next: true
prev: true
title: "DatagridCacheManager"
---

Defined in: core/managers/cache-manager.svelte.ts:11

Manages cache for a datagrid, including sorted, filtered, and grouped rows.
Provides methods to invalidate and update caches when data changes.

## Type Parameters

• **TOriginalRow**

The type of the original row data.

## Constructors

### new DatagridCacheManager()

> **new DatagridCacheManager**\<`TOriginalRow`\>(`datagrid`): [`DatagridCacheManager`](/api/classes/datagridcachemanager/)\<`TOriginalRow`\>

Defined in: core/managers/cache-manager.svelte.ts:95

Creates an instance of DatagridCacheManager for a specific datagrid.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The core datagrid instance.

#### Returns

[`DatagridCacheManager`](/api/classes/datagridcachemanager/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | The core datagrid instance that the cache manager is associated with. | core/managers/cache-manager.svelte.ts:16 |
| <a id="filtereddata"></a> `filteredData` | `TOriginalRow`[] | Cached filtered data. Null if the cache is invalid. | core/managers/cache-manager.svelte.ts:28 |
| <a id="hierarchicalrows"></a> `hierarchicalRows` | [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[] | Rows with hierarchical structure, present only when grouping is enabled. Null if the cache is invalid. | core/managers/cache-manager.svelte.ts:48 |
| <a id="paginatedrows"></a> `paginatedRows` | [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[] | Cached paginated rows. Null if the cache is invalid. | core/managers/cache-manager.svelte.ts:34 |
| <a id="rows"></a> `rows` | [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[] | Either grouped rows that are flattened or basic rows when there is no grouping. Null if the cache is invalid. | core/managers/cache-manager.svelte.ts:41 |
| <a id="sorteddata"></a> `sortedData` | `TOriginalRow`[] | Cached sorted data. Null if the cache is invalid. | core/managers/cache-manager.svelte.ts:22 |

## Methods

### invalidate()

> **invalidate**(`target`): `void`

Defined in: core/managers/cache-manager.svelte.ts:60

Invalidates the specified data in the cache.

#### Parameters

##### target

The type of cache to invalidate. Options are:
              - 'everything' to invalidate all caches.
              - 'sortedData' to invalidate the sorted data cache.
              - 'filteredData' to invalidate the filtered data cache.
              - 'hierarchicalRows' to invalidate the hierarchical rows cache.
              - 'rows' to invalidate the basic rows cache.
              - 'paginatedRows' to invalidate the paginated rows cache.

`"filteredData"` | `"everything"` | `"sortedData"` | `"hierarchicalRows"` | `"rows"` | `"paginatedRows"`

#### Returns

`void`

***

### invalidateGroupedRowsCache()

> **invalidateGroupedRowsCache**(): `void`

Defined in: core/managers/cache-manager.svelte.ts:86

Clears the flattened views of the grouped rows while keeping the hierarchical structure intact.

#### Returns

`void`
