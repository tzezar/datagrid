import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Toggles the selection state of a row in the datagrid.
 *
 * @param row - The row object to select or deselect, which must contain an id property.
 * @param datagrid - The datagrid instance containing the current selection state.
 */
export const selectRow = <T extends { id: number }>(row: T, datagrid: TzezarDatagrid<T>) => {
    const { id } = row;
    
    if (datagrid.state.selectedRows.some(r => r.id === id)) {
        // Remove the row from selectedRows
        const updatedSelectedRows = datagrid.state.selectedRows.filter(r => r.id !== id);
        datagrid.state.selectedRows = updatedSelectedRows;
        datagrid.internal.selectedRowIds.delete(id);
    } else {
        // Add the row to selectedRows
        const updatedSelectedRows = [...datagrid.state.selectedRows, row];
        datagrid.state.selectedRows = updatedSelectedRows;
        datagrid.internal.selectedRowIds.add(id);
    }
};
