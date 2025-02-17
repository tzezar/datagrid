---
editUrl: false
next: true
prev: true
title: "ColumnFacetingFeatureState"
---

> **ColumnFacetingFeatureState**: `object`

Defined in: core/features/column-faceting.svelte.ts:9

Represents the state for the Column Faceting feature, which holds numeric and categorical facets 
for each column in the datagrid.

## Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="_categoricalfacets"></a> `_categoricalFacets` | `Record`\<[`ColumnId`](/api/type-aliases/columnid/), \{ `uniqueValues`: `unknown`[]; `uniqueValuesCount`: `number`; \}\> | Stores the categorical facets (unique values and their count) for each column | core/features/column-faceting.svelte.ts:14 |
| <a id="_numericfacets"></a> `_numericFacets` | `Record`\<[`ColumnId`](/api/type-aliases/columnid/), \{ `max`: `number`; `min`: `number`; \}\> | Stores the numeric facets (min and max values) for each column | core/features/column-faceting.svelte.ts:11 |
| <a id="recalculatefacetsafterfiltering"></a> `recalculateFacetsAfterFiltering` | `boolean` | Flag indicating whether to recalculate facets after filtering | core/features/column-faceting.svelte.ts:17 |
