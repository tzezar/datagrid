import { isGroupColumn } from "../helpers/column-guards";
import type { DatagridCore } from "../index.svelte";
import type { Aggregation, AggregationFn, FilterCondition, GridGroupRow, GridRow } from "../types";
import type { PerformanceMetrics } from "../helpers/performance-metrics.svelte";
import type { AccessorColumn, ComputedColumn } from "../types";
import { aggregationFunctions } from "../helpers/aggregation-functions";
import { applySorting } from "./apply-sorting";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";
// import { applySorting } from "./apply-sorting-fast-sort";


/**
 * Class responsible for processing and transforming data for a datagrid component.
 * It handles various operations such as filtering, sorting, grouping, and pagination,
 * providing an efficient way to transform raw data into a format suitable for the grid.
 * 
 * @template TOriginalRow - The type of the original row data in the datagrid.
 */
export class DataDataProcessor<TOriginalRow> {
    readonly metrics: PerformanceMetrics;
    private customAggregationFns: Map<string, AggregationFn>;

    /**
    * Constructs an instance of the DataDataProcessor.
    * 
    * @param {DatagridCore<TOriginalRow>} datagrid - The core datagrid instance to which this processor belongs.
    */
    constructor(private readonly datagrid: DatagridCore<TOriginalRow>) {
        this.metrics = datagrid.performanceMetrics;
        this.customAggregationFns = new Map();
    }


    /**
     * Executes the full data transformation pipeline including filtering, sorting, and grouping,
     * preparing the data for display in the datagrid.
     * This function processes the data, stores intermediate results in cache, 
     * and manages pagination.
     */
    executeFullDataTransformation(): void {
        const shouldRunGrouping = this.datagrid.features.grouping.activeGroups.length > 0 || this.datagrid.features.grouping.manual;

        this.metrics.clear();

        // Create a copy of the data to avoid mutating the original data
        let data = [...this.datagrid.originalState.data];


        data = this.applyFilters(data);
        data = applySorting(this.datagrid, data);

        // Cache sorted or sortend and filtered results
        this.datagrid.cacheManager.sortedData = data;

        // Clear hierarchical cache when data changes
        this.datagrid.cacheManager.invalidate('hierarchicalRows');

        // Process grouped or regular data
        if (shouldRunGrouping) this.processGroupedData(data);
        else this.processRegularData(data);


        if (this.datagrid.measurePerformance) this.datagrid.performanceMetrics.print();
    }


    /**
     * Applies filters to the dataset. This includes both global search and column filters.
     * 
     * @param {TOriginalRow[]} data - The raw data to be filtered.
     * @returns {TOriginalRow[]} The filtered data.
     */
    applyFilters(data: TOriginalRow[]): TOriginalRow[] {
        if (this.datagrid.cacheManager.filteredData === null) {
            // Apply global search if value is set
            data = this.applyGlobalSearch(data);
            data = this.applyColumnFilters(data);

            this.datagrid.cacheManager.filteredData = data;

            if (this.datagrid.features.columnFaceting.recalculateFacetsAfterFiltering) {
                if (this.datagrid.features.columnFaceting.facetsSource === 'originalData') {
                    this.metrics.measure('Column faceting from original data', () => {
                        this.datagrid.features.columnFaceting.calculateFacets(
                            this.datagrid.originalState.data || [],
                            this.datagrid.columns.getLeafColumns()
                        );
                    })
                } else if (this.datagrid.features.columnFaceting.facetsSource === 'filteredData') {
                    this.metrics.measure('Column faceting from filtered data', () => {
                        this.datagrid.features.columnFaceting.calculateFacets(
                            data,
                            this.datagrid.columns.getLeafColumns()
                        );
                    })
                }
            }

        } else {
            data = this.datagrid.cacheManager.filteredData;
        }
        return data
    }

    /**
     * Applies global search to the data, using either fuzzy search or a simple substring match.
     * 
     * @param {TOriginalRow[]} data - The raw data to be searched.
     * @returns {TOriginalRow[]} The data after applying global search.
     */
    applyGlobalSearch(data: TOriginalRow[]): TOriginalRow[] {
        data = this.datagrid.lifecycleHooks.executePreGlobalSearch(data);

        const isManualSortingEnabled = this.datagrid.features.globalSearch.isManual
        const valueIsEmpty = this.datagrid.features.globalSearch.searchQuery === ''

        if (isManualSortingEnabled || valueIsEmpty) {
            return data
        }

        const searchValue = this.datagrid.features.globalSearch.searchQuery.toLowerCase();


        const applyFuzzySearch = () => {
            const fuseInstance = this.datagrid.features.globalSearch.getFuseSearchEngine();
            if (!fuseInstance) throw new Error('Fuse instance is not initialized');
            return fuseInstance.search(searchValue).map(result => result.item);

        }
        const applySimpleSearch = (data: TOriginalRow[]) => {

            const searchableColumns = flattenColumnStructureAndClearGroups(this.datagrid._columns).filter(c => ['accessor', 'computed'].includes(c.type)).filter(col => col.options.searchable !== false) as (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>)[];
            // const searchableColumns = this.datagrid.columns.getFlattenedColumnStructure().filter(c => ['accessor', 'computed'].includes(c.type)).filter(col => col.options.searchable !== false) as (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>)[];
            return data.filter(item =>
                searchableColumns.some(column =>
                    String(column.getValueFn(item))
                        .toLowerCase()
                        .includes(searchValue)
                )
            );
        }

        const isFuzzySearchEnabled = this.datagrid.features.globalSearch.isFuzzySearchEnabled;

        this.metrics.measure('Global Search', () => {
            if (isFuzzySearchEnabled) {
                data = applyFuzzySearch();
            } else {
                data = applySimpleSearch(data);
            }
        });


        return this.datagrid.lifecycleHooks.executePostGlobalSearch(data);
    }


    /**
    * Applies column filters to the data. Filters are evaluated on a per-column basis.
    * 
    * @param {TOriginalRow[]} data - The raw data to be filtered.
    * @returns {TOriginalRow[]} The data after applying column filters.
    */
    applyColumnFilters(data: TOriginalRow[]): TOriginalRow[] {
        data = this.datagrid.lifecycleHooks.executePreFilter(data);

        const isMnualSortingEnabled = this.datagrid.features.globalSearch.isManual
        const noFilters = this.datagrid.features.filtering.filterConditions.length === 0

        if (isMnualSortingEnabled || noFilters) return data

        const filterData = (data: TOriginalRow[], activeFilters: FilterCondition<any>[]) => {
            return data.filter(row =>
                activeFilters.every(filter =>
                    this.datagrid.features.filtering.evaluateCondition(
                        filter.getValueFn(row),
                        filter
                    )
                )
            );
        }

        const getActiveFilters = () => {
            return this.datagrid.features.filtering.filterConditions
                .filter(condition => condition.value !== null);
        }

        this.metrics.measure('Column Filtering', () => {
            data = filterData(data, getActiveFilters());
        })

        return this.datagrid.lifecycleHooks.executePostFilter(data);
    }


    /**
     * Processes grouped data by organizing it into hierarchical structures based on grouping columns,
     * applying any necessary aggregations and handling visibility based on group expansion state.
     * 
     * @param {TOriginalRow[]} data - The raw data to be processed into groups.
     */
    processGroupedData(data: TOriginalRow[]): void {
        // Create grouped structure only if not already cached
        let groupedRows = this.datagrid.cacheManager.hierarchicalRows;

        if (!groupedRows) {
            this.metrics.measure('Grouping', () => {
                groupedRows = this.createHierarchicalData(data);
                this.datagrid.cacheManager.hierarchicalRows = groupedRows;
            });
        }

        // Get only visible rows based on expansion state
        const visibleRows = this.getVisibleRows();

        // Update cache and pagination
        this.metrics.measure('Cache Update', () => {
            this.datagrid.cacheManager.rows = visibleRows;
            this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(visibleRows);
            this.datagrid.cacheManager.paginatedRows = this.paginateRows(visibleRows);
        });

        // this has to run always
        this.datagrid.features.rowPinning.updatePinnedRows();


    }


    /**
     * Processes regular (non-grouped) data, transforming it into basic rows and handling pagination.
     * 
     * @param {TOriginalRow[]} data - The raw data to be processed into basic rows.
     */
    private processRegularData(data: TOriginalRow[]): void {

        // Transform into basic rows
        let basicRows: GridRow<TOriginalRow>[];

        this.metrics.measure('Data Transformation', () => {
            basicRows = this.createBasicRows(data);
            this.datagrid.cacheManager.rows = basicRows;

        });

        // this has to run always
        this.metrics.measure('Row Pinning', () => {
            this.datagrid.features.rowPinning.updatePinnedRows();
        });

        if (this.datagrid.features.pagination.manual) {
            this.datagrid.cacheManager.paginatedRows = basicRows!;
            return
        }

        this.datagrid.features.pagination.totalCount = data!.length;
        this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(data);
        // Apply pagination
        this.datagrid.cacheManager.paginatedRows = this.paginateRows(basicRows!);
    }

    /**
    * Registers a custom aggregation function for use in the datagrid.
    * 
    * @param {string} name - The name of the aggregation function.
    * @param {AggregationFn} fn - The aggregation function to register.
    */
    registerAggregationFn(name: string, fn: AggregationFn): void {
        this.customAggregationFns.set(name, fn);
    }

    /**
     * Retrieves the aggregation function for a given aggregate type.
     * 
     * @param {string | { type: string, fn?: AggregationFn }} aggregateType - The type or configuration of the aggregation.
     * @returns {AggregationFn | null} The corresponding aggregation function, or null if not found.
     */
    private getAggregationFn(aggregateType: string | { type: string, fn?: AggregationFn }): AggregationFn | null {
        if (typeof aggregateType === 'string') {
            return aggregationFunctions[aggregateType] || this.customAggregationFns.get(aggregateType) || null;
        }

        if (aggregateType.fn) {
            return aggregateType.fn;
        }

        return aggregationFunctions[aggregateType.type] ||
            this.customAggregationFns.get(aggregateType.type) ||
            null;
    }

    /**
     * Calculates the aggregations for a given column and a set of grouped rows.
     * 
     * @param {AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>} column - The column for which aggregations are calculated.
     * @param {TOriginalRow[]} groupRows - The rows belonging to a group.
     * @returns {Aggregation[]} The list of calculated aggregations.
     */
    private calculateAggregations(
        column: AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>,
        groupRows: TOriginalRow[]
    ): Aggregation[] {
        const config = column.aggregate;
        if (!config) return [];

        // Handle array of aggregations
        if (Array.isArray(config)) {
            return config.map(aggConfig => {
                const aggType = typeof aggConfig === 'string' ? aggConfig : aggConfig.type;
                const aggFn = this.getAggregationFn(aggConfig);
                if (!aggFn) return null;

                const values = groupRows.map(row => column.getValueFn(row));
                return {
                    type: aggType,
                    value: aggFn(values),
                    columnId: column.columnId
                };
            }).filter((agg): agg is Aggregation => agg !== null);
        }

        // Handle single aggregation
        const aggType = typeof config === 'string' ? config : config.type;
        const aggFn = this.getAggregationFn(config);
        if (!aggFn) return [];

        const values = groupRows.map(row => column.getValueFn(row));
        return [{
            type: aggType,
            value: aggFn(values),
            columnId: column.columnId
        }];
    }
    /**
     * Creates hierarchical data by recursively grouping rows based on the defined grouping columns.
     * Each group can contain child groups, and aggregation functions are applied to each group.
     * 
     * @param {TOriginalRow[]} data - The raw data to be grouped.
     * @returns {GridRow<TOriginalRow>[]} The hierarchical structure of grouped rows.
     */
    createHierarchicalData(data: TOriginalRow[]): GridRow<TOriginalRow>[] {
        const groupCols = this.datagrid.features.grouping.activeGroups;
        if (!groupCols.length) return this.createBasicRows(data);

        const groupByLevel = (
            rows: TOriginalRow[],
            depth: number,
            parentPath = ''
        ): GridRow<TOriginalRow>[] => {
            const groups = new Map<string, TOriginalRow[]>();

            if (depth >= groupCols.length) return this.createBasicRows(rows, parentPath);

            const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid._columns), groupCols[depth]);

            if (!column) throw new Error(`Invalid group column: ${groupCols[depth]}`);
            if (isGroupColumn(column)) throw new Error(`Cannot group by group column: ${groupCols[depth]}`);
            if (column.type === 'display') throw new Error(`Cannot group by display column: ${groupCols[depth]}`);

            // Group rows by current column using getGroupValueFn if available
            rows.forEach(row => {
                const groupValue = column.getGroupValueFn
                    ? column.getGroupValueFn(row)
                    : column.getValueFn(row);

                const groupKey = String(groupValue ?? 'Unknown');
                const group = groups.get(groupKey) ?? [];
                group.push(row);
                groups.set(groupKey, group);
            });

            // Create group rows with aggregation
            return Array.from(groups.entries()).map(([key, groupRows], index) => {
                const aggregations = flattenColumnStructureAndClearGroups(this.datagrid._columns)
                    .filter(col =>
                        (col.type === 'accessor' || col.type === 'computed') &&
                        col.aggregate
                    )
                    .flatMap(col => {
                        col = col as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
                        return this.calculateAggregations(col, groupRows);
                    });

                const identifier = depth === 0 ? key : `${parentPath}|${key}`;

                return {
                    index: parentPath ? `${parentPath}-${index + 1}` : String(index + 1),
                    identifier,
                    groupKey: groupCols[depth],
                    groupValue: [key],
                    depth,
                    // isExpanded: false,
                    children: groupByLevel(groupRows, depth + 1, `${parentPath}${index + 1}`),
                    aggregations: aggregations,
                    isExpanded: () => this.datagrid.features.grouping.isGroupExpanded(identifier),
                    isGroupRow: function (): this is GridGroupRow<TOriginalRow> {
                        return true;
                    },
                };
            });
        };

        return groupByLevel(data, 0);
    }

    private isGroupRow(row: GridRow<TOriginalRow>): row is GridGroupRow<TOriginalRow> {
        return 'groupKey' in row && 'children' in row;
    }



    /**
     * Flattens expanded groups into a single list of rows, recursively expanding group rows.
     * 
     * @param {GridRow<TOriginalRow>[]} rows - The rows to flatten, which may include expanded group rows.
     * @returns {GridRow<TOriginalRow>[]} The flattened list of rows, with expanded groups fully included.
     */
    private flattenExpandedGroups(rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of rows) {
            flattened.push(row);

            if (this.isGroupRow(row) && this.datagrid.features.grouping.expandedGroups.has(row.identifier)) {
                flattened.push(...this.flattenExpandedGroups(row.children));
            }
        }

        return flattened;
    }

    /**
     * Creates basic rows from the original data, without applying grouping or aggregation.
     * 
     * @param {TOriginalRow[]} rows - The raw data to be transformed into basic rows.
     * @param {string} [parentIndex] - An optional parent index to manage hierarchical row identifiers.
     * @returns {GridRow<TOriginalRow>[]} The basic rows created from the data.
     */
    private createBasicRows(rows: TOriginalRow[], parentIndex?: string): GridRow<TOriginalRow>[] {
        return rows.map((row, i) => {
            const identifier = this.datagrid.rowIdGetter(row);
            return {
                identifier,
                index: this.datagrid.rowIndexGetter(row, parentIndex || null, i),
                parentIndex: parentIndex ?? null,
                original: row,
                isExpanded: () => this.datagrid.features.rowExpanding.isRowExpanded(identifier),
                isGroupRow: () => false
            }
        });
    }

    /**
  * Paginates the given rows based on the current page and page size.
  * 
  * @param {GridRow<TOriginalRow>[]} rows - The rows to paginate.
  * @returns {GridRow<TOriginalRow>[]} A subset of rows based on the pagination settings (page and pageSize).
  */
    private paginateRows(rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const { page, pageSize } = this.datagrid.features.pagination;
        const start = (page - 1) * pageSize;
        return rows.slice(start, start + pageSize);
    }

    /**
     * Handles group expansion and updates the visible rows, pagination, and cached rows accordingly.
     * 
     * If hierarchical rows exist, the visible rows are determined by the expanded group state, 
     * otherwise the sorted data is processed. Afterward, the rows are paginated and cached.
     */
    handleGroupExpansion(): void {
        const hierarchicalRows = this.datagrid.cacheManager.hierarchicalRows;
        if (!hierarchicalRows) {
            this.processGroupedData(this.datagrid.cacheManager.sortedData || []);
            return;
        }

        this.metrics.measure('Group Expansion', () => {
            const visibleRows = this.getVisibleRows();
            this.datagrid.cacheManager.rows = visibleRows;
            this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(visibleRows);
            this.datagrid.cacheManager.paginatedRows = this.paginateRows(visibleRows);
        });
    }

    /**
     * Handles the change in pagination and updates the cached paginated rows accordingly.
     * 
     * This method gets the visible rows based on the current state and then updates 
     * the cached paginated rows for the current page.
     */
    handlePaginationChange(): void {
        const visibleRows = this.getVisibleRows();
        this.metrics.measure('Pagination', () => {
            this.datagrid.cacheManager.paginatedRows = this.paginateRows(visibleRows);
        });
    }

    /**
     * Retrieves only the visible rows based on the group expansion state.
     * 
     * If hierarchical rows are available, it flattens the expanded groups, otherwise 
     * returns the regular rows. This helps in showing the correct rows based on 
     * whether groups are expanded or collapsed.
     * 
     * @returns {GridRow<TOriginalRow>[]} The visible rows to display.
     */
    private getVisibleRows(): GridRow<TOriginalRow>[] {
        if (!this.datagrid.cacheManager.hierarchicalRows) {
            return this.datagrid.cacheManager.rows;
        }

        return this.flattenExpandedGroups(this.datagrid.cacheManager.hierarchicalRows);
    }



}