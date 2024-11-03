


import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";



export interface GroupingManagerState {
    groupBy: string[]
    expandedRows: SvelteSet<string>
    groupedDataCache: Map<string, any> | null
}

export interface GroupingFeature {
    state: GroupingManagerState
}


export class GroupingManager implements GroupingFeature {
    protected grid: DatagridInstance;

    state: GroupingManagerState = {
        groupBy: [],
        expandedRows: new SvelteSet([]),
        groupedDataCache: null

    }

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    
}