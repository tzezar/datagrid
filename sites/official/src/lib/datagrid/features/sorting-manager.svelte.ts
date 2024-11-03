import type { DatagridInstance } from "../index.svelte";

export type SortDirection = "asc" | "desc";
export type SortMode = "multi" | "single" | "none";

export interface Sort {
    readonly accessor: string;
    direction: SortDirection;
}

export type SortBy = Sort[];  // Removed readonly to allow mutations

export interface SortingFeature {
    sortBy: SortBy;
    mode: SortMode;
    sortedData: any[];
    toggleSort(accessor: string): void;
    clearSort(): void;
    setSortMode(mode: SortMode): void;
}

export class SortingManager implements SortingFeature {
    protected grid: DatagridInstance;
    sortBy: SortBy = [];
    mode: SortMode = "single";
    sortedData: any[] = [];

    constructor(
        grid: DatagridInstance,
        initialSort: SortBy = [{ accessor: 'department', direction: 'asc' }],
        mode: SortMode = "single"
    ) {
        this.grid = grid;
        this.mode = mode;
        this.sortBy = initialSort;
    }

    public toggleSort(accessor: string): void {
        if (this.mode === "none") return;

        const currentSortIndex = this.sortBy.findIndex(sort => sort.accessor === accessor);

        if (this.mode === "single") {
            if (currentSortIndex !== -1) {
                // If clicking the same column, toggle direction
                if (this.sortBy[currentSortIndex].direction === "asc") {
                    this.sortBy = [{ accessor, direction: "desc" }];
                } else {
                    this.sortBy = [];  // Clear sorting if already desc
                }
            } else {
                // New column, set to asc
                this.sortBy = [{ accessor, direction: "asc" }];
            }
        } else {  // multi mode
            if (currentSortIndex === -1) {
                this.sortBy.push({ accessor, direction: "asc" });
            } else if (this.sortBy[currentSortIndex].direction === "asc") {
                this.sortBy[currentSortIndex].direction = "desc";
            } else {
                this.sortBy.splice(currentSortIndex, 1);
            }
        }

        // Clear the sorted data cache to force re-sorting
        this.sortedData = [];
        // Trigger grid update
        this.grid.rows = this.grid.dataProcessor.initialize();
    }
    public clearSort(): void {
        if (this.sortBy.length === 0) return;

        this.sortBy = [];
        this.sortedData = [];
        this.grid.rows = this.grid.dataProcessor.initialize();
    }

    public setSortMode(mode: SortMode): void {
        if (this.mode === mode) return;

        this.mode = mode;
        if (mode === "none") {
            this.clearSort();
        } else if (mode === "single" && this.sortBy.length > 1) {
            this.sortBy = [this.sortBy[0]];
            this.sortedData = [];
            this.grid.dataProcessor.initialize();
        }
    }
}