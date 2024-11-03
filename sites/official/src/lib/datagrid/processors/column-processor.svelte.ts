import type { ColumnDef } from "../../../v2/_components/types";
import type { SortDirection } from "../features/sorting-manager.svelte";
import type { DatagridInstance } from "../index.svelte";


export interface Column {
    accessorKey: string
    header: string
    size: {
        width: number
        minWidth: number
        maxWidth: number
    },


    isSorted: () => boolean
    getSortingDirection: () => SortDirection

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


            const isSorted = () => this.grid.sorting.sortBy.filter((s) => s.accessor === accessorKey).length > 0;
            const getSortingDirection = () => this.grid.sorting.sortBy.filter((s) => s.accessor === accessorKey)[0]?.direction
            
            columns.push({
                isSorted,
                getSortingDirection,
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