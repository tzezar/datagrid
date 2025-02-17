---
editUrl: false
next: true
prev: true
title: "FilteringService"
---

Defined in: core/services/filtering-service.svelte.ts:10

Service for handling filtering functionality in the data grid.
This service allows changing filter operators and updating filter conditions for columns.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Constructors

### new FilteringService()

> **new FilteringService**(`datagrid`, `events`): [`FilteringService`](/api/classes/filteringservice/)

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

[`FilteringService`](/api/classes/filteringservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### changeFilterOperator()

> **changeFilterOperator**(`columnId`, `operator`): `void`

Defined in: core/services/filtering-service.svelte.ts:19

Changes the filter operator for a given column and triggers a full data transformation.
This will invalidate the cached filtered data and recalculate the filtered view.

#### Parameters

##### columnId

`string`

The ID of the column whose filter operator is being changed.

##### operator

[`FilterOperator`](/api/type-aliases/filteroperator/)

The new operator to be applied to the filter condition.

#### Returns

`void`

***

### updateFilterCondition()

> **updateFilterCondition**(`props`): `void`

Defined in: core/services/filtering-service.svelte.ts:38

Updates the filter condition for a given column. If the column already has a filter condition,
it updates the existing condition; otherwise, it adds a new filter condition.
This will trigger the filter change event, invalidate cached filtered data, and refresh pagination.

#### Parameters

##### props

The filter condition properties.

###### column

[`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\>

The column to which the filter condition applies.

###### operator

[`FilterOperator`](/api/type-aliases/filteroperator/)

The operator to use in the filter condition (e.g., 'equals', 'between').

###### value

`any`

The value for the filter condition.

###### valueTo?

`any`

The second value for range-based filters (e.g., 'between' filters).

#### Returns

`void`

#### Emits

onFilterChange The event emitted when the filter condition changes.
