---
editUrl: false
next: true
prev: true
title: "SearchService"
---

Defined in: core/services/global-search-service.ts:9

Service for managing the global search functionality in the data grid.
It handles updating the search query, resetting pagination, and triggering data transformations.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Constructors

### new SearchService()

> **new SearchService**(`datagrid`, `events`): [`SearchService`](/api/classes/searchservice/)

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

[`SearchService`](/api/classes/searchservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### updateSearchQuery()

> **updateSearchQuery**(`value`): `void`

Defined in: core/services/global-search-service.ts:18

Updates the global search query and triggers necessary actions to filter the data.
This includes resetting pagination, invalidating cached filtered data, and transforming the data based on the updated query.

#### Parameters

##### value

`string`

The search query to update the global search with.
Refreshes the data grid, invalidates the cached filtered data, and recalculates the data transformation.

#### Returns

`void`
