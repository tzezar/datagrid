import { Grouping as GroupingFeature } from "./features/grouping.svelte";
import { PaginationFeature } from "./features/pagination.svelte";
import { Sorting as DataSortingFeature } from "./features/sorting.svelte";
import type { AnyColumn } from "./helpers/column-creators";
import type { GridRow } from "./types";
import { Filtering as FilteringFeature } from "./features/column-filtering.svelte";
import { GlobalSearch as GlobalSearchFeature } from "./features/global-search.svelte";
import { ColumnSizing as ColumnSizingFeature } from "./features/column-sizing.svelte";
import { ColumnVisibility as ColumnVisibilityFeature } from "./features/column-visibility.svelte";
import { RowExpanding as RowExpandingFeature } from "./features/row-expanding.svelte";
import { RowSelection as RowSelectionFeature } from "./features/row-selection.svelte";
import { ColumnPinning as ColumnPinningFeature } from "./features/column-pinning.svelte";
import { ColumnFaceting as ColumnFacetingFeature } from "./features/column-faceting.svelte";
import { RowPinning as RowPinningFeatures } from "./features/row-pinning.svelte";
import { ColumnOrdering as ColumnOrderingFeature } from "./features/column-ordering.svelte";
import { ColumnGrouping as ColumnGroupingFeature } from "./features/column-grouping.svelte";
import { Fullscreen as FullscreenFeature } from "./features/fullscreen.svelte";
import { RowManager } from "./managers/row-manager.svelte";
import { ColumnManager } from "./managers/column-manager.svelte";
import { DataProcessor } from "./processors/data-processor.svelte";
import { ColumnProcessor } from "./processors/column-processor.svelte";

export type DatagridConfig<TOriginalRow> = {
    columns: AnyColumn<TOriginalRow>[];
    data: TOriginalRow[];

    event?: object
}


export class DatagridCacheManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;

    filteredOriginalRowsCache: TOriginalRow[] = $state.raw([]);
    sortedOriginalRowsCache: TOriginalRow[] = $state.raw([]);







    processedRowsCache: GridRow<TOriginalRow>[] | null = $state.raw([]);
    paginatedRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);
    groupedRowsCache: GridRow<TOriginalRow>[] | null = $state.raw(null);
    flattenedRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);


    invalidateGroupedRowsCache() {
        this.groupedRowsCache = null;
    }
    getGroupedRowsCache(data: TOriginalRow[]): GridRow<TOriginalRow>[] {
        if (this.groupedRowsCache === null) {
            this.groupedRowsCache = this.datagrid.processors.data.createHierarchicalData(data);
        } 
        return this.groupedRowsCache;
    }


    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }



}

export class Datagrid<TOriginalRow> {
    original = $state.raw({
        columns: [] as AnyColumn<TOriginalRow>[],
        data: [] as TOriginalRow[]
    });
    columns: AnyColumn<TOriginalRow>[] = $state([]);

    rowManager = new RowManager(this);
    columnManager = new ColumnManager(this);

    cache = new DatagridCacheManager(this);

    processors = {
        data: new DataProcessor(this),
        column: new ColumnProcessor(this)
    }

    features = {
        columnGrouping: new ColumnGroupingFeature(this)
    }




    pagination = new PaginationFeature(this);
    sorting = new DataSortingFeature();
    grouping = new GroupingFeature();
    filtering = new FilteringFeature();
    globalSearch = new GlobalSearchFeature();

    columnSizing = new ColumnSizingFeature(this);
    columnVisibility = new ColumnVisibilityFeature(this);
    columnPinning = new ColumnPinningFeature(this);
    columnFaceting = new ColumnFacetingFeature(this);
    columnOrdering = new ColumnOrderingFeature(this);
    columnGrouping = new ColumnGroupingFeature(this);

    rowExpanding = new RowExpandingFeature(this);
    rowSelection = new RowSelectionFeature(this);
    rowPinning = new RowPinningFeatures(this);

    fullscreen = new FullscreenFeature();

    // Cache
 

    constructor(config: DatagridConfig<TOriginalRow>) {
        this.validateInputs(config);
        this.initializeState(config);
    }

    private validateInputs({ columns, data }: DatagridConfig<TOriginalRow>) {
        if (!columns) throw new Error('Columns are required');
        if (!data) throw new Error('Data is required');
        if (!Array.isArray(data)) throw new Error('Data must be an array');
        if (!Array.isArray(columns)) throw new Error('Columns must be an array');
        if (columns.length === 0) throw new Error('Columns array must not be empty');
        if (data.length === 0) throw new Error('Data array must not be empty');
    }

    private initializeState(config: DatagridConfig<TOriginalRow>) {
        this.original.columns = config.columns;
        this.original.data = config.data;

        this.columns = this.processors.column.transformColumns(this.original.columns);
        this.processors.data.executeFullDataTransformation();

        // Recompute faceted values
        // Moved out of executeFullDataTransformation to avoid unnecessary recomputation
        this.columnFaceting.calculateFacets(this.cache.filteredOriginalRowsCache, this.columns);

        this.globalSearch.fuseInstance = this.globalSearch.initializeFuseInstance(this.original.data, this.columns.map(col => col.columnId as string))
    }

    refresh(operation: () => void): void {
        const timeStart = performance.now();
        operation();
        this.processors.data.executeFullDataTransformation();
        console.log(`Operation took ${performance.now() - timeStart}ms`)
    }

}