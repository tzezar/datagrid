---
editUrl: false
next: true
prev: true
title: "DisplayColumn"
---

Defined in: core/types.ts:371

## Type Parameters

• **TOriginalRow**

• **TMeta** = `any`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_meta"></a> `_meta` | `TMeta` | core/types.ts:398 |
| <a id="aggregatedcell"></a> `aggregatedCell?` | [`AggregatedCell`](/api/type-aliases/aggregatedcell/)\<`TOriginalRow`\> | core/types.ts:377 |
| <a id="align"></a> `align` | [`ColumnAlign`](/api/type-aliases/columnalign/) | core/types.ts:397 |
| <a id="cell"></a> `cell` | [`CustomCell`](/api/type-aliases/customcell/)\<`TOriginalRow`\> | core/types.ts:376 |
| <a id="columnid"></a> `columnId` | `string` | core/types.ts:374 |
| <a id="groupedcell"></a> `groupedCell?` | [`GroupedCell`](/api/type-aliases/groupedcell/)\<`TOriginalRow`\> | core/types.ts:378 |
| <a id="header"></a> `header` | `string` | core/types.ts:373 |
| <a id="headercell"></a> `headerCell?` | [`HeaderCell`](/api/type-aliases/headercell/) | core/types.ts:379 |
| <a id="options"></a> `options` | `object` | core/types.ts:380 |
| `options.calculateFacets` | `null` | core/types.ts:381 |
| `options.filterable` | `null` | core/types.ts:385 |
| `options.groupable` | `null` | core/types.ts:383 |
| `options.hideable` | `boolean` | core/types.ts:388 |
| `options.moveable` | `boolean` | core/types.ts:387 |
| `options.pinnable` | `boolean` | core/types.ts:386 |
| `options.resizable` | `boolean` | core/types.ts:389 |
| `options.searchable` | `null` | core/types.ts:382 |
| `options.sortable` | `null` | core/types.ts:384 |
| <a id="parentcolumnid"></a> `parentColumnId` | `string` | core/types.ts:375 |
| <a id="state"></a> `state` | `object` | core/types.ts:391 |
| `state.pinning` | [`ColumnPinningState`](/api/type-aliases/columnpinningstate/) | core/types.ts:394 |
| `state.size` | [`ColumnSizeState`](/api/type-aliases/columnsizestate/) | core/types.ts:392 |
| `state.visible` | `boolean` | core/types.ts:393 |
| <a id="type"></a> `type` | `"display"` | core/types.ts:372 |

## Methods

### isFilterable()

> **isFilterable**(): `boolean`

Defined in: core/types.ts:401

#### Returns

`boolean`

***

### isSortable()

> **isSortable**(): `boolean`

Defined in: core/types.ts:400

#### Returns

`boolean`

***

### isVisible()

> **isVisible**(): `boolean`

Defined in: core/types.ts:399

#### Returns

`boolean`
