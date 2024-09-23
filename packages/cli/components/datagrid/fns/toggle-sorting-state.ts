import type { ColumnId, Sorting } from "../types";
import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

export function toggleSortingState(columnId: ColumnId, datagrid: TzezarDatagrid<unknown>): Sorting[] {
    datagrid.onSortingChange();
    datagrid.onChange();

    const index = datagrid.state.sortingArray.findIndex((s) => s.columnId === columnId);
    if (index !== -1) {
        // Toggle sorting direction for the existing column
        const currentSorting = datagrid.state.sortingArray[index];
        if (currentSorting.direction === 'asc') {
            datagrid.state.sortingArray[index] = { columnId: columnId, direction: 'desc' };
        } else {
            datagrid.state.sortingArray.splice(index, 1); // Remove sorting if direction is 'desc'
        }
    } else {
        // Add new sorting
        datagrid.state.sortingArray.push({ columnId: columnId, direction: 'asc' });
    }

    return [...datagrid.state.sortingArray];
}