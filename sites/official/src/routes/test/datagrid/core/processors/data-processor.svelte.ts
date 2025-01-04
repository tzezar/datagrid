import { sort } from "fast-sort";
import { isGroupColumn } from "../column-guards";
import type { Datagrid } from "../index.svelte";
import type { GridRow } from "../types";
import { findColumnById, isColumnSortable } from "../utils.svelte";
import type { PerformanceMetrics } from "../helpers/performance-metrics.svelte";





// Main data processor
export class DataProcessor<TRow> {
    private readonly metrics: PerformanceMetrics;
    constructor(private readonly datagrid: Datagrid<TRow>) {
        this.metrics = datagrid.metrics;
    }

    executeFullDataTransformation(): void {
        this.metrics.clear();

        // Apply transformations directly
        let data = this.datagrid.original.data;

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
                this.datagrid.cache.sortedOriginalRows = data;
            });
        }

        // Cache filtered results
        this.datagrid.cache.filteredOriginalRows = data;

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
        const searchableColumns = this.datagrid.columns.filter(col =>
            !isGroupColumn(col) && col.searchable !== false);

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
                const column = findColumnById(this.datagrid.original.columns, config.id);
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
            this.datagrid.cache.groupedRowsCache = groupedRows;
        });

        // Flatten groups
        let flattenedRows: GridRow<TRow>[];
        this.metrics.measure('Flattening', () => {
            flattenedRows = this.flattenGroups(groupedRows!);
            this.datagrid.cache.flattenedRowsCache = this.datagrid.rowManager.flattenGridRows(groupedRows!);
            this.datagrid.cache.rows = flattenedRows;
        });

        // Update pinned rows and pagination
        this.datagrid.rowPinning.updatePinnedRows();
        this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(flattenedRows!);
        this.datagrid.cache.paginatedRowsCache = this.paginateRows(flattenedRows!);
    }

    private processRegularData(data: TRow[]): void {
        // Transform into basic rows
        let basicRows: GridRow<TRow>[];

        this.metrics.measure('Data Transformation', () => {
            basicRows = this.createBasicRows(data);
            this.datagrid.cache.rows = basicRows;
            if (this.datagrid.rowPinning.rowIdsPinnedTop.size > 0 || this.datagrid.rowPinning.rowIdsPinnedBottom.size > 0) {
                this.metrics.measure('Row Pinning', () => {
                    this.datagrid.rowPinning.updatePinnedRows();
                });
            }
            this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(data);
        });

        // Apply pagination
        this.datagrid.cache.paginatedRowsCache = this.paginateRows(basicRows!);
    }

    createHierarchicalData(data: TRow[]): GridRow<TRow>[] {
        const groupCols = this.datagrid.grouping.groupByColumns;
        if (!groupCols.length) return this.createBasicRows(data);

        const groupByLevel = (
            rows: TRow[],
            depth: number,
            parentPath = ''
        ): GridRow<TRow>[] => {
            if (depth >= groupCols.length) {
                return this.createBasicRows(rows, parentPath);
            }

            const groups = new Map<string, TRow[]>();
            const column = findColumnById(this.datagrid.columns, groupCols[depth]);
            if (!column || isGroupColumn(column)) {
                throw new Error(`Invalid group column: ${groupCols[depth]}`);
            }

            // Group rows by current column
            rows.forEach(row => {
                const groupKey = String(column.getGroupValueFn?.(row) ?? column.getValueFn(row) ?? 'Unknown');
                const group = groups.get(groupKey) ?? [];
                group.push(row);
                groups.set(groupKey, group);
            });

            // Create group rows
            return Array.from(groups.entries()).map(([key, groupRows], index) => ({
                index: parentPath ? `${parentPath}-${index + 1}` : String(index + 1),
                groupId: `${parentPath}|${key}`,
                groupKey: groupCols[depth],
                groupValue: [key],
                depth,
                isExpanded: false,
                children: groupByLevel(groupRows, depth + 1, `${parentPath}${index + 1}`)
            }));
        };

        return groupByLevel(data, 0);
    }

    private flattenGroups(rows: GridRow<TRow>[]): GridRow<TRow>[] {
        const flattened: GridRow<TRow>[] = [];

        for (const row of rows) {
            flattened.push(row);

            if ('groupId' in row && 'children' in row) {
                if (this.datagrid.grouping.expandedGroups.has(row.groupId)) {
                    flattened.push(...this.flattenGroups(row.children));
                }
            }
        }

        return flattened;
    }

    private createBasicRows(rows: TRow[], parentIndex?: string): GridRow<TRow>[] {
        return rows.map((row, i) => ({
            index: parentIndex ? `${parentIndex}-${i + 1}` : String(i + 1),
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