import { BaseService } from "./base-service";

/**
 * Interface for pagination operations in the data grid, including navigation and page size management.
 */
export type PaginationOperations = {
    /**
     * Navigates to the previous page in the data grid.
     */
    goToPrevPage: () => void;

    /**
     * Navigates to the next page in the data grid.
     */
    goToNextPage: () => void;

    /**
     * Changes the page size for the data grid.
     * 
     * @param {number} newPageSize The new page size to set.
     */
    changePageSize: (newPageSize: number) => void;

    /**
     * Navigates to a specific page in the data grid.
     * 
     * @param {number} newPage The page number to navigate to.
     */
    goToPage: (newPage: number) => void;
}

/**
 * Service for handling pagination-related operations in the data grid, such as navigating between pages,
 * changing page sizes, and jumping to a specific page.
 * 
 * @extends BaseService
 */
export class PaginationService extends BaseService implements PaginationOperations {

    /**
     * Navigates to the previous page in the data grid.
     * Refreshes the data grid with pagination updates.
     */
    goToPrevPage() {
        this.datagrid.refresh(() => this.datagrid.features.pagination.goToPrevPage(), {
            recalculateAll: false,
            recalculateGroups: false,
            recalculatePagination: true
        });
    }

    /**
     * Navigates to the next page in the data grid.
     * Refreshes the data grid with pagination updates.
     */
    goToNextPage() {
        this.datagrid.refresh(() => this.datagrid.features.pagination.goToNextPage(), {
            recalculateAll: false,
            recalculateGroups: false,
            recalculatePagination: true
        });
    }

    /**
     * Changes the page size for the data grid.
     * 
     * @param {number} newPageSize The new page size to set.
     * Refreshes the data grid with pagination updates.
     */
    changePageSize(newPageSize: number) {
        this.datagrid.refresh(() => this.datagrid.features.pagination.setPageSize(newPageSize), {
            recalculatePagination: true
        });
    }

    /**
     * Navigates to a specific page in the data grid.
     * 
     * @param {number} newPage The page number to navigate to.
     * Refreshes the data grid with pagination updates.
     */
    goToPage(newPage: number) {
        this.datagrid.refresh(() => {
            this.datagrid.features.pagination.goToPage(newPage);
        });
    }
}
