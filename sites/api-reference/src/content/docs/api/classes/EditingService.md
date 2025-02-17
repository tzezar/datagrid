---
editUrl: false
next: true
prev: true
title: "EditingService"
---

Defined in: core/services/editing-service.svelte.ts:10

Service for managing cell editing in the datagrid.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Constructors

### new EditingService()

> **new EditingService**(`datagrid`, `events`): [`EditingService`](/api/classes/editingservice/)

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

[`EditingService`](/api/classes/editingservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### updateCellValue()

> **updateCellValue**(`row`, `column`, `value`, `rowIdentifier`?): `void`

Defined in: core/services/editing-service.svelte.ts:21

Updates the value of a specific cell in the grid and triggers necessary actions, such as refreshing the grid or invalidating caches.

#### Parameters

##### row

[`GridBasicRow`](/api/type-aliases/gridbasicrow/)\<`any`\>

The row containing the cell to update.

##### column

[`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\>

The column containing the cell to update.

##### value

`any`

The new value to set for the cell.

##### rowIdentifier?

`any` = `'id'`

The identifier for the row, defaulting to 'id'.

#### Returns

`void`

#### Fires

onCellEdit Emitted after a cell value is updated, providing the new and previous row data and the previous and new cell values.
