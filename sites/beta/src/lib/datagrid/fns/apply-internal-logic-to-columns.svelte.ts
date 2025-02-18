import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";
import { applyOffset } from "./apply-offset";
import { isColumnSortable } from "./is-column-sortable";



export const applyInternalLogicToColumns = (datagrid: TzezarDatagrid<unknown>) => {
    applyOffset(datagrid.columns);
    
    for (const column of datagrid.columns) {
        column.sortable = isColumnSortable(datagrid, column);
    }
}