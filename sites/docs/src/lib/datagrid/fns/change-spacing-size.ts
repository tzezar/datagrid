// @ts-nocheck
import type { TzezarDataGrid } from "../tzezar-datagrid.svelte";

// Function to change the spacing size to a given key
export const changeSpacingSize = (key: string, datagrid: TzezarDataGrid) => {
    if (datagrid.options.spacing.options[key]) {
        datagrid.options.spacing.selected.label = key;
        datagrid.options.spacing.selected.vertical = datagrid.options.spacing.options[key].vertical;
        datagrid.options.spacing.selected.horizontal = datagrid.options.spacing.options[key].horizontal;
    } else {
        console.error(`Invalid spacing size key: ${key}`);
    }
}