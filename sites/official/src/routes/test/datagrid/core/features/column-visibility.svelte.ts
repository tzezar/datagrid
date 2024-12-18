import type { Datagrid } from "../index.svelte";
import { filterOutGroupColumns, flattenColumns } from "../utils.svelte";


export class ColumnVisibility<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    toggleColumnVisibility(columnId: string) {
        const flatColumns = filterOutGroupColumns(flattenColumns(this.datagrid.columns));
        // Find the column by ID
        const column = flatColumns.find(c => c.columnId === columnId);

        if (!column) {
            throw new Error(`Column ${columnId} not found`);
        }

        // Toggle the column's visibility
        column.state.visible = !column.state.visible;
    }

}