import type { DatagridInstance } from "../index.svelte";
import type { Accessor, ColumnId } from "../processors/column-processor.svelte";

export type SortDirection = "asc" | "desc";
export type SortMode = "multi" | "single" | "none";

export interface Sort {
    columnId: ColumnId;
    accessor: Accessor,
    direction: SortDirection;
}

export type SortBy = Sort[];  // Removed readonly to allow mutations

export interface SortingFeature {
    sortBy: SortBy;
    mode: SortMode;
    _sortedDataCache: any[];
    toggleSort(accessor: string): void;
    clearSort(): void;
    setSortMode(mode: SortMode): void;
}

export class SortingManager implements SortingFeature {
    protected grid: DatagridInstance;
    sortBy: SortBy = $state([]);
    mode: SortMode = "single";
    _sortedDataCache: any[] = [];

    constructor(
        grid: DatagridInstance,
        initialSort: SortBy = [],
        mode: SortMode = "single"
    ) {
        this.grid = grid;
        this.mode = mode;
        this.sortBy = initialSort;
    }

    public toggleSort(columnId: ColumnId): void {
        const column = this.grid.columns.find(col => col.columnId === columnId);
        if (!column) return

        if (this.mode === "none") return;

        const currentSortIndex = this.sortBy.findIndex(sort => sort.columnId === columnId);

        if (this.mode === "single") {
            if (currentSortIndex !== -1) {
                // If clicking the same column, toggle direction
                if (this.sortBy[currentSortIndex].direction === "asc") {
                    this.sortBy = [{ columnId: columnId, direction: "desc", accessor: () => column.accessor }];
                } else {
                    this.sortBy = [];  // Clear sorting if already desc
                }
            } else {
                // New column, set to asc
                this.sortBy = [{ columnId: columnId, direction: "asc", accessor: () => column.accessor }];
            }
        } else {  // multi mode
            if (currentSortIndex === -1) {
                this.sortBy.push({ columnId: columnId, direction: "asc", accessor: () => column.accessor });
            } else if (this.sortBy[currentSortIndex].direction === "asc") {
                this.sortBy[currentSortIndex].direction = "desc";
            } else {
                this.sortBy.splice(currentSortIndex, 1);
            }
        }

        // Clear the sorted data cache to force re-sorting
        this._sortedDataCache = [];
        // Trigger grid update
        // this.grid.dataProcessor.initialize();
    }

    public clearSort(): void {
        if (this.sortBy.length === 0) return;

        this.sortBy = [];
        this._sortedDataCache = [];
        this.grid.dataProcessor.process();
    }

    public setSortMode(mode: SortMode): void {
        if (this.mode === mode) return;
        this.mode = mode;
        console.log(this.mode)
        if (mode === "none") {
            this.clearSort();
        } else if (mode === "single" && this.sortBy.length > 1) {
            this.sortBy = [this.sortBy[0]];
            this._sortedDataCache = [];
            this.grid.dataProcessor.process();
        }
    }
}