---
editUrl: false
next: true
prev: true
title: "RowExpansionFeature"
---

Defined in: core/features/row-expanding.svelte.ts:42

Manages row expansion functionality within the data grid.
Allows expanding and collapsing rows, with the state tracked via expanded row IDs.

## Type Parameters

• **TOriginalRow** = `any`

The type of the original row data in the grid.

## Implements

- [`IRowExpandingFeature`](/api/type-aliases/irowexpandingfeature/)

## Constructors

### new RowExpansionFeature()

> **new RowExpansionFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`RowExpansionFeature`](/api/classes/rowexpansionfeature/)\<`TOriginalRow`\>

Defined in: core/features/row-expanding.svelte.ts:61

Creates an instance of the RowExpansionFeature.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The data grid instance.

##### config?

`Partial`

Optional configuration to initialize the state.

#### Returns

[`RowExpansionFeature`](/api/classes/rowexpansionfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | The data grid instance this feature belongs to | core/features/row-expanding.svelte.ts:44 |
| <a id="expandedrowids"></a> `expandedRowIds` | `SvelteSet`\<[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)\> | Set containing the IDs of currently expanded rows | core/features/row-expanding.svelte.ts:47 |
| <a id="expansionmode"></a> `expansionMode` | [`RowExpansionMode`](/api/type-aliases/rowexpansionmode/) | The current row expansion mode ('single' or 'multiple') | core/features/row-expanding.svelte.ts:50 |
| <a id="maxexpandedrows"></a> `maxExpandedRows` | `number` | The maximum number of rows that can be expanded at the same time | core/features/row-expanding.svelte.ts:53 |

## Methods

### collapseRow()

> **collapseRow**(`identifier`): `void`

Defined in: core/features/row-expanding.svelte.ts:89

Collapses a specific row by its identifier.

#### Parameters

##### identifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to collapse.
Emits 'onRowCollapse' and removes the row from the expanded rows set.

#### Returns

`void`

***

### expandRow()

> **expandRow**(`identifier`): `void`

Defined in: core/features/row-expanding.svelte.ts:73

Expands a specific row by its identifier.

#### Parameters

##### identifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to expand.
Emits 'onRowExpand' and adds the row to the expanded rows set.
If the expansion limit is reached, an event 'onRowExpansionLimitExceeded' is emitted.

#### Returns

`void`

***

### isRowExpanded()

> **isRowExpanded**(`rowId`): `boolean`

Defined in: core/features/row-expanding.svelte.ts:114

Checks if a specific row is currently expanded.

#### Parameters

##### rowId

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to check.

#### Returns

`boolean`

True if the row is expanded, otherwise false.

***

### toggleRowExpansion()

> **toggleRowExpansion**(`identifier`): `void`

Defined in: core/features/row-expanding.svelte.ts:100

Toggles the expansion state of a specific row.
If the row is expanded, it will be collapsed. If it is collapsed, it will be expanded.

#### Parameters

##### identifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to toggle.

#### Returns

`void`
