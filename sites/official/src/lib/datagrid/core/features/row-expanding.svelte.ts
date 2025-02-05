import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridRowIdentifier } from "../types";

const DEFAULT_MAX_EXPANDED_ROWS = 999999999;

export type RowExpandingMode = 'single' | 'multiple';

export type RowExpandingPluginConfig = {
    expandedRowIds?: SvelteSet<GridRowIdentifier>;
    onExpandingChange?: (config: RowExpandingFeature<any>) => void;
    expandingMode?: RowExpandingMode
    maxExpandedRows?: number;
}


/**
 * Manages row expansion functionality within the data grid.
 * Allows expanding and collapsing rows, with the state tracked via expanded row IDs.
 */
export class RowExpandingFeature<TOriginalRow = any> {
    // The instance of the data grid associated with this feature
    datagrid: DatagridCore<TOriginalRow>;

    // Set of expanded row identifiers, used to track which rows are expanded
    expandedRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet()

    expandingMode: RowExpandingMode = $state('single');
    maxExpandedRows: number = $state(DEFAULT_MAX_EXPANDED_ROWS);


    onExpandingChange: (config: RowExpandingFeature<any>) => void = () => { };

    /**
     * Constructor to initialize the row expansion feature with a reference to the data grid.
     * @param datagrid - The data grid instance to associate with this row expansion feature.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowExpandingPluginConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: RowExpandingPluginConfig) {
        this.expandingMode = config?.expandingMode ?? this.expandingMode;
        this.maxExpandedRows = config?.maxExpandedRows ?? this.maxExpandedRows;
        this.onExpandingChange = config?.onExpandingChange ?? this.onExpandingChange;
        this.expandedRowIds = config?.expandedRowIds ?? this.expandedRowIds;
    }

    /**
     * Toggles the expansion state of a specific row.
     * If the row is expanded, it will collapse it; if it is collapsed, it will expand it.
     * @param {GridRowIdentifier} identifier - The unique identifier of the row to toggle.
     */
    toggleRowExpansion(identifier: GridRowIdentifier) {
        // If the row is already expanded, collapse it, otherwise expand it
        if (this.expandedRowIds.has(identifier)) {
            this.expandedRowIds.delete(identifier); // Collapse the row
        } else {
            this.expandedRowIds.add(identifier); // Expand the row
        }
    }

    /**
     * Checks whether a specific row is currently expanded.
     * @param {GridRowIdentifier} rowId - The unique identifier of the row to check.
     * @returns {boolean} - Returns true if the row is expanded, false otherwise.
     */
    isRowExpanded(rowId: GridRowIdentifier): boolean {
        return this.expandedRowIds.has(rowId); // Check if the row ID is in the expanded set
    }
}
