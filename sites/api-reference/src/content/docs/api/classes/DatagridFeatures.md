---
editUrl: false
next: true
prev: true
title: "DatagridFeatures"
---

Defined in: core/features/features.svelte.ts:14

A class that manages the various features of a DataGrid, including sorting, filtering, pagination, row selection, column visibility, and more.
It allows for the dynamic configuration and initialization of features, enabling an extensible and customizable DataGrid.

## Type Parameters

• **TOriginalRow** = `any`

## Constructors

### new DatagridFeatures()

> **new DatagridFeatures**\<`TOriginalRow`\>(`datagrid`, `config`?): [`DatagridFeatures`](/api/classes/datagridfeatures/)\<`TOriginalRow`\>

Defined in: core/features/features.svelte.ts:97

Initializes the DataGrid features with the provided DataGrid instance and optional configuration.
This constructor sets up all the core features for sorting, filtering, pagination, and more based on the provided configuration.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`any`\>

The DataGrid instance that these features will operate on.

##### config?

[`DatagridCoreConfig`](/api/type-aliases/datagridcoreconfig/)\<`TOriginalRow`\>

Optional configuration for the features, including initial states and feature overrides.

#### Returns

[`DatagridFeatures`](/api/classes/datagridfeatures/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="columnfaceting"></a> `columnFaceting` | [`ColumnFacetingFeature`](/api/classes/columnfacetingfeature/) | Column faceting feature for the DataGrid, enabling the grouping of data by column facets. | core/features/features.svelte.ts:63 |
| <a id="columngrouping"></a> `columnGrouping` | [`ColumnGroupingFeature`](/api/classes/columngroupingfeature/) | Column grouping feature for the DataGrid, enabling the grouping of columns. | core/features/features.svelte.ts:73 |
| <a id="columnordering"></a> `columnOrdering` | [`ColumnOrderingFeature`](/api/classes/columnorderingfeature/) | Column ordering feature for the DataGrid, allowing the reordering of columns. | core/features/features.svelte.ts:68 |
| <a id="columnpinning"></a> `columnPinning` | [`ColumnPinningFeature`](/api/classes/columnpinningfeature/) | Column pinning feature for the DataGrid, allowing columns to be pinned to the left or right. | core/features/features.svelte.ts:58 |
| <a id="columnsizing"></a> `columnSizing` | [`ColumnSizingFeature`](/api/classes/columnsizingfeature/) | Column sizing feature for the DataGrid, enabling the resizing of columns. | core/features/features.svelte.ts:48 |
| <a id="columnvisibility"></a> `columnVisibility` | [`ColumnVisibilityFeature`](/api/classes/columnvisibilityfeature/) | Column visibility feature for the DataGrid, allowing columns to be shown or hidden dynamically. | core/features/features.svelte.ts:53 |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`any`\> | The DataGrid instance that this feature set is operating on. | core/features/features.svelte.ts:18 |
| <a id="filtering"></a> `filtering` | [`ColumnFilteringFeature`](/api/classes/columnfilteringfeature/) | Filtering feature for the DataGrid, allowing rows to be filtered based on column values. | core/features/features.svelte.ts:38 |
| <a id="globalsearch"></a> `globalSearch` | [`GlobalSearchFeature`](/api/classes/globalsearchfeature/) | Global search feature for the DataGrid, allowing for a search across multiple columns. | core/features/features.svelte.ts:43 |
| <a id="grouping"></a> `grouping` | [`GroupingFeature`](/api/classes/groupingfeature/) | Grouping feature for the DataGrid, enabling the grouping of rows based on specified column values. | core/features/features.svelte.ts:33 |
| <a id="pagination"></a> `pagination` | [`PaginationFeature`](/api/classes/paginationfeature/) | Pagination feature for the DataGrid, enabling pagination controls. | core/features/features.svelte.ts:23 |
| <a id="rowexpanding"></a> `rowExpanding` | [`RowExpansionFeature`](/api/classes/rowexpansionfeature/) | Row expanding feature for the DataGrid, allowing rows to be expanded to show additional details. | core/features/features.svelte.ts:78 |
| <a id="rowpinning"></a> `rowPinning` | [`RowPinningFeature`](/api/classes/rowpinningfeature/) | Row pinning feature for the DataGrid, allowing rows to be pinned at the top or bottom. | core/features/features.svelte.ts:88 |
| <a id="rowselection"></a> `rowSelection` | [`RowSelectionFeature`](/api/classes/rowselectionfeature/) | Row selection feature for the DataGrid, enabling the selection of rows for batch actions. | core/features/features.svelte.ts:83 |
| <a id="sorting"></a> `sorting` | [`SortingFeature`](/api/classes/sortingfeature/) | Sorting feature for the DataGrid, allowing columns to be sorted in ascending or descending order. | core/features/features.svelte.ts:28 |
