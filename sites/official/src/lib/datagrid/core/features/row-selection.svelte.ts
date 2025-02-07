import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridRowIdentifier } from "../types";


export type RowSelectionMode = 'single' | 'multiple' | 'none'


interface IRowSelectionFeature<TOriginalRow> {
    datagrid: DatagridCore,
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

export type RowSelectionPluginConfig = {
    rowSelectionMode?: RowSelectionMode;
    maxSelectedRows?: number;
    selectedRowIds?: SvelteSet<GridRowIdentifier>;
    onSelectMoreThanMaxSelectedRows?(): void;
    onRowSelectionChange?(config: RowSelectionFeature<any>): void;
}


export class RowSelectionFeature<TOriginalRow = any> implements IRowSelectionFeature<TOriginalRow> {
    datagrid: DatagridCore<TOriginalRow>;
    selectedBasicRowIdentifiers: SvelteSet<GridRowIdentifier> = $state(new SvelteSet())
    maxSelectedRows: number = $state(Infinity);
    onSelectMoreThanMaxSelectedRows: () => void = () => { }
    rowSelectionMode: RowSelectionMode = $state('multiple');

    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowSelectionPluginConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: RowSelectionPluginConfig) {
        Object.assign(this, config);
    }

    onRowSelectionChange() { }

    getSelectedIdentifiers() {
        return Array.from(this.selectedBasicRowIdentifiers)
    }

    selectRow(identifier: GridRowIdentifier) {
        if (this.rowSelectionMode === 'single') {
            this.clearSelection()
            this.selectedBasicRowIdentifiers.add(identifier);
            this.onRowSelectionChange()
            return
        }

        const isMaxSelectedRowsReached = this.maxSelectedRows !== undefined && this.selectedBasicRowIdentifiers.size >= this.maxSelectedRows;
        if (isMaxSelectedRowsReached) {
            this.onSelectMoreThanMaxSelectedRows();
            return
        }

        this.selectedBasicRowIdentifiers.add(identifier);
        this.onRowSelectionChange()
    }

    // selectRow(identifier: GridRowIdentifier) {
    //     this.selectedBasicRowIdentifiers.add(identifier);
    // }


    unselectRow(identifier: GridRowIdentifier) {
        if (this.rowSelectionMode === 'single') {
            this.clearSelection()
            return
        }
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



