import type { GridRow } from "$lib/datagrid/core/types";
import type { TzezarsDatagrid } from "./core/index.svelte";

export function shouldShowColumnFilter(datagrid: TzezarsDatagrid): boolean {
    return datagrid.extra.features.columnFiltering.isEnabled();
}



export const shouldHighlightSelectedRow = (datagrid: TzezarsDatagrid, row: GridRow<any>): boolean => {
    return datagrid.extra.features.rowSelection.highlightSelectedRow && datagrid.features.rowSelection.isRowSelected(row.identifier)
}