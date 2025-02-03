import { SvelteSet } from "svelte/reactivity";
import type { DataGrid } from "../index.svelte";
import type { GridRowIdentifier } from "../types";


export class RowSelectionFeature<TOriginalRow = any> implements IRowSelectionFeature<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    selectedBasicRowIdentifiers: SvelteSet<GridRowIdentifier> = $state(new SvelteSet())
    maxSelectedRows: number = $state(DEFAULT_MAX_SELECTED_ROWS);

    constructor(datagrid: DataGrid<TOriginalRow>, config?: RowSelectionFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: RowSelectionFeatureConfig) {
        Object.assign(this, config);
    }

    onRowSelectionChange() { }

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



interface IRowSelectionFeature<TOriginalRow> {
    datagrid: DataGrid,
    selectedBasicRowIdentifiers: SvelteSet<GridRowIdentifier>;
    maxSelectedRows: number;

    onRowSelectionChange(config: RowSelectionFeature<any>): void;
    getSelectedIdentifiers(): GridRowIdentifier[];
    selectRow(identifier: GridRowIdentifier): void;
    unselectRow(identifier: GridRowIdentifier): void;
    toggleRowSelection(identifier: GridRowIdentifier): void;
    isRowSelected(identifier: GridRowIdentifier): boolean;
    getSelectedOriginalRows(): TOriginalRow[];
    selectRows(identifiers: GridRowIdentifier[]): void;
    unselectRows(identifiers: GridRowIdentifier[]): void;
    clearSelection(): void;
}


export type RowSelectionFeatureConfig = {
    maxSelectedRows?: number;
    selectedRowIds?: SvelteSet<GridRowIdentifier>;
    onRowSelectionChange?(config: RowSelectionFeature<any>): void;
}


const DEFAULT_MAX_SELECTED_ROWS = 99999999;