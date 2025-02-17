---
editUrl: false
next: true
prev: true
title: "AccessorColumn"
---

Defined in: core/types.ts:296

## Type Parameters

• **TOriginalRow**

• **TMeta** = `any`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_meta"></a> `_meta` | `TMeta` | core/types.ts:328 |
| <a id="accessorkey"></a> `accessorKey` | [`DotNestedKeys`](/api/type-aliases/dotnestedkeys/)\<`TOriginalRow`\> | core/types.ts:302 |
| <a id="aggregate"></a> `aggregate?` | [`AggregationConfig`](/api/type-aliases/aggregationconfig/) | core/types.ts:305 |
| <a id="aggregatedcell"></a> `aggregatedCell?` | [`AggregatedCell`](/api/type-aliases/aggregatedcell/)\<`TOriginalRow`\> | core/types.ts:308 |
| <a id="align"></a> `align` | [`ColumnAlign`](/api/type-aliases/columnalign/) | core/types.ts:327 |
| <a id="cell"></a> `cell?` | [`CustomCell`](/api/type-aliases/customcell/)\<`TOriginalRow`\> | core/types.ts:307 |
| <a id="columnid"></a> `columnId` | `string` | core/types.ts:300 |
| <a id="formatterfn"></a> `formatterFn?` | [`FormatterFn`](/api/type-aliases/formatterfn/)\<`TOriginalRow`\> | core/types.ts:304 |
| <a id="getgroupvaluefn"></a> `getGroupValueFn?` | [`GetGroupValue`](/api/type-aliases/getgroupvalue/)\<`TOriginalRow`\> | core/types.ts:306 |
| <a id="getvaluefn"></a> `getValueFn` | [`GetValueFn`](/api/type-aliases/getvaluefn/)\<`TOriginalRow`\> | core/types.ts:303 |
| <a id="groupedcell"></a> `groupedCell?` | [`GroupedCell`](/api/type-aliases/groupedcell/)\<`TOriginalRow`\> | core/types.ts:309 |
| <a id="header"></a> `header` | `string` | core/types.ts:298 |
| <a id="headercell"></a> `headerCell?` | [`HeaderCell`](/api/type-aliases/headercell/) | core/types.ts:310 |
| <a id="options"></a> `options` | `object` | core/types.ts:311 |
| `options.calculateFacets` | `boolean` | core/types.ts:312 |
| `options.filterable` | `boolean` | core/types.ts:316 |
| `options.groupable` | `boolean` | core/types.ts:314 |
| `options.hideable` | `boolean` | core/types.ts:319 |
| `options.moveable` | `boolean` | core/types.ts:318 |
| `options.pinnable` | `boolean` | core/types.ts:317 |
| `options.resizable` | `boolean` | core/types.ts:320 |
| `options.searchable` | `boolean` | core/types.ts:313 |
| `options.sortable` | `boolean` | core/types.ts:315 |
| <a id="parentcolumnid"></a> `parentColumnId` | `string` | core/types.ts:301 |
| <a id="state"></a> `state` | `object` | core/types.ts:322 |
| `state.pinning` | [`ColumnPinningState`](/api/type-aliases/columnpinningstate/) | core/types.ts:325 |
| `state.size` | [`ColumnSizeState`](/api/type-aliases/columnsizestate/) | core/types.ts:323 |
| `state.visible` | `boolean` | core/types.ts:324 |
| <a id="type"></a> `type` | `"accessor"` | core/types.ts:297 |

## Methods

### isFilterable()

> **isFilterable**(): `boolean`

Defined in: core/types.ts:331

#### Returns

`boolean`

***

### isSortable()

> **isSortable**(): `boolean`

Defined in: core/types.ts:330

#### Returns

`boolean`

***

### isVisible()

> **isVisible**(): `boolean`

Defined in: core/types.ts:329

#### Returns

`boolean`
