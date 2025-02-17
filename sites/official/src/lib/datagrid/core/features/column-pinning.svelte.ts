import type { ColumnDef, LeafColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId, PinningPosition } from "../types";

/**
 * Represents the state of the Column Pinning Feature.
 * The feature tracks the pinning state for columns in a data grid.
 */
export type ColumnPinningFeatureState = object;

/**
 * A configuration for the ColumnPinningFeature.
 * This allows for partial updates to the feature state during initialization.
 */
export type ColumnPinningFeatureConfig = Partial<ColumnPinningFeatureState>;

/**
 * Interface for the Column Pinning Feature.
 * This defines the essential state and methods for column pinning functionality.
 */
export type IColumnPinningFeature = ColumnPinningFeatureState;

/**
 * ColumnPinningFeature handles the pinning of columns in a data grid.
 * It allows columns to be pinned to the left or right and calculates the offset of pinned columns.
 */
export class ColumnPinningFeature implements IColumnPinningFeature {
    /**
     * Reference to the DataGrid instance to manage pinning operations.
     */
    datagrid: DatagridCore<any>;

    /**
     * Callback function triggered when the column pinning state changes.
     * This function is passed an array of pinned column IDs.
     *
     * @param {string[]} pinnedColumns - Array of column IDs that are currently pinned.
     */
    onColumnPinningChange: (pinnedColumns: string[]) => void = () => { };

    /**
     * Creates an instance of the ColumnPinningFeature.
     * The feature is initialized with a reference to the data grid and an optional configuration object.
     *
     * @param {DatagridCore<any>} datagrid - The data grid instance managing the columns.
     * @param {ColumnPinningFeatureConfig} [config] - Optional configuration to initialize the pinning feature.
     */
    constructor(datagrid: DatagridCore<any>, config?: ColumnPinningFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Changes the pinning position of a given column.
     * This method updates the column's pinning state and emits an event to notify the grid.
     * 
     * @param {LeafColumn<any>} column - The column whose pinning position needs to be changed.
     * @param {PinningPosition} position - The new pinning position. Can be 'left', 'right', or null.
     */
    changeColumnPinningPosition(column: LeafColumn<any>, position: PinningPosition): void {
        // Emit an event to notify the grid that the pinning state has changed
        this.datagrid.events.emit('onColumnPinningChange', { column });
        // Update the column's pinning position
        column.state.pinning.position = position;
    }

    /**
     * Calculates the offset for a column based on its pinning position.
     * The offset is the sum of the widths of all pinned columns that precede or follow the given column.
     * 
     * @param {ColumnDef<any>[]} columns - Array of all column definitions in the grid.
     * @param {ColumnId} columnId - The ID of the column whose offset needs to be calculated.
     * @param {'left' | 'right' | null} position - The pinning position of the column ('left', 'right', or null).
     * 
     * @returns {number} The offset for the given column, in pixels.
     * - A value of 0 means the column is at the edge of the grid, and no offset is needed.
     * - A value of -1 means the column is unpinned.
     */
    calculateOffset(columns: ColumnDef<any>[], columnId: ColumnId, position: 'left' | 'right' | null): number {
        // Return -1 for unpinned columns
        if (position === null) return -1;

        // Filter all visible columns that are pinned to the specified position (left or right)
        const pinnedColumns = columns.filter(
            (column) => column.state.visible !== false && column.state.pinning.position === position
        );

        // Find the index of the column with the specified ID among the pinned columns
        const index = pinnedColumns.findIndex((column) => column.columnId === columnId);

        // If column is not found or it's the first or last pinned column, return 0 (no offset needed)
        if (index === -1 || (position === 'left' && index === 0) ||
            (position === 'right' && index === pinnedColumns.length - 1)) {
            return 0;
        }

        if (position === 'left') {
            // For left-pinned columns, calculate the total width of columns before the target column
            return pinnedColumns
                .slice(0, index)
                .reduce((sum, column) => sum + (column.state.size.width || 0), 0);
        } else {
            // For right-pinned columns, calculate the total width of columns after the target column
            return pinnedColumns
                .slice(index + 1)
                .reduce((sum, column) => sum + (column.state.size.width || 0), 0);
        }
    }
}
