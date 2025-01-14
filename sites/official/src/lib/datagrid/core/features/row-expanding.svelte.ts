import { SvelteSet } from "svelte/reactivity";
import type { DataGrid } from "../index.svelte";
import type { GridRowIdentifier } from "../types";

/**
 * Manages row expansion functionality within the data grid.
 * Allows expanding and collapsing rows, with the state tracked via expanded row IDs.
 */
export class RowExpandingFeature<TOriginalRow> {
    // The instance of the data grid associated with this feature
    datagrid: DataGrid<TOriginalRow>;

    // Set of expanded row identifiers, used to track which rows are expanded
    expandedRowIds: SvelteSet<GridRowIdentifier> = $state(new SvelteSet());

    /**
     * Constructor to initialize the row expansion feature with a reference to the data grid.
     * @param datagrid - The data grid instance to associate with this row expansion feature.
     */
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
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
