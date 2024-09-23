import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";


// dirty function
export const selectRow = <T extends { id: number }>(row: T, datagrid: TzezarDatagrid<T>) => {
    if (datagrid.state.selectedRows.some(r => r.id === row.id)) {
        // Remove the row
        datagrid.state.selectedRows = datagrid.state.selectedRows.filter(r => r.id !== row.id);
        datagrid.internal.selectedRowIds.delete(row.id);
    } else {
        // Add the row
        datagrid.state.selectedRows = [...datagrid.state.selectedRows, row];
        datagrid.internal.selectedRowIds.add(row.id);
    }
};
