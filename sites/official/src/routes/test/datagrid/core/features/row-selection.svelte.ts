import { SvelteSet } from "svelte/reactivity";
import type { Datagrid } from "../index.svelte";
import type { GridBasicRowIdentifier } from "../types";



export class RowSelectionFeature<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    selectedBasicRowIdentifiers: SvelteSet<GridBasicRowIdentifier> = new SvelteSet()

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    selectRow(identifier: GridBasicRowIdentifier) {
        this.selectedBasicRowIdentifiers.add(identifier);
    }
    unselectRow(identifier: GridBasicRowIdentifier) {
        this.selectedBasicRowIdentifiers.delete(identifier);
    }


    toggleRowSelection(identifier: string) {
        if (this.selectedBasicRowIdentifiers.has(identifier)) this.unselectRow(identifier);
        else this.selectRow(identifier);
    }

    isRowSelected(identifier: string) {
        return this.selectedBasicRowIdentifiers.has(identifier);
    }

    getSelectedOriginalRows(): TOriginalRow[] {
        return Array.from(this.selectedBasicRowIdentifiers)
            .map(id => this.datagrid.original.data.find(row => this.datagrid.config.createBasicRowIdentifier(row) === id))
            .filter((row): row is TOriginalRow => row !== undefined); // Type guard for filtering
    }

}