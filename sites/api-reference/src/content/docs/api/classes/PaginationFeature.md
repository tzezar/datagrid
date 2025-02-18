---
editUrl: false
next: true
prev: true
title: "PaginationFeature"
---

Defined in: core/features/pagination.svelte.ts:45

Manages pagination functionality within the data grid, including page navigation, size adjustments, and event handling.

## Type Parameters

• **TOriginalRow** = `any`

## Implements

- [`IRowPinningFeature`](/api/type-aliases/irowpinningfeature/)

## Constructors

### new PaginationFeature()

> **new PaginationFeature**\<`TOriginalRow`\>(`datagrid`, `config`?): [`PaginationFeature`](/api/classes/paginationfeature/)\<`TOriginalRow`\>

Defined in: core/features/pagination.svelte.ts:78

Creates an instance of the PaginationFeature class.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The data grid instance to which pagination will be applied.

##### config?

`Partial`

Optional configuration to initialize the feature.

#### Returns

[`PaginationFeature`](/api/classes/paginationfeature/)\<`TOriginalRow`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autoresetpage"></a> `autoResetPage` | `boolean` | Flag indicating whether page resets automatically. | core/features/pagination.svelte.ts:50 |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | The instance of the data grid associated with this feature. | core/features/pagination.svelte.ts:47 |
| <a id="manual"></a> `manual` | `boolean` | Flag indicating whether pagination is manual. | core/features/pagination.svelte.ts:56 |
| <a id="onpaginationchange"></a> `onPaginationChange` | (`config`: [`PaginationFeature`](/api/classes/paginationfeature/)\<`any`\>) => `void` | Callback function to handle changes in pagination state. | core/features/pagination.svelte.ts:53 |
| <a id="page"></a> `page` | `any` | The current page number (starts at 1). | core/features/pagination.svelte.ts:59 |
| <a id="pagecount"></a> `pageCount` | `number` | Total number of pages available. | core/features/pagination.svelte.ts:68 |
| <a id="pagesize"></a> `pageSize` | `any` | The number of rows per page (default is 10). | core/features/pagination.svelte.ts:62 |
| <a id="pagesizes"></a> `pageSizes` | `any` | Available options for rows per page (e.g., [10, 20, 50, 100]). | core/features/pagination.svelte.ts:65 |
| <a id="totalcount"></a> `totalCount` | `number` | Total count of rows across all pages. | core/features/pagination.svelte.ts:71 |

## Methods

### canGoToNextPage()

> **canGoToNextPage**(): `boolean`

Defined in: core/features/pagination.svelte.ts:95

Determines if the next page can be navigated to.

#### Returns

`boolean`

`true` if the current page is equal to the last page, meaning no next page exists.

***

### canGoToPrevPage()

> **canGoToPrevPage**(): `boolean`

Defined in: core/features/pagination.svelte.ts:87

Determines if the previous page can be navigated to.

#### Returns

`boolean`

`true` if the current page is 1, meaning no previous page exists.

***

### getPageCount()

> **getPageCount**(`data`): `number`

Defined in: core/features/pagination.svelte.ts:164

Calculates the total number of pages based on the current data set and page size.

#### Parameters

##### data

`any`[]

The dataset used for pagination calculation.

#### Returns

`number`

The total number of pages.

***

### goToClosestPage()

> **goToClosestPage**(): `void`

Defined in: core/features/pagination.svelte.ts:153

Navigates to the closest valid page, ensuring it's within the range of available pages.

#### Returns

`void`

***

### goToFirstPage()

> **goToFirstPage**(): `void`

Defined in: core/features/pagination.svelte.ts:135

Navigates to the first page.

#### Returns

`void`

***

### goToLastPage()

> **goToLastPage**(): `void`

Defined in: core/features/pagination.svelte.ts:144

Navigates to the last page.

#### Returns

`void`

***

### goToNextPage()

> **goToNextPage**(): `void`

Defined in: core/features/pagination.svelte.ts:115

Navigates to the next page, if possible.

#### Returns

`void`

***

### goToPage()

> **goToPage**(`newPage`): `void`

Defined in: core/features/pagination.svelte.ts:103

Navigates to a specific page.

#### Parameters

##### newPage

`number`

The page number to navigate to.

#### Returns

`void`

***

### goToPrevPage()

> **goToPrevPage**(): `void`

Defined in: core/features/pagination.svelte.ts:125

Navigates to the previous page, if possible.

#### Returns

`void`

***

### setPageSize()

> **setPageSize**(`newSize`): `void`

Defined in: core/features/pagination.svelte.ts:172

Updates the page size and adjusts pagination accordingly.

#### Parameters

##### newSize

`number`

The new page size to set.

#### Returns

`void`
