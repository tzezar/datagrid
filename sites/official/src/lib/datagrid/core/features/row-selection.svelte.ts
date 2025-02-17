import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridRowIdentifier } from "../types";

/**
 * Defines the available row selection modes.
 */
export type RowSelectionMode = 'single' | 'multiple' | 'none'

/**
 * Represents the state of the row selection feature.
 */
export type RowSelectionFeatureState = {
    selectedRowIds: SvelteSet<GridRowIdentifier>;
    maxSelectableRows: number;
    selectionMode: RowSelectionMode;
}

/**
 * Interface for row selection feature methods.
 */
type IRowSelectionFeature<TOriginalRow> = {
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

/**
 * Configuration for the row selection feature.
 */
export type RowSelectionFeatureConfig = Partial<RowSelectionFeatureState>

/**
 * Manages row selection for a datagrid, including selection, deselection, and toggling.
 */
export class RowSelectionFeature<TOriginalRow = any> implements IRowSelectionFeature<TOriginalRow> {
    datagrid: DatagridCore<TOriginalRow>;
    selectedRowIds: SvelteSet<GridRowIdentifier> = $state(new SvelteSet());
    maxSelectableRows: number = $state(Infinity);
    selectionMode: RowSelectionMode = $state('multiple');

    /**
     * Initializes the row selection feature.
     * @param datagrid The datagrid instance.
     * @param config Optional configuration for the feature.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowSelectionFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Gets the list of selected row identifiers.
     * @returns An array of selected row identifiers.
     */
    getSelectedRowsIds() {
        return Array.from(this.selectedRowIds);
    }

    /**
     * Selects a row by its identifier.
     * @param identifier The identifier of the row to select.
     */
    selectRowById(identifier: GridRowIdentifier) {
        this.datagrid.events.emit('onRowSelect', { rowIdentifier: identifier });
        if (this.selectionMode === 'single') {
            this.clearSelection();
            this.selectedRowIds.add(identifier);
            return;
        }

        if (this.selectedRowIds.has(identifier)) return;

        if (this.selectedRowIds.size >= this.maxSelectableRows) {
            this.datagrid.events.emit('onRowSelectionLimitExceeded', { rowIdentifier: identifier });
            return;
        }

        this.selectedRowIds.add(identifier);
    }

    /**
     * Deselects a row by its identifier.
     * @param identifier The identifier of the row to deselect.
     */
    deselectRowById(identifier: GridRowIdentifier) {
        this.datagrid.events.emit('onRowDeselect', { rowIdentifier: identifier });
        this.selectedRowIds.delete(identifier);
    }

    /**
     * Toggles the selection state of a row.
     * @param identifier The identifier of the row to toggle.
     */
    toggleRowSelection(identifier: GridRowIdentifier) {
        if (this.selectedRowIds.has(identifier)) {
            this.deselectRowById(identifier);
        } else {
            this.selectRowById(identifier);
        }
    }

    /**
     * Checks if a row is selected.
     * @param identifier The identifier of the row to check.
     * @returns True if the row is selected, false otherwise.
     */
    isRowSelected(identifier: GridRowIdentifier) {
        return this.selectedRowIds.has(identifier);
    }

    /**
     * Gets the original rows corresponding to the selected row identifiers.
     * @returns An array of selected original rows.
     */
    getSelectedOriginalRows(): TOriginalRow[] {
        return Array.from(this.selectedRowIds)
            .map(id => this.datagrid.originalState.data.find(row => this.datagrid.rowIdGetter(row) === id))
            .filter((row): row is TOriginalRow => row !== undefined);
    }

    /**
     * Selects multiple rows by their identifiers.
     * @param identifiers An array of row identifiers to select.
     */
    selectRows(identifiers: GridRowIdentifier[]) {
        identifiers.forEach(identifier => this.selectRowById(identifier));
    }

    /**
     * Deselects multiple rows by their identifiers.
     * @param identifiers An array of row identifiers to deselect.
     */
    unselectRows(identifiers: GridRowIdentifier[]) {
        identifiers.forEach(identifier => this.deselectRowById(identifier));
    }

    /**
     * Clears the selection of all rows.
     */
    clearSelection() {
        this.selectedRowIds.clear();
    }
}
