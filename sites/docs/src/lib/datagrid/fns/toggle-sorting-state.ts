import type { ColumnId } from "../types";
import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

export function toggleSortingState(columnId: ColumnId, datagrid: TzezarDatagrid<unknown>) {

    const index = datagrid.state.sortingArray.findIndex((s) => s.columnId === columnId);
    
    let newSortingArray;

    if (index !== -1) {
        // Toggle sorting direction for the existing column
        const currentSorting = datagrid.state.sortingArray[index];
        if (currentSorting.direction === 'asc') {
            // Create new sorting array with updated sorting direction
            newSortingArray = [
                ...datagrid.state.sortingArray.slice(0, index),
                { columnId: columnId, direction: 'desc' },
                ...datagrid.state.sortingArray.slice(index + 1),
            ];
        } else {
            // Create new sorting array without the current sorting
            newSortingArray = [
                ...datagrid.state.sortingArray.slice(0, index),
                ...datagrid.state.sortingArray.slice(index + 1),
            ];
        }
    } else {
        // Add new sorting
        newSortingArray = [
            ...datagrid.state.sortingArray,
            { columnId: columnId, direction: 'asc' },
        ];
    }

    // Update the datagrid state with the new sorting array
    datagrid.updateSorting(newSortingArray);
}
