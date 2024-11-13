import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance, RowManagerStateConfig } from "../index.svelte";

export type RowSelectionMode = 'single' | 'multi' | 'none';
export type RowExpansionMode = 'single' | 'multi' | 'none';

export interface RowManagerState {
    expandedRows: SvelteSet<string>;
    selectedRows: SvelteSet<string>;
    pinnedRows: {
        top: SvelteSet<string>;
        bottom: SvelteSet<string>;
    }
}

export interface RowManagerInstance {
    expandedRows: SvelteSet<string>;
    selectedRows: SvelteSet<string>;
    pinnedRows: {
        top: SvelteSet<string>;
        bottom: SvelteSet<string>;
    }
    initialize(config: RowManagerStateConfig): void;
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

    pinRow(rowId: string, position: "top" | "bottom"): void;
    unpinRow(rowId: string): void;
    getPinnedRows(): {
        top: string[],
        bottom: string[]
    },
    toggleRowPinning(rowId: string, position: "top" | "bottom"): void;
    isPinned(rowId: string, position: "top" | "bottom"): boolean;
    expansionMode: RowExpansionMode
    selectionMode: RowSelectionMode
}

export class RowManager<TData> implements RowManagerInstance {
    private grid: DatagridInstance<TData, any>;

    selectionMode: RowSelectionMode = 'single';
    expansionMode: RowExpansionMode = 'single';

    expandedRows: SvelteSet<string> = new SvelteSet()
    selectedRows: SvelteSet<string> = new SvelteSet()
    pinnedRows: RowManagerState['pinnedRows'] = {
        top: new SvelteSet(),
        bottom: new SvelteSet(),
    }

    constructor(grid: DatagridInstance<TData, any>) {
        this.grid = grid;
    }

    initialize(config: RowManagerStateConfig) {
        this.selectionMode = config.selectionMode || 'single';
        this.expansionMode = config.expansionMode || 'single';

        if (config.expandedRows) {
            this.expandedRows = new SvelteSet(config.expandedRows);
        }
        if (config.selectedRows) {
            this.selectedRows = new SvelteSet(config.selectedRows);
        }
        if (config.pinnedRows) {
            this.pinnedRows.top = new SvelteSet(config.pinnedRows.top);
            this.pinnedRows.bottom = new SvelteSet(config.pinnedRows.bottom);
        }
    }


    pinRow(rowId: string, position: "top" | "bottom"): void {
        if (position === 'top') {
            this.pinnedRows.top.add(rowId);
            this.pinnedRows.bottom.delete(rowId);
        } else if (position === 'bottom') {
            this.pinnedRows.top.delete(rowId);
            this.pinnedRows.bottom.add(rowId);
        }
    }

    unpinRow(rowId: string): void {
        this.pinnedRows.top.delete(rowId);
        this.pinnedRows.bottom.delete(rowId);
    }

    getPinnedRows(): {
        top: string[];
        bottom: string[]
    } {
        return {
            top: Array.from(this.pinnedRows.top),
            bottom: Array.from(this.pinnedRows.bottom),
        }
    }

    toggleRowPinning(rowId: string, position: "top" | "bottom"): void {
        if (this.pinnedRows[position].has(rowId)) {
            this.unpinRow(rowId);
        } else {
            this.pinRow(rowId, position);
        }
    }

    isPinned(rowId: string, position: "top" | "bottom"): boolean {
        return this.pinnedRows[position].has(rowId);
    }


    expandRow(rowId: string): void {
        if (this.expansionMode === 'single') {
            this.expandedRows.clear(); // Clear all expanded rows if in single mode
        }
        this.expandedRows.add(rowId);
    }

    collapseRow(rowId: string): void {
        this.expandedRows.delete(rowId);
    }

    toggleRowExpansion(rowId: string): void {
        if (this.expandedRows.has(rowId)) {
            this.collapseRow(rowId);
        } else {
            this.expandRow(rowId);
        }
    }

    getExpandedRows(): string[] {
        return Array.from(this.expandedRows);
    }

    setExpandedRows(rows: string[]): void {
        this.expandedRows = new SvelteSet(rows);
    }

    isRowExpanded(rowId: string): boolean {
        return this.expandedRows.has(rowId);
    }

    isRowSelected(rowId: string): boolean {
        return this.selectedRows.has(rowId);
    }

    selectRow(rowId: string): void {
        if (this.selectionMode === 'single') {
            this.selectedRows.clear(); // Clear all selected rows if in single mode
        }
        this.selectedRows.add(rowId);
    }

    unselectRow(rowId: string): void {
        this.selectedRows.delete(rowId);
    }

    toggleRowSelection(rowId: string): void {
        if (this.selectionMode === 'none') {
            return; // No selection allowed in none mode
        }
        if (this.selectedRows.has(rowId)) {
            this.unselectRow(rowId);
        } else {
            this.selectRow(rowId);
        }
    }

    getSelectedRows(): string[] {
        return Array.from(this.selectedRows);
    }
}
