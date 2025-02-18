/**
 * Checks if every row in the data set is selected.
 *
 * @param selectedRows - An array of selected rows.
 * @param data - An array of all data rows.
 * @returns True if every row is selected, false otherwise.
 */
export const isEveryRowSelected = <T>(selectedRows: T[], data: T[]): boolean => {
    return selectedRows.length === data.length;
};
