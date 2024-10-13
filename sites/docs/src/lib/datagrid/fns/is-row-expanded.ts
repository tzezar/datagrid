import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Checks if a specific row is expanded in the datagrid.
 *
 * @param datagrid - The datagrid instance containing the state.
 * @param rowId - The ID of the row to check for expansion.
 * @returns True if the row is expanded, false otherwise.
 */
export const isRowExpanded = (datagrid: TzezarDatagrid<unknown>, rowId: number | string): boolean => {
    return datagrid.state.expandedRows.includes(rowId);
};
