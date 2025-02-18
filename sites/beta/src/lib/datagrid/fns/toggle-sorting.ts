import type { ColumnId, Sorting } from "../types";

/**
 * Toggles the sorting state for a specified column.
 *
 * @param {Object} params - The parameters object.
 * @param {ColumnId} params.columnId - The ID of the column to toggle sorting for.
 * @param {Sorting[]} params.sortings - The current array of sorting states.
 * @returns {Sorting[]} A new array of sorting states with the updated sorting for the specified column.
 */
export const toggleSorting = ({
    columnId,
    sortings
}: {
    columnId: ColumnId;
    sortings: Sorting[];
}): Sorting[] => {
    // Find the index of the current sorting for the specified column
    const index = sortings.findIndex(s => s.columnId === columnId);
    let newSortings: Sorting[];

    if (index !== -1) {
        // Column is already sorted; toggle its direction
        const currentSorting = sortings[index];
        
        // Determine the new sorting direction based on the current direction
        if (currentSorting.direction === 'asc') {
            // Change direction to 'desc'
            newSortings = [
                ...sortings.slice(0, index), // Keep all previous sortings
                { columnId: columnId, direction: 'desc' }, // Update direction
                ...sortings.slice(index + 1) // Keep all subsequent sortings
            ];
        } else {
            // Remove sorting entry if current direction is 'desc'
            newSortings = [
                ...sortings.slice(0, index), // Keep all previous sortings
                ...sortings.slice(index + 1) // Exclude the current sorting
            ];
        }
    } else {
        // Column is not currently sorted; add it to the sorting array
        newSortings = [
            ...sortings, // Keep existing sortings
            { columnId: columnId, direction: 'asc' } // Add new sorting in 'asc' order
        ];
    }

    // Return the new sorting array to maintain immutability
    return newSortings;
};
