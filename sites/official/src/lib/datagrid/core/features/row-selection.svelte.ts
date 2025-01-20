import { SvelteSet } from "svelte/reactivity";
import type { DataGrid } from "../index.svelte";
import type { GridRowIdentifier } from "../types";


export type RowSelectionFeatureConfig = {
    maxSelectedRows?: number;
    selectedRowIds?: SvelteSet<GridRowIdentifier>;
    onRowSelectionChange?(config: RowSelectionFeature<any>): void;
}


export class RowSelectionFeature<TOriginalRow = any> {
    datagrid: DataGrid<TOriginalRow>;
    selectedBasicRowIdentifiers: SvelteSet<GridRowIdentifier> = new SvelteSet()
    maxSelectedRows: number = $state(99);

    constructor(datagrid: DataGrid<TOriginalRow>, config?: RowSelectionFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: RowSelectionFeatureConfig) {
        this.maxSelectedRows = config?.maxSelectedRows ?? this.maxSelectedRows;
        this.selectedBasicRowIdentifiers = config?.selectedRowIds ?? this.selectedBasicRowIdentifiers;
    }

    getSelectedIdentifiers() {
        return Array.from(this.selectedBasicRowIdentifiers)
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

    clearSelection() {
        this.selectedBasicRowIdentifiers.clear();
    }


    
}