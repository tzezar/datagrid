---
editUrl: false
next: true
prev: true
title: "DatagridCoreConfig"
---

> **DatagridCoreConfig**\<`TOriginalRow`, `C`\>: `object`

Defined in: core/types.ts:465

## Type Parameters

• **TOriginalRow**

• **C** *extends* [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\> = [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="columns"></a> `columns` | `C`[] | core/types.ts:466 |
| <a id="data"></a> `data` | `TOriginalRow`[] | core/types.ts:467 |
| <a id="features"></a> `features`? | `object` | core/types.ts:476 |
| `features.columnGrouping`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`ColumnGroupingFeature`](/api/classes/columngroupingfeature/)\> | core/types.ts:487 |
| `features.columnOrdering`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`ColumnOrderingFeature`](/api/classes/columnorderingfeature/)\> | core/types.ts:486 |
| `features.columnPinning`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`ColumnPinningFeature`](/api/classes/columnpinningfeature/)\> | core/types.ts:488 |
| `features.columnSizing`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`ColumnSizingFeature`](/api/classes/columnsizingfeature/)\> | core/types.ts:489 |
| `features.columnVisibility`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`ColumnVisibilityFeature`](/api/classes/columnvisibilityfeature/)\> | core/types.ts:490 |
| `features.faceting`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`ColumnFacetingFeature`](/api/classes/columnfacetingfeature/)\> | core/types.ts:480 |
| `features.filtering`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`ColumnFilteringFeature`](/api/classes/columnfilteringfeature/)\> | core/types.ts:479 |
| `features.globalSearch`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`GlobalSearchFeature`](/api/classes/globalsearchfeature/)\> | core/types.ts:481 |
| `features.grouping`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`GroupingFeature`](/api/classes/groupingfeature/)\> | core/types.ts:482 |
| `features.pagination`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`PaginationFeature`](/api/classes/paginationfeature/)\> | core/types.ts:478 |
| `features.rowExpanding`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`RowExpansionFeature`](/api/classes/rowexpansionfeature/)\> | core/types.ts:483 |
| `features.rowPinning`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`RowPinningFeature`](/api/classes/rowpinningfeature/)\> | core/types.ts:485 |
| `features.rowSelection`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`RowSelectionFeature`](/api/classes/rowselectionfeature/)\> | core/types.ts:484 |
| `features.sorting`? | [`FeatureConstructor`](/api/type-aliases/featureconstructor/)\<[`SortingFeature`](/api/classes/sortingfeature/)\> | core/types.ts:477 |
| <a id="initialstate"></a> `initialState`? | [`InitialState`](/api/type-aliases/initialstate/) | core/types.ts:470 |
| <a id="lifecyclehooks"></a> `lifecycleHooks`? | [`LifecycleHooks`](/api/classes/lifecyclehooks/)\<`TOriginalRow`\> | core/types.ts:468 |
| <a id="measureperformance"></a> `measurePerformance`? | `boolean` | core/types.ts:472 |
| <a id="rowidgetter"></a> `rowIdGetter`? | (`row`) => `string` | core/types.ts:473 |
| <a id="rowindexgetter"></a> `rowIndexGetter`? | (`row`) => `string` | core/types.ts:474 |
