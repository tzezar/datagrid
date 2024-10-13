import type { ColumnId, Sorting } from "../types";
import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Toggles the sorting state for a given column in the datagrid.
 * If the column is already sorted, its direction is toggled or removed. 
 * If it is not sorted, it is added to the sorting array with ascending order.
 *
 * @param columnId - The ID of the column to toggle sorting for.
 * @param datagrid - The instance of the TzezarDatagrid.
 */
export function toggleSortingState(columnId: ColumnId, datagrid: TzezarDatagrid<unknown>) {
    const index = datagrid.state.sortingArray.findIndex((s) => s.columnId === columnId);
    let newSortingArray: Sorting[]; // Using the Sorting type

    if (index !== -1) {
        const currentSorting = datagrid.state.sortingArray[index];
        
        if (currentSorting.direction === 'asc') {
            newSortingArray = [
                ...datagrid.state.sortingArray.slice(0, index),
                { columnId, direction: 'desc' },
                ...datagrid.state.sortingArray.slice(index + 1),
            ];
        } else {
            newSortingArray = [
                ...datagrid.state.sortingArray.slice(0, index),
                ...datagrid.state.sortingArray.slice(index + 1),
            ];
        }
    } else {
        newSortingArray = [
            ...datagrid.state.sortingArray,
            { columnId, direction: 'asc' }, // This now matches the expected type
        ];
    }

    datagrid.updateSorting(newSortingArray);
}
