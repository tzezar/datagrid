import type { DatagridInstance } from "../index.svelte";
import type { Column, ColumnId } from "../processors/column-processor.svelte"

export type PinningPosition = 'left' | 'right';


interface ColumnManagerInstance {
    hideColumn(column: Column): void;
    showColumn(column: Column): void;
    pinColumn(column: Column, position: PinningPosition, offset: number): void;
    unpinColumn(column: Column): void;

    resizeColumn(column: Column, width: number): void;
}


export class ColumnManager implements ColumnManagerInstance {
    private grid: DatagridInstance;


    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    getVisibleColumns(): Column[] {
        return this.grid.columns.filter(c => c.visible);
    }

    getColumn(columnId: ColumnId): Column {
        const column = this.grid.columns.find(c => c.columnId === columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);
        return column
    }

    hideColumn(column: Column): void {
        column.visible = false
    }

    showColumn(column: Column): void {
        column.visible = true
    }

    toggleColumnVisibility(column: Column): void {
        if (column.visible) {
            this.hideColumn(column);
        } else {
            this.showColumn(column);
        }
    }

    pinColumn(column: Column, position: PinningPosition, offset: number): void {

    }

    unpinColumn(column: Column): void {

    }

    resizeColumn(column: Column, width: number): void {
        if (width <= column.size.minWidth) width = column.size.minWidth
        if (width >= column.size.maxWidth) width = column.size.maxWidth
        column.size.width = width
    }
}