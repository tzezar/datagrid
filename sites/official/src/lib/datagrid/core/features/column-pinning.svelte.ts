import type { AnyColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId, PinningPosition } from "../types";



export type ColumnPinningFeatureState = {}
export type ColumnPinningFeatureConfig = Partial<ColumnPinningFeatureState>
export type IColumnPinningFeature = ColumnPinningFeatureState

export class ColumnPinningFeature implements IColumnPinningFeature {
    // Reference to the DataGrid instance
    datagrid: DatagridCore<any>;

    onColumnPinningChange: (pinnedColumns: string[]) => void = () => { };

    // Initialize the ColumnPinningFeature with a reference to the DataGrid
    constructor(datagrid: DatagridCore<any>, config?: ColumnPinningFeatureConfig) {
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

    calculateOffset(columns: AnyColumn<any>[], columnId: ColumnId, position: 'left' | 'right' | null): number {
        if (position === null) return -1; // No offset for unpinned columns

        // Get all visible columns pinned to the specified position
        const pinnedColumns = columns.filter(
            (column) => column.state.visible !== false && column.state.pinning.position === position
        );

        // Find the index of the column with the specified ID
        const index = pinnedColumns.findIndex((column) => column.columnId === columnId);

        // If column not found or if it's left-pinned and first, or right-pinned and last
        if (index === -1 || (position === 'left' && index === 0) ||
            (position === 'right' && index === pinnedColumns.length - 1)) {
            return 0;
        }

        if (position === 'left') {
            // For left-pinned columns, calculate from left to right
            return pinnedColumns
                .slice(0, index)
                .reduce((sum, column) => sum + (column.state.size.width || 0), 0);
        } else {
            // For right-pinned columns, calculate from right to left
            return pinnedColumns
                .slice(index + 1)
                .reduce((sum, column) => sum + (column.state.size.width || 0), 0);
        }
    }
}
