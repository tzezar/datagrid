import type { AnyColumn } from "./column-creation/types";
import { PerformanceMetrics } from "./helpers/performance-metrics.svelte";
import { ColumnFacetingFeature, ColumnFilteringFeature, ColumnGroupingFeature, ColumnOrderingFeature, ColumnPinningFeature, ColumnSizingFeature, ColumnVisibilityFeature, FullscreenFeature, GlobalSearchFeature, GroupingFeature, PaginationFeature, RowExpandingFeature, RowPinningFeature, RowSelectionFeature, SortingFeature } from "./features";
import { DataProcessor, ColumnProcessor } from "./processors";
import { DatagridCacheManager, HandlersManager, RowManager, ColumnManager } from "./managers";
export type DatagridConfig<TOriginalRow> = {
    columns: AnyColumn<TOriginalRow>[];
    data: TOriginalRow[];

    event?: object
}


const defaultConfig = {
    measurePerformance: false,
    createBasicRowIdentifier: (row: any) => row.id,
    createBasicRowIndex: (row: any, parentIndex: string | null, index: number) => parentIndex ? `${parentIndex}-${index + 1}` : String(index + 1),
}

export class Datagrid<TOriginalRow> {
    readonly metrics = new PerformanceMetrics();

    original = $state.raw({
        columns: [] as AnyColumn<TOriginalRow>[],
        data: [] as TOriginalRow[]
    });
    columns: AnyColumn<TOriginalRow>[] = $state([]);

    handlers = new HandlersManager(this);

    processors = {
        data: new DataProcessor(this),
        column: new ColumnProcessor(this)
    }

    feature = {
        pagination: new PaginationFeature(this),
        sorting: new SortingFeature(this),
        grouping: new GroupingFeature(),
        filtering: new ColumnFilteringFeature(),
        globalSearch: new GlobalSearchFeature(),
        columnSizing: new ColumnSizingFeature(this),
        columnVisibility: new ColumnVisibilityFeature(this),
        columnPinning: new ColumnPinningFeature(this),
        columnFaceting: new ColumnFacetingFeature(this),
        columnOrdering: new ColumnOrderingFeature(this),
        columnGrouping: new ColumnGroupingFeature(this),
        rowExpanding: new RowExpandingFeature(this),
        rowSelection: new RowSelectionFeature(this),
        rowPinning: new RowPinningFeature(this),
        fullscreen: new FullscreenFeature()
    }

    cache = new DatagridCacheManager(this);
    rowManager = new RowManager(this);
    columnManager = new ColumnManager(this);

    config = defaultConfig

    pagination = new PaginationFeature(this);
    sorting = new SortingFeature(this);
    grouping = new GroupingFeature();
    filtering = new ColumnFilteringFeature();
    globalSearch = new GlobalSearchFeature();

    columnSizing = new ColumnSizingFeature(this);
    columnVisibility = new ColumnVisibilityFeature(this);
    columnPinning = new ColumnPinningFeature(this);
    columnFaceting = new ColumnFacetingFeature(this);
    columnOrdering = new ColumnOrderingFeature(this);
    columnGrouping = new ColumnGroupingFeature(this);

    rowExpanding = new RowExpandingFeature(this);
    rowSelection = new RowSelectionFeature(this);
    rowPinning = new RowPinningFeature(this);

    fullscreen = new FullscreenFeature();


    hooks = {
        preProcessColumns: (action: any, columns: AnyColumn<TOriginalRow>[]) => {
            return action(columns);
        }
    }

    constructor(config: DatagridConfig<TOriginalRow>, hook: any) {
        this.validateInputs(config);
        config.columns = this.hooks.preProcessColumns(hook, config.columns);
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
        this.columnFaceting.calculateFacets(this.cache.sortedData || [], this.columns);

        this.globalSearch.fuseInstance = this.globalSearch.initializeFuseInstance(this.original.data, this.columns.map(col => col.columnId as string))
    }

    /**
       * Performs a refresh with different levels of data recalculation
       */
    refresh(operation: () => void, options: {
        recalculateAll?: boolean;
        recalculateGroups?: boolean;
        recalculatePagination?: boolean;
    } = {}): void {
        const timeStart = performance.now();

        operation();

        const {
            recalculateAll = false,
            recalculateGroups = false,
            recalculatePagination = true
        } = options;

        if (recalculateAll) {
            this.processors.data.executeFullDataTransformation();
        } else if (recalculateGroups) {
            this.processors.data.handleGroupExpansion();
        } else if (recalculatePagination) {
            this.processors.data.handlePaginationChange();
        }

        console.log(`Operation took ${performance.now() - timeStart}ms`);
    }





}