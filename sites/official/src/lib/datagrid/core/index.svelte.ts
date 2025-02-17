import type { ColumnDef, ColumnId, DatagridCoreConfig, GridBasicRow, GridRow, GridRowIdentifier, GroupColumn, LeafColumn } from "./types";
import { PerformanceMetrics } from "./helpers/performance-metrics.svelte";
import { DataProcessor, ColumnProcessor } from "./processors";
import { DatagridCacheManager } from "./managers";
import { LifecycleHooks } from "./managers/lifecycle-hooks-manager.svelte";
import { DatagridFeatures } from "./features/features.svelte";
import { HandlersManager } from "./managers/handler-manager";
import { EventService } from "./services/event-service";
import { isGroupColumn } from "./helpers/column-guards";
import { flattenColumnStructureAndClearGroups, flattenColumnStructurePreservingGroups } from "./utils.svelte";

/**
 * Core class for managing the datagrid, handling state, events, processing, and features.
 * 
 * @template TOriginalRow The type of the original data row.
 * @template TMeta Additional metadata type for columns.
 * 
 * @example
 * const datagrid = new DatagridCore({ columns: myColumns, data: myData });
 */
export class DatagridCore<TOriginalRow = any, TMeta = any> {
    /**
     * Event service for managing event subscriptions and emissions.
     */
    readonly events: EventService;

    /**
     * Performance metrics tracker.
     */
    readonly performanceMetrics = new PerformanceMetrics();

    /**
     * Manages event handlers for the grid.
     */
    readonly handlers: HandlersManager;

    /**
     * Unique identifier for the grid instance.
     */
    gridIdentifier = $state('tzezars-datagrid');

    /**
     * Stores the original state of the datagrid, including columns and data.
     */
    originalState = $state.raw({
        columns: [] as ColumnDef<TOriginalRow, TMeta>[],
        data: [] as TOriginalRow[]
    });

    /**
     * Processed columns for internal use.
     */
    _columns: ColumnDef<TOriginalRow, TMeta>[] = $state([]);

    /**
     * Column management instance.
     */
    columns: Columns<TOriginalRow> = new Columns(this);

    /**
     * Row management instance.
     */
    rows: Rows<TOriginalRow> = new Rows(this);

    /**
     * Data and column processing managers.
     */
    processors = {
        data: new DataProcessor(this),
        column: new ColumnProcessor(this)
    };

    /**
     * Cache management for the datagrid.
     */
    cacheManager = new DatagridCacheManager(this);

    /**
     * Whether to measure performance metrics for grid operations.
     */
    measurePerformance: boolean = $state(false);

    /**
     * Function to retrieve the row identifier.
     * @param row - The row data.
     * @returns The unique identifier for the row.
     */
    rowIdGetter: (row: TOriginalRow) => GridRowIdentifier = (row: TOriginalRow) => (row as any).id;

    /**
     * Function to retrieve the row index.
     * @param row - The row data.
     * @param parentIndex - The parent index (if applicable).
     * @param index - The row index.
     * @returns The computed row index.
     */
    rowIndexGetter: (row: TOriginalRow, parentIndex: string | null, index: number) => string =
        (row: TOriginalRow, parentIndex: string | null, index: number) => parentIndex ? `${parentIndex}-${index + 1}` : String(index + 1);

    /**
     * Feature manager for enabling/disabling specific datagrid features.
     */
    features: DatagridFeatures<TOriginalRow> = new DatagridFeatures(this);

    /**
     * Lifecycle hooks for pre/post processing operations.
     */
    lifecycleHooks = new LifecycleHooks<TOriginalRow>();

    /**
     * Creates an instance of DatagridCore.
     * @param config - The datagrid configuration.
     * @param lazyInitialization - Whether to delay initialization.
     * @example
     * ```typescript
     * const grid = new DatagridCore({ columns: [...], data: [...] });
     * ```
     */
    constructor(config: DatagridCoreConfig<TOriginalRow>, lazyInitialization: boolean = false) {
        this.events = new EventService();
        this.handlers = new HandlersManager(this, this.events);
        this.features = new DatagridFeatures(this, config);

        this.measurePerformance = config?.measurePerformance ?? this.measurePerformance;
        this.rowIdGetter = config?.rowIdGetter ?? this.rowIdGetter;
        this.rowIndexGetter = config?.rowIndexGetter ?? this.rowIndexGetter;

        if (config.lifecycleHooks) this.lifecycleHooks = config.lifecycleHooks;
        if (lazyInitialization) return;
        this.initializeGridState(config);
    }

    /**
     * Initializes the grid state based on the provided configuration.
     * @param config - The datagrid configuration.
     */
    initializeGridState(config: DatagridCoreConfig<TOriginalRow>) {
        this.validateConfiguration(config);

        // !!! IMPORTANT !!!
        // This has to run in this order, otherwise the datagrid will not be initialized properly
        // * Features have to be initialized first to prevent issues such as pagination updates failing

        this.initializeSourceColumns(config.columns);
        this.initializeSourceData(config.data);

        this._columns = this.processors.column.initializeColumns(this.originalState.columns);
        this.features = new DatagridFeatures(this, config);
        this.processors.data.executeFullDataTransformation();
    }

    /**
     * Initializes the source columns.
     * @param columns - The column definitions.
     */
    private initializeSourceColumns(columns: ColumnDef<TOriginalRow>[]) {
        columns = this.lifecycleHooks.executePreProcessOriginalColumns(this.processors.column.assignParentColumnIds(columns));
        this.originalState.columns = columns;
        this.originalState.columns = this.lifecycleHooks.executePostProcessOriginalColumns(this.originalState.columns);
    }

    /**
     * Initializes the source data.
     * @param data - The row data.
     */
    private initializeSourceData(data: TOriginalRow[]) {
        data = this.lifecycleHooks.executePreProcessData(data);
        this.originalState.data = data;
        this.originalState.data = this.lifecycleHooks.executePostProcessData(this.originalState.data);
    }

    /**
     * Refreshes the datagrid with optional recalculations.
     * @param updateOperation - The update function.
     * @param options - The recalculation options.
     * @example
     * ```typescript
     * grid.refresh(() => {
     *     grid.rows.updateSomeData();
     * }, { recalculateAll: true });
     * ```
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

        if (this.measurePerformance) console.log(`Operation took ${performance.now() - timeStart}ms`);
    }

    /**
     * Validates the datagrid configuration.
     * @param config - The datagrid configuration.
     * @throws Will throw an error if the configuration is invalid.
     */
    private validateConfiguration({ columns, data }: DatagridCoreConfig<TOriginalRow>) {
        if (!columns) throw new Error('Columns are required');
        if (!data) throw new Error('Data is required');
        if (!Array.isArray(data)) throw new Error('Data must be an array');
        if (!Array.isArray(columns)) throw new Error('Columns must be an array');
        if (columns.length === 0) throw new Error('Columns array must not be empty');
    }
}




/**
 * Interface representing row operations in a data grid.
 * 
 * @template TOriginalRow The type of the original row data.
 */
type IRows<TOriginalRow> = {
    /**
     * Retrieves the visible rows of the data grid.
     * 
     * @returns {GridRow<TOriginalRow>[]} A list of visible rows.
     */
    getVisibleRows: () => GridRow<TOriginalRow>[];

    /**
     * Retrieves the paginated rows of the data grid.
     * 
     * @returns {GridRow<TOriginalRow>[]} A list of rows according to pagination.
     */
    getPaginatedRows: () => GridRow<TOriginalRow>[];
}

/**
 * Class for handling and manipulating rows in a data grid.
 * 
 * @template TOriginalRow The type of the original row data.
 */
class Rows<TOriginalRow> implements IRows<TOriginalRow> {
    /**
     * Creates an instance of the Rows class.
     * 
     * @param {DatagridCore<TOriginalRow>} datagrid The datagrid instance to manage rows for.
     */
    constructor(private readonly datagrid: DatagridCore<TOriginalRow>) { }

    /**
     * Retrieves the basic visible rows of the data grid, excluding group rows.
     * 
     * @returns {GridBasicRow<TOriginalRow>[]} A list of visible basic rows.
     */
    getVisibleBasicRows(): GridBasicRow<TOriginalRow>[] {
        return this.datagrid.cacheManager.rows.filter(row => !row.isGroupRow()) as GridBasicRow<TOriginalRow>[] || [] as GridBasicRow<TOriginalRow>[];
    }

    /**
     * Retrieves all visible rows in the data grid, including pinned rows (top, center, and bottom).
     * 
     * @returns {GridRow<TOriginalRow>[]} A list of all visible rows.
     */
    getVisibleRows(): GridRow<TOriginalRow>[] {
        const topRows = this.datagrid.features.rowPinning.getTopRows();
        const bottomRows = this.datagrid.features.rowPinning.getBottomRows();
        const centerRows = this.datagrid.features.rowPinning.getCenterRows();
        return [...topRows, ...centerRows, ...bottomRows];
    }

    /**
     * Retrieves the rows that are currently paginated.
     * 
     * @returns {GridRow<TOriginalRow>[]} A list of paginated rows.
     */
    getPaginatedRows(): GridRow<TOriginalRow>[] {
        return this.datagrid.cacheManager.paginatedRows || [];
    }

    /**
     * Finds a row in the data grid by its unique identifier.
     * 
     * @param {GridRowIdentifier} identifier The identifier of the row to find.
     * @returns {GridRow<TOriginalRow> | undefined} The row with the given identifier, or undefined if not found.
     */
    findRowById(identifier: GridRowIdentifier): GridRow<TOriginalRow> | undefined {
        return this.datagrid.cacheManager.rows?.find(row => row.identifier === identifier);
    }

    /**
     * Flattens a set of grid rows, including nested group rows.
     * 
     * @param {GridRow<TOriginalRow>[]} data The list of grid rows to flatten.
     * @returns {GridRow<TOriginalRow>[]} A flattened list of grid rows, with all group rows expanded.
     */
    flattenGridRows<TOriginalRow>(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);
            if (row.isGroupRow()) {
                flattened.push(...this.flattenGridRows(row.children));
            }
        }
        return flattened;
    }
}

/**
 * Class for handling and manipulating columns in a data grid.
 * 
 * @template TOriginalRow The type of the original row data.
 */
class Columns<TOriginalRow> {

    /**
     * Creates an instance of the Columns class.
     * 
     * @param {DatagridCore<TOriginalRow>} datagrid The datagrid instance to manage columns for.
     */
    constructor(private readonly datagrid: DatagridCore<TOriginalRow>) { }

    /**
     * Retrieves a list of all columns without considering column pinning.
     * This method does not account for pinned columns and returns all columns.
     * 
     * @returns An array of all columns.
     */
    getColumns(): ColumnDef<TOriginalRow>[] {
        return this.datagrid._columns;
    }

    /**
     * Retrieves a list of all leaf columns.
     * Leaf columns are those that are not group columns.
     * 
     * @returns An array of leaf columns.
     */
    getLeafColumns(): LeafColumn<TOriginalRow>[] {
        return flattenColumnStructureAndClearGroups(this.datagrid._columns).filter(col => col.type !== 'group')
    }

    /**
    * Retrieves a list of all leaf columns in the correct order, taking into account column pinning, and grouping.
    * This includes left-pinned, non-pinned, and right-pinned columns.
    * 
    * @returns An array of leaf columns in order with pinning considered.
    */
    getLeafColumnsInOrder(): LeafColumn<TOriginalRow>[] {
        const cols = flattenColumnStructureAndClearGroups(this.getColumnsInOrder()).filter(col => col.type !== 'group')
        return cols
    }

    /**
     * Retrieves a list of all columns in the correct order, considering column pinning and grouping.
     * Columns are categorized into left-pinned, non-pinned, and right-pinned groups.
     * 
     * @returns An array of columns ordered by their pinning position and grouping.
     */
    getColumnsInOrder(): ColumnDef<TOriginalRow>[] {
        const { activeGroups: groupByColumns } = this.datagrid.features.grouping;

        const flatCols = this.datagrid.processors.column.placeGroupColumnsInFront(flattenColumnStructureAndClearGroups(this.datagrid._columns));

        const columns = flatCols.reduce(
            (acc, col) => {
                const position = col.state.pinning.position;
                if (position === 'left' || groupByColumns.includes(col.columnId)) {
                    acc.left.push(col);
                } else if (position === 'right' && col.type !== 'group') {
                    acc.right.push(col);
                } else {
                    acc.none.push(col);
                }
                return acc;
            },
            { left: [], right: [], none: [] } as Record<'left' | 'right' | 'none', ColumnDef<TOriginalRow>[]>
        );

        return [
            ...columns.left,
            ...this.datagrid.processors.column.createColumnHierarchy(columns.none),
            ...columns.right
        ];
    }

    /**
     * Categorizes columns into left-pinned, right-pinned, and center (unpinned) groups.
     * 
     * This function processes the datagrid's column structure, determining which columns
     * should be pinned to the left or right, and which should remain in the center. 
     * Grouped columns are treated as left-pinned.
     * 
     * @returns An object containing categorized columns:
     *   - `left`: Columns pinned to the left or part of active groups.
     *   - `center`: Unpinned columns, structured into a hierarchy.
     *   - `right`: Columns pinned to the right (excluding group columns).
     */
    getPinnedAndCenterColumns(): { left: ColumnDef<TOriginalRow>[], center: ColumnDef<TOriginalRow>[], right: ColumnDef<TOriginalRow>[] } {
        const { activeGroups: groupByColumns } = this.datagrid.features.grouping;

        const columns = flattenColumnStructureAndClearGroups(this.datagrid._columns).reduce(
            (acc, col) => {
                const position = col.state.pinning.position;
                if (position === 'left' || groupByColumns.includes(col.columnId)) {
                    acc.left.push(col);
                } else if (position === 'right' && col.type !== 'group') {
                    acc.right.push(col);
                } else {
                    acc.none.push(col);
                }
                return acc;
            },
            { left: [], right: [], none: [] } as Record<'left' | 'right' | 'none', ColumnDef<TOriginalRow>[]>
        );

        return {
            left: columns.left,
            center: this.datagrid.processors.column.createColumnHierarchy(columns.none),
            right: columns.right
        };
    }

    /**
     * Retrieves a list of all group columns.
     * Group columns are those that contain child columns and represent a grouping of other columns.
     * 
     * @returns An array of group columns.
     */
    getGroupColumns<TOriginalRow>(): GroupColumn<TOriginalRow>[] {
        return flattenColumnStructureAndClearGroups(this.datagrid._columns).filter(col => isGroupColumn(col));
    }

    /**
     * Finds a column by its unique columnId.
     * 
     * @param columnId The unique identifier of the column.
     * @returns The column if found, otherwise null.
     */

    findColumnById(columnId: ColumnId): ColumnDef<TOriginalRow> | null {
        return flattenColumnStructurePreservingGroups(this.datagrid._columns).find((col) => col.columnId === columnId) ?? null;
    }

    /**
     * Finds a column by its unique columnId and throws an error if not found.
     * 
     * @param columnId The unique identifier of the column.
     * @returns The column if found.
     * @throws Error if the column is not found.
     */
    findColumnByIdOrThrow(columnId: ColumnId): ColumnDef<TOriginalRow> {
        const column = this.findColumnById(columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);
        return column;
    }

}
