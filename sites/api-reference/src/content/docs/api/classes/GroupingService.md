---
editUrl: false
next: true
prev: true
title: "GroupingService"
---

Defined in: core/services/grouping-service.ts:11

Service for handling column grouping operations within the data grid,
including updating active groups and toggling grouping for specific columns.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Constructors

### new GroupingService()

> **new GroupingService**(`datagrid`, `events`): [`GroupingService`](/api/classes/groupingservice/)

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

[`GroupingService`](/api/classes/groupingservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### toggleGrouping()

> **toggleGrouping**(`columnId`): `void`

Defined in: core/services/grouping-service.ts:47

Toggles the grouping for a specific column.
If the column is groupable, it will either add or remove the column from the active groups.

#### Parameters

##### columnId

`string`

The identifier of the column to toggle grouping for.
Refreshes the data grid, recalculating the groups and resetting pagination.

#### Returns

`void`

***

### updateGrouping()

> **updateGrouping**(`values`): `void`

Defined in: core/services/grouping-service.ts:20

Updates the active grouping columns based on the provided values.
Only columns that are groupable will be included.

#### Parameters

##### values

`string`[]

An array of column identifiers to set as active groups.
Refreshes the data grid, recalculating the groups and resetting pagination.

#### Returns

`void`
