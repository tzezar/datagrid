import type { DatagridCore } from "../index.svelte";

export type PaginationFeatureState = {
    manual: boolean;
    page: number;
    pageSize: number;
    pageSizes: number[];
    pageCount: number;
    visibleRowsCount: number;
    autoResetPage: boolean;
    onPaginationChange(config: PaginationFeature<any>): void;

}

export type PaginationFeatureConfig = Partial<PaginationFeatureState>

export type IRowPinningFeature = {} & PaginationFeatureState

/**
 * Manages pagination functionality within the data grid.
 */
export class PaginationFeature<TOriginalRow = any> implements IRowPinningFeature {
    // The instance of the data grid associated with this feature
    datagrid: DatagridCore<TOriginalRow>;


    autoResetPage: boolean = $state(false);
    onPaginationChange: (config: PaginationFeature<any>) => void = () => { };

    manual: boolean = $state(false);

    // The current page number (starts at page 1)
    page = $state(1);

    // The number of items per page (initially set to 10)
    pageSize = $state(10);

    // Available page size options (e.g., [10, 20, 50, 100])
    pageSizes = $state([10, 20, 50, 100]);

    // Total number of pages in the current data set
    pageCount: number = $state(0);
    visibleRowsCount: number = $state(0);


    constructor(datagrid: DatagridCore<TOriginalRow>, config?: PaginationFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    canGoToPrevPage(): boolean {
        return this.page === 1;
    }

    canGoToNextPage(): boolean {
        return this.page === this.pageCount;
    }

    goToPage(page: number): void {
        if (page === this.page) return; // No action if already on the specified page
        this.page = page;
    }

    goToNextPage(): void {
        if (this.canGoToNextPage()) return;
        this.goToPage(this.page + 1);
    }

    goToPrevPage(): void {
        if (this.canGoToPrevPage()) return;
        this.goToPage(this.page - 1);
    }


    goToFirstPage(): void {
        this.goToPage(1);
    }

    goToLastPage(): void {
        this.goToPage(this.pageCount);
    }

    goToClosestPage(): void {
        const closestPage = Math.min(this.page, this.pageCount); // Ensure the page is within valid bounds
        this.goToPage(closestPage);
    }


    getPageCount(data: Array<any>): number {
        return Math.ceil(data.length / this.pageSize);
    }

    setPageSize(newSize: number): void {
        if (newSize === this.pageSize) return; // No action if the page size is the same
        this.pageSize = newSize;
        this.pageCount = this.getPageCount(this.datagrid.cache.rows || []);
        // Recalculate pagination and ensure the page is within the valid range after the page size change
        this.goToClosestPage();
    }
}
