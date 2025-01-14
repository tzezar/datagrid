import { sort } from "fast-sort";
import { isGroupColumn } from "../helpers/column-guards";
import type { DataGrid } from "../index.svelte";
import type { Aggregation, AggregationFn, GridGroupRow, GridRow } from "../types";
import { findColumnById, createFlatColumnStructure} from "../utils.svelte";
import type { PerformanceMetrics } from "../helpers/performance-metrics.svelte";
import type { AccessorColumn, ComputedColumn } from "../column-creation/types";
import { aggregationFunctions } from "../helpers/aggregation-functions";

export class DataProcessor<TRow> {
    private readonly metrics: PerformanceMetrics;
    private customAggregationFns: Map<string, AggregationFn>;

    constructor(private readonly datagrid: DataGrid<TRow>) {
        this.metrics = datagrid.metrics;
        this.customAggregationFns = new Map();
    }

    executeFullDataTransformation(): void {
        this.metrics.clear();

        const shouldRunGlobalSearch = this.datagrid.features.globalSearch.value !== '';
        const shouldRunColumnFilters = this.datagrid.features.filtering.conditions.length > 0;
        const shouldRunSorting = this.datagrid.features.sorting.sortConfigs.length > 0;
        const shouldRunGrouping = this.datagrid.features.grouping.groupByColumns.length > 0;


        // Create a copy of the data to avoid mutating the original data
        let data = [...this.datagrid.initial.data];


        if (this.datagrid.cache.filteredData === null) {
            // Apply global search if value is set
            if (shouldRunGlobalSearch) {
                this.metrics.measure('Global Search', () => {
                    data = this.applyGlobalSearch(data);
                });
            }

            if (shouldRunColumnFilters) {
                this.metrics.measure('Column Filtering', () => {
                    data = this.applyColumnFilters(data);
                });
            }
        } else {
            data = this.datagrid.cache.filteredData;
        }

        if (shouldRunSorting) {
            this.metrics.measure('Sorting', () => {
                data = this.applySorting(data);
                this.datagrid.cache.sortedData = data;
            });
        }

        // Cache sorted/filtered results
        this.datagrid.cache.sortedData = data;

        // Clear hierarchical cache when data changes
        this.datagrid.cache.invalidate('hierarchicalRows');

        // Process grouped or regular data
        if (shouldRunGrouping) this.processGroupedData(data);
        else this.processRegularData(data);

        if (this.datagrid.config.measurePerformance) this.datagrid.metrics.print();

    }

    private applyGlobalSearch(data: TRow[]): TRow[] {
        const searchValue = this.datagrid.features.globalSearch.value.toLowerCase();
        const searchableColumns = createFlatColumnStructure(this.datagrid.columns).filter(c => ['accessor', 'computed'].includes(c.type)).filter(col => col.options.searchable !== false) as (AccessorColumn<TRow> | ComputedColumn<TRow>)[];

        if (this.datagrid.features.globalSearch.fuzzy) {
            const fuse = this.datagrid.features.globalSearch.fuseInstance;
            if (!fuse) throw new Error('Fuse instance is not initialized');
            return fuse.search(searchValue).map(result => result.item);
        }

        return data.filter(item =>
            searchableColumns.some(column =>
                String(column.getValueFn(item))
                    .toLowerCase()
                    .includes(searchValue)
            )
        );
    }

    private applyColumnFilters(data: TRow[]): TRow[] {
        const activeFilters = this.datagrid.features.filtering.conditions
            .filter(condition => condition.value !== '');

        return data.filter(row =>
            activeFilters.every(filter =>
                this.datagrid.features.filtering.evaluateCondition(
                    filter.getValueFn(row),
                    filter
                )
            )
        );
    }

    private applySorting(data: TRow[]): TRow[] {
        const sortInstructions = this.datagrid.features.sorting.sortConfigs
            .map(config => {
                const column = findColumnById(this.datagrid.initial.columns, config.columnId) as (AccessorColumn<TRow> | ComputedColumn<TRow>);
                if (!column || isGroupColumn(column) || !column.isSortable()) {
                    return null;
                }

                const getValueFn = (row: TRow) => column.getValueFn(row);
                return config.desc ? { desc: getValueFn } : { asc: getValueFn };
            })
            .filter(Boolean);

        return sort(data).by(sortInstructions as any);
    }

    flattenGridRows(data: GridRow<TRow>[]): GridRow<TRow>[] {
        const flattened: GridRow<TRow>[] = [];

        for (const row of data) {
            flattened.push(row);
            if (row.isGroupRow()) {
                flattened.push(...this.flattenGridRows(row.children));
            }
        }
        return flattened
    }

    processGroupedData(data: TRow[]): void {
        // Create grouped structure only if not already cached
        let groupedRows = this.datagrid.cache.hierarchicalRows;

        if (!groupedRows) {
            this.metrics.measure('Grouping', () => {
                groupedRows = this.createHierarchicalData(data);
                this.datagrid.cache.hierarchicalRows = groupedRows;
            });
        }

        // Get only visible rows based on expansion state
        const visibleRows = this.getVisibleRows();

        // Update cache and pagination
        this.metrics.measure('Cache Update', () => {
            this.datagrid.cache.rows = visibleRows;
            this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(visibleRows);
            this.datagrid.cache.paginatedRows = this.paginateRows(visibleRows);
        });

        // this has to run always
        this.datagrid.features.rowPinning.updatePinnedRows();
    }

    private processRegularData(data: TRow[]): void {
        // Transform into basic rows
        let basicRows: GridRow<TRow>[];

        this.metrics.measure('Data Transformation', () => {
            basicRows = this.createBasicRows(data);
            this.datagrid.cache.rows = basicRows;

        });

        // this has to run always
        this.metrics.measure('Row Pinning', () => {
            this.datagrid.features.rowPinning.updatePinnedRows();
        });

        this.datagrid.features.pagination.visibleRowsCount = data!.length;
        this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(data);
        // Apply pagination
        this.datagrid.cache.paginatedRows = this.paginateRows(basicRows!);
    }

    // Register custom aggregation function
    registerAggregationFn(name: string, fn: AggregationFn): void {
        this.customAggregationFns.set(name, fn);
    }

    // Get aggregation function
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


    private calculateAggregations(
        column: AccessorColumn<TRow> | ComputedColumn<TRow>,
        groupRows: TRow[]
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

    createHierarchicalData(data: TRow[]): GridRow<TRow>[] {
        const groupCols = this.datagrid.features.grouping.groupByColumns;
        if (!groupCols.length) return this.createBasicRows(data);

        const groupByLevel = (
            rows: TRow[],
            depth: number,
            parentPath = ''
        ): GridRow<TRow>[] => {
            const groups = new Map<string, TRow[]>();

            if (depth >= groupCols.length) return this.createBasicRows(rows, parentPath);

            const column = findColumnById(createFlatColumnStructure(this.datagrid.columns), groupCols[depth]);

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
                const aggregations = createFlatColumnStructure(this.datagrid.columns)
                    .filter(col =>
                        (col.type === 'accessor' || col.type === 'computed') &&
                        col.aggregate
                    )
                    .flatMap(col => {
                        col = col as AccessorColumn<TRow> | ComputedColumn<TRow>;
                        return this.calculateAggregations(col, groupRows);
                    });

                return {
                    index: parentPath ? `${parentPath}-${index + 1}` : String(index + 1),
                    identifier: depth === 0 ? key : `${parentPath}|${key}`,
                    groupKey: groupCols[depth],
                    groupValue: [key],
                    depth,
                    // isExpanded: false,
                    children: groupByLevel(groupRows, depth + 1, `${parentPath}${index + 1}`),
                    aggregations: aggregations,
                    isExpanded: () => this.datagrid.features.rowExpanding.isRowExpanded(key),
                    isGroupRow: function (): this is GridGroupRow<TRow> {
                        return true;
                    },
                };
            });
        };

        return groupByLevel(data, 0);
    }

    private isGroupRow(row: GridRow<TRow>): row is GridGroupRow<TRow> {
        return 'groupKey' in row && 'children' in row;
    }

    private flattenExpandedGroups(rows: GridRow<TRow>[]): GridRow<TRow>[] {
        const flattened: GridRow<TRow>[] = [];

        for (const row of rows) {
            flattened.push(row);

            if (this.isGroupRow(row) && this.datagrid.features.grouping.expandedGroups.has(row.identifier)) {
                flattened.push(...this.flattenExpandedGroups(row.children));
            }
        }

        return flattened;
    }

    private createBasicRows(rows: TRow[], parentIndex?: string): GridRow<TRow>[] {

        return rows.map((row, i) => {
            const identifier = this.datagrid.config.createBasicRowIdentifier(row);
            return {
                identifier,
                index: this.datagrid.config.createBasicRowIndex(row, parentIndex || null, i),
                parentIndex: parentIndex ?? null,
                original: row,
                isExpanded: () => this.datagrid.features.rowExpanding.isRowExpanded(identifier),
                isGroupRow: () => false
            }
        });
    }

    private paginateRows(rows: GridRow<TRow>[]): GridRow<TRow>[] {
        const { page, pageSize } = this.datagrid.features.pagination;
        const start = (page - 1) * pageSize;
        return rows.slice(start, start + pageSize);
    }


    // Handlers

    handleGroupExpansion(): void {
        const hierarchicalRows = this.datagrid.cache.hierarchicalRows;
        if (!hierarchicalRows) {
            this.processGroupedData(this.datagrid.cache.sortedData || []);
            return;
        }

        this.metrics.measure('Group Expansion', () => {
            const visibleRows = this.getVisibleRows();
            this.datagrid.cache.rows = visibleRows;
            this.datagrid.features.pagination.pageCount = this.datagrid.features.pagination.getPageCount(visibleRows);
            this.datagrid.cache.paginatedRows = this.paginateRows(visibleRows);
        });
    }

    handlePaginationChange(): void {
        const visibleRows = this.getVisibleRows();
        this.metrics.measure('Pagination', () => {
            this.datagrid.cache.paginatedRows = this.paginateRows(visibleRows);
        });
    }

    // New method to get only the visible rows based on group expansion state
    private getVisibleRows(): GridRow<TRow>[] {
        if (!this.datagrid.cache.hierarchicalRows) {
            return this.datagrid.cache.rows;
        }

        return this.flattenExpandedGroups(this.datagrid.cache.hierarchicalRows);
    }




}