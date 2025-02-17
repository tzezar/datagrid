import type { DatagridCore } from "../index.svelte";
import type { ColumnId, LeafColumn } from "../types";
import { findColumnById } from "../utils.svelte";

/**
 * Represents the state of the Column Visibility feature.
 * This feature manages the visibility of columns within the DataGrid.
 */
export type ColumnVisibilityFeatureState = {
    /**
     * Callback function triggered when the visibility of columns changes.
     * This function is called with a list of column IDs that are hidden.
     * 
     * @param {string[]} hiddenColumns - The list of column IDs that are hidden.
     */
    onColumnVisibilityChange: (hiddenColumns: string[]) => void;
};

/**
 * Configuration for the Column Visibility feature.
 * Allows partial updates to the feature's state, such as setting visibility change handlers.
 */
export type ColumnVisibilityPluginConfig = Partial<ColumnVisibilityFeatureState>;

/**
 * Interface for the Column Visibility feature.
 * Defines the essential state and methods for managing column visibility.
 */
export type IColumnVisibilityFeature = ColumnVisibilityFeature;

/**
 * Manages the visibility of columns in the DataGrid.
 * This feature allows columns to be shown or hidden dynamically and triggers an event when their visibility changes.
 */
export class ColumnVisibilityFeature<TOriginalRow = any> implements IColumnVisibilityFeature {
    /**
     * A reference to the DataGrid instance that this feature operates on.
     */
    datagrid: DatagridCore<TOriginalRow>;

    /**
     * Callback function triggered when the visibility of columns changes.
     * This function is called with the updated column's visibility state.
     * 
     * @param {string[]} hiddenColumns - The list of column IDs that are hidden.
     */
    onColumnVisibilityChange: (hiddenColumns: string[]) => void = () => { };

    /**
     * Initializes the ColumnVisibilityFeature with a reference to the DataGrid and optional configuration.
     * This feature helps manage the visibility of columns, allowing for toggling, showing, and hiding columns.
     * 
     * @param {DatagridCore<TOriginalRow>} datagrid - The DataGrid instance that this feature will operate on.
     * @param {ColumnVisibilityPluginConfig} [config] - Optional configuration for column visibility, such as a custom visibility change handler.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnVisibilityPluginConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Toggles the visibility of a column.
     * If the column is currently visible, it will be hidden. If it is hidden, it will be shown.
     * 
     * @param {ColumnId} columnId - The ID of the column to toggle visibility for.
     */
    toggleColumnVisibility(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columns.getLeafColumns(), columnId) as LeafColumn<any>;
        if (!column) return;

        // Toggle the visibility state of the column
        if (column.state.visible) this.hideColumn(columnId);
        else this.showColumn(columnId);
    }

    /**
     * Hides a column, making it invisible in the DataGrid.
     * It also emits an event to notify that the column's visibility has changed.
     * 
     * @param {ColumnId} columnId - The ID of the column to hide.
     */
    hideColumn(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columns.getLeafColumns(), columnId) as LeafColumn<any>;
        if (!column) return;

        // Set the column's visibility state to false (hidden)
        column.state.visible = false;

        // Emit the visibility change event
        this.datagrid.events.emit('onColumnVisibilityChange', { column });
    }

    /**
     * Shows a column, making it visible in the DataGrid.
     * It also emits an event to notify that the column's visibility has changed.
     * 
     * @param {ColumnId} columnId - The ID of the column to show.
     */
    showColumn(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columns.getLeafColumns(), columnId) as LeafColumn<any>;
        if (!column) return;

        // Set the column's visibility state to true (visible)
        column.state.visible = true;

        // Emit the visibility change event
        this.datagrid.events.emit('onColumnVisibilityChange', { column });
    }
}
