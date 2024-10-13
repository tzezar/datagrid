import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

/**
 * Toggles the pinning state of a column in a data grid.
 * If the column is already pinned to the specified position,
 * it will be unpinned; otherwise, it will be pinned to that position.
 *
 * @param columnId - The unique identifier of the column to toggle.
 * @param position - The position to which the column should be pinned ('left' or 'right').
 * @param columns - An array of columns representing the current state of the grid.
 * @returns A new array of columns with the updated pinning state for the specified column.
 */
export const toggleColumnPin = <T>(
    columnId: string,
    position: 'left' | 'right',
    columns: BaseColumn<T>[]
): BaseColumn<T>[] => {
    // Create a new columns array with the updated pinned state
    const updatedColumns = columns.map((column) => {
        // Check if the current column is the one to toggle
        if (column.id === columnId) {
            // If it's already pinned to the specified position, unpin it
            if (column.pinned?.position === position) {
                return { ...column, pinned: undefined }; // Unpin
            } else {
                // Otherwise, pin it to the specified position
                return { ...column, pinned: { position } }; // Pin to new position
            }
        }
        // Return the column unchanged if it's not the one to toggle
        return column;
    });

    // Apply any necessary offsets after updating the column states
    applyOffset(updatedColumns);
    
    // Return the updated columns array
    return updatedColumns;
};
