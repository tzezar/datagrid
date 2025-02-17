---
editUrl: false
next: true
prev: true
title: "RowExpansionState"
---

> **RowExpansionState**: `object`

Defined in: core/features/row-expanding.svelte.ts:15

Represents the state of row expansion functionality within the grid,
including expanded row identifiers, expansion mode, and max expanded rows.

## Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="expandedrowids"></a> `expandedRowIds` | `SvelteSet`\<[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)\> | Set of expanded row identifiers | core/features/row-expanding.svelte.ts:17 |
| <a id="expansionmode"></a> `expansionMode` | [`RowExpansionMode`](/api/type-aliases/rowexpansionmode/) | The row expansion mode ('single' or 'multiple') | core/features/row-expanding.svelte.ts:20 |
| <a id="maxexpandedrows"></a> `maxExpandedRows` | `number` | The maximum number of rows that can be expanded at once | core/features/row-expanding.svelte.ts:23 |
