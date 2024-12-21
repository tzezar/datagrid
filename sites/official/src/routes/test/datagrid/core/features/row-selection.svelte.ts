import { SvelteSet } from "svelte/reactivity";
import type { Datagrid } from "../index.svelte";



export class RowSelection<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    selectedRowIds: SvelteSet<string> = $state(new SvelteSet());

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }


    toggleRowSelection(identifier: string) {
        if (this.selectedRowIds.has(identifier)) {
            this.selectedRowIds.delete(identifier);
        } else {
            this.selectedRowIds.add(identifier);
        }
    }

    isRowSelected(identifier: string) {
        return this.selectedRowIds.has(identifier);
    }

    getSelectedRows(): TOriginalRow[] {
        return Array.from(this.selectedRowIds)
            .map(id => this.datagrid.original.data.find(row => row.id === id))
            .filter((row): row is TOriginalRow => row !== undefined); // Type guard for filtering
    }


}