import type { ColumnDef, DatagridCoreConfig, GridBasicRow, GridRow, GridRowIdentifier, GroupColumn, LeafColumn } from "./types";
import { PerformanceMetrics } from "./helpers/performance-metrics.svelte";
import { DataProcessor, ColumnProcessor } from "./processors";
import { DatagridCacheManager } from "./managers";
import { LifecycleHooks } from "./managers/lifecycle-hooks-manager.svelte";
import { DatagridFeatures } from "./features/features.svelte";
import { HandlersManager } from "./managers/handler-manager";
import { EventService } from "./services/event-service";
import { isGroupColumn } from "./helpers/column-guards";
import { flattenColumnStructureAndClearGroups } from "./utils.svelte";


export class DatagridCore<TOriginalRow = any, TMeta = any> {
    readonly events: EventService;
    readonly performanceMetrics = new PerformanceMetrics();
    readonly handlers: HandlersManager

    gridIdentifier = $state('tzezars-datagrid')

    originalState = $state.raw({
        columns: [] as ColumnDef<TOriginalRow, TMeta>[],
        data: [] as TOriginalRow[]
    });

    _columns: ColumnDef<TOriginalRow, TMeta>[] = $state([]);

    columns: Columns<TOriginalRow> = new Columns(this);
    rows: Rows<TOriginalRow> = new Rows(this);

    processors = {
        data: new DataProcessor(this),
        column: new ColumnProcessor(this)
    }

    cacheManager = new DatagridCacheManager(this);

    measurePerformance: boolean = $state(false)
    rowIdGetter: (row: TOriginalRow) => GridRowIdentifier = (row: TOriginalRow) => (row as any).id
    rowIndexGetter: (row: TOriginalRow, parentIndex: string | null, index: number) => string = (row: TOriginalRow, parentIndex: string | null, index: number) => parentIndex ? `${parentIndex}-${index + 1}` : String(index + 1)

    features: DatagridFeatures<TOriginalRow> = new DatagridFeatures(this);

    lifecycleHooks = new LifecycleHooks<TOriginalRow>();

    constructor(config: DatagridCoreConfig<TOriginalRow>, lazyInitialization: boolean = false) {
        this.events = new EventService();
        this.handlers = new HandlersManager(this, this.events);
        this.features = new DatagridFeatures(this, config);

        this.measurePerformance = config?.measurePerformance ?? this.measurePerformance
        this.rowIdGetter = config?.rowIdGetter ?? this.rowIdGetter
        this.rowIndexGetter = config?.rowIndexGetter ?? this.rowIndexGetter

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

        this._columns = this.processors.column.initializeColumns(this.originalState.columns)
        this.features = new DatagridFeatures(this, config);
        this.processors.data.executeFullDataTransformation();
    }

    private initializeSourceColumns(columns: ColumnDef<TOriginalRow>[]) {
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

        if (this.measurePerformance) console.log(`Operation took ${performance.now() - timeStart}ms`);
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
    getVisibleRows: () => GridRow<TOriginalRow>[]
    getPaginatedRows: () => GridRow<TOriginalRow>[]
}

class Rows<TOriginalRow> implements IRows<TOriginalRow> {
    constructor(private readonly datagrid: DatagridCore<TOriginalRow>) { }


    getVisibleBasicRows(): GridBasicRow<TOriginalRow>[] {
        return this.datagrid.cacheManager.rows.filter(row => !row.isGroupRow()) as GridBasicRow<TOriginalRow>[] || [] as GridBasicRow<TOriginalRow>[]
    }

    getVisibleRows(): GridRow<TOriginalRow>[] {
        const topRows = this.datagrid.features.rowPinning.getTopRows();
        const bottomRows = this.datagrid.features.rowPinning.getBottomRows();
        const centerRows = this.datagrid.features.rowPinning.getCenterRows();
        return [...topRows, ...centerRows, ...bottomRows];
    }

    getPaginatedRows(): GridRow<TOriginalRow>[] {
        return this.datagrid.cacheManager.paginatedRows || [];
    }

    findRowById(identifier: GridRowIdentifier): GridRow<TOriginalRow> | undefined {
        return this.datagrid.cacheManager.rows?.find(row => row.identifier === identifier);
    }

    flattenGridRows<TOriginalRow>(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);
            if (row.isGroupRow()) {
                flattened.push(...this.flattenGridRows(row.children));
            }
        }
        return flattened
    }

}


// type IColumns<TOriginalRow> = {
//     getLeafColumns: () => LeafColumn<TOriginalRow>[];
//     getLeafColumnsInOrder: () => LeafColumn<TOriginalRow>[];
//     getColumnsInOrder: () => ColumnDef<TOriginalRow>[];
//     getGroupColumns: () => GroupColumn<TOriginalRow>[]
//     getFlattenedColumnStructure: (preserveGroups: boolean) => ColumnDef<TOriginalRow>[]
//     flattenColumnStructure: (columns: ColumnDef<TOriginalRow>[], preserveGroups: boolean) => ColumnDef<TOriginalRow>[]
//     findColumnById: (columnId: ColumnId) => ColumnDef<TOriginalRow> | null
// }

// class Columns<TOriginalRow> implements IColumns<TOriginalRow> {
class Columns<TOriginalRow> {

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

    // /**
    //  * Retrieves a list of all leaf columns in the correct order, taking into account column pinning.
    //  * This includes left-pinned, non-pinned, and right-pinned columns.
    //  * 
    //  * @returns An array of leaf columns in order with pinning considered.
    //  */
    getLeafColumnsInOrder(): LeafColumn<TOriginalRow>[] {
        const cols = flattenColumnStructureAndClearGroups(this.getColumnsInOrder()).filter(col => col.type !== 'group')
        return cols
    }

    /**
     * Retrieves a list of all columns in the correct order, considering column pinning.
     * Columns are categorized into left-pinned, non-pinned, and right-pinned groups.
     * 
     * @returns An array of columns ordered by their pinning position.
     */
    getColumnsInOrder(): ColumnDef<TOriginalRow>[] {
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

        return [
            ...columns.left,
            ...this.datagrid.processors.column.createColumnHierarchy(columns.none),
            ...columns.right
        ];
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
    // /**
    //  * Retrieves a flattened column structure, optionally preserving group columns.
    //  * Flattening removes nested groups, and can preserve them depending on the `preserveGroups` flag.
    //  * 
    //  * @param preserveGroups Whether to preserve group columns in the structure.
    //  * @returns An array of columns, possibly with group columns preserved.
    //  */
    // getFlattenedColumnStructure(preserveGroups: boolean = true): ColumnDef<TOriginalRow>[] {
    //     return this.flattenColumnStructure(this.datagrid._columns, preserveGroups);
    // }

    // /**
    //  * Flattens a given column structure, optionally preserving group columns.
    //  * This method recursively processes nested group columns and flattens them into a single array.
    //  * 
    //  * @param columns The columns to flatten.
    //  * @param preserveGroups Whether to preserve group columns in the output.
    //  * @returns A flattened array of columns.
    //  */
    // flattenColumnStructure(
    //     columns: ColumnDef<TOriginalRow>[],
    //     preserveGroups: boolean = false
    // ): ColumnDef<TOriginalRow>[] {
    //     const flattened: ColumnDef<TOriginalRow>[] = [];

    //     const processColumns = (columns: ColumnDef<any>[], result: ColumnDef<any>[]) => {
    //         for (let i = 0; i < columns.length; i++) {
    //             const column = columns[i];
    //             if (column.type === 'group') {
    //                 processColumns(column.columns, result);
    //                 result.push(preserveGroups ? column : { ...column, columns: [] });
    //             } else {
    //                 result.push(column);
    //             }
    //         }
    //     };

    //     processColumns(columns, flattened);
    //     return flattened;
    // }

    /**
     * Finds a column by its unique columnId.
     * 
     * @param columnId The unique identifier of the column.
     * @returns The column if found, otherwise null.
     */
    // findColumnById(columnId: ColumnId): ColumnDef<TOriginalRow> | null {
    //     return this.flattenColumnStructure(this.datagrid._columns).find((col) => col.columnId === columnId) ?? null;
    // }

    /**
     * Finds a leaf column (a non-group column) by its unique columnId.
     * 
     * @param columnId The unique identifier of the leaf column.
     * @returns The leaf column if found, otherwise null.
     */
    // findLeafColumnById(columnId: ColumnId): LeafColumn<TOriginalRow> | null {
    //     return this.getLeafColumns().find((col) => col.columnId === columnId) ?? null;
    // }

    /**
     * Finds a column by its unique columnId and throws an error if not found.
     * 
     * @param columnId The unique identifier of the column.
     * @returns The column if found.
     * @throws Error if the column is not found.
     */
    // findColumnByIdOrThrow(columnId: ColumnId): ColumnDef<TOriginalRow> {
    //     const column = this.findColumnById(columnId);
    //     if (!column) throw new Error(`Column ${columnId} not found`);
    //     return column;
    // }

    /**
     * Finds a leaf column (a non-group column) by its unique columnId and throws an error if not found.
     * 
     * @param columnId The unique identifier of the leaf column.
     * @returns The leaf column if found.
     * @throws Error if the leaf column is not found.
     */
    // findLeafColumnByIdOrThrow(columnId: ColumnId): LeafColumn<TOriginalRow> {
    //     const column = this.findLeafColumnById(columnId);
    //     if (!column) throw new Error(`Column ${columnId} not found`);
    //     return column;
    // }

}
