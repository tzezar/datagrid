import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridRowIdentifier } from "../types";

/**
 * Defines the row expansion mode: 'single' for one expanded row at a time,
 * 'multiple' for allowing multiple rows to be expanded simultaneously.
 */
export type RowExpansionMode = 'single' | 'multiple';

/**
 * Represents the state of row expansion functionality within the grid,
 * including expanded row identifiers, expansion mode, and max expanded rows.
 */
export type RowExpansionState = {
    /** Set of expanded row identifiers */
    expandedRowIds: SvelteSet<GridRowIdentifier>;
    
    /** The row expansion mode ('single' or 'multiple') */
    expansionMode: RowExpansionMode;
    
    /** The maximum number of rows that can be expanded at once */
    maxExpandedRows: number;
};

/**
 * Partial configuration for row expansion, allowing for customized initial state.
 */
export type RowExpansionConfig = Partial<RowExpansionState>;

/**
 * Interface extending RowExpansionState for row expansion functionality in the grid.
 */
export type IRowExpandingFeature = {} & RowExpansionState;

/**
 * Manages row expansion functionality within the data grid.
 * Allows expanding and collapsing rows, with the state tracked via expanded row IDs.
 * 
 * @template TOriginalRow The type of the original row data in the grid.
 */
export class RowExpansionFeature<TOriginalRow = any> implements IRowExpandingFeature {
    /** The data grid instance this feature belongs to */
    datagrid: DatagridCore<TOriginalRow>;

    /** Set containing the IDs of currently expanded rows */
    expandedRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet();

    /** The current row expansion mode ('single' or 'multiple') */
    expansionMode: RowExpansionMode = $state('single');

    /** The maximum number of rows that can be expanded at the same time */
    maxExpandedRows: number = $state(Infinity);

    /**
     * Creates an instance of the RowExpansionFeature.
     * 
     * @param {DatagridCore<TOriginalRow>} datagrid The data grid instance.
     * @param {RowExpansionConfig} [config] Optional configuration to initialize the state.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowExpansionConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Expands a specific row by its identifier.
     * 
     * @param {GridRowIdentifier} identifier The identifier of the row to expand.
     * Emits 'onRowExpand' and adds the row to the expanded rows set.
     * If the expansion limit is reached, an event 'onRowExpansionLimitExceeded' is emitted.
     */
    expandRow(identifier: GridRowIdentifier): void {
        if (this.expandedRowIds.size >= this.maxExpandedRows) {
            // Enforce max limit
            this.datagrid.events.emit('onRowExpansionLimitExceeded', { rowIdentifier: identifier });
            return;
        }
        this.datagrid.events.emit('onRowExpand', { rowIdentifier: identifier });
        this.expandedRowIds.add(identifier);
    }

    /**
     * Collapses a specific row by its identifier.
     * 
     * @param {GridRowIdentifier} identifier The identifier of the row to collapse.
     * Emits 'onRowCollapse' and removes the row from the expanded rows set.
     */
    collapseRow(identifier: GridRowIdentifier): void {
        this.datagrid.events.emit('onRowCollapse', { rowIdentifier: identifier });
        this.expandedRowIds.delete(identifier);
    }

    /**
     * Toggles the expansion state of a specific row.
     * If the row is expanded, it will be collapsed. If it is collapsed, it will be expanded.
     * 
     * @param {GridRowIdentifier} identifier The identifier of the row to toggle.
     */
    toggleRowExpansion(identifier: GridRowIdentifier): void {
        if (this.isRowExpanded(identifier)) {
            this.collapseRow(identifier);
        } else {
            this.expandRow(identifier);
        }
    }

    /**
     * Checks if a specific row is currently expanded.
     * 
     * @param {GridRowIdentifier} rowId The identifier of the row to check.
     * @returns {boolean} True if the row is expanded, otherwise false.
     */
    isRowExpanded(rowId: GridRowIdentifier): boolean {
        return this.expandedRowIds.has(rowId); // Check if the row ID is in the expanded set
    }
}
