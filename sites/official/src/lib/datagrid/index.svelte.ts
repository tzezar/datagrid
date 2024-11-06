import { ColumnManager } from "./features/column-manager.svelte";
import { FilteringManager, type FilteringFeature, type FilteringState } from "./features/filtering-manager.svelte";
import { GroupingManager, type GroupingFeature, type GroupingManagerState } from "./features/grouping-manager.svelte";
import { PaginationManager, type PaginationFeature, type PaginationState } from "./features/pagination-manager.svelte";
import { RowManager, type RowExpansionMode, type RowManagerState, type RowSelectionMode } from "./features/row-manager.svelte";
import { SortingManager, type SortingFeature, type SortingState } from "./features/sorting-manager.svelte";
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


    isRowVisible(row: Row): boolean
    getVisibleRows(page: number, pageSize: number): Row[]
    getVisibleRowCount(): number
}


export type PaginationStateConfig = Partial<Omit<PaginationState, 'pageCount'>>
export type GroupingStateConfig = Partial<Omit<GroupingManagerState, '_groupedDataCache'>>
export type FilteringStateConfig = Partial<FilteringState>
export type RowManagerStateConfig = Partial<RowManagerState> & {
    selectionMode?: RowSelectionMode
    expansionMode?: RowExpansionMode
}
export type SortingStateConfig = Partial<SortingState>

export type DatagridConfig = {
    columns: ColumnDef[]
    data: Data[]

    pagination?: PaginationStateConfig
    grouping?: GroupingStateConfig
    filtering?: FilteringStateConfig
    rowManager?: RowManagerStateConfig
    sorting?: SortingStateConfig
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

    constructor(config: DatagridConfig) {
        this.original = { data: config.data, columns: config.columns };
        this.initialize(config);
    }

    private initialize(config: DatagridConfig): void {
        this.pagination.initialize(config.pagination || {});
        this.grouping.initialize(config.grouping || {});
        this.filtering.initialize(config.filtering || {});
        this.rowManager.initialize(config.rowManager || {});
        this.sorting.initialize(config.sorting || {});

        this.columnsProcessor.transform();
        this.dataProcessor.process();
        this.columnsProcessor.calculateFacets(this.dataProcessor.processedRowsCache);
        this.filtering.assignFuseInstance(this.original.data);
        this.pagination.updatePageCount()
    }

    refreshVisibleRows(): void {
        this.rows = this.getVisibleRows(this.pagination.page, this.pagination.pageSize);
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
        this.pagination.updatePageCount()
        console.log(`Execution took ${performance.now() - timeStart}ms`)

    }


    getVisibleRows(page: number, pageSize: number): Row[] {
        const visibleRows = this.dataProcessor.processedRowsCache.filter(row => this.isRowVisible(row));
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return visibleRows.slice(startIndex, endIndex);
    }

    isRowVisible(row: Row): boolean {
        if (!row.parentId) return true;

        let currentParentId: string | null = row.parentId;
        while (currentParentId) {
            if (!this.grouping.state.expandedRows.has(currentParentId)) {
                return false;
            }
            const parentRow = this.dataProcessor.rowsMap.get(currentParentId);
            currentParentId = parentRow?.parentId ?? null;
        }

        return true;
    }
    getVisibleRowCount(): number {
        return this.dataProcessor.processedRowsCache.filter(row => this.isRowVisible(row)).length;
    }
}