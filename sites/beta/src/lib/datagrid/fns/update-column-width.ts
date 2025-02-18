import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

/**
 * Updates the width of a specified column and applies offsets.
 *
 * @param {string} newWidth - The new width to set for the column (in pixels).
 * @param {string} columnId - The ID of the column to update.
 * @param {BaseColumn<T>[]} columns - The current array of columns.
 * @returns {BaseColumn<T>[]} A new array of columns with the updated width for the specified column.
 */
export const updateColumnWidth = <T>(
    newWidth: string, 
    columnId: string, 
    columns: BaseColumn<T>[]
): BaseColumn<T>[] => {
    // Create a new array of columns with the updated width for the specified column
    const updatedColumns = columns.map((column) => {
        // If the column ID matches, return a new object with the updated width
        if (column.id === columnId) {
            return { ...column, width: `${newWidth}px` }; // Ensure the width is in pixels
        }
        // Return the original column if the ID does not match
        return column;
    });

    // Apply offsets to the updated columns
    applyOffset(updatedColumns);

    // Return the new array of columns
    return updatedColumns;
};
