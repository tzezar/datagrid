import { SvelteSet } from "svelte/reactivity";
import type { Datagrid } from "../index.svelte";
import type { GridRowIdentifier } from "../types";



export class RowExpandingFeature<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    expandedRowIds: SvelteSet<GridRowIdentifier> = $state(new SvelteSet());

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    toggleRowExpansion(identifier: GridRowIdentifier) {
        if (this.expandedRowIds.has(identifier)) {
            this.expandedRowIds.delete(identifier);
        } else {
            this.expandedRowIds.add(identifier);
        }
    }

    isRowExpanded(rowId: GridRowIdentifier) {
        return this.expandedRowIds.has(rowId);
    }

}