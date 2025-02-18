import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'additionalColumn',
        title: 'Additional Column',
    },
] satisfies BaseColumn<InventoryDataRow>[]
