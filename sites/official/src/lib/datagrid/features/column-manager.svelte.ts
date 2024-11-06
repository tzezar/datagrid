import type { DatagridInstance } from "../index.svelte";
import type { Accessor, Column, ColumnId } from "../processors/column-processor.svelte"

export type PinningPosition = 'left' | 'right' | 'none'


interface ColumnManagerInstance {
    getAccessor(columnId: ColumnId): Accessor

    hideColumn(column: Column): void;
    showColumn(column: Column): void;

    changeColumnPinningPosition(column: Column, position: PinningPosition): void;

    resizeColumn(column: Column, width: number): void;

    moveColumnLeft(column: Column): void;
    moveColumnRight(column: Column): void;
    moveColumnToPosition(column: Column, position: number): void

    canMoveColumnLeft(column: Column): boolean;
    canMoveColumnRight(column: Column): boolean;

    toggleColumnVisibility(column: Column): void;
    getVisibleColumns(): Column[]

    isFilterable(column: Column): boolean

    getSearchableColumns(): Column[]
}


export class ColumnManager implements ColumnManagerInstance {
    private grid: DatagridInstance;


    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    getAccessor(columnId: ColumnId) {
        const column = this.grid.columns.find(c => c.columnId === columnId)
        if (!column) throw new Error(`Column ${columnId} not found`)
        return column.accessor
    }

    isFilterable(column: Column): boolean {
        return column.filterable === true
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

    getOffset = (id: ColumnId, position: 'left' | 'right'): number => {
        // Filter columns that are visible and pinned to the specified position
        const pinnedColumns = this.grid.columns.filter(
            (column) => column.visible !== false && column.pinning.position === position
        );

        // Find the index of the column with the specified ID
        const index = pinnedColumns.findIndex((column) => column.columnId === id);
        // If the column is the first in the pinned list or not found, return '0px'
        if (index === -1 || index === 0) {
            return 0
        }

        // Sum up the widths of all previous columns in the pinned list before the specified column
        const widthSumOfPreviousIndexes = pinnedColumns
            .slice(0, index) // Get all columns before the specified column
            .reduce((sum, column) => {
                const width = column.size.width || 0 // Parse width; default to 0 if missing
                return sum + width; // Accumulate the total width
            }, 0);

        return widthSumOfPreviousIndexes; // Return the total width as a string
    };


    refreshColumnPinningOffsets() {
        const newColumns: Column[] = [];
        for (let i = 0; i < this.grid.columns.length; i++) {
            const col = this.grid.columns[i];
            if (col.pinning.position === 'none') {
                col.pinning.offset = 0;
            } else {
                col.pinning.offset = this.getOffset(col.columnId, col.pinning.position);
            }

            newColumns.push(col);
        }
        this.grid.columns = newColumns;
    };

    changeColumnPinningPosition(column: Column, position: PinningPosition): void {
        column.pinning.position = position
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

    moveColumnToPosition(column: Column, position: number): void {
        const columnIndex = this.getColumnIndex(column);
        if (columnIndex !== position) {
            this.grid.columns.splice(position, 0, column);
            this.grid.columns.splice(columnIndex, 1);
        }
    }

    // used in global search
    getSearchableColumns(): Column[] {
        return this.grid.columns.filter(c => c.searchable && c.visible);
    }

}