---
editUrl: false
next: true
prev: true
title: "ColumnFacetingFeature"
---

Defined in: core/features/column-faceting.svelte.ts:30

Class that implements the column faceting feature, responsible for calculating and managing
numeric and categorical facets for each column in the datagrid.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- [`IColumnFacetingFeature`](/api/type-aliases/icolumnfacetingfeature/)

## Constructors

### new ColumnFacetingFeature()

> **new ColumnFacetingFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`ColumnFacetingFeature`](/api/classes/columnfacetingfeature/)\<`TOriginalRow`\>

Defined in: core/features/column-faceting.svelte.ts:52

Constructor for initializing the ColumnFacetingFeature with a reference to the datagrid
and optional configuration.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The parent datagrid instance.

##### config?

`Partial`

Optional configuration to override the default facet feature state.

#### Returns

[`ColumnFacetingFeature`](/api/classes/columnfacetingfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="_categoricalfacets"></a> `_categoricalFacets` | `Record`\<`string`, \{ `uniqueValues`: `unknown`[]; `uniqueValuesCount`: `number`; \}\> | Stores categorical facets (unique values and their count) for each column | core/features/column-faceting.svelte.ts:38 |
| <a id="_numericfacets"></a> `_numericFacets` | `Record`\<`string`, \{ `max`: `number`; `min`: `number`; \}\> | Stores numeric facets (min and max values) for each column | core/features/column-faceting.svelte.ts:35 |
| <a id="facetssource"></a> `facetsSource` | `"originalData"` \| `"filteredData"` | Indicates whether the facets are calculated from the original or filtered data | core/features/column-faceting.svelte.ts:44 |
| <a id="recalculatefacetsafterfiltering"></a> `recalculateFacetsAfterFiltering` | `any` | Flag indicating whether facets should be recalculated after filtering | core/features/column-faceting.svelte.ts:41 |

## Methods

### calculateFacets()

> **calculateFacets**(`rows`, `columns`): `void`

Defined in: core/features/column-faceting.svelte.ts:102

Calculates numeric and categorical facets for the provided rows and columns.
This method iterates over the rows and columns to compute the facets and updates the
`_numericFacets` and `_categoricalFacets` state properties accordingly.

#### Parameters

##### rows

`TOriginalRow`[]

The array of rows to calculate facets for.

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

The array of columns for which facets need to be calculated.

#### Returns

`void`

***

### getAllCategoricalFacets()

> **getAllCategoricalFacets**(): `object`

Defined in: core/features/column-faceting.svelte.ts:89

Retrieves all categorical facets for all columns.

#### Returns

`object`

A shallow copy of the categorical facets object.

***

### getAllNumericFacets()

> **getAllNumericFacets**(): `object`

Defined in: core/features/column-faceting.svelte.ts:81

Retrieves all numeric facets for all columns.

#### Returns

`object`

A shallow copy of the numeric facets object.

***

### getCategoricalFacet()

> **getCategoricalFacet**(`columnId`): `object`

Defined in: core/features/column-faceting.svelte.ts:73

Retrieves the categorical facet (unique values and their count) for a specific column.

#### Parameters

##### columnId

`string`

The ID of the column.

#### Returns

`object`

The categorical facet for the column or `null` if no facet is available.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="uniquevalues-1"></a> `uniqueValues` | `unknown`[] | core/features/column-faceting.svelte.ts:38 |
| <a id="uniquevaluescount-1"></a> `uniqueValuesCount` | `number` | core/features/column-faceting.svelte.ts:38 |

***

### getNumericFacet()

> **getNumericFacet**(`columnId`): `object`

Defined in: core/features/column-faceting.svelte.ts:64

Retrieves the numeric facet (min and max values) for a specific column.

#### Parameters

##### columnId

`string`

The ID of the column.

#### Returns

`object`

The numeric facet for the column or `null` if no facet is available.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="max-1"></a> `max` | `number` | core/features/column-faceting.svelte.ts:35 |
| <a id="min-1"></a> `min` | `number` | core/features/column-faceting.svelte.ts:35 |
