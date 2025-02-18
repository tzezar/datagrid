---
editUrl: false
next: true
prev: true
title: "ColumnOrderingFeature"
---

Defined in: core/features/column-ordering.svelte.ts:27

Class responsible for managing column reordering within a data grid.
Handles both root-level and group-level column movements, validating moves,
and executing the reordering process.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- [`IColumnOrderingFeature`](/api/type-aliases/icolumnorderingfeature/)

## Constructors

### new ColumnOrderingFeature()

> **new ColumnOrderingFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`ColumnOrderingFeature`](/api/classes/columnorderingfeature/)\<`TOriginalRow`\>

Defined in: core/features/column-ordering.svelte.ts:42

Initializes the column ordering feature with the provided data grid instance and optional configuration.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The data grid instance.

##### config?

`object`

Optional configuration for the feature.

#### Returns

[`ColumnOrderingFeature`](/api/classes/columnorderingfeature/)\<`TOriginalRow`\>

## Methods

### executeMove()

> **executeMove**(`operation`): `void`

Defined in: core/features/column-ordering.svelte.ts:238

Executes the move operation by removing the column from its current location
and inserting it into the new target location.

#### Parameters

##### operation

[`MoveOperation`](/api/interfaces/moveoperation/)

The move operation to execute.

#### Returns

`void`

***

### findColumnOrThrow()

> **findColumnOrThrow**(`columnId`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>

Defined in: core/features/column-ordering.svelte.ts:99

Finds a column by its ID and throws an error if not found.

#### Parameters

##### columnId

`string`

The ID of the column to find.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>

The found column.

#### Throws

If the column is not found.

***

### move()

> **move**(`columnId`, `direction`): `void`

Defined in: core/features/column-ordering.svelte.ts:54

Moves a column in the specified direction.
Emits a column reorder event and triggers the move.

#### Parameters

##### columnId

`string`

The ID of the column to be moved.

##### direction

[`ColumnMovementDirection`](/api/type-aliases/columnmovementdirection/)

The direction to move the column ('left' or 'right').

#### Returns

`void`

***

### moveToPosition()

> **moveToPosition**(`columnId`, `targetId`): `void`

Defined in: core/features/column-ordering.svelte.ts:344

Moves a column to the specified position relative to another column.
This could involve moving the column to the root position or within a group.

#### Parameters

##### columnId

`string`

The ID of the column to move.

##### targetId

`string`

The ID of the column to move the source column relative to.

#### Returns

`void`

#### Throws

Throws an error if the column cannot be found or if invalid move operation is attempted.

***

### refreshColumnState()

> **refreshColumnState**(): `void`

Defined in: core/features/column-ordering.svelte.ts:289

Refreshes the column state by recalculating the pinning offsets.

#### Returns

`void`

***

### validateMove()

> **validateMove**(`operation`): `void`

Defined in: core/features/column-ordering.svelte.ts:325

Validates the proposed move operation to ensure that it does not create invalid column relationships.
Specifically, checks that a group column is not moved into one of its own descendants, which would create a circular reference.

#### Parameters

##### operation

[`MoveOperation`](/api/interfaces/moveoperation/)

The move operation to validate.

#### Returns

`void`

#### Throws

Throws an error if the move would create a circular reference.
