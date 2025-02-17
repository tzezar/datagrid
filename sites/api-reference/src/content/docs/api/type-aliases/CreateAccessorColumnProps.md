---
editUrl: false
next: true
prev: true
title: "CreateAccessorColumnProps"
---

> **CreateAccessorColumnProps**\<`TOriginalRow`, `TKey`, `TMeta`\>: `object` & `CommonColumnCreationProps`\<`TMeta`\>

Defined in: core/column-creation/types.ts:10

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `accessorKey` | `TKey` | core/column-creation/types.ts:11 |
| `aggregate`? | [`AggregationConfig`](/api/type-aliases/aggregationconfig/) | core/column-creation/types.ts:15 |
| `aggregatedCell`? | [`AggregatedCell`](/api/type-aliases/aggregatedcell/)\<`TOriginalRow`\> | core/column-creation/types.ts:17 |
| `align`? | [`ColumnAlign`](/api/type-aliases/columnalign/) | core/column-creation/types.ts:32 |
| `cell`? | [`CustomCell`](/api/type-aliases/customcell/)\<`TOriginalRow`\> | core/column-creation/types.ts:16 |
| `formatterFn`? | [`FormatterFn`](/api/type-aliases/formatterfn/)\<`TOriginalRow`\> | core/column-creation/types.ts:20 |
| `getGroupValueFn`? | [`GetGroupValue`](/api/type-aliases/getgroupvalue/)\<`TOriginalRow`\> | core/column-creation/types.ts:14 |
| `getValueFn`? | (`row`) => [`CellValue`](/api/type-aliases/cellvalue/) | core/column-creation/types.ts:13 |
| `groupedCell`? | [`GroupedCell`](/api/type-aliases/groupedcell/)\<`TOriginalRow`\> | core/column-creation/types.ts:18 |
| `header`? | `string` | core/column-creation/types.ts:12 |
| `headerCell`? | [`HeaderCell`](/api/type-aliases/headercell/) | core/column-creation/types.ts:19 |
| `options`? | `object` | core/column-creation/types.ts:21 |
| `options.calculateFacets`? | `boolean` | core/column-creation/types.ts:22 |
| `options.filterable`? | `boolean` | core/column-creation/types.ts:26 |
| `options.groupable`? | `boolean` | core/column-creation/types.ts:24 |
| `options.hideable`? | `boolean` | core/column-creation/types.ts:29 |
| `options.moveable`? | `boolean` | core/column-creation/types.ts:28 |
| `options.pinnable`? | `boolean` | core/column-creation/types.ts:27 |
| `options.resizable`? | `boolean` | core/column-creation/types.ts:30 |
| `options.searchable`? | `boolean` | core/column-creation/types.ts:23 |
| `options.sortable`? | `boolean` | core/column-creation/types.ts:25 |
| `state`? | `ColumnCreationStateProps` | core/column-creation/types.ts:33 |

## Type Parameters

• **TOriginalRow**

• **TKey** *extends* [`DotNestedKeys`](/api/type-aliases/dotnestedkeys/)\<`TOriginalRow`\>

• **TMeta**
