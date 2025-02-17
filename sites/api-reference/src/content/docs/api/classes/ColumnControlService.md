---
editUrl: false
next: true
prev: true
title: "ColumnControlService"
---

Defined in: core/services/column-control-service.ts:11

Service for managing column operations in the datagrid, including column resizing, visibility, pinning, ordering, and grouping.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Constructors

### new ColumnControlService()

> **new ColumnControlService**(`datagrid`, `events`): [`ColumnControlService`](/api/classes/columncontrolservice/)

Defined in: core/services/base-service.ts:14

Creates an instance of the BaseService class.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`any`\>

The core datagrid instance.

##### events

[`EventService`](/api/classes/eventservice/)

The event service used for emitting events.

#### Returns

[`ColumnControlService`](/api/classes/columncontrolservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### changeColumnPinningPosition()

> **changeColumnPinningPosition**(`columnId`, `position`): `void`

Defined in: core/services/column-control-service.ts:72

Changes the pinning position of a specified column.

#### Parameters

##### columnId

`string`

The ID of the column to change the pinning position.

##### position

[`PinningPosition`](/api/type-aliases/pinningposition/)

The new pinning position (left, right, etc.).

#### Returns

`void`

#### Throws

Throws an error if the column is not found.

***

### createGroup()

> **createGroup**(`params`): `void`

Defined in: core/services/column-control-service.ts:38

Creates a new group of selected columns.

#### Parameters

##### params

[`CreateGroupParams`](/api/interfaces/creategroupparams/)

The parameters for creating the group, including the group name and selected columns.

#### Returns

`void`

***

### deleteGroupColumn()

> **deleteGroupColumn**(`groupColumn`): `void`

Defined in: core/services/column-control-service.ts:47

Deletes a group column.

#### Parameters

##### groupColumn

[`ColumnGroup`](/api/interfaces/columngroup/)\<`any`\>

The group column to delete.

#### Returns

`void`

***

### moveColumnToPosition()

> **moveColumnToPosition**(`params`): `void`

Defined in: core/services/column-control-service.ts:104

Moves a column to a specific position relative to a target group column.

#### Parameters

##### params

The parameters for moving the column.

###### columnId

`string`

The ID of the column to move.

###### targetGroupColumnId

`string`

The ID of the target group column to move the column to.

#### Returns

`void`

***

### moveLeft()

> **moveLeft**(`columnId`): `void`

Defined in: core/services/column-control-service.ts:84

Moves a column to the left.

#### Parameters

##### columnId

`string`

The ID of the column to move.

#### Returns

`void`

***

### moveRight()

> **moveRight**(`columnId`): `void`

Defined in: core/services/column-control-service.ts:93

Moves a column to the right.

#### Parameters

##### columnId

`string`

The ID of the column to move.

#### Returns

`void`

***

### pinColumn()

> **pinColumn**(`columnId`, `position`): `void`

Defined in: core/services/column-control-service.ts:58

Pins a specified column to a given position.

#### Parameters

##### columnId

`string`

The ID of the column to pin.

##### position

[`PinningPosition`](/api/type-aliases/pinningposition/)

The pinning position (left, right, etc.).

#### Returns

`void`

#### Throws

Throws an error if the column is not found.

***

### toggleColumnVisibility()

> **toggleColumnVisibility**(`columnId`): `void`

Defined in: core/services/column-control-service.ts:29

Toggles the visibility of a specified column.

#### Parameters

##### columnId

`string`

The ID of the column whose visibility will be toggled.

#### Returns

`void`

***

### updateColumnSize()

> **updateColumnSize**(`columnId`, `width`): `void`

Defined in: core/services/column-control-service.ts:19

Updates the size of a specified column.

#### Parameters

##### columnId

`string`

The ID of the column to resize.

##### width

`number`

The new width for the column.

#### Returns

`void`
