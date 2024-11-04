import type { SortDirection } from "../features/sorting-manager.svelte";
import type { DatagridInstance } from "../index.svelte";
import type { Row } from "./data-processor.svelte";


export type NumericFacet = {
    type: 'numeric'
    min: number
    max: number
}

export type CategoricalFacet = {
    type: 'categorical'
    uniqueValues: any[]
    uniqueValuesCount: number
}


export type Accessor = (row: any) => any
export type ColumnId = string

export interface Column {
    columnId: ColumnId,
    // ? I am not sure if keeping accessor as fn is good idea, it makes more problems than getting value
    // ? with getNestedValue(); or maybe cached value would be better for performance
    // ? (row) => row.smth comes with performance overhead 200%
    accessor: (row: any) => any
    accessorKey?: string
    formatter?: (row: any) => any
    header: string
    size: {
        width: number
        minWidth: number
        maxWidth: number
    },
    cell?: {
        component?: any | undefined
        style?: (row: any) => any | undefined
    }
    visible: boolean;
    groupable: boolean;
    sortable: boolean;
    filterable: boolean;

    faceting: NumericFacet | CategoricalFacet | undefined

    isSorted: () => boolean
    getSortingDirection: () => SortDirection
    includeInSearch: boolean
    includeInExport: boolean
}

export interface ColumnProcessorInstance {
    initialize(): void
    getAccessor(columnId: ColumnId): Accessor

    calculateFacets(rows: Row[]): void
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

            const processedColumn = {
                columnId,
                accessorKey: col.accessorKey,
                header: col.header,
                accessor,
                isSorted,
                getSortingDirection,
                includeInSearch: col.includeInSearch === undefined ? true : col.includeInSearch,
                includeInExport: col.includeInExport === undefined ? true : col.includeInExport,
                cell: {
                    component: col?.cell?.component,
                    style: col?.cell?.style
                },
                faceting: col.faceting,
                formatter: col.formatter,
                size: col.size || { width: 100, minWidth: 50, maxWidth: 200 },
                visible: col.visible === undefined ? true : col.visible,
                groupable: col.groupable === undefined ? true : col.groupable,
                sortable: col.sortable === undefined ? true : col.sortable,
                filterable: col.filterable === undefined ? true : col.filterable,
            }

            columns.push(processedColumn);
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


    calculateFacets(rows: Row[]) {
        for (const column of this.grid.columns) {
            if (!column.faceting) continue
            if (column.faceting.type === 'numeric') {
                column.faceting.min = Math.min(...rows.map(row => column.accessor(row.original))) 
                column.faceting.max = Math.max(...rows.map(row => column.accessor(row.original))) 
            }

            if (column.faceting.type === 'categorical') {
                column.faceting.uniqueValuesCount = new Set(rows.map(row => column.accessor(row.original))).size
                column.faceting.uniqueValues = Array.from(new Set(rows.map(row => column.accessor(row.original))))
            }
        }
    }
}