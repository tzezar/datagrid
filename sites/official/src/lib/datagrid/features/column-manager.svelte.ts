import type { DatagridInstance } from "../index.svelte";
import type { Column, ColumnId } from "../processors/column-processor.svelte"

export type PinningPosition = 'left' | 'right';


interface ColumnManagerInstance {
    hideColumn(column: Column): void;
    showColumn(column: Column): void;
    pinColumn(column: Column, position: PinningPosition, offset: number): void;
    unpinColumn(column: Column): void;

    resizeColumn(column: Column, width: number): void;

    moveColumnLeft(column: Column): void;
    moveColumnRight(column: Column): void;

    canMoveColumnLeft(column: Column): boolean;
    canMoveColumnRight(column: Column): boolean;

    toggleColumnVisibility(column: Column): void;
    getVisibleColumns(): Column[]
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

    private getColumnIndex(column: Column): number {
        return this.grid.columns.indexOf(column);
    }


    canMoveColumnLeft(column: Column): boolean {
        return this.getColumnIndex(column) > 0;
    }

    canMoveColumnRight(column: Column): boolean {
        return this.getColumnIndex(column) < this.grid.columns.length - 1;
    }

    moveColumnLeft(column: Column): void {
        const columnIndex = this.getColumnIndex(column);
        if (this.canMoveColumnLeft(column)) {
            const prevColumn = this.grid.columns[columnIndex - 1];
            this.grid.columns[columnIndex - 1] = column;
            this.grid.columns[columnIndex] = prevColumn;
        }
    }

    moveColumnRight(column: Column): void {
        const columnIndex = this.getColumnIndex(column);
        if (this.canMoveColumnRight(column)) {
            const nextColumn = this.grid.columns[columnIndex + 1];
            this.grid.columns[columnIndex + 1] = column;
            this.grid.columns[columnIndex] = nextColumn;
        }
    }

}