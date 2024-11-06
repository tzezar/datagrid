import type { DatagridInstance } from "../index.svelte";

export type PaginationState = {
    page: number
    pageSize: number
    count: number
    pageSizes: number[]
    pageCount: number
}

export type PaginationFeature = {
    canPrevPage(): boolean;
    canNextPage(): boolean;
    goToPage(page: number): void;
    goToNextPage(): void;
    goToPrevPage(): void;
    goToFirstPage(): void;
    goToLastPage(): void;
    goToClosestPage(): void;

    updatePageSize(pageSize: number): void;
    updatePageCount(): void;
} & PaginationState


export class PaginationManager implements PaginationFeature {
    protected grid: DatagridInstance;

    page = $state(1);
    pageSize = 10;
    count = 0;
    pageSizes = [10, 25, 50, 100];
    pageCount = $state(0)

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }



    canPrevPage(): boolean {
        return this.page === 1;
    }

    canNextPage(): boolean {
        return this.page === this.pageCount;
    }

    goToPage(page: number): void {
        this.page = page;
    }

    goToNextPage(): void {
        if (this.canNextPage()) return;
        this.goToPage(this.page + 1);
    }

    goToPrevPage(): void {
        if (this.canPrevPage()) return;
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

    updatePageSize(pageSize: number): void {
        this.pageSize = pageSize;
        this.pageCount = Math.ceil(this.grid.getVisibleRowCount() / this.pageSize);
        this.goToPage(1);
    }

    updatePageCount(): void {
        this.pageCount = Math.ceil(this.grid.getVisibleRowCount() / this.pageSize);
    }
}