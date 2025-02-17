---
editUrl: false
next: true
prev: true
title: "RowService"
---

Defined in: core/services/row-service.svelte.ts:78

Service for handling row-related operations in a data grid, such as row selection, pinning, and expansion.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Implements

- [`RowOperations`](/api/type-aliases/rowoperations/)

## Constructors

### new RowService()

> **new RowService**(`datagrid`, `events`): [`RowService`](/api/classes/rowservice/)

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

[`RowService`](/api/classes/rowservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### deselectAllRows()

> **deselectAllRows**(): `void`

Defined in: core/services/row-service.svelte.ts:110

Deselects all rows in the data grid.

#### Returns

`void`

#### Implementation of

`RowOperations.deselectAllRows`

***

### deselectRowsOnCurrentPage()

> **deselectRowsOnCurrentPage**(): `void`

Defined in: core/services/row-service.svelte.ts:92

Deselects all rows on the current page.

#### Returns

`void`

#### Implementation of

`RowOperations.deselectRowsOnCurrentPage`

***

### pinRowToBottom()

> **pinRowToBottom**(`rowIdentifier`): `void`

Defined in: core/services/row-service.svelte.ts:139

Pins a row to the bottom of the data grid.

#### Parameters

##### rowIdentifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to pin.

#### Returns

`void`

#### Implementation of

`RowOperations.pinRowToBottom`

***

### pinRowToTop()

> **pinRowToTop**(`rowIdentifier`): `void`

Defined in: core/services/row-service.svelte.ts:130

Pins a row to the top of the data grid.

#### Parameters

##### rowIdentifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to pin.

#### Returns

`void`

#### Implementation of

`RowOperations.pinRowToTop`

***

### selectAllRows()

> **selectAllRows**(): `void`

Defined in: core/services/row-service.svelte.ts:101

Selects all rows in the data grid.

#### Returns

`void`

#### Implementation of

`RowOperations.selectAllRows`

***

### selectRowsOnCurrentPage()

> **selectRowsOnCurrentPage**(): `void`

Defined in: core/services/row-service.svelte.ts:83

Selects all rows on the current page.

#### Returns

`void`

#### Implementation of

`RowOperations.selectRowsOnCurrentPage`

***

### toggleGroupExpansion()

> **toggleGroupExpansion**\<`TOriginalRow`\>(`row`): `void`

Defined in: core/services/row-service.svelte.ts:179

Toggles the expansion state of a group row.

#### Type Parameters

• **TOriginalRow**

#### Parameters

##### row

[`GridGroupRow`](/api/type-aliases/gridgrouprow/)\<`TOriginalRow`\>

The group row to toggle expansion for.

#### Returns

`void`

#### Implementation of

`RowOperations.toggleGroupExpansion`

***

### toggleRowExpansion()

> **toggleRowExpansion**(`rowIdentifier`): `void`

Defined in: core/services/row-service.svelte.ts:158

Toggles the expansion state of a row.

#### Parameters

##### rowIdentifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to toggle expansion for.

#### Returns

`void`

#### Implementation of

`RowOperations.toggleRowExpansion`

***

### toggleRowSelection()

> **toggleRowSelection**(`rowIdentifier`): `void`

Defined in: core/services/row-service.svelte.ts:121

Toggles the selection state of a row by its identifier.

#### Parameters

##### rowIdentifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to toggle selection for.

#### Returns

`void`

#### Implementation of

`RowOperations.toggleRowSelection`

***

### unpinRow()

> **unpinRow**(`rowIdentifier`): `void`

Defined in: core/services/row-service.svelte.ts:148

Unpins a row from the data grid.

#### Parameters

##### rowIdentifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to unpin.

#### Returns

`void`

#### Implementation of

`RowOperations.unpinRow`
