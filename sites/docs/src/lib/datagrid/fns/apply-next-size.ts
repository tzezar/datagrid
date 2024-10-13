import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Function to apply the next spacing size in the TzezarDatagrid.
 *
 * This function retrieves the currently selected spacing size and updates
 * it to the next available option in the list. If the currently selected
 * size is the last in the list, it wraps around to the first size.
 *
 * @param {TzezarDatagrid<unknown>} datagrid - The datagrid instance containing spacing options.
 */
export const apllyNextSpacing = (datagrid: TzezarDatagrid<unknown>) => {
    // Retrieve the keys of the spacing options available
    const sizeKeys = Object.keys(datagrid.options.spacing.options);

    // Find the index of the currently selected size based on the label
    const currentIndex = sizeKeys.indexOf(datagrid.options.spacing.selected.label);

    // Calculate the index of the next size, wrapping around if necessary
    const nextIndex = (currentIndex + 1) % sizeKeys.length;
    const nextSizeKey = sizeKeys[nextIndex];

    // Update the selected spacing properties with the next size values
    datagrid.options.spacing.selected.label = nextSizeKey; // Update the label to the next size
    // @ts-expect-error ts(7053): TypeScript error suppression due to dynamic property access
    datagrid.options.spacing.selected.vertical = datagrid.options.spacing.options[nextSizeKey].vertical; // Update vertical spacing
    // @ts-expect-error ts(7053): TypeScript error suppression due to dynamic property access
    datagrid.options.spacing.selected.horizontal = datagrid.options.spacing.options[nextSizeKey].horizontal; // Update horizontal spacing
};
