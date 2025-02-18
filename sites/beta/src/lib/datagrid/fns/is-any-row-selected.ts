/**
 * Checks if any rows are selected.
 *
 * @param selectedRows - An array of selected rows.
 * @returns True if there are selected rows, false otherwise.
 */
export const isAnyRowSelected = <T>(selectedRows: T[]): boolean => {
    return selectedRows.length > 0;
};
