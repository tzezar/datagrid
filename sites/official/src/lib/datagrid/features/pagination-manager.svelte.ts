import type { DatagridInstance } from "../index.svelte";


export interface PaginationFeature {

}


export class PaginationManager implements PaginationFeature {
    protected grid: DatagridInstance;

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }
}