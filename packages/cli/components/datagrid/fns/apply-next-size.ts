import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

// Function to apply the next size for spacing
export const applyNextSize = (datagrid: TzezarDatagrid<unknown>) => {
    const sizeKeys = Object.keys(datagrid.options.spacing.options);

    // Find the index of the currently selected size based on the label
    const currentIndex = sizeKeys.indexOf(datagrid.options.spacing.selected.label);

    // Get the next size key, or loop back to the first size
    const nextIndex = (currentIndex + 1) % sizeKeys.length;
    const nextSizeKey = sizeKeys[nextIndex];

    // Update the selected object with the next size values
    datagrid.options.spacing.selected.label = nextSizeKey;
    datagrid.options.spacing.selected.vertical =
        // @ts-expect-error ts(7053)
        datagrid.options.spacing.options[nextSizeKey].vertical;
    datagrid.options.spacing.selected.horizontal =
        // @ts-expect-error ts(7053)
        datagrid.options.spacing.options[nextSizeKey].horizontal;
}