import type { DatagridCore } from "../index.svelte";
import type { ColumnId, LeafColumn } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";

/**
 * Represents the state of the Column Sizing feature.
 * This feature handles column width adjustments and ensures columns are resized within their constraints (min/max width).
 */
export type ColumnSizingFeatureState = object;
/**
 * Configuration for the Column Sizing feature.
 * Allows partial updates to the feature's state, such as setting default column sizes.
 */
export type ColumnSizingFeatureConfig = Partial<ColumnSizingFeatureState>;

/**
 * Interface for the Column Sizing feature.
 * Defines the essential state and methods for managing column resizing.
 */
export type IColumnSizingFeature = Partial<ColumnSizingFeatureConfig>;

/**
 * The ColumnSizingFeature class manages the resizing of columns in a data grid.
 * It allows columns to be resized within their specified constraints and notifies the grid when columns are resized.
 */
export class ColumnSizingFeature<TOriginalRow = any> implements IColumnSizingFeature {
    /**
     * A reference to the DataGrid instance that manages the columns and their resizing.
     */
    datagrid: DatagridCore<TOriginalRow>;

    /**
     * Callback function triggered when a column's size is changed.
     * This function is called with the column ID and the new width after resizing.
     *
     * @param {string} columnId - The ID of the column that was resized.
     * @param {number} width - The new width of the resized column.
     */
    onColumnResize: (columnId: string, width: number) => void = () => { };

    /**
     * Initializes the ColumnSizingFeature with a reference to the DataGrid and optional configuration.
     * This feature helps manage column widths and their constraints, such as min and max width.
     *
     * @param {DatagridCore<TOriginalRow>} datagrid - The DataGrid instance that this feature will operate on.
     * @param {ColumnSizingFeatureConfig} [config] - Optional configuration for column sizing, such as default sizes.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnSizingFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Updates the size (width) of a column, ensuring the new width adheres to the column's minimum and maximum width constraints.
     * Emits an event when the column size is updated.
     * 
     * The width is clamped between the column's `minWidth` and `maxWidth` to ensure it is within valid bounds.
     * 
     * @param {ColumnId} columnId - The ID of the column to resize.
     * @param {number} width - The new width to apply to the column.
     * 
     * @throws {Error} Throws an error if the column with the provided `columnId` cannot be found.
     */
    updateColumnSize(columnId: ColumnId, width: number): void {
        // Find the column by its ID, flattening the column structure if necessary
        const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid._columns), columnId) as LeafColumn<TOriginalRow>;

        // Emit the column resize event with the updated column information
        this.datagrid.events.emit('onColumnResize', { column });

        // Retrieve the column's minWidth and maxWidth constraints
        const { minWidth, maxWidth } = column.state.size;

        // Update the column width, clamped between minWidth and maxWidth
        column.state.size.width = Math.max(
            minWidth || 0, // Default to 0 if minWidth is undefined
            Math.min(width, maxWidth || Number.MAX_SAFE_INTEGER) // Default to a very large number if maxWidth is undefined
        );
    }
}
