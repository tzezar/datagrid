import type { DataGrid } from "../index.svelte";
import type { ColumnId } from "../types";


export type ColumnSizingFeatureConfig = {
    onColumnResize?(columnId: string, width: number): void;
}

/**
 * Handles column sizing logic for a DataGrid.
 */
export class ColumnSizingFeature<TOriginalRow> {
    // Reference to the DataGrid instance
    datagrid: DataGrid<TOriginalRow>;

    onColumnResize: (columnId: string, width: number) => void = () => { };

    /**
     * Initializes the ColumnSizingFeature with a reference to the DataGrid.
     * @param datagrid - The DataGrid instance to manage column sizes.
     */
    constructor(datagrid: DataGrid<TOriginalRow>, config?: ColumnSizingFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: ColumnSizingFeatureConfig) {
        this.onColumnResize = config?.onColumnResize ?? this.onColumnResize;
    }

    /**
     * Updates the size (width) of a specific column by its ID.
     * Ensures the width is clamped between the column's `minWidth` and `maxWidth`.
     * @param columnId - The unique identifier of the column to resize.
     * @param width - The new width to set for the column.
     * @throws If the column with the specified ID is not found.
     */
    updateColumnSize(columnId: ColumnId, width: number): void {
        // Retrieve all leaf columns (ignoring grouped columns)
        const leafColumns = this.datagrid.columnManager.getLeafColumns();

        // Find the column with the specified ID
        const column = leafColumns.find(c => c.columnId === columnId);
        if (!column) {
            throw new Error(`Column with ID "${columnId}" not found.`);
        }

        // Determine the new width, clamped between the column's minWidth and maxWidth
        const { minWidth, maxWidth } = column.state.size;
        column.state.size.width = Math.max(
            minWidth || 0, // Default to 0 if minWidth is undefined
            Math.min(width, maxWidth || Number.MAX_SAFE_INTEGER) // Default to a very large number if maxWidth is undefined
        );
    }
}
