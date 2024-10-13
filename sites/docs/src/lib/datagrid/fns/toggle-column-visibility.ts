import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

/**
 * Toggles the visibility of a column in a data grid.
 * If the column is currently visible, it will be hidden; 
 * otherwise, it will be shown.
 *
 * @param columnId - The unique identifier of the column to toggle.
 * @param columns - An array of columns representing the current state of the grid.
 * @returns A new array of columns with the updated visibility state for the specified column.
 */
export const toggleColumnVisibility = <T>(
    columnId: string,
    columns: BaseColumn<T>[]
): BaseColumn<T>[] => {
    // Map through the columns to create a new array with updated visibility state
    const updatedColumns = columns.map((column) => {
        // Check if the current column is the one to toggle
        if (column.id === columnId) {
            // Toggle the visibility state of the column
            return { ...column, visible: !column.visible };
        }
        // Return the column unchanged if it's not the one to toggle
        return column;
    });

    // Apply any necessary offsets after updating the column states
    applyOffset(updatedColumns);
    
    // Return the updated columns array
    return updatedColumns;
};
