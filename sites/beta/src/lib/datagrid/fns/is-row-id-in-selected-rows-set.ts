/**
 * Checks if a specific row ID is in the set of selected rows.
 *
 * @param rowId - The ID of the row to check.
 * @param selectedRows - A Set containing the IDs of selected rows.
 * @returns True if the row ID is in the set of selected rows, false otherwise.
 */
export const isRowIdInSelectedRowsSet = (rowId: number, selectedRows: Set<number>): boolean => {
    return selectedRows.has(rowId);
};
