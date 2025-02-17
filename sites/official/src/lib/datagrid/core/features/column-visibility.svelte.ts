import type { DatagridCore } from "../index.svelte";
import type { ColumnId, LeafColumn } from "../types";
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
    datagrid: DatagridCore<TOriginalRow>;

    onColumnVisibilityChange: (hiddenColumns: string[]) => void = () => { };


    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnVisibilityPluginConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }


    toggleColumnVisibility(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columns.getLeafColumns(), columnId) as LeafColumn<any>
        if (!column) return;
        if (column.state.visible) this.hideColumn(columnId);
        else this.showColumn(columnId);
    }

    hideColumn(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columns.getLeafColumns(), columnId) as LeafColumn<any>

        if (!column) return;
        column.state.visible = false;
        this.datagrid.events.emit('onColumnVisibilityChange', { column });

    }

    showColumn(columnId: ColumnId): void {
        const column = findColumnById(this.datagrid.columns.getLeafColumns(), columnId) as LeafColumn<any>
        if (!column) return;
        column.state.visible = true;
        this.datagrid.events.emit('onColumnVisibilityChange', { column });
    }

}
