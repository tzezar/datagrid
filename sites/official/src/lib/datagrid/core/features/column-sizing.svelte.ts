import type { Datagrid } from "../index.svelte";
import { filterOutGroupColumns, flattenColumns } from "../utils.svelte";


export class ColumnSizingFeature<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    setColumnSize(columnId: string, width: number) {
        const flatColumns = filterOutGroupColumns(flattenColumns(this.datagrid.columns));

        // Find the column by ID
        const column = flatColumns.find(c => c.columnId === columnId);

        if (!column) {
            throw new Error(`Column ${columnId} not found`);
        }

        // TODO: not sure if we want to resize groups, those are filtered out right now
        // if (column.columns && column.columns.length > 0) {
        //     // Iterate over each child column in the group
        //     column.columns.forEach(childColumn => {
        //         childColumn.state.size.width = Math.max(childColumn.state.size.minWidth, Math.min(width, childColumn.state.size.maxWidth));
        //     });
        // } else {
        //     column.state.size.width = Math.max(column.state.size.minWidth, Math.min(width, column.state.size.maxWidth));
        //     // Otherwise, resize the column itself
        // }
        column.state.size.width = Math.max(column.state.size.minWidth, Math.min(width, column.state.size.maxWidth));
    }

}