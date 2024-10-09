import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

export const isRowExpanded = (datagrid: TzezarDatagrid<unknown>, rowId: number | string) => {
    return datagrid.state.expandedRows.includes(rowId) || false
};