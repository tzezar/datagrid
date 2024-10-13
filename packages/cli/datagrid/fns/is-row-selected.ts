// Define a Row type with an id property
interface Row {
    id: number;
}

/**
 * Checks if a given row is selected based on its ID.
 *
 * @param row - The row object to check for selection.
 * @param selectedRows - An array of selected row objects.
 * @returns True if the row is selected, false otherwise.
 */
export const isRowSelected = (row: Row, selectedRows: Row[]): boolean => {
    return selectedRows.some((r) => r.id === row.id);
};
