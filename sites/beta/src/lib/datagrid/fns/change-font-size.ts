import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";
import type { FontSizeOptions } from "../types"; // Adjust the path accordingly

/**
 * Function to change the font size of the TzezarDataGrid to a specified key.
 *
 * This function updates the selected font size in the datagrid's options
 * if the provided key exists in the available font size options. If the key
 * is invalid, an error is logged to the console.
 *
 * @param {keyof FontSizeOptions} key - The key corresponding to the desired font size option.
 * @param {TzezarDatagrid<unknown>} datagrid - The datagrid instance containing font size options.
 */
export const changeFontSize = (key: keyof FontSizeOptions, datagrid: TzezarDatagrid<unknown>) => {
    // Check if the provided key corresponds to a valid font size option
    if (datagrid.options.fontSize.options[key]) {
        // Update the selected font size label and value
        datagrid.options.fontSize.selected.label = key; // Set the selected font size label
        datagrid.options.fontSize.selected.value = datagrid.options.fontSize.options[key]; // Set the selected font size value
    } else {
        // Log an error if the key is invalid
        console.error(`Invalid font size key: ${key}`);
    }
};
