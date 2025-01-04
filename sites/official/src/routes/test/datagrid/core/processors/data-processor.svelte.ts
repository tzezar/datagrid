import { sort } from "fast-sort";
import { isGroupColumn } from "../column-guards";
import type { Datagrid } from "../index.svelte";
import type { Aggregation, AggregationFn, GridRow } from "../types";
import { findColumnById, flattenColumns, isColumnSortable } from "../utils.svelte";
import type { PerformanceMetrics } from "../helpers/performance-metrics.svelte";
import type { AccessorColumn, ComputedColumn } from "../helpers/column-creators";
import { aggregationFunctions } from "../helpers/aggregation-functions";





// export const aggregationFunctions = {
//     sum: (getValue: (row: any) => number) => 
//         (getLeafRows: () => Row<any>[]): number => 
//             getLeafRows().reduce((sum, row) => sum + (getValue(row.original) || 0), 0),

//     min: (getValue: (row: any) => number) =>
//         (getLeafRows: () => Row<any>[]): number =>
//             Math.min(...getLeafRows().map(row => getValue(row.original))),

//     max: (getValue: (row: any) => number) =>
//         (getLeafRows: () => Row<any>[]): number =>
//             Math.max(...getLeafRows().map(row => getValue(row.original))),

//     extent: (getValue: (row: any) => number) =>
//         (getLeafRows: () => Row<any>[]): [number, number] => {
//             const values = getLeafRows().map(row => getValue(row.original));
//             return [Math.min(...values), Math.max(...values)];
//         },

//     mean: (getValue: (row: any) => number) =>
//         (getLeafRows: () => Row<any>[]): number => {
//             const rows = getLeafRows();
//             return rows.reduce((sum, row) => sum + getValue(row.original), 0) / rows.length;
//         },

//     median: (getValue: (row: any) => number) =>
//         (getLeafRows: () => Row<any>[]): number => {
//             const values = getLeafRows()
//                 .map(row => getValue(row.original))
//                 .sort((a, b) => a - b);
//             const mid = Math.floor(values.length / 2);
//             return values.length % 2 !== 0 
//                 ? values[mid] 
//                 : (values[mid - 1] + values[mid]) / 2;
//         },

//     unique: (getValue: (row: any) => any) =>
//         (getLeafRows: () => Row<any>[]): any[] =>
//             Array.from(new Set(getLeafRows().map(row => getValue(row.original)))),

//     uniqueCount: (getValue: (row: any) => any) =>
//         (getLeafRows: () => Row<any>[]): number =>
//             new Set(getLeafRows().map(row => getValue(row.original))).size,

//     count: () =>
//         (getLeafRows: () => Row<any>[]): number =>
//             getLeafRows().length,
// };


// Main data processor
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

            // Group rows by current column
            rows.forEach(row => {
                const groupKey = String(column.getValueFn(row) ?? 'Unknown');
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
                    .flatMap(col => this.calculateAggregations(col, groupRows));


                return {
                    index: parentPath ? `${parentPath}-${index + 1}` : String(index + 1),
                    identifier: depth === 0 ? key : `${parentPath}|${key}`,
                    groupKey: groupCols[depth],
                    groupValue: [key],
                    depth,
                    isExpanded: false,
                    children: groupByLevel(groupRows, depth + 1, `${parentPath}${index + 1}`),
                    aggregations
                };
            });
        };

        return groupByLevel(data, 0);
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