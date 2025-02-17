---
editUrl: false
next: true
prev: true
title: "SortingService"
---

Defined in: core/services/sorting-service.ts:43

Class responsible for managing column sorting in a data grid.

## Extends

- [`BaseService`](/api/classes/baseservice/)

## Constructors

### new SortingService()

> **new SortingService**(`datagrid`, `events`): [`SortingService`](/api/classes/sortingservice/)

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

[`SortingService`](/api/classes/sortingservice/)

#### Inherited from

[`BaseService`](/api/classes/baseservice/).[`constructor`](/api/classes/baseservice/#constructors)

## Methods

### applyAscendingSort()

> **applyAscendingSort**(`column`): `void`

Defined in: core/services/sorting-service.ts:104

Applies an ascending sort to the specified column.

#### Parameters

##### column

[`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\>

The column to apply ascending sort to.

#### Returns

`void`

***

### applyDescendingSort()

> **applyDescendingSort**(`column`): `void`

Defined in: core/services/sorting-service.ts:119

Applies a descending sort to the specified column.

#### Parameters

##### column

[`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\>

The column to apply descending sort to.

#### Returns

`void`

***

### clearColumnSort()

> **clearColumnSort**(`column`): `void`

Defined in: core/services/sorting-service.ts:134

Clears the sort configuration for a specified column.

#### Parameters

##### column

[`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\>

The column to clear the sort for.

#### Returns

`void`

***

### toggleColumnSort()

> **toggleColumnSort**(`column`, `multisort`): `void`

Defined in: core/services/sorting-service.ts:51

Toggles the sorting direction of a column (ascending/descending) or clears the sort.

#### Parameters

##### column

[`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\>

The column to toggle sort for.

##### multisort

`boolean`

Whether to apply multi-column sorting.

#### Returns

`void`
