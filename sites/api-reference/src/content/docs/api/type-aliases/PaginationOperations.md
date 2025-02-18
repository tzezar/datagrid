---
editUrl: false
next: true
prev: true
title: "PaginationOperations"
---

> **PaginationOperations**: `object`

Defined in: core/services/pagination-service.ts:6

Interface for pagination operations in the data grid, including navigation and page size management.

## Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="changepagesize"></a> `changePageSize` | (`newPageSize`) => `void` | Changes the page size for the data grid. | core/services/pagination-service.ts:22 |
| <a id="gotonextpage"></a> `goToNextPage` | () => `void` | Navigates to the next page in the data grid. | core/services/pagination-service.ts:15 |
| <a id="gotopage"></a> `goToPage` | (`newPage`) => `void` | Navigates to a specific page in the data grid. | core/services/pagination-service.ts:29 |
| <a id="gotoprevpage"></a> `goToPrevPage` | () => `void` | Navigates to the previous page in the data grid. | core/services/pagination-service.ts:10 |
