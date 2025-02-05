import type { AnyColumn } from "./types";
import { PerformanceMetrics } from "./helpers/performance-metrics.svelte";
import { DataProcessor, ColumnProcessor } from "./processors";
import { DatagridCacheManager, HandlersManager, RowManager, ColumnManager } from "./managers";
import { LifecycleHooks } from "./managers/lifecycle-hooks-manager.svelte";
import { type PaginationPluginConfig } from "./features/pagination.svelte";
import { type ColumnFilteringPluginConfig } from "./features/column-filtering.svelte";
import { type ColumnFacetingPluginConfig } from "./features/column-faceting.svelte";
import { type GlobalSearchPluginConfig } from "./features/global-search.svelte";
import { type GroupingPluginConfig } from "./features/grouping.svelte";
import { type RowExpandingPluginConfig } from "./features/row-expanding.svelte";
import { type RowSelectionPluginConfig, } from "./features/row-selection.svelte";
import { type SortingPluginConfig, } from "./features/sorting.svelte";
import { FeatureManager } from "./managers/feature-manager.svelte";
import type { ColumnOrderingPluginConfig } from "./features/column-ordering.svelte";
import type { ColumnGroupingPluginConfig } from "./features/column-grouping.svelte";
import type { ColumnPinningPluginConfig } from "./features/column-pinning.svelte";
import type { ColumnSizingPluginConfig } from "./features/column-sizing.svelte";
import type { ColumnVisibilityPluginConfig } from "./features/column-visibility.svelte";
import type { RowPinningPluginConfig } from "./features/row-pinning.svelte";

export type DatagridCoreConfig<TOriginalRow, C extends AnyColumn<TOriginalRow> = AnyColumn<TOriginalRow>> = {
    columns: C[];
    data: TOriginalRow[];
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;  // Add this

    features?: {
        columnFaceting?: ColumnFacetingPluginConfig
        filtering?: ColumnFilteringPluginConfig
        globalSearch?: GlobalSearchPluginConfig
        grouping?: GroupingPluginConfig
        pagination?: PaginationPluginConfig
        rowExpanding?: RowExpandingPluginConfig
        rowPinning?: RowPinningPluginConfig
        rowSelection?: RowSelectionPluginConfig
        sorting?: SortingPluginConfig
        columnSizing?: ColumnSizingPluginConfig
        columnVisibility?: ColumnVisibilityPluginConfig
        columnPinning?: ColumnPinningPluginConfig
        columnGrouping?: ColumnGroupingPluginConfig
        columnOrdering?: ColumnOrderingPluginConfig
    }
}


export class DatagridCore<TOriginalRow = any, TMeta = any> {
    identifier = $state('tzezars-datagrid')

    readonly metrics = new PerformanceMetrics();
    initial = $state.raw({
        columns: [] as AnyColumn<TOriginalRow, TMeta>[],
        data: [] as TOriginalRow[]
    });
    columns: AnyColumn<TOriginalRow, TMeta>[] = $state([]);

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

    features: FeatureManager<TOriginalRow> = new FeatureManager(this);

    lifecycleHooks = new LifecycleHooks<TOriginalRow>();

    constructor(config: DatagridCoreConfig<TOriginalRow>, lazy: boolean = true) {
        this.features = new FeatureManager(this, config);

        if (config.lifecycleHooks) this.lifecycleHooks = config.lifecycleHooks;
        if (lazy) return;
        this.initializeState(config);
    }



    initializeState(config: DatagridCoreConfig<TOriginalRow>) {
        this.validateConfigInputs(config);

        // !!! IMPORTANT !!!
        // This has to run in this order, otherwise the datagrid will not be initialized properly

        // * Features has to be initialized first to prevent some bugs eg. not updating pagination
        // * when there is wrapper around the datagrid that implements its own features
        // * it might be worked around by processing data after extra features are initialized
        // * but it involves extra processing which is not needed, maybe some refactoring is needed



        this.initializeOriginalColumns(config.columns);
        this.initializeOriginalData(config.data)

        this.columns = this.processors.column.initializeColumns(this.initial.columns)
        this.features = new FeatureManager(this, config);
        this.processors.data.executeFullDataTransformation();

        // Recompute faceted values
        // Moved out of executeFullDataTransformation to avoid unnecessary recomputation
        this.features.columnFaceting.calculateFacets(this.cache.sortedData || [], this.columns);

    }

    private initializeOriginalColumns(columns: AnyColumn<TOriginalRow>[]) {
        // * Parent column Ids must be assigned before the columns are processed to ensure correct grouping
        columns = this.lifecycleHooks.executePreProcessOriginalColumns(this.processors.column.assignParentColumnIds(columns));
        this.initial.columns = columns;
        this.initial.columns = this.lifecycleHooks.executePostProcessOriginalColumns(this.initial.columns);
    }

    private initializeOriginalData(data: TOriginalRow[]) {
        data = this.lifecycleHooks.executePreProcessData(data);
        this.initial.data = data;
        this.initial.data = this.lifecycleHooks.executePostProcessData(this.initial.data);
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

    private validateConfigInputs({ columns, data }: DatagridCoreConfig<TOriginalRow>) {
        if (!columns) throw new Error('Columns are required');
        if (!data) throw new Error('Data is required');
        if (!Array.isArray(data)) throw new Error('Data must be an array');
        if (!Array.isArray(columns)) throw new Error('Columns must be an array');
        if (columns.length === 0) throw new Error('Columns array must not be empty');
        if (data.length === 0) throw new Error('Data array must not be empty');
    }
}