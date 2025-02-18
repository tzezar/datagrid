---
editUrl: false
next: true
prev: true
title: "EventPayloadMap"
---

> **EventPayloadMap**: `object`

Defined in: core/types.ts:508

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="onactivegroupslimitexceeded"></a> `onActiveGroupsLimitExceeded` | `object` | core/types.ts:528 |
| `onActiveGroupsLimitExceeded.maxActiveGroups` | `number` | core/types.ts:528 |
| <a id="oncelledit"></a> `onCellEdit` | `object` | core/types.ts:543 |
| `onCellEdit.newOriginalRow` | `any` | core/types.ts:543 |
| `onCellEdit.newValue` | `any` | core/types.ts:543 |
| `onCellEdit.prevOriginalRow` | `any` | core/types.ts:543 |
| `onCellEdit.prevValue` | `any` | core/types.ts:543 |
| <a id="oncolumngroupcreation"></a> `onColumnGroupCreation` | `object` | core/types.ts:538 |
| `onColumnGroupCreation.columnGroup` | [`ColumnGroup`](/api/interfaces/columngroup/)\<`any`\> | core/types.ts:538 |
| <a id="oncolumngroupdeletion"></a> `onColumnGroupDeletion` | `object` | core/types.ts:539 |
| `onColumnGroupDeletion.columnGroup` | [`ColumnGroup`](/api/interfaces/columngroup/)\<`any`\> | core/types.ts:539 |
| <a id="oncolumnpinningchange"></a> `onColumnPinningChange` | `object` | core/types.ts:540 |
| `onColumnPinningChange.column` | [`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\> | core/types.ts:540 |
| <a id="oncolumnreorder"></a> `onColumnReorder` | `object` | core/types.ts:541 |
| `onColumnReorder.columnId` | [`ColumnId`](/api/type-aliases/columnid/) | core/types.ts:541 |
| `onColumnReorder.direction` | [`ColumnMovementDirection`](/api/type-aliases/columnmovementdirection/) | core/types.ts:541 |
| <a id="oncolumnresize"></a> `onColumnResize` | `object` | core/types.ts:535 |
| `onColumnResize.column` | [`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\> | core/types.ts:535 |
| <a id="oncolumnsort"></a> `onColumnSort` | `object` | core/types.ts:509 |
| `onColumnSort.column` | [`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\> | core/types.ts:509 |
| `onColumnSort.multisort`? | `boolean` | core/types.ts:509 |
| <a id="oncolumnvisibilitychange"></a> `onColumnVisibilityChange` | `object` | core/types.ts:536 |
| `onColumnVisibilityChange.column` | [`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\> | core/types.ts:536 |
| <a id="onfilterchange"></a> `onFilterChange` | `object` | core/types.ts:534 |
| `onFilterChange.column` | [`LeafColumn`](/api/type-aliases/leafcolumn/)\<`any`\> | core/types.ts:534 |
| <a id="ongroupcollapse"></a> `onGroupCollapse` | `object` | core/types.ts:526 |
| `onGroupCollapse.groupIdentifier` | [`GridGroupRowIdentifier`](/api/type-aliases/gridgrouprowidentifier/) | core/types.ts:526 |
| <a id="ongroupexpand"></a> `onGroupExpand` | `object` | core/types.ts:525 |
| `onGroupExpand.groupIdentifier` | [`GridGroupRowIdentifier`](/api/type-aliases/gridgrouprowidentifier/) | core/types.ts:525 |
| <a id="ongroupexpansionlimitexceeded"></a> `onGroupExpansionLimitExceeded` | `object` | core/types.ts:527 |
| `onGroupExpansionLimitExceeded.maxExpandedGroups` | `number` | core/types.ts:527 |
| <a id="ongroupingchange"></a> `onGroupingChange` | `object` | core/types.ts:530 |
| `onGroupingChange.activeGroups` | [`ColumnId`](/api/type-aliases/columnid/)[] | core/types.ts:530 |
| <a id="onpagechange"></a> `onPageChange` | [`OnPageChangePayload`](/api/type-aliases/onpagechangepayload/) | core/types.ts:522 |
| <a id="onpagesizechange"></a> `onPageSizeChange` | `object` | core/types.ts:523 |
| `onPageSizeChange.pageSize` | `number` | core/types.ts:523 |
| `onPageSizeChange.prevSize` | `number` | core/types.ts:523 |
| <a id="onrowcollapse"></a> `onRowCollapse` | `object` | core/types.ts:519 |
| `onRowCollapse.rowIdentifier` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:519 |
| <a id="onrowdeselect"></a> `onRowDeselect` | `object` | core/types.ts:515 |
| `onRowDeselect.rowIdentifier` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:515 |
| <a id="onrowexpand"></a> `onRowExpand` | `object` | core/types.ts:518 |
| `onRowExpand.rowIdentifier` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:518 |
| <a id="onrowexpansionlimitexceeded"></a> `onRowExpansionLimitExceeded` | `object` | core/types.ts:520 |
| `onRowExpansionLimitExceeded.rowIdentifier` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:520 |
| <a id="onrowpin"></a> `onRowPin` | `object` | core/types.ts:511 |
| `onRowPin.rowId` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:511 |
| <a id="onrowselect"></a> `onRowSelect` | `object` | core/types.ts:514 |
| `onRowSelect.rowIdentifier` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:514 |
| <a id="onrowselectionlimitexceeded"></a> `onRowSelectionLimitExceeded` | `object` | core/types.ts:516 |
| `onRowSelectionLimitExceeded.rowIdentifier` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:516 |
| <a id="onrowunpin"></a> `onRowUnpin` | `object` | core/types.ts:512 |
| `onRowUnpin.rowIdentifier` | [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | core/types.ts:512 |
| <a id="onsearchquerychange"></a> `onSearchQueryChange` | `object` | core/types.ts:532 |
| `onSearchQueryChange.newQuery` | `string` | core/types.ts:532 |
| `onSearchQueryChange.prevQuery` | `string` | core/types.ts:532 |
