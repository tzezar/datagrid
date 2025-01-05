import { sort } from "fast-sort";
import { isGroupColumn } from "../column-guards";
import type { Datagrid } from "../index.svelte";
import type { Aggregation, AggregationFn, GridGroupRow, GridRow } from "../types";
import { findColumnById, flattenColumns, isColumnSortable, isGridGroupRow } from "../utils.svelte";
import type { PerformanceMetrics } from "../helpers/performance-metrics.svelte";
import type { AccessorColumn, ComputedColumn } from "../helpers/column-creators";
import { aggregationFunctions } from "../helpers/aggregation-functions";

export class DataProcessor<TRow> {
    private readonly metrics: PerformanceMetrics;
    private customAggregationFns: Map<string, AggregationFn>;

    constructor(private readonly datagrid: Datagrid<TRow>) {
        this.metrics = datagrid.metrics;
        this.customAggregationFns = new Map();
    }

    executeFullDataTransformation(): void {
        this.metrics.clear();

        // Create a copy of the data to avoid mutating the original data
        let data = [...this.datagrid.original.data];

        // Apply global search if value is set
        if (this.datagrid.globalSearch.value !== '') {
            this.metrics.measure('Global Search', () => {
                data = this.applyGlobalSearch(data);
            });
        }

        if (this.datagrid.filtering.conditions.length > 0) {
            this.metrics.measure('Column Filtering', () => {
                data = this.applyColumnFilters(data);
            });
        }

        if (this.datagrid.sorting.sortConfigs.length > 0) {
            this.metrics.measure('Sorting', () => {
                data = this.applySorting(data);
                this.datagrid.cache.sortedData = data;
            });
        }

        // Cache sorted/filtered results
        this.datagrid.cache.sortedData = data;

        // Clear hierarchical cache when data changes
        this.datagrid.cache.hierarchicalRows = null;

        // Process grouped or regular data
        if (this.datagrid.grouping.groupByColumns.length > 0) {
            this.processGroupedData(data);
        } else {
            this.processRegularData(data);
        }

        if (this.datagrid.config.measurePerformance) {
            this.datagrid.metrics.print();
        }
    }

    private applyGlobalSearch(data: TRow[]): TRow[] {
        const searchValue = this.datagrid.globalSearch.value.toLowerCase();
        const searchableColumns = flattenColumns(this.datagrid.columns).filter(c => ['accessor', 'computed'].includes(c.type)).filter(col => col.options.searchable !== false) as (AccessorColumn<TRow> | ComputedColumn<TRow>)[];

        if (this.datagrid.globalSearch.fuzzy) {
            const fuse = this.datagrid.globalSearch.fuseInstance;
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
        const activeFilters = this.datagrid.filtering.conditions
            .filter(condition => condition.value !== '');

        return data.filter(row =>
            activeFilters.every(filter =>
                this.datagrid.filtering.evaluateCondition(
                    filter.getValueFn(row),
                    filter
                )
            )
        );
    }

    private applySorting(data: TRow[]): TRow[] {
        const sortInstructions = this.datagrid.sorting.sortConfigs
            .map(config => {
                const column = findColumnById(this.datagrid.original.columns, config.id) as (AccessorColumn<TRow> | ComputedColumn<TRow>);
                if (!column || isGroupColumn(column) || !isColumnSortable(column)) {
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
            if (isGridGroupRow(row)) {
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
            this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(visibleRows);
            this.datagrid.cache.paginatedRows = this.paginateRows(visibleRows);
        });

        // Update pinned rows if needed
        if (this.datagrid.rowPinning) {
            this.datagrid.rowPinning.updatePinnedRows();
        }
    }

    private processRegularData(data: TRow[]): void {
        // Transform into basic rows
        let basicRows: GridRow<TRow>[];

        this.metrics.measure('Data Transformation', () => {
            basicRows = this.createBasicRows(data);
            this.datagrid.cache.rows = basicRows;

        });
        if (this.datagrid.rowPinning.rowIdsPinnedTop.size > 0 || this.datagrid.rowPinning.rowIdsPinnedBottom.size > 0) {
            this.metrics.measure('Row Pinning', () => {
                this.datagrid.rowPinning.updatePinnedRows();
            });
        }
        this.datagrid.pagination.visibleRowsCount = data!.length;
        this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(data);
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
        const groupCols = this.datagrid.grouping.groupByColumns;
        if (!groupCols.length) return this.createBasicRows(data);

        const groupByLevel = (
            rows: TRow[],
            depth: number,
            parentPath = ''
        ): GridRow<TRow>[] => {
            const groups = new Map<string, TRow[]>();

            if (depth >= groupCols.length) return this.createBasicRows(rows, parentPath);

            const column = findColumnById(flattenColumns(this.datagrid.columns), groupCols[depth]);

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
                const aggregations = flattenColumns(this.datagrid.columns)
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
                    isExpanded: false,
                    children: groupByLevel(groupRows, depth + 1, `${parentPath}${index + 1}`),
                    aggregations: aggregations
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
            
            if (this.isGroupRow(row) && this.datagrid.grouping.expandedGroups.has(row.identifier)) {
                flattened.push(...this.flattenExpandedGroups(row.children));
            }
        }
        
        return flattened;
    }

    private createBasicRows(rows: TRow[], parentIndex?: string): GridRow<TRow>[] {
        return rows.map((row, i) => ({
            identifier: this.datagrid.config.createBasicRowIdentifier(row),
            index: this.datagrid.config.createBasicRowIndex(row, parentIndex || null, i),
            parentIndex: parentIndex ?? null,
            original: row
        }));
    }

    private paginateRows(rows: GridRow<TRow>[]): GridRow<TRow>[] {
        const { page, pageSize } = this.datagrid.pagination;
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
            this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(visibleRows);
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