import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance, GroupingStateConfig } from "../index.svelte";
import type { Column, ColumnId } from "../processors/column-processor.svelte";
import type { Row } from "../processors/data-processor.svelte";


export type AggregationFn = "none" | 'sum' | 'min' | 'max' | 'extent' | 'mean' | 'median' | 'unique' | 'uniqueCount' | 'count' | 'all'
export interface Aggregate {
    columnId: ColumnId
    accessor: (row: any) => any,
    values: {
        [key in AggregationFn]: number
    }
}

export interface GroupData {
    items: any[];
    allItems: any[];
    subgroups: Map<string, any>;
    groupPath: string;
    value: any;
    columnId: ColumnId;
    depth: number;
    aggregates: any;
}

export type GroupRow<T> = {
    index: string;
    subRows: Row<T>[];
    groupId: string | null;
    parentId: string | null;
    original: null,
    depth: number;
    isExpanded?: boolean;
    aggregates: {
        [columnId: string]: {
            sum?: number;
            count?: number;
            min?: number;
            max?: number;
            mean?: number;
        };
    };
    columnId: ColumnId,
}

export type Group = {
    columnId: ColumnId
    accessor: (row: any) => any
}

export interface GroupingManagerState {
    groupBy: Group[]
    expandedRows: SvelteSet<string>
    _groupedDataCache: Map<string, any> | null

}

export interface GroupingFeature {
    state: GroupingManagerState
    initialize(state: GroupingStateConfig): void
    setGroupBy(groupBy: Group[]): void
    isGroupExpanded(groupId: string): boolean
    hasGroups(): boolean
    calculateGroupAggregates(group: any): any
}


export class GroupingManager<TData> implements GroupingFeature {
    protected grid: DatagridInstance<TData, any>

    state: GroupingManagerState = {
        groupBy: [],
        expandedRows: new SvelteSet([]),
        _groupedDataCache: null

    }

    initialize(state: GroupingStateConfig): void {
        this.state.groupBy = state.groupBy || this.state.groupBy;
        this.state.expandedRows = state.expandedRows || this.state.expandedRows;
    }



    hasGroups(): boolean {
        return this.state.groupBy.length > 0;
    }

    constructor(grid: DatagridInstance<TData, any>) {
        this.grid = grid;

    }

    setGroupBy(groupBy: Group[]): void {
        this.state.groupBy = groupBy;
        this.state.expandedRows.clear();
    }

    isGroupExpanded(groupId: string): boolean {
        return this.state.expandedRows.has(groupId);
    }

    private calculateAggregates(items: TData[], column: Column<TData>): any {
        if (!items.length) return null;

        const accessor = this.grid.columnManager.getAccessor(column.columnId);
        const values = items.map(item => accessor(item)).filter(val => val !== null && val !== undefined);

        if (!values.length) return null;

        const aggregates: any = {};

        if (column.aggregationFn === 'sum' || column.aggregationFn === 'all') {
            aggregates.sum = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
        }

        if (column.aggregationFn === 'count' || column.aggregationFn === 'all') {
            aggregates.count = values.length;
        }

        if (column.aggregationFn === 'min' || column.aggregationFn === 'all') {
            aggregates.min = Math.min(...values);
        }

        if (column.aggregationFn === 'max' || column.aggregationFn === 'all') {
            aggregates.max = Math.max(...values);
        }

        if (column.aggregationFn === 'mean' || column.aggregationFn === 'all') {
            aggregates.mean = aggregates.sum / aggregates.count;
        }

        return aggregates;
    }

    calculateGroupAggregates(group: any): any {
        const aggregates: any = {};

        // Get all columns that have aggregation functions
        const columnsWithAggregation = this.grid.columns.filter(
            col => col.aggregationFn
        );

        // Calculate aggregates for each column using allItems for complete aggregation
        columnsWithAggregation.forEach(column => {
            aggregates[column.columnId] = this.calculateAggregates(group.allItems, column);
        });

        return aggregates;
    }
}