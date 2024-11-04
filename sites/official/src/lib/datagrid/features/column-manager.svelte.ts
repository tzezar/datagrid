import type { DatagridInstance } from "../index.svelte";
import type { ColumnId } from "../processors/column-processor.svelte"

export type PinningPosition = 'left' | 'right';


interface ColumnManagerInstance {
    state: {
        visibility: { [key: ColumnId]: boolean };
        pinning: {
            [key: ColumnId]: {
                position: PinningPosition,
                offset: number
            }
        },
        sizing: {
            [key: ColumnId]: {
                width: number,
                minWidth: number,
                maxWidth: number
            }
        }
    }

    hideColumn(columnId: ColumnId): void;
    showColumn(columnId: ColumnId): void;
    pinColumn(columnId: ColumnId, position: PinningPosition, offset: number): void;
    unpinColumn(columnId: ColumnId): void;

    resizeColumn(columnId: ColumnId, width: number): void;
}


export class ColumnManager implements ColumnManagerInstance {
    private grid: DatagridInstance;

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    hideColumn(columnId: ColumnId): void {

    }

    showColumn(columnId: ColumnId): void {

    }

    pinColumn(columnId: ColumnId, position: PinningPosition, offset: number): void {

    }

    unpinColumn(columnId: ColumnId): void {

    }

    resizeColumn(columnId: ColumnId, width: number): void {

    }
}