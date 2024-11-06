import type { PinningPosition } from "../features/column-manager.svelte";
import { numberFilterOperators, stringFilterOperators, type FilterOperator } from "../features/filtering-manager.svelte";
import type { AggregationFn } from "../features/grouping-manager.svelte";
import type { SortDirection } from "../features/sorting-manager.svelte";
import type { DatagridInstance } from "../index.svelte";
import type { ColumnDef, DataType } from "../types";
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
    columnId: ColumnId, // Used to identify the column
    accessor: Accessor // Used to get the value
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
    filter: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'custom' | undefined
    pinning: {
        position: PinningPosition
        offset: number
    }
    type: DataType
    isSorted: () => boolean
    getSortingDirection: () => SortDirection
    includeInSearch: boolean
    includeInExport: boolean
    allowedSortDirections: SortDirection[]
    allowedFilterOperators: FilterOperator[],
    aggregationFn: AggregationFn,
    columnDef: ColumnDef
}

export interface ColumnProcessorInstance {
    transform(): void
    getAccessor(columnId: ColumnId): Accessor
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
            const pinningPosition = columnDef.pinning?.position || 'none';
            const size = columnDef.size || { width: 100, minWidth: 50, maxWidth: 200 };

            const processedColumn: Column = {
                columnId,
                header: columnDef.header,
                accessor,
                isSorted,
                getSortingDirection,
                includeInSearch: columnDef.includeInSearch ?? true,
                includeInExport: columnDef.includeInExport ?? true,
                cell: {
                    component: columnDef?.cell?.component,
                    style: columnDef?.cell?.style
                },
                filter: columnDef.filter,
                faceting: columnDef.faceting,
                formatter: columnDef.formatter,
                size,
                visible: columnDef.visible ?? true,
                groupable: columnDef.groupable ?? true,
                sortable: columnDef.sortable ?? true,
                filterable: columnDef.filterable ?? true,
                allowedSortDirections: columnDef.allowedSortDirections || ['asc', 'desc'],
                allowedFilterOperators: this.getAllowedFilterOperators(columnDef),
                pinning: {
                    position: pinningPosition,
                    offset: 0
                },
                aggregationFn: columnDef.aggregationFn || 'none',
                type: columnDef?.type || 'string',
                columnDef: columnDef
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
        if (!column.type) return []
        if (column.allowedFilterOperators) return column.allowedFilterOperators
        if (column.type === 'string') return stringFilterOperators
        if (column.type === 'number') return numberFilterOperators
        return []
    }

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