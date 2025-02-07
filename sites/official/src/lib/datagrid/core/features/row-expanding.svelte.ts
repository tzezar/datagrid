import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridRowIdentifier } from "../types";

export type RowExpansionMode = 'single' | 'multiple';

export type RowExpansionState = {
    expandedRowIds: SvelteSet<GridRowIdentifier>;
    expansionMode: RowExpansionMode;
    maxExpandedRows: number;

    onExpansionChange: (config: RowExpansionFeature<any>) => void;
    onExceedMaxExpansion: (config: RowExpansionFeature<any>) => void;
}

export type RowExpansionConfig = Partial<RowExpansionState>

export type IRowExpandingFeature = {} & RowExpansionState

/**
 * Manages row expansion functionality within the data grid.
 * Allows expanding and collapsing rows, with the state tracked via expanded row IDs.
 */
export class RowExpansionFeature<TOriginalRow = any> implements IRowExpandingFeature {
    datagrid: DatagridCore<TOriginalRow>;
    expandedRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet()
    expansionMode: RowExpansionMode = $state('single');
    maxExpandedRows: number = $state(2);


    onExpansionChange: (config: RowExpansionFeature<any>) => void = () => { };
    onExceedMaxExpansion: (config: RowExpansionFeature<any>) => void = () => { };

    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowExpansionConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    toggleRowExpansion(identifier: GridRowIdentifier) {
        // If the row is already expanded, collapse it, otherwise expand it
        if (this.expandedRowIds.has(identifier)) {
            this.expandedRowIds.delete(identifier); // Collapse the row
        } else {
            this.expandedRowIds.add(identifier); // Expand the row
        }
    }

    isRowExpanded(rowId: GridRowIdentifier): boolean {
        return this.expandedRowIds.has(rowId); // Check if the row ID is in the expanded set
    }
}
