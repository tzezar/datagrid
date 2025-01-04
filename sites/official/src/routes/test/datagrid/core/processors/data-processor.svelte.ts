import { sort } from "fast-sort";
import { isGroupColumn } from "../column-guards";
import type { Datagrid } from "../index.svelte";
import type { GridRow } from "../types";
import { findColumnById, flattenColumns, isColumnSortable } from "../utils.svelte";
import type { PerformanceMetrics } from "../helpers/performance-metrics.svelte";
import type { AccessorColumn, ComputedColumn } from "../helpers/column-creators";

const aggregationMethods = {
    sum: (values: number[]) => values.reduce((acc, val) => acc + val, 0),
    avg: (values: number[]) => values.reduce((acc, val) => acc + val, 0) / values.length || 0,
    min: (values: number[]) => Math.min(...values),
    max: (values: number[]) => Math.max(...values),
    count: (values: number[]) => values.length,
};



// Main data processor
export class DataProcessor<TRow> {
    private readonly metrics: PerformanceMetrics;
    constructor(private readonly datagrid: Datagrid<TRow>) {
        this.metrics = datagrid.metrics;
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

        // Cache filtered results
        this.datagrid.cache.sortedData = data;

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

    private processGroupedData(data: TRow[]): void {
        // Create grouped structure
        let groupedRows: GridRow<TRow>[];
        this.metrics.measure('Grouping', () => {
            groupedRows = this.createHierarchicalData(data);
            this.datagrid.cache.hierarchicalRows = groupedRows;
        });

        // Flatten groups
        let flattenedRows: GridRow<TRow>[];
        this.metrics.measure('Flattening', () => {
            flattenedRows = this.flattenGroups(groupedRows!);
            this.datagrid.cache.rows = this.datagrid.rowManager.flattenGridRows(groupedRows!);
            this.datagrid.cache.rows = flattenedRows;
        });

        // Update pinned rows and pagination
        this.datagrid.rowPinning.updatePinnedRows();
        this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(flattenedRows!);
        this.datagrid.cache.paginatedRows = this.paginateRows(flattenedRows!);
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
        this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(data);
        // Apply pagination
        this.datagrid.cache.paginatedRows = this.paginateRows(basicRows!);
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
    
            // Group rows by the current column
            rows.forEach(row => {
                const groupKey = String(column.getValueFn(row) ?? 'Unknown');
                const group = groups.get(groupKey) ?? [];
                group.push(row);
                groups.set(groupKey, group);
            });
    
            // Create group rows with aggregation
            return Array.from(groups.entries()).map(([key, groupRows], index) => {
                const aggregatedValues = this.computeAggregations(groupRows);
    
                return {
                    index: parentPath ? `${parentPath}-${index + 1}` : String(index + 1),
                    identifier: depth === 0 ? key : `${parentPath}|${key}`,
                    groupKey: groupCols[depth],
                    groupValue: [key],
                    depth,
                    isExpanded: false,
                    aggregatedValues, // Add aggregated values
                    children: groupByLevel(groupRows, depth + 1, `${parentPath}${index + 1}`),
                };
            });
        };
    
        return groupByLevel(data, 0);
    }

    private computeAggregations(groupRows: TRow[]): Record<string, any> {
        const aggregations: Record<string, any> = {};

        flattenColumns(this.datagrid.columns).forEach(column => {
            const aggregationMethod = column.options.aggregationMethod as keyof typeof aggregationMethods;
            if (aggregationMethod && aggregationMethods[aggregationMethod]) {
                const values = groupRows.map(row => column.getValueFn(row)).filter(value => value != null) as number[];
                aggregations[column.id] = aggregationMethods[aggregationMethod](values);
            }
        });

        return aggregations;
    }

    private flattenGroups(rows: GridRow<TRow>[]): GridRow<TRow>[] {
        const flattened: GridRow<TRow>[] = [];
        for (const row of rows) {
            flattened.push(row);
            if ('groupKey' in row && 'children' in row) {
                if (this.datagrid.grouping.expandedGroups.has(row.identifier)) {
                    flattened.push(...this.flattenGroups(row.children));
                }
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
}