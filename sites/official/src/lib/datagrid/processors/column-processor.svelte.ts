import type { PinningPosition } from "../features/column-manager.svelte";
import type { AggregationFn } from "../features/grouping-manager.svelte";
import type { SortDirection } from "../features/sorting-manager.svelte";
import type { DatagridInstance } from "../index.svelte";
import type { Accessor, ColumnDef, CommonColumnProps } from "../types";
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

export type ColumnId = string

export type Column<TData, TCustomKeys extends string = never> = {
    columnId: ColumnId, // Used to identify the column
    accessor: Accessor<TData> // Used to get the value
    cell?: {
        component?: any | undefined
        style?: (row: any) => any | undefined
    }
    pinning: {
        position: PinningPosition
        offset: number
    }
    isSorted: () => boolean
    getSortingDirection: () => SortDirection
    aggregationFn: AggregationFn,
    columnDef: ColumnDef<TData, TCustomKeys>
} & CommonColumnProps

export interface ColumnProcessorInstance<TData> {
    transform(): void
    calculateFacets(rows: Row<TData>[]): void
}

export class ColumnProcessor<TData> implements ColumnProcessorInstance<TData> {
    private grid: DatagridInstance<TData, any>

    constructor(grid: DatagridInstance<TData, any>) {
        this.grid = grid;
    }

    transform() {
        const makeAccessor = (col: ColumnDef<TData>) => {
            let accessor: Accessor<TData>
            if (col.accessorFn !== undefined) {
                // If accessorFn is provided, use it directly
                accessor = (obj) => col.accessorFn!(( obj )) 
            } else if (col.accessorKey) {
                // If only accessorKey is provided, create an accessor function
                accessor = this.createAccessor(col.accessorKey as string);
            } else {
                throw new Error('Neither accessorFn nor accessorKey is provided')
            }
            return accessor
        }
        const columns: Column<TData>[] = [];
        for (let i = 0; i < this.grid.original.columns.length; i++) {
            const columnDef = this.grid.original.columns[i]

            const columnId = columnDef.accessorKey || String(i)
            const accessor: Accessor<TData> = makeAccessor(columnDef);
            const isSorted = () => this.grid.sorting.sortBy.filter((s) => s.columnId === columnId).length > 0;
            const getSortingDirection = () => this.grid.sorting.sortBy.filter((s) => s.columnId === columnId)[0]?.direction;
            const pinningPosition = columnDef?.pinning || 'none' as PinningPosition

            const processedColumn: Column<TData> = {
                columnId,
                header: columnDef.header,
                accessor,
                isSorted,
                getSortingDirection,
                cell: {
                    component: columnDef?.cell?.component,
                    style: columnDef?.cell?.style
                },
                faceting: columnDef.faceting,
                formatter: columnDef.formatter,
                allowedSortDirections: columnDef.allowedSortDirections || ['asc', 'desc'],
                pinning: {
                    position: pinningPosition as PinningPosition,
                    // temporary offset, later will be calculated
                    offset: 0
                },
                aggregationFn: columnDef.aggregationFn || 'none',
                columnDef: columnDef,
                sortable: columnDef.sortable ?? true,
                resizable: columnDef.resizable ?? true,
                movable: columnDef.movable ?? true,
                pinnable: columnDef.pinnable ?? true,
                hideable: columnDef.hideable ?? true,
                // exportable: columnDef.exportable ?? true,
                searchable: columnDef.searchable ?? true,
                filterable: columnDef.filterable ?? true,
                groupable: columnDef.groupable ?? true,
                visible: columnDef.visible ?? true,
                size: columnDef.size ?? { width: 100, minWidth: 50, maxWidth: 200, grow: false },
                _meta: columnDef._meta

            };

            columns.push(processedColumn);
        }

        this.grid.columns = columns;

        // Process pinning
        for (const col of columns) {
            if (col.pinning?.position !== 'none') {
                col.pinning.offset = this.grid.columnManager.getOffset(col.columnId, col.pinning.position);
            }
        }
    }

    private createAccessor = (path: string): ((obj: any) => any) => {
        const parts = path.split('.');

        // For non-nested properties, use direct access for best performance
        if (parts.length === 1) {
            return (obj: any) => obj[path];
        }

        // For nested properties, create optimized function
        // This is faster than using reduce() or recursive function calls
        switch (parts.length) {
            case 2:
                return (obj: any) => obj[parts[0]]?.[parts[1]];
            case 3:
                return (obj: any) => obj[parts[0]]?.[parts[1]]?.[parts[2]];
            default:
                // Fallback for deeply nested properties (rare case)
                return (obj: any) => {
                    let value = obj;
                    for (let i = 0; i < parts.length; i++) {
                        value = value?.[parts[i]];
                        if (value === undefined) return undefined;
                    }
                    return value;
                };
        }
    };
   

    calculateFacets(rows: Row<TData>[]) {
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