import type { Datagrid } from "../index.svelte";



export class PaginationFeature<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    page = $state(1);
    pageSize = $state(10);
    pageSizes = $state([10, 20, 50, 100, 100000]);
    pageCount: number = $state(0);
    visibleRowsCount: number = $state(0);

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    canGoToPrevPage(): boolean {
        return this.page === 1;
    }

    canGoToNextPage(): boolean {
        return this.page === this.pageCount;
    }

    goToPage(page: number): void {
        if (page === this.page) return;
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
        const closestPage = Math.min(this.page, this.pageCount);
        this.goToPage(closestPage);
    }

    getPageCount(data: Array<any>): number {
        return Math.ceil(data.length / this.pageSize);
    }

    setPageSize(newSize: number): void {
        if (newSize === this.pageSize) return;
        this.pageSize = newSize;
        // When changing page size, we need to recalculate pagination
        // and make sure we're on a valid page
        this.goToClosestPage();
    }
}
