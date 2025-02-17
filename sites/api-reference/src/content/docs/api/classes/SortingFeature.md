---
editUrl: false
next: true
prev: true
title: "SortingFeature"
---

Defined in: core/features/sorting.svelte.ts:35

Manages sorting configurations for the datagrid, allowing sorting by one or more columns.

## Implements

- [`ISortingFeature`](/api/type-aliases/isortingfeature/)

## Constructors

### new SortingFeature()

> **new SortingFeature**(`datagrid`, `config`?): [`SortingFeature`](/api/classes/sortingfeature/)

Defined in: core/features/sorting.svelte.ts:48

Initializes the sorting feature for a given datagrid.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`any`\>

The datagrid instance.

##### config?

`Partial`

Optional configuration for the sorting feature.

#### Returns

[`SortingFeature`](/api/classes/sortingfeature/)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="allowmultisort"></a> `allowMultiSort` | `boolean` | core/features/sorting.svelte.ts:39 |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`any`\> | core/features/sorting.svelte.ts:36 |
| <a id="ismanual"></a> `isManual` | `boolean` | core/features/sorting.svelte.ts:38 |
| <a id="maxmultisortcolumns"></a> `maxMultiSortColumns` | `number` | core/features/sorting.svelte.ts:40 |
| <a id="onsortingchange"></a> `onSortingChange` | (`config`: [`SortingFeature`](/api/classes/sortingfeature/)) => `void` | core/features/sorting.svelte.ts:41 |
| <a id="sortconfigs"></a> `sortConfigs` | [`Sorting`](/api/interfaces/sorting/)[] | core/features/sorting.svelte.ts:37 |

## Methods

### addSortConfig()

> **addSortConfig**(`columnId`, `direction`): `void`

Defined in: core/features/sorting.svelte.ts:136

Adds a new sort configuration for a column.

#### Parameters

##### columnId

`string`

The column ID to add the sort configuration for.

##### direction

[`SortingDirection`](/api/type-aliases/sortingdirection/)

The sort direction.

#### Returns

`void`

#### Implementation of

`ISortingFeature.addSortConfig`

***

### changeSortConfigDirection()

> **changeSortConfigDirection**(`columnId`, `direction`): `void`

Defined in: core/features/sorting.svelte.ts:121

Changes the sort direction for a specific column.

#### Parameters

##### columnId

`string`

The column ID to change the sort direction for.

##### direction

[`SortingDirection`](/api/type-aliases/sortingdirection/)

The new sort direction.

#### Returns

`void`

#### Implementation of

`ISortingFeature.changeSortConfigDirection`

***

### clearSortConfigs()

> **clearSortConfigs**(): `void`

Defined in: core/features/sorting.svelte.ts:104

Clears all sort configurations.

#### Returns

`void`

#### Implementation of

`ISortingFeature.clearSortConfigs`

***

### findSortConfigByColumnId()

> **findSortConfigByColumnId**(`columnId`): [`Sorting`](/api/interfaces/sorting/)

Defined in: core/features/sorting.svelte.ts:67

Finds the sort configuration for a column by its ID.

#### Parameters

##### columnId

`string`

The column ID to find the sort configuration for.

#### Returns

[`Sorting`](/api/interfaces/sorting/)

The sort configuration or undefined if not found.

#### Implementation of

`ISortingFeature.findSortConfigByColumnId`

***

### findSortConfigIndex()

> **findSortConfigIndex**(`columnId`): `number`

Defined in: core/features/sorting.svelte.ts:76

Finds the index of the sort configuration for a column.

#### Parameters

##### columnId

`string`

The column ID to find the index for.

#### Returns

`number`

The index of the sort configuration, or -1 if not found.

#### Implementation of

`ISortingFeature.findSortConfigIndex`

***

### getSortConfigByColumnId()

> **getSortConfigByColumnId**(`columnId`): [`Sorting`](/api/interfaces/sorting/)

Defined in: core/features/sorting.svelte.ts:58

Retrieves the sort configuration for a column by its ID.

#### Parameters

##### columnId

`string`

The column ID to retrieve the sort configuration for.

#### Returns

[`Sorting`](/api/interfaces/sorting/)

The sort configuration or undefined if not found.

***

### getSortConfigIndex()

> **getSortConfigIndex**(`columnId`): `number`

Defined in: core/features/sorting.svelte.ts:85

Retrieves the index of the sort configuration in the datagrid.

#### Parameters

##### columnId

`string`

The column ID to get the sort configuration index for.

#### Returns

`number`

The index of the sort configuration or null if not found.

***

### getSortDirection()

> **getSortDirection**(`columnId`): [`SortingDirection`](/api/type-aliases/sortingdirection/)

Defined in: core/features/sorting.svelte.ts:95

Retrieves the sort direction for a column.

#### Parameters

##### columnId

`string`

The column ID to get the sort direction for.

#### Returns

[`SortingDirection`](/api/type-aliases/sortingdirection/)

The sort direction, or 'intermediate' if no direction is set.

***

### isColumnSorted()

> **isColumnSorted**(`columnId`, `direction`?): `boolean`

Defined in: core/features/sorting.svelte.ts:150

Checks if a column is sorted, optionally with a specific direction.

#### Parameters

##### columnId

`string`

The column ID to check.

##### direction?

[`SortingDirection`](/api/type-aliases/sortingdirection/)

The direction to check for (optional).

#### Returns

`boolean`

True if the column is sorted with the specified direction, otherwise false.

#### Implementation of

`ISortingFeature.isColumnSorted`

***

### removeSortConfig()

> **removeSortConfig**(`columnId`): `void`

Defined in: core/features/sorting.svelte.ts:112

Removes the sort configuration for a specific column.

#### Parameters

##### columnId

`string`

The column ID to remove the sort configuration for.

#### Returns

`void`

#### Implementation of

`ISortingFeature.removeSortConfig`
