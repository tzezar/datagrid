import type { AnyColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId, PinningPosition } from "../types";

export class ColumnPinningFeature {
    // Reference to the DataGrid instance
    datagrid: DataGrid<any>;

    // Initialize the ColumnPinningFeature with a reference to the DataGrid
    constructor(datagrid: DataGrid<any>) {
        this.datagrid = datagrid;
    }

    /**
     * Changes the pinning position of a given column.
     * @param column - The column to update.
     * @param position - The new pinning position ('left', 'right', or null).
     */
    changeColumnPinningPosition(column: AnyColumn<any>, position: PinningPosition): void {
        column.state.pinning.position = position;
    }

    /**
     * Calculates the offset (in pixels) for a column based on its pinning position.
     * @param columnId - The unique ID of the column.
     * @param position - The pinning position ('left', 'right', or null).
     * @returns The calculated offset for the column. Returns -1 if position is null.
     */
    calculateOffset(columnId: ColumnId, position: 'left' | 'right' | null): number {
        if (position === null) return -1; // No offset for unpinned columns

        // Get all visible columns pinned to the specified position
        const pinnedColumns = this.datagrid.columnManager.getLeafColumns().filter(
            (column) => column.state.visible !== false && column.state.pinning.position === position
        );

        // Find the index of the column with the specified ID
        const index = pinnedColumns.findIndex((column) => column.columnId === columnId);

        // If the column is not found or is the first in the pinned list, return 0
        if (index === -1 || index === 0) {
            return 0;
        }

        // Calculate the total width of all columns before the specified column
        const widthSumOfPreviousIndexes = pinnedColumns
            .slice(0, index) // Get all columns before the specified column
            .reduce((sum, column) => {
                // Use a default width of 0 if column width is not defined
                const width = column.state.size.width || 0;
                return sum + width;
            }, 0);

        return widthSumOfPreviousIndexes; // Return the total width as the offset
    }
}
