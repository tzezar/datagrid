---
editUrl: false
next: true
prev: true
title: "ColumnPinningFeature"
---

Defined in: core/features/column-pinning.svelte.ts:27

ColumnPinningFeature handles the pinning of columns in a data grid.
It allows columns to be pinned to the left or right and calculates the offset of pinned columns.

## Implements

- [`IColumnPinningFeature`](/api/type-aliases/icolumnpinningfeature/)

## Constructors

### new ColumnPinningFeature()

> **new ColumnPinningFeature**(`datagrid`, `config`?): [`ColumnPinningFeature`](/api/classes/columnpinningfeature/)

Defined in: core/features/column-pinning.svelte.ts:48

Creates an instance of the ColumnPinningFeature.
The feature is initialized with a reference to the data grid and an optional configuration object.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`any`\>

The data grid instance managing the columns.

##### config?

`object`

Optional configuration to initialize the pinning feature.

#### Returns

[`ColumnPinningFeature`](/api/classes/columnpinningfeature/)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`any`\> | Reference to the DataGrid instance to manage pinning operations. | core/features/column-pinning.svelte.ts:31 |
| <a id="oncolumnpinningchange"></a> `onColumnPinningChange` | (`pinnedColumns`: `string`[]) => `void` | Callback function triggered when the column pinning state changes. This function is passed an array of pinned column IDs. | core/features/column-pinning.svelte.ts:39 |

## Methods

### calculateOffset()

> **calculateOffset**(`columns`, `columnId`, `position`): `number`

Defined in: core/features/column-pinning.svelte.ts:79

Calculates the offset for a column based on its pinning position.
The offset is the sum of the widths of all pinned columns that precede or follow the given column.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

Array of all column definitions in the grid.

##### columnId

`string`

The ID of the column whose offset needs to be calculated.

##### position

The pinning position of the column ('left', 'right', or null).

`"left"` | `"right"`

#### Returns

`number`

The offset for the given column, in pixels.
- A value of 0 means the column is at the edge of the grid, and no offset is needed.
- A value of -1 means the column is unpinned.

***

### changeColumnPinningPosition()

> **changeColumnPinningPosition**(`column`, `position`): `void`

Defined in: core/features/column-pinning.svelte.ts:60

Changes the pinning position of a given column.
This method updates the column's pinning state and emits an event to notify the grid.

#### Parameters

##### column

[`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\>

The column whose pinning position needs to be changed.

##### position

[`PinningPosition`](/api/type-aliases/pinningposition/)

The new pinning position. Can be 'left', 'right', or null.

#### Returns

`void`
