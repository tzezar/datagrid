---
editUrl: false
next: true
prev: true
title: "ColumnGroup"
---

Defined in: core/types.ts:404

## Type Parameters

• **TOriginalRow**

• **TMeta** = `any`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_meta"></a> `_meta` | `TMeta` | core/types.ts:425 |
| <a id="columnid"></a> `columnId` | `string` | core/types.ts:408 |
| <a id="columns"></a> `columns` | [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`, `any`\>[] | core/types.ts:410 |
| <a id="header"></a> `header` | `string` | core/types.ts:406 |
| <a id="headercell"></a> `headerCell?` | [`HeaderCell`](/api/type-aliases/headercell/) | core/types.ts:407 |
| <a id="options"></a> `options` | `object` | core/types.ts:411 |
| `options.filterable` | `null` | core/types.ts:415 |
| `options.groupable` | `null` | core/types.ts:413 |
| `options.moveable` | `boolean` | core/types.ts:417 |
| `options.pinnable` | `null` | core/types.ts:416 |
| `options.resizable` | `boolean` | core/types.ts:418 |
| `options.searchable` | `null` | core/types.ts:412 |
| `options.sortable` | `null` | core/types.ts:414 |
| <a id="parentcolumnid"></a> `parentColumnId` | `string` | core/types.ts:409 |
| <a id="state"></a> `state` | `object` | core/types.ts:420 |
| `state.pinning` | [`ColumnPinningState`](/api/type-aliases/columnpinningstate/) | core/types.ts:423 |
| `state.size` | [`ColumnSizeState`](/api/type-aliases/columnsizestate/) | core/types.ts:421 |
| `state.visible` | `null` | core/types.ts:422 |
| <a id="type"></a> `type` | `"group"` | core/types.ts:405 |

## Methods

### isFilterable()

> **isFilterable**(): `boolean`

Defined in: core/types.ts:428

#### Returns

`boolean`

***

### isSortable()

> **isSortable**(): `boolean`

Defined in: core/types.ts:427

#### Returns

`boolean`

***

### isVisible()

> **isVisible**(): `boolean`

Defined in: core/types.ts:426

#### Returns

`boolean`
