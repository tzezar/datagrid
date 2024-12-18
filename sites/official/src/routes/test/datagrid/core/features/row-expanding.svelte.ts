import { SvelteSet } from "svelte/reactivity";
import type { Datagrid } from "../index.svelte";



export class RowExpanding<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    expandedRowIds: SvelteSet<string> = $state(new SvelteSet());

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    toggleRowExpansion(identifier: string) {
        if (this.expandedRowIds.has(identifier)) {
            this.expandedRowIds.delete(identifier);
        } else {
            this.expandedRowIds.add(identifier);
        }
    }

    isRowExpanded(rowId: string) {
        return this.expandedRowIds.has(rowId);
    }

}