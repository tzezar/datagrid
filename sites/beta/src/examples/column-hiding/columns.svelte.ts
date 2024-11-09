import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'barcode',
        title: 'Barcode',
        visible: false,
        grow: true,
    },

    {
        id: 'location',
        title: 'Location',
        hideable: false,
        grow: true,
    },

] satisfies BaseColumn<InventoryDataRow>[]
