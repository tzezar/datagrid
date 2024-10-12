import type { ColumnId, Sorting } from "../types";

export const toggleSorting = ({
    columnId,
    sortings
}: {
    columnId: ColumnId;
    sortings: Sorting[];
}) => {
    const index = sortings.findIndex(s => s.columnId === columnId);

    if (index !== -1) {
        // Toggle sorting direction for the existing column
        const currentSorting = sortings[index];
        if (currentSorting.direction === 'asc') {
            sortings[index] = { columnId: columnId, direction: 'desc' };
        } else {
            sortings.splice(index, 1); // Remove sorting if direction is 'desc'
        }
    } else {
        // Add new sorting
        sortings.push({ columnId: columnId, direction: 'asc' });
    }


    return [...sortings];
};
