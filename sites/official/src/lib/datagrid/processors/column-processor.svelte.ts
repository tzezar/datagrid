import type { PinningPosition } from "../features/column-manager.svelte";
import { numberFilterOperators, stringFilterOperators, type FilterOperator } from "../features/filtering-manager.svelte";
import type { AggregationFn } from "../features/grouping-manager.svelte";
import type { SortDirection } from "../features/sorting-manager.svelte";
import type { DatagridInstance } from "../index.svelte";
import type { ColumnDef, CommonColumnProps, DataType } from "../types";
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

export type Column = {
    columnId: ColumnId, // Used to identify the column
    accessor: Accessor // Used to get the value
    cell?: {
        component?: any | undefined
        style?: (row: any) => any | undefined
    }
    filter: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'custom' | undefined
    pinning: {
        position: PinningPosition
        offset: number
    }
    type: DataType
    isSorted: () => boolean
    getSortingDirection: () => SortDirection
    aggregationFn: AggregationFn,
    columnDef: ColumnDef
} & CommonColumnProps

export interface ColumnProcessorInstance {
    transform(): void
    calculateFacets(rows: Row[]): void
}

export class ColumnProcessor implements ColumnProcessorInstance {
    private grid: DatagridInstance;

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    transform() {
        const makeAccessor = (col: ColumnDef) => {
            let accessor: Accessor
            if (col.accessorFn) {
                // If accessorFn is provided, use it directly
                accessor = (obj: any) => col.accessorFn!(({ original: obj } as Row));
            } else if (col.accessorKey) {
                // If only accessorKey is provided, create an accessor function
                accessor = this.createAccessor(col.accessorKey);
            } else {
                throw new Error('Neither accessorFn nor accessorKey is provided')
            }
            return accessor
        }
        const columns: Column[] = [];
        for (let i = 0; i < this.grid.original.columns.length; i++) {
            const columnDef: ColumnDef = this.grid.original.columns[i]

            const columnId = columnDef.accessorKey || String(i);
            const accessor: Accessor = makeAccessor(columnDef);
            const isSorted = () => this.grid.sorting.sortBy.filter((s) => s.columnId === columnId).length > 0;
            const getSortingDirection = () => this.grid.sorting.sortBy.filter((s) => s.columnId === columnId)[0]?.direction;
            const pinningPosition = columnDef?.pinning || 'none' as PinningPosition

            const processedColumn: Column = {
                columnId,
                header: columnDef.header,
                accessor,
                isSorted,
                getSortingDirection,
                cell: {
                    component: columnDef?.cell?.component,
                    style: columnDef?.cell?.style
                },
                filter: columnDef.filter,
                faceting: columnDef.faceting,
                formatter: columnDef.formatter,
                allowedSortDirections: columnDef.allowedSortDirections || ['asc', 'desc'],
                allowedFilterOperators: this.getAllowedFilterOperators(columnDef),
                pinning: {
                    position: pinningPosition as PinningPosition,
                    // temporary offset, later will be calculated
                    offset: 0
                },
                aggregationFn: columnDef.aggregationFn || 'none',
                type: columnDef.type || 'string',
                
                columnDef: columnDef,
                
                sortable: columnDef.sortable || false,
                resizable: columnDef.resizable || false,
                movable: columnDef.movable || false,
                pinnable: columnDef.pinnable || false,
                hideable: columnDef.hideable || false,
                exportable: columnDef.exportable || false,
                searchable: columnDef.searchable ?? true,
                filterable: columnDef.filterable || false,
                groupable: columnDef.groupable || false,
                visible: columnDef.visible || true,
                size: columnDef.size || { width: 100, minWidth: 50, maxWidth: 200 }

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

    private getAllowedFilterOperators(column: ColumnDef): FilterOperator[] {
        if (!column) return []
        if (column.filterable === false) return []
        if (!column.filter) return []
        if (column.allowedFilterOperators) return column.allowedFilterOperators
        if (column.filter === 'string') return stringFilterOperators
        if (column.filter === 'number') return numberFilterOperators
        return []
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