import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Gets the sorting position of a specified column in the datagrid's sorting array.
 *
 * @param field - The ID of the column for which to get the sorting position.
 * @param datagrid - The instance of the TzezarDatagrid.
 * @returns The 1-based index of the column in the sorting array, or null if not found.
 */
export function getSortingPosition(field: string, datagrid: TzezarDatagrid<unknown>): number | null {
    // Find the index of the specified column in the sorting array
    const index = datagrid.state.sortingArray.findIndex((s) => s.columnId === field);

    // Return the 1-based position or null if not found
    return index !== -1 ? index + 1 : null;
}
