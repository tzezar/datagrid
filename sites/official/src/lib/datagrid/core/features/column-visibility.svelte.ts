import type { DatagridCore } from "../index.svelte";
import type { ColumnId } from "../types";
import { findColumnById } from "../utils.svelte";

export type ColumnVisibilityFeatureState = {
    onColumnVisibilityChange: (hiddenColumns: string[]) => void
}


export type ColumnVisibilityPluginConfig = Partial<ColumnVisibilityFeatureState>
export type IColumnVisibilityFeature = ColumnVisibilityFeature
/**
 * Manages column visibility functionality for a DataGrid.
 */
export class ColumnVisibilityFeature<TOriginalRow = any> implements IColumnVisibilityFeature {
    // Reference to the DataGrid instance
    datagrid: DatagridCore<TOriginalRow>;

    onColumnVisibilityChange: (hiddenColumns: string[]) => void = () => { };

    /**
     * Initializes the ColumnVisibilityFeature with a reference to the DataGrid.
     * @param datagrid - The DataGrid instance used to manage column visibility.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnVisibilityPluginConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Toggles the visibility of a specific column by its ID.
     * If the column is currently visible, it will be hidden, and vice versa.
     * @param columnId - The unique identifier of the column to toggle visibility for.
     * @throws If the column with the specified ID is not found.
     */
    toggleColumnVisibility(columnId: ColumnId): void {
        // Retrieve all leaf columns (ignoring grouped or parent columns)
        const leafColumns = this.datagrid.columnManager.getLeafColumns();

        // Find the column with the specified ID
        const column = leafColumns.find(c => c.columnId === columnId);
        if (!column) {
            throw new Error(`Column with ID "${columnId}" not found.`);
        }

        // Toggle the column's visibility state
        column.state.visible = !column.state.visible;
    }

    hideColumn(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columnManager.getLeafColumns(), columnId);
        if (column) {
            column.state.visible = false;
        }
    }

    showColumn(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columnManager.getLeafColumns(), columnId);
        if (column) {
            column.state.visible = true;
        }
    }

}
