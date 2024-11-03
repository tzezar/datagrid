import type { ColumnDef } from "../../../v2/_components/types";
import type { DatagridInstance } from "../index.svelte";


export interface Column {
    accessorKey: string
    header: string
    size: {
        width: number
        minWidth: number
        maxWidth: number
    }
}

export interface ColumnProcessorInstance {

    initialize(): void
}

export class ColumnProcessor implements ColumnProcessorInstance {
    private grid: DatagridInstance

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    initialize() {
        const columns: Column[] = [];
        for (let i = 0; i < this.grid.original.columns.length; i++) {
            const { accessorKey, header } = this.grid.original.columns[i];

            columns.push({
                accessorKey,
                header,
                size: {
                    width: 100,
                    minWidth: 50,
                    maxWidth: 200
                }
            });

            this.grid.columns = columns;
        }
    }
}