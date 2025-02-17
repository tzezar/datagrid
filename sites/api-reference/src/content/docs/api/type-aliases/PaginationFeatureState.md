---
editUrl: false
next: true
prev: true
title: "PaginationFeatureState"
---

> **PaginationFeatureState**: `object`

Defined in: core/features/pagination.svelte.ts:6

State configuration for the Pagination feature in the data grid.

## Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autoresetpage"></a> `autoResetPage` | `boolean` | Whether the page number should automatically reset when the data changes. | core/features/pagination.svelte.ts:26 |
| <a id="manual"></a> `manual` | `boolean` | Indicates whether the pagination is controlled manually. | core/features/pagination.svelte.ts:8 |
| <a id="page"></a> `page` | `number` | The current page number (starts at 1). | core/features/pagination.svelte.ts:11 |
| <a id="pagecount"></a> `pageCount` | `number` | The total number of pages available. | core/features/pagination.svelte.ts:20 |
| <a id="pagesize"></a> `pageSize` | `number` | The number of rows per page. | core/features/pagination.svelte.ts:14 |
| <a id="pagesizes"></a> `pageSizes` | `number`[] | Available page size options (e.g., [10, 20, 50, 100]). | core/features/pagination.svelte.ts:17 |
| <a id="totalcount"></a> `totalCount` | `number` | The total number of rows across all pages. | core/features/pagination.svelte.ts:23 |
| <a id="onpaginationchange"></a> `onPaginationChange()` | `void` | Callback invoked when the pagination state changes. | core/features/pagination.svelte.ts:29 |
