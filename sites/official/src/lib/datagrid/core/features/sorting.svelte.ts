import type { DataGrid } from "../index.svelte";
import type { ColumnId, Sorting } from "../types";


export type SortingFeatureConfig = {
    manual: boolean;
    sortConfigs?: Sorting[];
}

/**
 * This class manages the sorting behavior within the data grid.
 * It allows adding, removing, and changing the sorting direction of columns.
 */
export class SortingFeature {
    manual: boolean = $state(false);

    // The instance of the data grid associated with this feature
    datagrid: DataGrid<any>;

    // List of sort configurations, each representing a column's sort state
    sortings: Sorting[] = $state([]);

    /**
     * Constructor to initialize the sorting feature with a reference to the data grid.
     * @param datagrid - The data grid instance to associate with this sorting feature.
     */
    constructor(datagrid: DataGrid<any>, config?: SortingFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: SortingFeatureConfig) {
        this.manual = config?.manual ?? this.manual;
        this.sortings = config?.sortConfigs ?? this.sortings;
    }


    /**
     * Refreshes the indices of the sort configurations, ensuring each config has an up-to-date index.
     */
    refreshIndices() {
        this.sortings = this.sortings.map((config, index) => ({
            ...config,
            index
        }));
    }

    /**
     * Clears all the sorting configurations, effectively removing any sorting from the grid.
     */
    clearSorting() {
        this.sortings = [];
    }

    /**
     * Removes the sort configuration for a given column.
     * @param columnId - The ID of the column to remove from sorting.
     */
    removeSortConfig(columnId: ColumnId) {
        this.sortings = this.sortings.filter((config) => config.columnId !== columnId);
        this.refreshIndices(); // Refresh indices after removing a sort config
    }

    /**
     * Finds the index of a given column in the sorting configuration.
     * @param columnId - The ID of the column to find.
     * @returns The index of the column in the sort configuration array, or -1 if not found.
     */
    findIndex(columnId: ColumnId): number {
        return this.sortings.findIndex((config) => config.columnId === columnId);
    }

    /**
     * Changes the sorting direction (ascending/descending) for a specified column.
     * @param columnId - The ID of the column to update.
     * @param desc - The desired sorting direction; true for descending, false for ascending.
     */
    changeDirection(columnId: ColumnId, desc: boolean) {
        const index = this.findIndex(columnId);
        if (index === -1) return; // If the column is not sorted, do nothing

        // Update the sort direction for the specified column
        this.sortings = this.sortings.map((config, i) =>
            i === index ? { ...config, desc } : config
        );
    }

    /**
     * Adds a new sort configuration for a specified column.
     * @param columnId - The ID of the column to add a sorting configuration for.
     * @param desc - The sorting direction; true for descending, false for ascending.
     */
    addSortConfig(columnId: ColumnId, desc: boolean) {
        this.sortings = [
            ...this.sortings,
            { columnId, desc, index: this.sortings.length }
        ];
    }

    /**
     * Checks if a given column is currently sorted.
     * Optionally checks the sorting direction (ascending or descending).
     * @param columnId - The ID of the column to check.
     * @param desc - Optional; if specified, checks for the sorting direction.
     * @returns True if the column is sorted, optionally with the specified direction.
     */
    isColumnSorted(columnId: ColumnId, desc?: boolean): boolean {
        if (desc === undefined) {
            // Return true if the column is sorted in any direction
            return this.sortings.some((config) => config.columnId === columnId);
        }

        // Return true if the column is sorted with the specified direction
        return this.sortings.some((config) => config.columnId === columnId && config.desc === desc);
    }
}
