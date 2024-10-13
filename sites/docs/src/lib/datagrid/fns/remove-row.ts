import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Removes a row from the datagrid based on the specified ID.
 *
 * @param id - The ID of the row to remove.
 * @param datagrid - The datagrid instance from which to remove the row.
 * @returns A new instance of the data array without the specified row.
 */
export const removeRow = (
    id: number | string,
    datagrid: TzezarDatagrid<{ id: number | string }>
) => {
    if (id === undefined || id === null) {
        throw new Error("ID must not be undefined or null.");
    }

    // Filter out the row with the specified ID
    const updatedData = datagrid.data.filter((row) => row.id !== id);

    // Return the updated data instead of mutating the original
    return updatedData;
};
