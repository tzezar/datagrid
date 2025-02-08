import type { DatagridCore } from "../index.svelte";
import type { ColumnId, LeafColumn } from "../types";

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
        const column = this.datagrid.columns.findColumnByIdOrThrow(columnId) as LeafColumn<TOriginalRow>;
        if (column.state.visible) this.hideColumn(columnId);
        else this.showColumn(columnId);
    }

    hideColumn(columnId: ColumnId): void {
        const column = this.datagrid.columns.findColumnByIdOrThrow(columnId) as LeafColumn<TOriginalRow>;
        column.state.visible = false;
        this.datagrid.events.emit('onColumnVisibilityChange', { column });

    }

    showColumn(columnId: ColumnId): void {
        const column = this.datagrid.columns.findColumnByIdOrThrow(columnId) as LeafColumn<TOriginalRow>;
        column.state.visible = true;
        this.datagrid.events.emit('onColumnVisibilityChange', { column });
    }

}
