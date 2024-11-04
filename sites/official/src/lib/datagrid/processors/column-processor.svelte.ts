import type { SortDirection } from "../features/sorting-manager.svelte";
import type { DatagridInstance } from "../index.svelte";

export type Accessor = (row: any) => any
export type ColumnId = string

export interface Column {
    columnId: ColumnId,
    accessor: (row: any) => any
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


    getAccessor(columnId: ColumnId): Accessor
}

export class ColumnProcessor implements ColumnProcessorInstance {
    private grid: DatagridInstance

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    initialize() {
        const columns: Column[] = [];
        for (let i = 0; i < this.grid.original.columns.length; i++) {
            const col = this.grid.original.columns[i];

            const columnId = col.accessorKey || String(i)

            let accessor = col.accessorKey || col.accessorFn
            if (accessor === undefined) {
                throw new Error(`Column ${columnId} with header ${col.header} does not have an accessorKey or accessorFn.`);
            }
            accessor = this.createAccessorFn(accessor)

            const isSorted = () => this.grid.sorting.sortBy.filter((s) => s.columnId === columnId).length > 0;
            const getSortingDirection = () => this.grid.sorting.sortBy.filter((s) => s.columnId === columnId)[0]?.direction

            columns.push({
                columnId,
                accessor,
                isSorted,
                getSortingDirection,
                header: col.header,
                size: {
                    width: 100,
                    minWidth: 50,
                    maxWidth: 200
                }
            });

            this.grid.columns = columns;
        }
    }

    createAccessorFn<T,>(accessor: string | Accessor) {
        if (typeof accessor === 'string') {
            return (row: T) => {
                // Handle nested paths like 'department.name'
                //@ts-expect-error TS7053
                return accessor.split('.').reduce((obj, key) => obj?.[key], row);
            };
        }
        return accessor;
    };

    getAccessor(columnId: ColumnId) {
        const column = this.grid.columns.find(c => c.columnId === columnId)
        if (!column) throw new Error(`Column ${columnId} not found`)
        return column.accessor
    }

}