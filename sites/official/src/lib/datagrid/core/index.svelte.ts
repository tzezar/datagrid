import type { AnyColumn, GroupColumn } from "./column-creation/types";
import { PerformanceMetrics } from "./helpers/performance-metrics.svelte";
import { ColumnFacetingFeature, ColumnFilteringFeature, ColumnGroupingFeature, ColumnOrderingFeature, ColumnPinningFeature, ColumnSizingFeature, ColumnVisibilityFeature, GlobalSearchFeature, GroupingFeature, PaginationFeature, RowExpandingFeature, RowPinningFeature, RowSelectionFeature, SortingFeature } from "./features";
import { DataProcessor, ColumnProcessor } from "./processors";
import { DatagridCacheManager, HandlersManager, RowManager, ColumnManager } from "./managers";
import { LifecycleHooks } from "./managers/lifecycle-hooks-manager.svelte";
import { isGroupColumn } from "./helpers/column-guards";

export type GridConfig<TOriginalRow, C extends AnyColumn<TOriginalRow> = AnyColumn<TOriginalRow>> = {
    columns: C[];
    data: TOriginalRow[];
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;  // Add this
    event?: object
}

export class DataGrid<TOriginalRow> {
    readonly metrics = new PerformanceMetrics();
    initial = $state.raw({
        columns: [] as AnyColumn<TOriginalRow>[],
        data: [] as TOriginalRow[]
    });
    columns: AnyColumn<TOriginalRow>[] = $state([]);

    handlers = new HandlersManager(this);
    processors = {
        data: new DataProcessor(this),
        column: new ColumnProcessor(this)
    }
    
    cache = new DatagridCacheManager(this);
    rows = new RowManager(this);
    columnManager = new ColumnManager(this);

    config = {
        measurePerformance: false,
        createBasicRowIdentifier: (row: TOriginalRow) => (row as any).id,
        createBasicRowIndex: (row: TOriginalRow, parentIndex: string | null, index: number) =>
            parentIndex ? `${parentIndex}-${index + 1}` : String(index + 1),
    }

    features = {
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
    }

    readonly lifecycleHooks = new LifecycleHooks<TOriginalRow>();

    constructor(config: GridConfig<TOriginalRow>) {
        if (config.lifecycleHooks) {
            this.lifecycleHooks = config.lifecycleHooks;
        }


        this.validateConfigInputs(config);
        // config.columns = this.lifecycleHooks.preProcessColumns(hook, config.columns);
        this.initializeState(config);
    }

    private validateConfigInputs({ columns, data }: GridConfig<TOriginalRow>) {
        if (!columns) throw new Error('Columns are required');
        if (!data) throw new Error('Data is required');
        if (!Array.isArray(data)) throw new Error('Data must be an array');
        if (!Array.isArray(columns)) throw new Error('Columns must be an array');
        if (columns.length === 0) throw new Error('Columns array must not be empty');
        if (data.length === 0) throw new Error('Data array must not be empty');
    }

        assignParentColumnIds(columns: AnyColumn<TOriginalRow>[], parentColumnId: string | null = null) {
            columns.forEach(column => {
                if (isGroupColumn(column)) {
                    const groupColumn = column as GroupColumn<TOriginalRow>;
                    this.assignParentColumnIds(groupColumn.columns, groupColumn.columnId);
                }
                column.parentColumnId = parentColumnId;
            })
            return columns;
        }

    private initializeState(config: GridConfig<TOriginalRow>) {
        this.initial.columns = config.columns;
        this.initial.data = config.data;

        this.columns = this.processors.column.transformColumns(this.initial.columns)
        this.processors.data.executeFullDataTransformation();
        // Recompute faceted values
        // Moved out of executeFullDataTransformation to avoid unnecessary recomputation
        this.features.columnFaceting.calculateFacets(this.cache.sortedData || [], this.columns);

        this.features.globalSearch.fuseInstance = this.features.globalSearch.initializeFuseInstance(this.initial.data, this.columns.map(col => col.columnId as string))
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

        if (this.config.measurePerformance) console.log(`Operation took ${performance.now() - timeStart}ms`);
    }

}