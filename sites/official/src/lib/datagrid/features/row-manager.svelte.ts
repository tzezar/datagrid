import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";

export interface RowManagerState {
    expandedRows: SvelteSet<string>;
    selectedRows: SvelteSet<string>;
    pinnedRows: SvelteSet<string>;
}

export interface RowManagerInstance {
    state: RowManagerState;

    expandRow(rowId: string): void;
    collapseRow(rowId: string): void;
    toggleRowExpansion(rowId: string): void;
    getExpandedRows(): string[];
    setExpandedRows(rows: string[]): void;
    isRowExpanded(rowId: string): boolean;

    isRowSelected(rowId: string): boolean;
    selectRow(rowId: string): void;
    unselectRow(rowId: string): void;
    toggleRowSelection(rowId: string): void;
    getSelectedRows(): string[];
}

export class RowManager implements RowManagerInstance {
    private grid: DatagridInstance;

    selectionMode: 'single' | 'multiple' | 'none' = 'single';
    expansionMode: 'single' | 'multiple' | 'none' = 'single';

    state: RowManagerState = {
        expandedRows: new SvelteSet(),
        pinnedRows: new SvelteSet(),
        selectedRows: new SvelteSet(),
    }

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    expandRow(rowId: string): void {
        if (this.expansionMode === 'single') {
            this.state.expandedRows.clear(); // Clear all expanded rows if in single mode
        }
        this.state.expandedRows.add(rowId);
    }

    collapseRow(rowId: string): void {
        this.state.expandedRows.delete(rowId);
    }

    toggleRowExpansion(rowId: string): void {
        if (this.state.expandedRows.has(rowId)) {
            this.collapseRow(rowId);
        } else {
            this.expandRow(rowId);
        }
    }

    getExpandedRows(): string[] {
        return Array.from(this.state.expandedRows);
    }

    setExpandedRows(rows: string[]): void {
        this.state.expandedRows = new SvelteSet(rows);
    }

    isRowExpanded(rowId: string): boolean {
        return this.state.expandedRows.has(rowId);
    }

    isRowSelected(rowId: string): boolean {
        return this.state.selectedRows.has(rowId);
    }

    selectRow(rowId: string): void {
        if (this.selectionMode === 'single') {
            this.state.selectedRows.clear(); // Clear all selected rows if in single mode
        }
        this.state.selectedRows.add(rowId);
    }

    unselectRow(rowId: string): void {
        this.state.selectedRows.delete(rowId);
    }

    toggleRowSelection(rowId: string): void {
        if (this.selectionMode === 'none') {
            return; // No selection allowed in none mode
        }
        if (this.state.selectedRows.has(rowId)) {
            this.unselectRow(rowId);
        } else {
            this.selectRow(rowId);
        }
    }

    getSelectedRows(): string[] {
        return Array.from(this.state.selectedRows);
    }
}
