---
editUrl: false
next: true
prev: true
title: "ColumnVisibilityFeature"
---

Defined in: core/features/column-visibility.svelte.ts:35

Manages the visibility of columns in the DataGrid.
This feature allows columns to be shown or hidden dynamically and triggers an event when their visibility changes.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- [`IColumnVisibilityFeature`](/api/type-aliases/icolumnvisibilityfeature/)

## Constructors

### new ColumnVisibilityFeature()

> **new ColumnVisibilityFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`ColumnVisibilityFeature`](/api/classes/columnvisibilityfeature/)\<`TOriginalRow`\>

Defined in: core/features/column-visibility.svelte.ts:56

Initializes the ColumnVisibilityFeature with a reference to the DataGrid and optional configuration.
This feature helps manage the visibility of columns, allowing for toggling, showing, and hiding columns.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The DataGrid instance that this feature will operate on.

##### config?

`Partial`

Optional configuration for column visibility, such as a custom visibility change handler.

#### Returns

[`ColumnVisibilityFeature`](/api/classes/columnvisibilityfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | A reference to the DataGrid instance that this feature operates on. | core/features/column-visibility.svelte.ts:39 |
| <a id="oncolumnvisibilitychange"></a> `onColumnVisibilityChange` | (`hiddenColumns`: `string`[]) => `void` | Callback function triggered when the visibility of columns changes. This function is called with the updated column's visibility state. | core/features/column-visibility.svelte.ts:47 |

## Methods

### hideColumn()

> **hideColumn**(`columnId`): `void`

Defined in: core/features/column-visibility.svelte.ts:82

Hides a column, making it invisible in the DataGrid.
It also emits an event to notify that the column's visibility has changed.

#### Parameters

##### columnId

`string`

The ID of the column to hide.

#### Returns

`void`

#### Implementation of

`IColumnVisibilityFeature.hideColumn`

***

### showColumn()

> **showColumn**(`columnId`): `void`

Defined in: core/features/column-visibility.svelte.ts:99

Shows a column, making it visible in the DataGrid.
It also emits an event to notify that the column's visibility has changed.

#### Parameters

##### columnId

`string`

The ID of the column to show.

#### Returns

`void`

#### Implementation of

`IColumnVisibilityFeature.showColumn`

***

### toggleColumnVisibility()

> **toggleColumnVisibility**(`columnId`): `void`

Defined in: core/features/column-visibility.svelte.ts:67

Toggles the visibility of a column.
If the column is currently visible, it will be hidden. If it is hidden, it will be shown.

#### Parameters

##### columnId

`string`

The ID of the column to toggle visibility for.

#### Returns

`void`

#### Implementation of

`IColumnVisibilityFeature.toggleColumnVisibility`
