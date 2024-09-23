// @ts-nocheck
import type { TzezarDataGrid } from "../tzezar-datagrid.svelte";

// Function to change the font size to a given key
export const changeFontSize = (key: string, datagrid: TzezarDataGrid) => {
    if (datagrid.options.fontSize.options[key]) {
        datagrid.options.fontSize.selected.label = key;
        datagrid.options.fontSize.selected.value = datagrid.options.fontSize.options[key];

    } else {
        console.error(`Invalid font size key: ${key}`);
    }
}