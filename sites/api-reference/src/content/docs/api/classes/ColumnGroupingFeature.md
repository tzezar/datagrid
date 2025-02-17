---
editUrl: false
next: true
prev: true
title: "ColumnGroupingFeature"
---

Defined in: core/features/column-grouping.svelte.ts:43

ColumnGroupingFeature class handles the creation, deletion, and management of column groups in the datagrid.
It allows grouping columns, moving columns into groups, and emitting events related to column group creation and deletion.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- [`IColumnGroupingFeature`](/api/type-aliases/icolumngroupingfeature/)

## Constructors

### new ColumnGroupingFeature()

> **new ColumnGroupingFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`ColumnGroupingFeature`](/api/classes/columngroupingfeature/)\<`TOriginalRow`\>

Defined in: core/features/column-grouping.svelte.ts:51

Constructs the ColumnGroupingFeature instance.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The datagrid instance that this feature will operate on.

##### config?

`object`

Configuration options for the column grouping feature.

#### Returns

[`ColumnGroupingFeature`](/api/classes/columngroupingfeature/)\<`TOriginalRow`\>

## Methods

### createGroup()

> **createGroup**(`params`): `void`

Defined in: core/features/column-grouping.svelte.ts:103

Creates a new column group and adds selected columns into it.
This method generates a new column group, moves the selected columns into it, 
and triggers a refresh of the column state.

#### Parameters

##### params

[`CreateGroupParams`](/api/interfaces/creategroupparams/)

The parameters for creating the new column group, including the group name and selected columns.

#### Returns

`void`

***

### deleteGroupColumn()

> **deleteGroupColumn**(`columnGroup`): `void`

Defined in: core/features/column-grouping.svelte.ts:63

Deletes a column group from the datagrid.
This method removes the group column and moves its child columns back to the root level or their parent group.
It also triggers a refresh of the column pinning offsets after the deletion.

#### Parameters

##### columnGroup

[`ColumnGroup`](/api/interfaces/columngroup/)\<`TOriginalRow`\>

The column group to be deleted.

#### Returns

`void`
