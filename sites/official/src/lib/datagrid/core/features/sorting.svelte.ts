import type { DatagridCore } from "../index.svelte";
import type { ColumnId, Sorting, SortingDirection } from "../types";

export type SortingFeatureState = {
    sortConfigs: Sorting[];
    isManual: boolean;
    allowMultiSort: boolean;
    maxMultiSortColumns: number;
}


export type ISortingFeature = {
    clearSortConfigs(): void;
    removeSortConfig(columnId: ColumnId): void;
    changeSortConfigDirection(columnId: ColumnId, direction: SortingDirection): void;
    addSortConfig(columnId: ColumnId, direction: SortingDirection): void;
    isColumnSorted(columnId: ColumnId, direction?: SortingDirection): boolean;
    findSortConfigIndex(columnId: ColumnId): number;
    findSortConfigByColumnId(columnId: ColumnId): Sorting | undefined;
} & SortingFeatureState

export type SortingFeatureConfig = Partial<SortingFeatureState>

export class SortingFeature implements ISortingFeature {
    datagrid: DatagridCore<any>;
    sortConfigs: Sorting[] = $state([]); // List of sort configurations, each representing a column's sort state
    isManual: boolean = $state(false);
    allowMultiSort: boolean = $state(true);
    maxMultiSortColumns: number = $state(Infinity);
    onSortingChange: (config: SortingFeature) => void = () => { };


    constructor(datagrid: DatagridCore<any>, config?: SortingFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);

    }

    getSortConfigByColumnId(columnId: ColumnId): Sorting | undefined {
        return this.findSortConfigByColumnId(columnId);
    }

    findSortConfigByColumnId(columnId: ColumnId): Sorting | undefined {
        return this.sortConfigs.find((config) => config.columnId === columnId);
    }

    findSortConfigIndex(columnId: ColumnId): number {
        return this.sortConfigs.findIndex((config) => config.columnId === columnId);
    }


    getSortConfigIndex = (columnId: ColumnId): number | null => {
        const sortConfig = this.getSortConfigByColumnId(columnId);
        return sortConfig ? this.datagrid.features.sorting.sortConfigs.indexOf(sortConfig) + 1 : null;
    };

    getSortDirection = (columnId: ColumnId): SortingDirection => {
        const sortConfig = this.getSortConfigByColumnId(columnId);
        if (!sortConfig) return 'intermediate';
        return sortConfig.direction;
    };

    clearSortConfigs() {
        this.sortConfigs = [];
    }

    removeSortConfig(columnId: ColumnId) {
        this.sortConfigs = this.sortConfigs.filter((config) => config.columnId !== columnId);
    }


    changeSortConfigDirection(columnId: ColumnId, direction: SortingDirection) {
        const index = this.findSortConfigIndex(columnId);
        if (index === -1) return; // If the column is not sorted, do nothing

        // Update the sort direction for the specified column
        this.sortConfigs = this.sortConfigs.map((config, i) =>
            i === index ? { ...config, direction } : config
        );
    }

    addSortConfig(columnId: ColumnId, direction: SortingDirection) {
        if (this.sortConfigs.length >= this.maxMultiSortColumns) return;
        this.sortConfigs = [
            ...this.sortConfigs,
            { columnId, direction }
        ];
    }

    isColumnSorted(columnId: ColumnId, direction?: SortingDirection): boolean {
        if (!direction) return this.sortConfigs.some((config) => config.columnId === columnId);

        // Return true if the column is sorted with the specified direction
        return this.sortConfigs.some((config) => config.columnId === columnId && config.direction === direction);
    }
}
