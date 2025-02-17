---
editUrl: false
next: true
prev: true
title: "PaginationService"
---

Defined in: core/services/pagination-service.ts:38

Service for handling pagination-related operations in the data grid, such as navigating between pages,
changing page sizes, and jumping to a specific page.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Implements

- [`PaginationOperations`](/api/type-aliases/paginationoperations/)

## Constructors

### new PaginationService()

> **new PaginationService**(`datagrid`, `events`): [`PaginationService`](/api/classes/paginationservice/)

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

[`PaginationService`](/api/classes/paginationservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### changePageSize()

> **changePageSize**(`newPageSize`): `void`

Defined in: core/services/pagination-service.ts:70

Changes the page size for the data grid.

#### Parameters

##### newPageSize

`number`

The new page size to set.
Refreshes the data grid with pagination updates.

#### Returns

`void`

#### Implementation of

`PaginationOperations.changePageSize`

***

### goToNextPage()

> **goToNextPage**(): `void`

Defined in: core/services/pagination-service.ts:56

Navigates to the next page in the data grid.
Refreshes the data grid with pagination updates.

#### Returns

`void`

#### Implementation of

`PaginationOperations.goToNextPage`

***

### goToPage()

> **goToPage**(`newPage`): `void`

Defined in: core/services/pagination-service.ts:82

Navigates to a specific page in the data grid.

#### Parameters

##### newPage

`number`

The page number to navigate to.
Refreshes the data grid with pagination updates.

#### Returns

`void`

#### Implementation of

`PaginationOperations.goToPage`

***

### goToPrevPage()

> **goToPrevPage**(): `void`

Defined in: core/services/pagination-service.ts:44

Navigates to the previous page in the data grid.
Refreshes the data grid with pagination updates.

#### Returns

`void`

#### Implementation of

`PaginationOperations.goToPrevPage`
