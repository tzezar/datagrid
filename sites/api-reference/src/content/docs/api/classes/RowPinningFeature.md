---
editUrl: false
next: true
prev: true
title: "RowPinningFeature"
---

Defined in: core/features/row-pinning.svelte.ts:24

Class that implements the row pinning feature for a data grid.
Handles the pinning of rows to the top and bottom of the grid.

 RowPinningFeature

## Type Parameters

• **TOriginalRow** = `any`

The type of the original row data.

## Implements

- [`IRowPinningFeature`](/api/type-aliases/irowpinningfeature/)

## Constructors

### new RowPinningFeature()

> **new RowPinningFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`RowPinningFeature`](/api/classes/rowpinningfeature/)\<`TOriginalRow`\>

Defined in: core/features/row-pinning.svelte.ts:63

Creates an instance of the row pinning feature.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The data grid core instance.

##### config?

`Partial`

Optional configuration for the row pinning feature.

#### Returns

[`RowPinningFeature`](/api/classes/rowpinningfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | The reference to the data grid core. | core/features/row-pinning.svelte.ts:29 |
| <a id="pinnedbottomrowids"></a> `pinnedBottomRowIds` | `SvelteSet`\<[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)\> | The set of row identifiers pinned to the bottom of the grid. | core/features/row-pinning.svelte.ts:41 |
| <a id="pinnedtoprowids"></a> `pinnedTopRowIds` | `SvelteSet`\<[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)\> | The set of row identifiers pinned to the top of the grid. | core/features/row-pinning.svelte.ts:35 |

## Methods

### clearPinnedRows()

> **clearPinnedRows**(): `void`

Defined in: core/features/row-pinning.svelte.ts:340

Clears all pinned rows from both top and bottom.

#### Returns

`void`

***

### getBottomRows()

> **getBottomRows**(): [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

Defined in: core/features/row-pinning.svelte.ts:188

Retrieves the rows pinned to the bottom of the grid.

#### Returns

[`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

The rows pinned to the bottom.

***

### getCenterRows()

> **getCenterRows**(): [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

Defined in: core/features/row-pinning.svelte.ts:175

Retrieves the rows that are neither pinned to the top nor bottom.

#### Returns

[`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

The unpinned rows.

***

### getIdentifiersOfPinnedRows()

> **getIdentifiersOfPinnedRows**(): `object`

Defined in: core/features/row-pinning.svelte.ts:352

Retrieves the identifiers of all pinned rows.

#### Returns

`object`

The identifiers of pinned top and bottom rows.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="bottom"></a> `bottom` | `unknown`[] | core/features/row-pinning.svelte.ts:355 |
| <a id="top"></a> `top` | `unknown`[] | core/features/row-pinning.svelte.ts:354 |

***

### getPinningState()

> **getPinningState**(`rowId`): [`RowPinningPosition`](/api/type-aliases/rowpinningposition/)

Defined in: core/features/row-pinning.svelte.ts:330

Get the pinning state of a row.

#### Parameters

##### rowId

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The unique identifier of the row.

#### Returns

[`RowPinningPosition`](/api/type-aliases/rowpinningposition/)

The pinning state of the row:
- `'top'` if the row is pinned to the top.
- `'bottom'` if the row is pinned to the bottom.
- `false` if the row is not pinned.

***

### getRowsAsArrayInPinnedOrder()

> **getRowsAsArrayInPinnedOrder**(`rows`): [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

Defined in: core/features/row-pinning.svelte.ts:121

Returns the rows in the grid, ordered with pinned rows (top, center, bottom).

#### Parameters

##### rows

[`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

The rows to process.

#### Returns

[`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

The rows in pinned order.

***

### getTopRows()

> **getTopRows**(): [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

Defined in: core/features/row-pinning.svelte.ts:165

Retrieves the rows pinned to the top of the grid.

#### Returns

[`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[]

The rows pinned to the top.

***

### isPinned()

> **isPinned**(`rowId`): `boolean`

Defined in: core/features/row-pinning.svelte.ts:317

Checks whether a row is pinned either at the top or the bottom.

#### Parameters

##### rowId

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row.

#### Returns

`boolean`

`true` if the row is pinned, otherwise `false`.

***

### isPinnedBottom()

> **isPinnedBottom**(`rowId`): `boolean`

Defined in: core/features/row-pinning.svelte.ts:308

Checks whether a row is pinned to the bottom of the grid.

#### Parameters

##### rowId

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row.

#### Returns

`boolean`

`true` if the row is pinned to the bottom, otherwise `false`.

***

### isPinnedTop()

> **isPinnedTop**(`rowId`): `boolean`

Defined in: core/features/row-pinning.svelte.ts:297

Checks whether a row is pinned to the top of the grid.

#### Parameters

##### rowId

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row.

#### Returns

`boolean`

`true` if the row is pinned to the top, otherwise `false`.

***

### pinRow()

> **pinRow**(`rowId`, `position`): `void`

Defined in: core/features/row-pinning.svelte.ts:198

Pins a row to the top or bottom of the grid.

#### Parameters

##### rowId

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to pin.

##### position

[`RowPinningPosition`](/api/type-aliases/rowpinningposition/)

The position to pin the row ('top' or 'bottom').

#### Returns

`void`

***

### unpinRow()

> **unpinRow**(`rowIdentifier`): `void`

Defined in: core/features/row-pinning.svelte.ts:267

Unpins a row from both the top and bottom pinning positions.

#### Parameters

##### rowIdentifier

[`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/)

The identifier of the row to unpin.

#### Returns

`void`

***

### updatePinnedRows()

> **updatePinnedRows**(): `void`

Defined in: core/features/row-pinning.svelte.ts:91

Updates the caches for pinned rows based on the current rows in the data grid.

#### Returns

`void`
