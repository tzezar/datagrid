import type { DatagridCore } from "../index.svelte";
import type { ColumnId, Sorting } from "../types";

export type SortingFeatureState = {
    sortConfigs: Sorting[];
    isManual: boolean;
    allowMultiSort: boolean;
    maxMultiSortColumns: number;
}


export type SortingFeatureConfig = {
    onSortingChange?(config: any): void;
} & Partial<SortingFeatureState>

/**
 * This class manages the sorting behavior within the data grid.
 * It allows adding, removing, and changing the sorting direction of columns.
 */
export class SortingFeature implements SortingFeatureState {
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

    clearSortConfigs() {
        this.sortConfigs = [];
    }

    removeSortConfig(columnId: ColumnId) {
        this.sortConfigs = this.sortConfigs.filter((config) => config.columnId !== columnId);
    }

    findSortConfigIndex(columnId: ColumnId): number {
        return this.sortConfigs.findIndex((config) => config.columnId === columnId);
    }

    changeSortConfigDirection(columnId: ColumnId, desc: boolean) {
        const index = this.findSortConfigIndex(columnId);
        if (index === -1) return; // If the column is not sorted, do nothing

        // Update the sort direction for the specified column
        this.sortConfigs = this.sortConfigs.map((config, i) =>
            i === index ? { ...config, desc } : config
        );
    }

    addSortConfig(columnId: ColumnId, desc: boolean) {
        if (this.sortConfigs.length >= this.maxMultiSortColumns) return;
        this.sortConfigs = [
            ...this.sortConfigs,
            { columnId, desc }
        ];
    }

    isColumnSorted(columnId: ColumnId, desc?: boolean): boolean {
        if (desc === undefined) {
            // Return true if the column is sorted in any direction
            return this.sortConfigs.some((config) => config.columnId === columnId);
        }

        // Return true if the column is sorted with the specified direction
        return this.sortConfigs.some((config) => config.columnId === columnId && config.desc === desc);
    }
}
