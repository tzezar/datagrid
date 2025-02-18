---
editUrl: false
next: true
prev: true
title: "BaseService"
---

Defined in: core/services/base-service.ts:7

Base class for service operations related to the datagrid, providing shared functionality such as refreshing the grid.

## Extended by

- [`ColumnControlService`](/api/classes/columncontrolservice/)
- [`EditingService`](/api/classes/editingservice/)
- [`FilteringService`](/api/classes/filteringservice/)
- [`SearchService`](/api/classes/searchservice/)
- [`GroupingService`](/api/classes/groupingservice/)
- [`PaginationService`](/api/classes/paginationservice/)
- [`RowService`](/api/classes/rowservice/)
- [`SortingService`](/api/classes/sortingservice/)

## Constructors

### new BaseService()

> **new BaseService**(`datagrid`, `events`): [`BaseService`](/api/classes/baseservice/)

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

[`BaseService`](/api/classes/baseservice/)
