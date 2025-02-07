import type { AnyColumn, DatagridCoreConfig, GridRow } from "./types";
import { PerformanceMetrics } from "./helpers/performance-metrics.svelte";
import { DataProcessor, ColumnProcessor } from "./processors";
import { DatagridCacheManager } from "./managers";
import { LifecycleHooks } from "./managers/lifecycle-hooks-manager.svelte";
import { DatagridFeatures } from "./features/features.svelte";
import { HandlersManager } from "./managers/handler-manager";
import { EventService } from "./services/event-service";


export class DatagridCore<TOriginalRow = any, TMeta = any> {
    readonly events: EventService;
    readonly performanceMetrics = new PerformanceMetrics();
    readonly handlers: HandlersManager

    gridIdentifier = $state('tzezars-datagrid')

    originalState = $state.raw({
        columns: [] as AnyColumn<TOriginalRow, TMeta>[],
        data: [] as TOriginalRow[]
    });

    columns: AnyColumn<TOriginalRow, TMeta>[] = $state([]);
    rows: Rows<TOriginalRow> = new Rows(this);

    processors = {
        data: new DataProcessor(this),
        column: new ColumnProcessor(this)
    }

    cacheManager = new DatagridCacheManager(this);


    config = {
        measurePerformance: false,
        createBasicRowIdentifier: (row: TOriginalRow) => (row as any).id,
        createBasicRowIndex: (row: TOriginalRow, parentIndex: string | null, index: number) =>
            parentIndex ? `${parentIndex}-${index + 1}` : String(index + 1),
    }

    features: DatagridFeatures<TOriginalRow> = new DatagridFeatures(this);

    lifecycleHooks = new LifecycleHooks<TOriginalRow>();

    constructor(config: DatagridCoreConfig<TOriginalRow>, lazyInitialization: boolean = true) {
        this.events = new EventService();
        this.handlers = new HandlersManager(this, this.events);

        this.features = new DatagridFeatures(this, config);

        if (config.lifecycleHooks) this.lifecycleHooks = config.lifecycleHooks;
        if (lazyInitialization) return;
        this.initializeGridState(config);
    }

    initializeGridState(config: DatagridCoreConfig<TOriginalRow>) {
        this.validateConfiguration(config);

        // !!! IMPORTANT !!!
        // This has to run in this order, otherwise the datagrid will not be initialized properly
        // * Features has to be initialized first to prevent some bugs eg. not updating pagination
        // * when there is wrapper around the datagrid that implements its own features
        // * it might be worked around by processing data after extra features are initialized
        // * but it involves extra processing which is not needed, maybe some refactoring is needed

        this.initializeSourceColumns(config.columns);
        this.initializeSourceData(config.data)

        this.columns = this.processors.column.initializeColumns(this.originalState.columns)
        this.features = new DatagridFeatures(this, config);
        this.processors.data.executeFullDataTransformation();

        // Recompute faceted values
        // Moved out of executeFullDataTransformation to avoid unnecessary recomputation
        this.features.columnFaceting.calculateFacets(this.cacheManager.sortedData || [], this.columns);

    }

    private initializeSourceColumns(columns: AnyColumn<TOriginalRow>[]) {
        // * Parent column Ids must be assigned before the columns are processed to ensure correct grouping
        columns = this.lifecycleHooks.executePreProcessOriginalColumns(this.processors.column.assignParentColumnIds(columns));
        this.originalState.columns = columns;
        this.originalState.columns = this.lifecycleHooks.executePostProcessOriginalColumns(this.originalState.columns);
    }

    private initializeSourceData(data: TOriginalRow[]) {
        data = this.lifecycleHooks.executePreProcessData(data);
        this.originalState.data = data;
        this.originalState.data = this.lifecycleHooks.executePostProcessData(this.originalState.data);
    }

    /**
       * Performs a refresh with different levels of data recalculation
       */
    refresh(updateOperation: () => void, options: {
        recalculateAll?: boolean;
        recalculateGroups?: boolean;
        recalculatePagination?: boolean;
    } = {}): void {
        const timeStart = performance.now();

        updateOperation();

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

    private validateConfiguration({ columns, data }: DatagridCoreConfig<TOriginalRow>) {
        if (!columns) throw new Error('Columns are required');
        if (!data) throw new Error('Data is required');
        if (!Array.isArray(data)) throw new Error('Data must be an array');
        if (!Array.isArray(columns)) throw new Error('Columns must be an array');
        if (columns.length === 0) throw new Error('Columns array must not be empty');
        if (data.length === 0) throw new Error('Data array must not be empty');
    }


}



type IRows<TOriginalRow> = {
    paginated: GridRow<TOriginalRow>[]
    visible: GridRow<TOriginalRow>[]
}

class Rows<TOriginalRow> implements IRows<TOriginalRow> {
    constructor(private readonly datagrid: DatagridCore<TOriginalRow>) { }

    get visible(): GridRow<TOriginalRow>[] {
        const topRows = this.datagrid.features.rowPinning.getTopRows();
        const bottomRows = this.datagrid.features.rowPinning.getBottomRows();
        const centerRows = this.datagrid.features.rowPinning.getCenterRows();
        return [...topRows, ...centerRows, ...bottomRows];
    }

    get paginated(): GridRow<TOriginalRow>[] {
        return this.datagrid.cacheManager.paginatedRows || [];
    }

}