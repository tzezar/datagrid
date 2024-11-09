import type { ExpandedRows } from "../types";

/**
 * Hides a specific expanded row by removing its ID from the list of expanded rows.
 *
 * @param rowId - The ID of the row to be hidden.
 * @param expandedRows - The current array of expanded row IDs.
 * @returns A new array of expanded rows excluding the specified row ID.
 */
export const hideExpandedRow = (rowId: number | string, expandedRows: ExpandedRows): ExpandedRows => {
    return expandedRows.filter((id) => id !== rowId);
};
