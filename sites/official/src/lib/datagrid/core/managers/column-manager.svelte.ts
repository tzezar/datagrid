import type { GroupColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import { filterGroupColumns, flattenColumns } from "../utils.svelte";



export class ColumnManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    getGroupColumns(): GroupColumn<TOriginalRow>[] {
        return filterGroupColumns(flattenColumns(this.datagrid.columns)); 
    }



}