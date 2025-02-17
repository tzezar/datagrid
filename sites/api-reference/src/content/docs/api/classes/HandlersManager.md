---
editUrl: false
next: true
prev: true
title: "HandlersManager"
---

Defined in: core/managers/handler-manager.ts:19

Manages handlers for various services within the datagrid.
Provides access to services for column control, filtering, global search,
grouping, pagination, row operations, sorting, and editing.

 HandlersManager

## Constructors

### new HandlersManager()

> **new HandlersManager**(`datagrid`, `eventService`): [`HandlersManager`](/api/classes/handlersmanager/)

Defined in: core/managers/handler-manager.ts:82

Creates an instance of the HandlersManager, initializing all the necessary services.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`any`\>

The core datagrid instance to which services will be bound.

##### eventService

[`EventService`](/api/classes/eventservice/)

The event service used for event-driven interactions between services.

#### Returns

[`HandlersManager`](/api/classes/handlersmanager/)

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="column"></a> `column` | `readonly` | [`ColumnControlService`](/api/classes/columncontrolservice/) | Service to manage column controls such as visibility, ordering, etc. | core/managers/handler-manager.ts:25 |
| <a id="editing"></a> `editing` | `readonly` | [`EditingService`](/api/classes/editingservice/) | Service to manage editing functionality for rows within the datagrid. | core/managers/handler-manager.ts:74 |
| <a id="filtering"></a> `filtering` | `readonly` | [`FilteringService`](/api/classes/filteringservice/) | Service to manage filtering functionality within the datagrid. | core/managers/handler-manager.ts:32 |
| <a id="globalsearch"></a> `globalSearch` | `readonly` | [`SearchService`](/api/classes/searchservice/) | Service to manage global search functionality. | core/managers/handler-manager.ts:39 |
| <a id="grouping"></a> `grouping` | `readonly` | [`GroupingService`](/api/classes/groupingservice/) | Service to manage grouping functionality within the datagrid. | core/managers/handler-manager.ts:46 |
| <a id="pagination"></a> `pagination` | `readonly` | [`PaginationService`](/api/classes/paginationservice/) | Service to manage pagination functionality within the datagrid. | core/managers/handler-manager.ts:53 |
| <a id="rows"></a> `rows` | `readonly` | [`RowService`](/api/classes/rowservice/) | Service to manage row operations such as selection, expansion, etc. | core/managers/handler-manager.ts:60 |
| <a id="sorting"></a> `sorting` | `readonly` | [`SortingService`](/api/classes/sortingservice/) | Service to manage sorting functionality within the datagrid. | core/managers/handler-manager.ts:67 |
