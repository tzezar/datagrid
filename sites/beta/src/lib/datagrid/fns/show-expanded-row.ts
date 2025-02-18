import type { ExpandedRows } from "../types";

/**
 * Adds a row ID to the list of expanded rows.
 *
 * @param rowId - The ID of the row to expand.
 * @param expandedRows - The current list of expanded row IDs.
 * @returns A new array containing the expanded row IDs, including the newly added row ID.
 */
export const showExpandedRow = (rowId: number | string, expandedRows: ExpandedRows): ExpandedRows => {
    // Check if the rowId is already expanded
    if (expandedRows.includes(rowId)) {
        // Return the existing array if rowId is already expanded
        return expandedRows;
    }
    
    // Return a new array with the rowId added
    return [...expandedRows, rowId];
};
