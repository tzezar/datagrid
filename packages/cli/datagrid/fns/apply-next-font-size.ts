import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

// Function to apply the next size for font size
export const applyNextFontSize = (datagrid: TzezarDatagrid<unknown>) => {
    const fontSizeKeys = Object.keys(datagrid.options.fontSize.options);

    // Find the index of the currently selected font size
    const currentIndex = fontSizeKeys.indexOf(datagrid.options.fontSize.selected.label);

    // Get the next font size key, or loop back to the first size
    const nextIndex = (currentIndex + 1) % fontSizeKeys.length;
    const nextFontSizeKey = fontSizeKeys[nextIndex];

    // Update the selected font size
    datagrid.options.fontSize.selected.label = nextFontSizeKey;
    // @ts-expect-error ts(7053)
    datagrid.options.fontSize.selected.value = datagrid.options.fontSize.options[nextFontSizeKey];
}