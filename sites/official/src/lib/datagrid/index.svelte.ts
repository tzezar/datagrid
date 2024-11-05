import { ColumnManager } from "./features/column-manager.svelte";
import { FilteringManager, type FilteringFeature } from "./features/filtering-manager.svelte";
import { GroupingManager, type GroupingFeature } from "./features/grouping-manager.svelte";
import { PaginationManager, type PaginationFeature } from "./features/pagination-manager.svelte";
import { RowManager } from "./features/row-manager.svelte";
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

    columnManager: ColumnManager


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
    columnManager: ColumnManager = new ColumnManager(this);
    rowManager: RowManager = new RowManager(this);

    dataProcessor: DataProcessorInstance = new DataProcessor(this);
    columnsProcessor: ColumnProcessorInstance = new ColumnProcessor(this);

    constructor(data: Data[], columns: ColumnDef[]) {
        this.original = { data, columns };
        this.columnsProcessor.initialize();

        // this.grouping.state.groupBy = [
        //     { columnId: 'department.name', accessor: this.columnManager.getColumn('department.name').accessor },
        //     { columnId: 'region', accessor: grid.columnManager.getColumn('region').accessor }
        // ]

        this.rows = this.dataProcessor.process();
        this.columnsProcessor.calculateFacets(this.dataProcessor.processedRowsCache);


        this.filtering.assignFuseInstance(this.original.data);
    }

    refreshVisibleRows(): void {
        this.rows = this.dataProcessor.getVisibleRows(this.pagination.page, this.pagination.pageSize);
    }


    // Used when the data should be updated eg. pagination
    refresh(operation: () => void): void {
        const timeStart = performance.now();
        operation();
        this.refreshVisibleRows();
        console.log(`Operation took ${performance.now() - timeStart}ms`)
    }

    // Used when the data should be reloaded
    reload(command: () => void): void {
        const timeStart = performance.now();
        command();
        this.dataProcessor.process()
        console.log(`Execution took ${performance.now() - timeStart}ms`)

    }

}