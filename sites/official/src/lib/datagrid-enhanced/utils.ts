import type { GridRow } from "$lib/datagrid/core/types";
import type { EnhancedDatagrid } from "./core/index.svelte";

export function shouldShowColumnFilter(datagrid: EnhancedDatagrid): boolean {
    return datagrid.extra.features.columnFiltering.isEnabled();
}



export const shouldHighlightSelectedRow = (
    datagrid: EnhancedDatagrid,
    row: GridRow<any>
): boolean => {
    return (
        datagrid.extra.features.rowSelection.highlightSelectedRow &&
        datagrid.features.rowSelection.isRowSelected(row.identifier)
    );
}