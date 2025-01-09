import type { Datagrid } from "../index.svelte";
import type { ColumnId } from "../types";

export class ColumnSizingFeature<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    updateColumnSize(columnId: ColumnId, width: number) {
        const leafColumns = this.datagrid.columnManager.getLeafColumns();

        const column = leafColumns.find(c => c.columnId === columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);

        // ? not sure if we want to resize groups, those are filtered out right now
     
        column.state.size.width = Math.max(column.state.size.minWidth, Math.min(width, column.state.size.maxWidth));
    }

}