import type { DatagridInstance, SortingStateConfig } from "../index.svelte";
import type { ColumnId } from "../processors/column-processor.svelte";
import type { Accessor } from "../types";

export type SortDirection = "asc" | "desc";
export type SortMode = "multi" | "single" | "none";

export interface Sort<TData> {
    columnId: ColumnId;
    accessor: Accessor<TData>;
    direction: SortDirection;
}

export type SortBy<TData> = Sort<TData>[];  // Removed readonly to allow mutations

export type SortingFeature<TData> = {
    initialize(state: SortingStateConfig<TData>): void;
    _sortedDataCache: TData[];
    toggleSort(accessor: string): void;
    clearSort(): void;
    setSortMode(mode: SortMode): void;
} & SortingState<TData>

export type SortingState<TData> = {
    sortBy: SortBy<TData>
    mode: SortMode
}

export class SortingManager<TData> implements SortingFeature<TData> {
    protected grid: DatagridInstance<TData, any>;
    sortBy: SortBy<TData> = $state([]);
    mode: SortMode = "single";
    _sortedDataCache: TData[] = [];

    constructor(grid: DatagridInstance<TData, any>) {
        this.grid = grid;
    }

    initialize(state: SortingStateConfig<TData>): void {
        this.sortBy = state.sortBy || this.sortBy;
        this.mode = state.mode || this.mode;
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