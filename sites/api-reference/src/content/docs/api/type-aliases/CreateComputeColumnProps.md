---
editUrl: false
next: true
prev: true
title: "CreateComputeColumnProps"
---

> **CreateComputeColumnProps**\<`TOriginalRow`, `TMeta`\>: `object` & `CommonColumnCreationProps`\<`TMeta`\>

Defined in: core/column-creation/types.ts:38

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `aggregate`? | [`AggregationConfig`](/api/type-aliases/aggregationconfig/) | core/column-creation/types.ts:41 |
| `aggregatedCell`? | [`AggregatedCell`](/api/type-aliases/aggregatedcell/)\<`TOriginalRow`\> | core/column-creation/types.ts:45 |
| `align`? | [`ColumnAlign`](/api/type-aliases/columnalign/) | core/column-creation/types.ts:59 |
| `cell`? | [`CustomCell`](/api/type-aliases/customcell/)\<`TOriginalRow`\> | core/column-creation/types.ts:44 |
| `formatterFn`? | [`FormatterFn`](/api/type-aliases/formatterfn/)\<`TOriginalRow`\> | core/column-creation/types.ts:43 |
| `getGroupValueFn`? | [`GetGroupValue`](/api/type-aliases/getgroupvalue/)\<`TOriginalRow`\> | core/column-creation/types.ts:42 |
| `getValueFn` | (`row`) => [`CellValue`](/api/type-aliases/cellvalue/) | core/column-creation/types.ts:40 |
| `groupedCell`? | [`GroupedCell`](/api/type-aliases/groupedcell/)\<`TOriginalRow`\> | core/column-creation/types.ts:46 |
| `header` | `string` | core/column-creation/types.ts:60 |
| `headerCell`? | [`HeaderCell`](/api/type-aliases/headercell/) | core/column-creation/types.ts:47 |
| `options`? | `object` | core/column-creation/types.ts:48 |
| `options.calculateFacets`? | `boolean` | core/column-creation/types.ts:49 |
| `options.filterable`? | `boolean` | core/column-creation/types.ts:53 |
| `options.groupable`? | `boolean` | core/column-creation/types.ts:51 |
| `options.hideable`? | `boolean` | core/column-creation/types.ts:56 |
| `options.moveable`? | `boolean` | core/column-creation/types.ts:55 |
| `options.pinnable`? | `boolean` | core/column-creation/types.ts:54 |
| `options.resizable`? | `boolean` | core/column-creation/types.ts:57 |
| `options.searchable`? | `boolean` | core/column-creation/types.ts:50 |
| `options.sortable`? | `boolean` | core/column-creation/types.ts:52 |
| `state`? | `ColumnCreationStateProps` | core/column-creation/types.ts:61 |

## Type Parameters

• **TOriginalRow**

• **TMeta**
