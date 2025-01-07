import { isGroupColumn } from "../column-guards";
import type { AnyColumn, GroupColumn } from "../helpers/column-creators";
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



    getFlattenColumns(): AnyColumn<TOriginalRow>[] {
         const flattened: AnyColumn<any>[] = [];
            for (const column of this.datagrid.columns) {
                if (isGroupColumn(column)) {
                    flattened.push(column);
                    flattened.push(...flattenColumns(column.columns));
                } else {
                    flattened.push(column);
                }
            }
            return flattened;
    }

    
}