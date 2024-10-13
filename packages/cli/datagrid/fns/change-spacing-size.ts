import type { SpacingOptions } from "../types";
import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Changes the spacing size of the TzezarDataGrid based on the specified key.
 *
 * This function updates the selected spacing in the datagrid's options
 * if the provided key corresponds to a valid spacing size option. If the key
 * is invalid, an error is logged to the console.
 *
 * @param {keyof SpacingOptions} key - The key corresponding to the desired spacing size option.
 * @param {TzezarDataGrid<unknown>} datagrid - The datagrid instance containing spacing options.
 */
export const changeSpacingSize = (key: keyof SpacingOptions, datagrid: TzezarDatagrid<unknown>) => {
    // Check if the provided key corresponds to a valid spacing size option
    if (datagrid.options.spacing.options[key]) {
        // Update the selected spacing size label and dimensions
        datagrid.options.spacing.selected.label = key; // Set the selected spacing label
        datagrid.options.spacing.selected.vertical = datagrid.options.spacing.options[key].vertical; // Set vertical spacing
        datagrid.options.spacing.selected.horizontal = datagrid.options.spacing.options[key].horizontal; // Set horizontal spacing
    } else {
        // Log an error if the key is invalid
        console.error(`Invalid spacing size key: ${key}`);
    }
};
