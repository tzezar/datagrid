import { SvelteSet } from "svelte/reactivity";
import type { DataGrid } from "../index.svelte";
import type { GridRowIdentifier } from "../types";



export class RowSelectionFeature<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    selectedBasicRowIdentifiers: SvelteSet<GridRowIdentifier> = new SvelteSet()

    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    selectRow(identifier: GridRowIdentifier) {
        this.selectedBasicRowIdentifiers.add(identifier);
    }
    unselectRow(identifier: GridRowIdentifier) {
        this.selectedBasicRowIdentifiers.delete(identifier);
    }

    toggleRowSelection(identifier: GridRowIdentifier) {
        if (this.selectedBasicRowIdentifiers.has(identifier)) this.unselectRow(identifier);
        else this.selectRow(identifier);
    }

    isRowSelected(identifier: GridRowIdentifier) {
        return this.selectedBasicRowIdentifiers.has(identifier);
    }

    getSelectedOriginalRows(): TOriginalRow[] {
        return Array.from(this.selectedBasicRowIdentifiers)
            .map(id => this.datagrid.initial.data.find(row => this.datagrid.config.createBasicRowIdentifier(row) === id))
            .filter((row): row is TOriginalRow => row !== undefined); // Type guard for filtering
    }


    selectRows(identifiers: GridRowIdentifier[]) {
        identifiers.forEach(identifier => this.selectRow(identifier));
    }

    unselectRows(identifiers: GridRowIdentifier[]) {
        identifiers.forEach(identifier => this.unselectRow(identifier));
    }


    
}