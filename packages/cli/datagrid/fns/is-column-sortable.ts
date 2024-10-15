import type { BaseColumn } from "../types";
import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

export const isColumnSortable = (datagrid: TzezarDatagrid<unknown>, column: BaseColumn<T>): boolean => {
    return datagrid.options.sortable && column.sortable !== false
}