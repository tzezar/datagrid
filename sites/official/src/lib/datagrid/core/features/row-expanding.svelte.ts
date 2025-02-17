import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridRowIdentifier } from "../types";

export type RowExpansionMode = 'single' | 'multiple';

export type RowExpansionState = {
    expandedRowIds: SvelteSet<GridRowIdentifier>;
    expansionMode: RowExpansionMode;
    maxExpandedRows: number;
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
    maxExpandedRows: number = $state(Infinity);

    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowExpansionConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    expandRow(identifier: GridRowIdentifier) {
        if (this.expandedRowIds.size >= this.maxExpandedRows) {
            // Enforce max limit
            this.datagrid.events.emit('onRowExpansionLimitExceeded', { rowIdentifier: identifier });
            
            return
        }
        this.datagrid.events.emit('onRowExpand', { rowIdentifier: identifier });
        this.expandedRowIds.add(identifier);
    }

    collapseRow(identifier: GridRowIdentifier) {
        this.datagrid.events.emit('onRowCollapse', { rowIdentifier: identifier });
        this.expandedRowIds.delete(identifier);
    }

    toggleRowExpansion(identifier: GridRowIdentifier) {
        if (this.isRowExpanded(identifier)) {
            this.collapseRow(identifier);
        } else {
            this.expandRow(identifier);
        }
    }

    isRowExpanded(rowId: GridRowIdentifier): boolean {
        return this.expandedRowIds.has(rowId); // Check if the row ID is in the expanded set
    }
}
