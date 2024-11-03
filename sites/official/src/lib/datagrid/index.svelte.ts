import { browser } from "$app/environment";
import { FilteringManager, type FilteringFeature } from "./features/filtering-manager.svelte";
import { GroupingManager, type GroupingFeature } from "./features/grouping-manager.svelte";
import { PaginationManager, type PaginationFeature } from "./features/pagination-manager.svelte";
import { SortingManager, type SortingFeature } from "./features/sorting-manager.svelte";
import { ColumnProcessor, type Column, type ColumnProcessorInstance } from "./processors/column-processor.svelte";
import { DataProcessor, type DataProcessorInstance, type Row } from "./processors/data-processor.svelte";
import type { ColumnDef, Data } from "./types";



export interface DatagridOriginal {
    data: Data[];
    columns: ColumnDef[];
}


export interface DatagridInstance {
    original: DatagridOriginal


    rows: Row[]
    columns: Column[]

    sorting: SortingFeature;
    filtering: FilteringFeature;
    grouping: GroupingFeature
    pagination: PaginationFeature


    dataProcessor: DataProcessorInstance
    columnsProcessor: ColumnProcessorInstance
}


export class Datagrid implements DatagridInstance {
    original: DatagridOriginal = {
        data: [],
        columns: [],
    }
    
    rows: Row[] = $state([]);
    columns: Column[] = $state([]);

    sorting: SortingFeature = new SortingManager(this);
    filtering: FilteringFeature = new FilteringManager(this);
    grouping: GroupingFeature = new GroupingManager(this);
    pagination: PaginationFeature = new PaginationManager(this);


    dataProcessor: DataProcessorInstance = new DataProcessor(this);
    columnsProcessor: ColumnProcessorInstance = new ColumnProcessor(this);

    constructor(data: Data[], columns: ColumnDef[]) {
        this.original = { data, columns };
        this.rows = this.dataProcessor.initialize();
        this.columnsProcessor.initialize();
    }



}