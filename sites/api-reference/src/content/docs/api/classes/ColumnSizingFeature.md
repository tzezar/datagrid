---
editUrl: false
next: true
prev: true
title: "ColumnSizingFeature"
---

Defined in: core/features/column-sizing.svelte.ts:26

The ColumnSizingFeature class manages the resizing of columns in a data grid.
It allows columns to be resized within their specified constraints and notifies the grid when columns are resized.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- [`IColumnSizingFeature`](/api/type-aliases/icolumnsizingfeature/)

## Constructors

### new ColumnSizingFeature()

> **new ColumnSizingFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`ColumnSizingFeature`](/api/classes/columnsizingfeature/)\<`TOriginalRow`\>

Defined in: core/features/column-sizing.svelte.ts:48

Initializes the ColumnSizingFeature with a reference to the DataGrid and optional configuration.
This feature helps manage column widths and their constraints, such as min and max width.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The DataGrid instance that this feature will operate on.

##### config?

`object`

Optional configuration for column sizing, such as default sizes.

#### Returns

[`ColumnSizingFeature`](/api/classes/columnsizingfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | A reference to the DataGrid instance that manages the columns and their resizing. | core/features/column-sizing.svelte.ts:30 |
| <a id="oncolumnresize"></a> `onColumnResize` | (`columnId`: `string`, `width`: `number`) => `void` | Callback function triggered when a column's size is changed. This function is called with the column ID and the new width after resizing. | core/features/column-sizing.svelte.ts:39 |

## Methods

### updateColumnSize()

> **updateColumnSize**(`columnId`, `width`): `void`

Defined in: core/features/column-sizing.svelte.ts:64

Updates the size (width) of a column, ensuring the new width adheres to the column's minimum and maximum width constraints.
Emits an event when the column size is updated.

The width is clamped between the column's `minWidth` and `maxWidth` to ensure it is within valid bounds.

#### Parameters

##### columnId

`string`

The ID of the column to resize.

##### width

`number`

The new width to apply to the column.

#### Returns

`void`

#### Throws

Throws an error if the column with the provided `columnId` cannot be found.
