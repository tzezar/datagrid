---
editUrl: false
next: true
prev: true
title: "ComputedColumn"
---

Defined in: core/types.ts:334

## Type Parameters

• **TOriginalRow**

• **TMeta** = `any`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_meta"></a> `_meta` | `TMeta` | core/types.ts:365 |
| <a id="aggregate"></a> `aggregate?` | [`AggregationConfig`](/api/type-aliases/aggregationconfig/) | core/types.ts:347 |
| <a id="aggregatedcell"></a> `aggregatedCell?` | [`AggregatedCell`](/api/type-aliases/aggregatedcell/)\<`TOriginalRow`\> | core/types.ts:343 |
| <a id="align"></a> `align` | [`ColumnAlign`](/api/type-aliases/columnalign/) | core/types.ts:364 |
| <a id="cell"></a> `cell?` | [`CustomCell`](/api/type-aliases/customcell/)\<`TOriginalRow`\> | core/types.ts:342 |
| <a id="columnid"></a> `columnId` | `string` | core/types.ts:337 |
| <a id="formatterfn"></a> `formatterFn?` | [`FormatterFn`](/api/type-aliases/formatterfn/)\<`TOriginalRow`\> | core/types.ts:346 |
| <a id="getgroupvaluefn"></a> `getGroupValueFn?` | [`GetGroupValue`](/api/type-aliases/getgroupvalue/)\<`TOriginalRow`\> | core/types.ts:341 |
| <a id="getvaluefn"></a> `getValueFn` | [`GetValueFn`](/api/type-aliases/getvaluefn/)\<`TOriginalRow`\> | core/types.ts:340 |
| <a id="groupedcell"></a> `groupedCell?` | [`GroupedCell`](/api/type-aliases/groupedcell/)\<`TOriginalRow`\> | core/types.ts:344 |
| <a id="header"></a> `header` | `string` | core/types.ts:336 |
| <a id="headercell"></a> `headerCell?` | [`HeaderCell`](/api/type-aliases/headercell/) | core/types.ts:345 |
| <a id="options"></a> `options` | `object` | core/types.ts:348 |
| `options.calculateFacets` | `boolean` | core/types.ts:349 |
| `options.filterable` | `boolean` | core/types.ts:353 |
| `options.groupable` | `boolean` | core/types.ts:351 |
| `options.hideable` | `boolean` | core/types.ts:356 |
| `options.moveable` | `boolean` | core/types.ts:355 |
| `options.pinnable` | `boolean` | core/types.ts:354 |
| `options.resizable` | `boolean` | core/types.ts:357 |
| `options.searchable` | `boolean` | core/types.ts:350 |
| `options.sortable` | `boolean` | core/types.ts:352 |
| <a id="parentcolumnid"></a> `parentColumnId` | `string` | core/types.ts:338 |
| <a id="state"></a> `state` | `object` | core/types.ts:359 |
| `state.pinning` | [`ColumnPinningState`](/api/type-aliases/columnpinningstate/) | core/types.ts:362 |
| `state.size` | [`ColumnSizeState`](/api/type-aliases/columnsizestate/) | core/types.ts:360 |
| `state.visible` | `boolean` | core/types.ts:361 |
| <a id="type"></a> `type` | `"computed"` | core/types.ts:335 |

## Methods

### isFilterable()

> **isFilterable**(): `boolean`

Defined in: core/types.ts:368

#### Returns

`boolean`

***

### isSortable()

> **isSortable**(): `boolean`

Defined in: core/types.ts:367

#### Returns

`boolean`

***

### isVisible()

> **isVisible**(): `boolean`

Defined in: core/types.ts:366

#### Returns

`boolean`
