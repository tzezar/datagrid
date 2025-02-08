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

    goToPage(newPage: number): void {
        if (newPage === this.page) return; // No action if already on the specified page
        this.datagrid.events.emit('onPageChange', { prevPage: this.page, newPage: newPage });
        this.page = Math.min(
            Math.max(newPage, 1),
            this.datagrid.features.pagination.pageCount
        );
    }

    goToNextPage(): void {
        if (this.canGoToNextPage()) return;
        const newPage = this.page + 1;
        this.datagrid.events.emit('onPageChange', { prevPage: this.page, newPage });
        this.goToPage(newPage);
    }

    goToPrevPage(): void {
        if (this.canGoToPrevPage()) return;
        const newPage = this.page - 1;
        this.datagrid.events.emit('onPageChange', { prevPage: this.page, newPage });
        this.goToPage(newPage);
    }


    goToFirstPage(): void {
        const firstPage = 1;
        this.datagrid.events.emit('onPageChange', { prevPage: this.page, newPage: firstPage });
        this.goToPage(firstPage);
    }

    goToLastPage(): void {
        const lastPage = this.pageCount;
        this.datagrid.events.emit('onPageChange', { prevPage: this.page, newPage: lastPage });
        this.goToPage(lastPage);
    }

    goToClosestPage(): void {
        const closestPage = Math.min(this.page, this.pageCount); // Ensure the page is within valid bounds
        this.datagrid.events.emit('onPageChange', { prevPage: this.page, newPage: closestPage });
        this.goToPage(closestPage);
    }


    getPageCount(data: Array<any>): number {
        return Math.ceil(data.length / this.pageSize);
    }

    setPageSize(newSize: number): void {
        this.datagrid.events.emit('onPageSizeChange', { prevSize: this.pageSize, pageSize: newSize });
        if (newSize === this.pageSize) return; // No action if the page size is the same
        this.pageSize = newSize;
        this.pageCount = this.getPageCount(this.datagrid.cacheManager.rows || []);
        // Recalculate pagination and ensure the page is within the valid range after the page size change
        this.goToClosestPage();
    }
}
