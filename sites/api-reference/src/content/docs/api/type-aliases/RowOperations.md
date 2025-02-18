---
editUrl: false
next: true
prev: true
title: "RowOperations"
---

> **RowOperations**: `object`

Defined in: core/services/row-service.svelte.ts:7

Interface for row operations in the data grid, including selection, pinning, and expansion.

## Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="deselectallrows"></a> `deselectAllRows` | () => `void` | Deselects all rows in the data grid. | core/services/row-service.svelte.ts:27 |
| <a id="deselectrowsoncurrentpage"></a> `deselectRowsOnCurrentPage` | () => `void` | Deselects all rows on the current page. | core/services/row-service.svelte.ts:17 |
| <a id="pinrowtobottom"></a> `pinRowToBottom` | (`rowIdentifier`) => `void` | Pins a row to the bottom of the data grid. | core/services/row-service.svelte.ts:49 |
| <a id="pinrowtotop"></a> `pinRowToTop` | (`rowIdentifier`) => `void` | Pins a row to the top of the data grid. | core/services/row-service.svelte.ts:42 |
| <a id="selectallrows"></a> `selectAllRows` | () => `void` | Selects all rows in the data grid. | core/services/row-service.svelte.ts:22 |
| <a id="selectrowsoncurrentpage"></a> `selectRowsOnCurrentPage` | () => `void` | Selects all rows on the current page. | core/services/row-service.svelte.ts:12 |
| <a id="togglegroupexpansion"></a> `toggleGroupExpansion` | \<`TOriginalRow`\>(`row`) => `void` | Toggles the expansion state of a group of rows. | core/services/row-service.svelte.ts:70 |
| <a id="togglerowexpansion"></a> `toggleRowExpansion` | (`rowIdentifier`) => `void` | Toggles the expansion state of a row. | core/services/row-service.svelte.ts:63 |
| <a id="togglerowselection"></a> `toggleRowSelection` | (`rowIdentifier`) => `void` | Toggles the selection of a row by its identifier. | core/services/row-service.svelte.ts:34 |
| <a id="unpinrow"></a> `unpinRow` | (`rowIdentifier`) => `void` | Unpins a row from the grid. | core/services/row-service.svelte.ts:56 |
