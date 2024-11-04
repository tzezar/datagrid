import { SvelteSet } from "svelte/reactivity"
import type { DatagridInstance } from "../index.svelte";


export interface RowManagerState {
    expandedRows: SvelteSet<string>
}

export interface RowManagerInstance {
    state: RowManagerState


    expandRow(rowId: string): void
    collapseRow(rowId: string): void
    toggleRowExpansion(rowId: string): void
    getExpandedRows(): string[]
    setExpandedRows(rows: string[]): void
    isRowExpanded(rowId: string): boolean
}

export class RowManager implements RowManagerInstance {
    private grid: DatagridInstance;

    state: RowManagerState = {
        expandedRows: new SvelteSet()
    }

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }


    expandRow(rowId: string): void {
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
    
}