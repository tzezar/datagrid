---
editUrl: false
next: true
prev: true
title: "DataDataProcessor"
---

Defined in: core/processors/data-processor.svelte.ts:19

Class responsible for processing and transforming data for a datagrid component.
It handles various operations such as filtering, sorting, grouping, and pagination,
providing an efficient way to transform raw data into a format suitable for the grid.

## Type Parameters

• **TOriginalRow**

The type of the original row data in the datagrid.

## Constructors

### new DataDataProcessor()

> **new DataDataProcessor**\<`TOriginalRow`\>(`datagrid`): [`DataDataProcessor`](/api/classes/datadataprocessor/)\<`TOriginalRow`\>

Defined in: core/processors/data-processor.svelte.ts:28

Constructs an instance of the DataDataProcessor.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The core datagrid instance to which this processor belongs.

#### Returns

[`DataDataProcessor`](/api/classes/datadataprocessor/)\<`TOriginalRow`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="metrics"></a> `metrics` | `readonly` | [`PerformanceMetrics`](/api/classes/performancemetrics/) | core/processors/data-processor.svelte.ts:20 |

## Methods

### applyColumnFilters()

> **applyColumnFilters**(`data`): `TOriginalRow`[]

Defined in: core/processors/data-processor.svelte.ts:164

Applies column filters to the data. Filters are evaluated on a per-column basis.

#### Parameters

##### data

`TOriginalRow`[]

The raw data to be filtered.

#### Returns

`TOriginalRow`[]

The data after applying column filters.

***

### applyFilters()

> **applyFilters**(`data`): `TOriginalRow`[]

Defined in: core/processors/data-processor.svelte.ts:73

Applies filters to the dataset. This includes both global search and column filters.

#### Parameters

##### data

`TOriginalRow`[]

The raw data to be filtered.

#### Returns

`TOriginalRow`[]

The filtered data.

***

### applyGlobalSearch()

> **applyGlobalSearch**(`data`): `TOriginalRow`[]

Defined in: core/processors/data-processor.svelte.ts:111

Applies global search to the data, using either fuzzy search or a simple substring match.

#### Parameters

##### data

`TOriginalRow`[]

The raw data to be searched.

#### Returns

`TOriginalRow`[]

The data after applying global search.

***

### createHierarchicalData()

> **createHierarchicalData**(`data`): [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

Defined in: core/processors/data-processor.svelte.ts:341

Creates hierarchical data by recursively grouping rows based on the defined grouping columns.
Each group can contain child groups, and aggregation functions are applied to each group.

#### Parameters

##### data

`TOriginalRow`[]

The raw data to be grouped.

#### Returns

[`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

The hierarchical structure of grouped rows.

***

### executeFullDataTransformation()

> **executeFullDataTransformation**(): `void`

Defined in: core/processors/data-processor.svelte.ts:40

Executes the full data transformation pipeline including filtering, sorting, and grouping,
preparing the data for display in the datagrid.
This function processes the data, stores intermediate results in cache, 
and manages pagination.

#### Returns

`void`

***

### handleGroupExpansion()

> **handleGroupExpansion**(): `void`

Defined in: core/processors/data-processor.svelte.ts:471

Handles group expansion and updates the visible rows, pagination, and cached rows accordingly.

If hierarchical rows exist, the visible rows are determined by the expanded group state, 
otherwise the sorted data is processed. Afterward, the rows are paginated and cached.

#### Returns

`void`

***

### handlePaginationChange()

> **handlePaginationChange**(): `void`

Defined in: core/processors/data-processor.svelte.ts:492

Handles the change in pagination and updates the cached paginated rows accordingly.

This method gets the visible rows based on the current state and then updates 
the cached paginated rows for the current page.

#### Returns

`void`

***

### processGroupedData()

> **processGroupedData**(`data`): `void`

Defined in: core/processors/data-processor.svelte.ts:202

Processes grouped data by organizing it into hierarchical structures based on grouping columns,
applying any necessary aggregations and handling visibility based on group expansion state.

#### Parameters

##### data

`TOriginalRow`[]

The raw data to be processed into groups.

#### Returns

`void`

***

### registerAggregationFn()

> **registerAggregationFn**(`name`, `fn`): `void`

Defined in: core/processors/data-processor.svelte.ts:268

Registers a custom aggregation function for use in the datagrid.

#### Parameters

##### name

`string`

The name of the aggregation function.

##### fn

[`AggregationFn`](/api/type-aliases/aggregationfn/)

The aggregation function to register.

#### Returns

`void`
