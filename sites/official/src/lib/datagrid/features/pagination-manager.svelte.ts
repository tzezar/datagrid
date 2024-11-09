import type { DatagridInstance, PaginationStateConfig } from "../index.svelte";

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

    initialize(state: Partial<PaginationState>): void
} & PaginationState


export class PaginationManager<TData> implements PaginationFeature {
    protected grid: DatagridInstance<TData, any>

    page = $state(1);
    pageSize = 10;
    count = 0;
    pageSizes = [10, 25, 50, 100];
    pageCount = $state(0)

    constructor(grid: DatagridInstance<TData, any>) {
        this.grid = grid;
    }

    initialize (state: PaginationStateConfig) {
        this.page = state.page || this.page;
        this.pageSize = state.pageSize || this.pageSize;
        this.count = state.count || this.count;
        this.pageSizes = state.pageSizes || this.pageSizes;
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