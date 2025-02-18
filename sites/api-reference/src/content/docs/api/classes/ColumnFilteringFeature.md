---
editUrl: false
next: true
prev: true
title: "ColumnFilteringFeature"
---

Defined in: core/features/column-filtering.svelte.ts:18

Manages column filtering functionality for a data grid.
Provides utilities for evaluating filter conditions and toggling the visibility of filters.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- [`IColumnFilteringFeature`](/api/type-aliases/icolumnfilteringfeature/)

## Constructors

### new ColumnFilteringFeature()

> **new ColumnFilteringFeature**\<`TOriginalRow`\>(`datagrid`, `config`): [`ColumnFilteringFeature`](/api/classes/columnfilteringfeature/)\<`TOriginalRow`\>

Defined in: core/features/column-filtering.svelte.ts:30

Creates an instance of ColumnFilteringFeature.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)

The DataGrid instance to manage filters for.

##### config

`Partial`

Optional configuration to initialize the feature with.

#### Returns

[`ColumnFilteringFeature`](/api/classes/columnfilteringfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/) | core/features/column-filtering.svelte.ts:19 |
| <a id="filterconditions"></a> `filterConditions` | [`FilterCondition`](/api/interfaces/filtercondition/)\<`TOriginalRow`\>[] | core/features/column-filtering.svelte.ts:22 |
| <a id="ismanual"></a> `isManual` | `boolean` | core/features/column-filtering.svelte.ts:23 |

## Methods

### changeConditionOperator()

> **changeConditionOperator**(`columnId`, `operator`): `void`

Defined in: core/features/column-filtering.svelte.ts:71

Updates the filter operator for a given column.
If no condition exists, a new one is created.

#### Parameters

##### columnId

`string`

The ID of the column to update the filter operator for.

##### operator

[`FilterOperator`](/api/type-aliases/filteroperator/)

The new filter operator to set.

#### Returns

`void`

#### Implementation of

`IColumnFilteringFeature.changeConditionOperator`

***

### evaluateCondition()

> **evaluateCondition**(`cellValue`, `condition`): `boolean`

Defined in: core/features/column-filtering.svelte.ts:99

Evaluates a cell value against a filter condition.

#### Parameters

##### cellValue

`any`

The value of the cell to evaluate.

##### condition

[`FilterCondition`](/api/interfaces/filtercondition/)\<`TOriginalRow`\>

The filter condition to evaluate against.

#### Returns

`boolean`

`true` if the cell value satisfies the condition, otherwise `false`.

#### Implementation of

`IColumnFilteringFeature.evaluateCondition`

***

### getConditionOperator()

> **getConditionOperator**(`columnId`): [`FilterOperator`](/api/type-aliases/filteroperator/)

Defined in: core/features/column-filtering.svelte.ts:60

Retrieves the filter operator for a given column.

#### Parameters

##### columnId

`string`

The ID of the column to get the filter operator for.

#### Returns

[`FilterOperator`](/api/type-aliases/filteroperator/)

The filter operator or `undefined` if no condition exists for the column.

#### Implementation of

`IColumnFilteringFeature.getConditionOperator`

***

### getConditionValue()

> **getConditionValue**(`columnId`): `any`

Defined in: core/features/column-filtering.svelte.ts:40

Retrieves the filter condition value for a given column.

#### Parameters

##### columnId

`string`

The ID of the column to get the filter condition value for.

#### Returns

`any`

The filter condition value or `null` if no condition exists for the column.

#### Implementation of

`IColumnFilteringFeature.getConditionValue`

***

### getConditionValueTo()

> **getConditionValueTo**(`columnId`): `any`

Defined in: core/features/column-filtering.svelte.ts:50

Retrieves the 'to' value for a range filter condition for a given column.

#### Parameters

##### columnId

`string`

The ID of the column to get the range filter 'to' value for.

#### Returns

`any`

The 'to' filter condition value or `null` if no condition exists for the column.

#### Implementation of

`IColumnFilteringFeature.getConditionValueTo`
