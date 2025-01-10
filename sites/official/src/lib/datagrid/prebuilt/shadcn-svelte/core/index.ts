import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/column-creation/types";
import { isGroupColumn } from "$lib/datagrid/core/helpers/column-guards";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import type { LeafColumn } from "$lib/datagrid/core/types";

const handleDropdownMenu = (columns: AnyColumn<any>[]) => {
    columns.forEach((column) => {
        if (isGroupColumn(column)) {
            const groupColumn = column as GroupColumn<any>;
            handleDropdownMenu(groupColumn.columns);
        }
        column = column as LeafColumn<any>;
        column._meta.showColumnManagerDropdownMenu =
            column._meta.showColumnManagerDropdownMenu ?? true;
    });
    return columns;
};

export class TzezarsDatagrid extends DataGrid<any> {
    constructor(config: GridConfig<any>) {
        super(config, handleDropdownMenu);
    }

    extra = {
        highlightSelectedRow: true
    }
}