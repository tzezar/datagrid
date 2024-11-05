import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";
import type { ColumnId } from "../processors/column-processor.svelte";


export type AggregationFn = 'sum' | 'min' | 'max' | 'extent' | 'mean' | 'median' | 'unique' | 'uniqueCount' | 'count'
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
}