import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridRowIdentifier } from "../types";


export type RowSelectionMode = 'single' | 'multiple' | 'none'

export type RowSelectionFeatureState = {
    selectedRowIds: SvelteSet<GridRowIdentifier>;
    maxSelectableRows: number;
    selectionMode: RowSelectionMode;
}


type IRowSelectionFeature<TOriginalRow> = {
    datagrid: DatagridCore,

    getSelectedRowsIds(): GridRowIdentifier[];
    selectRowById(identifier: GridRowIdentifier): void;
    deselectRowById(identifier: GridRowIdentifier): void;
    toggleRowSelection(identifier: GridRowIdentifier): void;
    isRowSelected(identifier: GridRowIdentifier): boolean;
    getSelectedOriginalRows(): TOriginalRow[];
    selectRows(identifiers: GridRowIdentifier[]): void;
    unselectRows(identifiers: GridRowIdentifier[]): void;
    clearSelection(): void;
} & RowSelectionFeatureState

export type RowSelectionFeatureConfig = {
    onSelectMoreThanMaxSelectedRows?(): void;
    onRowSelectionChange?(config: RowSelection<any>): void;
} & Partial<RowSelectionFeatureState>


export class RowSelection<TOriginalRow = any> implements IRowSelectionFeature<TOriginalRow> {
    datagrid: DatagridCore<TOriginalRow>;
    selectedRowIds: SvelteSet<GridRowIdentifier> = $state(new SvelteSet())
    maxSelectableRows: number = $state(Infinity);
    selectionMode: RowSelectionMode = $state('multiple');

    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowSelectionFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);

    }

    getSelectedRowsIds() {
        return Array.from(this.selectedRowIds)
    }

    selectRowById(identifier: GridRowIdentifier) {
        if (this.selectionMode === 'single') {
            this.clearSelection()
            this.selectedRowIds.add(identifier);
            return
        }

        const isMaxSelectedRowsReached = this.maxSelectableRows !== undefined && this.selectedRowIds.size >= this.maxSelectableRows;
        if (isMaxSelectedRowsReached) {
            // this.onSelectMoreThanMaxSelectedRows();
            return
        }

        this.selectedRowIds.add(identifier);
    }

    deselectRowById(identifier: GridRowIdentifier) {
        if (this.selectionMode === 'single') {
            this.clearSelection()
            return
        }
        this.selectedRowIds.delete(identifier);
    }


    toggleRowSelection(identifier: GridRowIdentifier) {
        if (this.selectedRowIds.has(identifier)) this.deselectRowById(identifier);
        else this.selectRowById(identifier);
    }

    isRowSelected(identifier: GridRowIdentifier) {
        return this.selectedRowIds.has(identifier);
    }

    getSelectedOriginalRows(): TOriginalRow[] {
        return Array.from(this.selectedRowIds)
            .map(id => this.datagrid.initial.data.find(row => this.datagrid.config.createBasicRowIdentifier(row) === id))
            .filter((row): row is TOriginalRow => row !== undefined); // Type guard for filtering
    }

    selectRows(identifiers: GridRowIdentifier[]) {
        identifiers.forEach(identifier => this.selectRowById(identifier));
    }

    unselectRows(identifiers: GridRowIdentifier[]) {
        identifiers.forEach(identifier => this.deselectRowById(identifier));
    }

    clearSelection() {
        this.selectedRowIds.clear();
    }

}



