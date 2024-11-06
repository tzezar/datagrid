import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";
import type { Column, ColumnId } from "../processors/column-processor.svelte";
import type { Data } from "../types";


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
    subgroups: Map<string, any>;
    groupPath: string;
    value: any;
    key: string;
    depth: number;
    aggregates: any;
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

    setGroupBy(groupBy: Group[]): void
    isGroupExpanded(groupId: string): boolean
    isGrouped(): boolean



    calculateAggregates(items: Data[], column: any): any
    calculateGroupAggregates(group: any): any
}


export class GroupingManager implements GroupingFeature {
    protected grid: DatagridInstance;

    state: GroupingManagerState = {
        groupBy: [],
        expandedRows: new SvelteSet([]),
        _groupedDataCache: null

    }


    isGrouped(): boolean {
        return this.state.groupBy.length > 0;
    }

    constructor(grid: DatagridInstance) {
        this.grid = grid;

    }

    setGroupBy(groupBy: Group[]): void {
        this.state.groupBy = groupBy;
        this.state.expandedRows.clear();
    }

    isGroupExpanded(groupId: string): boolean {
        return this.state.expandedRows.has(groupId);
    }

    calculateAggregates(items: Data[], column: Column): any {
        if (!items.length) return null;

        const accessor = this.grid.columnsProcessor.getAccessor(column.columnId);
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