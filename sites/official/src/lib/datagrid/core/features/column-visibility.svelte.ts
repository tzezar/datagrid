import type { Datagrid } from "../index.svelte";
import type { ColumnId } from "../types";

export class ColumnVisibilityFeature<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    toggleColumnVisibility(columnId: ColumnId) {
        const leafColumns = this.datagrid.columnManager.getLeafColumns();
        const column = leafColumns.find(c => c.columnId === columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);

        // Toggle the column's visibility
        column.state.visible = !column.state.visible;
    }

}