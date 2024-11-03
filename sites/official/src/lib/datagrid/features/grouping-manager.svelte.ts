


import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";



export interface GroupingManagerState {
    groupBy: string[]
    expandedRows: SvelteSet<string>
    _groupedDataCache: Map<string, any> | null

}

export interface GroupingFeature {
    state: GroupingManagerState


    setGroupBy(groupBy: string[]): void
}


export class GroupingManager implements GroupingFeature {
    protected grid: DatagridInstance;

    state: GroupingManagerState = {
        groupBy: [],
        expandedRows: new SvelteSet([]),
        _groupedDataCache: null

    }

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }



    setGroupBy(groupBy: string[]): void {
        this.state.groupBy = groupBy;
		this.state.expandedRows.clear();
    }
}