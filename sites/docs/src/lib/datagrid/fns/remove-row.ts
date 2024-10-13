import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

// Define a type that includes the id property
type WithId = { id: number | string };

/**
 * Removes a row from the datagrid based on the specified ID.
 *
 * @param id - The ID of the row to remove.
 * @param datagrid - The datagrid instance from which to remove the row.
 * @returns A new instance of the data array without the specified row.
 */
export const removeRow = <T extends WithId>(
    id: number | string,
    datagrid: TzezarDatagrid<T>
) => {
    if (id === undefined || id === null) {
        throw new Error("ID must not be undefined or null.");
    }

    // Filter out the row with the specified ID
    const updatedData = datagrid.data.filter((row) => row.id !== id);

    // Return the updated data instead of mutating the original
    return updatedData;
};
