import type { ExpandedRows } from "../types";
import { hideExpandedRow } from "./hide-expanded-row";
import { showExpandedRow } from "./show-expanded-row";

/**
 * Toggles the expansion state of a row identified by the given identifier.
 * If the row is currently expanded, it will be collapsed; 
 * otherwise, it will be expanded.
 *
 * @param identifier - The unique identifier of the row to toggle.
 * @param expandedRows - An array of currently expanded rows.
 * @returns A new array of expanded rows after toggling the specified row.
 */
export const toggleExpandedRow = (
    identifier: number | string,
    expandedRows: ExpandedRows
): ExpandedRows => {
    // Check if the row is currently expanded
    if (expandedRows.includes(identifier)) {
        // Hide the row if it is expanded
        return hideExpandedRow(identifier, expandedRows);
    } else {
        // Show the row if it is not expanded
        return showExpandedRow(identifier, expandedRows);
    }
};
