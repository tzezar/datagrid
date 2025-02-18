import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Function to apply the next font size in the TzezarDatagrid.
 *
 * This function retrieves the currently selected font size and updates
 * it to the next available option in the list. If the currently selected
 * size is the last in the list, it wraps around to the first size.
 *
 * @param {TzezarDatagrid<unknown>} datagrid - The datagrid instance containing font size options.
 */
export const applyNextFontSize = (datagrid: TzezarDatagrid<unknown>) => {
    // Retrieve the keys of the font size options available
    const fontSizeOptions = datagrid.options.fontSize.options;
    const fontSizeKeys = Object.keys(fontSizeOptions) as Array<keyof typeof fontSizeOptions>;

    // Find the index of the currently selected font size
    const currentIndex = fontSizeKeys.indexOf(datagrid.options.fontSize.selected.label as keyof typeof fontSizeOptions);

    // Calculate the index of the next font size, wrapping around if necessary
    const nextIndex = (currentIndex + 1) % fontSizeKeys.length;
    const nextFontSizeKey = fontSizeKeys[nextIndex];

    // Update the selected font size properties
    datagrid.options.fontSize.selected.label = nextFontSizeKey; // Update label to the next font size
    datagrid.options.fontSize.selected.value = fontSizeOptions[nextFontSizeKey]; // Update value based on the next font size key
};
