import type { BaseColumn } from "../types";
import { getOffsetLeft } from "./get-offset-left";
import { getOffsetRight } from "./get-offset-right";

/**
 * Function to apply offsets to pinned columns in a data table.
 *
 * This function iterates through the provided array of columns and calculates
 * the offset for each pinned column based on its position (left or right).
 * The offset is stored in the column's pinned property.
 *
 * @param {BaseColumn<T>[]} columns - An array of column definitions.
 * @returns {BaseColumn<T>[]} The updated array of columns with offsets applied.
 */
export const applyOffset = <T>(columns: BaseColumn<T>[]) => {
    // Iterate through each column to apply offsets based on their pinned position
    for (const column of columns) {
        // Check if the column is pinned to the left
        if (column.pinned?.position === 'left') {
            // Calculate and assign the left offset
            column.pinned.offset = getOffsetLeft(column.id, columns);
        } 
        // Check if the column is pinned to the right
        else if (column.pinned?.position === 'right') {
            // Calculate and assign the right offset
            column.pinned.offset = getOffsetRight(column.id, columns);
        }
    }
    // Return the updated array of columns with offsets
    return columns;
};
