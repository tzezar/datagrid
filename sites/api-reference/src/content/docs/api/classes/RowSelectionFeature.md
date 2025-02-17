---
editUrl: false
next: true
prev: true
title: "RowSelectionFeature"
---

Defined in: core/features/row-selection.svelte.ts:42

Manages row selection for a datagrid, including selection, deselection, and toggling.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- `IRowSelectionFeature`\<`TOriginalRow`\>

## Constructors

### new RowSelectionFeature()

> **new RowSelectionFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`RowSelectionFeature`](/api/classes/rowselectionfeature/)\<`TOriginalRow`\>

Defined in: core/features/row-selection.svelte.ts:53

Initializes the row selection feature.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The datagrid instance.

##### config?

`Partial`

Optional configuration for the feature.

#### Returns

[`RowSelectionFeature`](/api/classes/rowselectionfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | core/features/row-selection.svelte.ts:43 |
| <a id="maxselectablerows"></a> `maxSelectableRows` | `number` | core/features/row-selection.svelte.ts:45 |
| <a id="selectedrowids"></a> `selectedRowIds` | `SvelteSet`\<[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)\> | core/features/row-selection.svelte.ts:44 |
| <a id="selectionmode"></a> `selectionMode` | [`RowSelectionMode`](/api/type-aliases/rowselectionmode/) | core/features/row-selection.svelte.ts:46 |

## Methods

### clearSelection()

> **clearSelection**(): `void`

Defined in: core/features/row-selection.svelte.ts:147

Clears the selection of all rows.

#### Returns

`void`

#### Implementation of

`IRowSelectionFeature.clearSelection`

***

### deselectRowById()

> **deselectRowById**(`identifier`): `void`

Defined in: core/features/row-selection.svelte.ts:92

Deselects a row by its identifier.

#### Parameters

##### identifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to deselect.

#### Returns

`void`

#### Implementation of

`IRowSelectionFeature.deselectRowById`

***

### getSelectedOriginalRows()

> **getSelectedOriginalRows**(): `TOriginalRow`[]

Defined in: core/features/row-selection.svelte.ts:122

Gets the original rows corresponding to the selected row identifiers.

#### Returns

`TOriginalRow`[]

An array of selected original rows.

#### Implementation of

`IRowSelectionFeature.getSelectedOriginalRows`

***

### getSelectedRowsIds()

> **getSelectedRowsIds**(): `unknown`[]

Defined in: core/features/row-selection.svelte.ts:62

Gets the list of selected row identifiers.

#### Returns

`unknown`[]

An array of selected row identifiers.

#### Implementation of

`IRowSelectionFeature.getSelectedRowsIds`

***

### isRowSelected()

> **isRowSelected**(`identifier`): `any`

Defined in: core/features/row-selection.svelte.ts:114

Checks if a row is selected.

#### Parameters

##### identifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to check.

#### Returns

`any`

True if the row is selected, false otherwise.

#### Implementation of

`IRowSelectionFeature.isRowSelected`

***

### selectRowById()

> **selectRowById**(`identifier`): `void`

Defined in: core/features/row-selection.svelte.ts:70

Selects a row by its identifier.

#### Parameters

##### identifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to select.

#### Returns

`void`

#### Implementation of

`IRowSelectionFeature.selectRowById`

***

### selectRows()

> **selectRows**(`identifiers`): `void`

Defined in: core/features/row-selection.svelte.ts:132

Selects multiple rows by their identifiers.

#### Parameters

##### identifiers

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)[]

An array of row identifiers to select.

#### Returns

`void`

#### Implementation of

`IRowSelectionFeature.selectRows`

***

### toggleRowSelection()

> **toggleRowSelection**(`identifier`): `void`

Defined in: core/features/row-selection.svelte.ts:101

Toggles the selection state of a row.

#### Parameters

##### identifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to toggle.

#### Returns

`void`

#### Implementation of

`IRowSelectionFeature.toggleRowSelection`

***

### unselectRows()

> **unselectRows**(`identifiers`): `void`

Defined in: core/features/row-selection.svelte.ts:140

Deselects multiple rows by their identifiers.

#### Parameters

##### identifiers

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)[]

An array of row identifiers to deselect.

#### Returns

`void`

#### Implementation of

`IRowSelectionFeature.unselectRows`
