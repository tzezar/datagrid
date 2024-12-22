import { sort } from "fast-sort";
import { isGroupColumn } from "../column-guards";
import type { AccessorColumn, ComputedColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import type { GridBasicRow, GridRow } from "../types";
import { findColumnById, getSearchableColumns, isColumnSortable, isGridGroupRow } from "../utils.svelte";


export class PerformanceMetrics {
    metrics: { label: string, value: number }[] = [];

    add(label: string, value: number) {
        this.metrics.push({ label, value: Number(value) });
    }

    print() {
        console.log('');
        console.log('Performance Summary:');
        this.metrics.forEach(({ label, value }) => {
            console.log(`${value.toFixed(2)}ms - ${label}`);
        });
        console.log(`Total processing time: ${this.getTotalTime()}ms`);
    }

    clear() {
        this.metrics = [];
    }

    getTotalTime() {
        return Number(this.metrics.reduce((acc, metric) => acc + metric.value, 0).toFixed(2));
    }

    measure(operation: () => void, name: string) {
        const timeStart = performance.now();
        operation();
        const duration = performance.now() - timeStart;
        this.add(name, duration);
        console.log(`${duration.toFixed(2)}ms - ${name}`);
    }
}

class DataTransformationPipeline<T> {
    private steps: Array<[string, (data: T) => T]> = [];
    private initialData: T | null = null;
    private readonly datagrid: Datagrid<any>;

    constructor(datagrid: Datagrid<any>) {
        this.datagrid = datagrid;
    }

    setInitialData(data: T): this {
        this.initialData = data;
        return this;
    }

    addStep(name: string, transform: (data: T) => T): this {
        this.steps.push([name, transform]);
        return this;
    }

    execute(metrics: PerformanceMetrics): T {
        if (this.initialData === null) {
            throw new Error('Pipeline execution failed: no initial data provided');
        }

        return this.steps.reduce((result: T, [name, transform]) => {
            let transformedResult: T;
            metrics.measure(() => {
                transformedResult = transform(result);
            }, name);
            return transformedResult!;
        }, this.initialData);
    }
}

export class DataProcessor<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    metrics: PerformanceMetrics;
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
        this.metrics = new PerformanceMetrics();
    }

    executeFullDataTransformation(): void {
        this.metrics.clear();

        const transformationPipeline = new DataTransformationPipeline<TOriginalRow[]>(this.datagrid);

        const transformedData = transformationPipeline
            .addStep('Global Search', () =>
                this.datagrid.globalSearch.value !== ''
                    ? this.filterOriginalRowsWithGlobalSearch(this.datagrid.original.data)
                    : this.datagrid.original.data
            )
            .addStep('Column Filtering', (previousData) =>
                this.datagrid.filtering.conditions.length > 0
                    ? this.filterOriginalRowsWithColumnFilters(previousData)
                    : previousData
            )
            .addStep('Sorting', (previousData) => {
                if (this.datagrid.sorting.sortConfigs.length > 0) {
                    const sortedData = this.sortOriginalRows(previousData);
                    this.datagrid.cache.sortedOriginalRows = sortedData;
                    return sortedData;
                }
                return previousData;
            })
            .execute(this.metrics);

        // Cache filtered results
        this.datagrid.cache.filteredOriginalRows = transformedData;

        // Process grouped or regular data
        if (this.datagrid.grouping.groupByColumns.length > 0) {
            this.processGroupedData(transformedData);
        } else {
            this.processRegularData(transformedData);
        }

        if (this.datagrid.config.measurePerformance) {
            this.metrics.print();
        }
    }

    private processGroupedData(data: TOriginalRow[]): void {
        const pipeline = new DataTransformationPipeline<GridRow<TOriginalRow>[]>(this.datagrid);

        pipeline
            .addStep('Grouping', () => {
                const groupedRows = this.datagrid.cache.getOrComputeGroupedRowsCache(data);
                this.datagrid.cache.groupedRowsCache = groupedRows;
                return groupedRows;
            })
            .addStep('Flattening', (groupedRows) => {
                const flattenedRows = this.flattenExpandedHierarchicalData(groupedRows);
                this.datagrid.cache.flattenedRowsCache = this.datagrid.rowManager.getFlattenedRows(groupedRows);
                this.datagrid.cache.rows = flattenedRows;
                return flattenedRows;
            })
            .addStep('Row Pinning', (flattenedRows) => {
                this.datagrid.rowPinning.updatePinnedRows();
                return flattenedRows;
            })
            .addStep('Pagination', (flattenedRows) => {
                this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(flattenedRows);
                const paginatedRows = this.paginateGridRows(flattenedRows);
                this.datagrid.cache.paginatedRowsCache = paginatedRows;
                return paginatedRows;
            })
            .execute(this.metrics);
    }

    private processRegularData(data: TOriginalRow[]): void {
        const pipeline = new DataTransformationPipeline<GridRow<TOriginalRow>[]>(this.datagrid);

        pipeline
            .addStep('Data Transformation', () => {
                const basicRows = this.transformOriginalRowsIntoGridBasicRows(data);
                this.datagrid.cache.rows = basicRows;
                this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(data);
                return basicRows;
            })
            .addStep('Pagination', (basicRows) => {
                const paginatedRows = this.paginateGridRows(basicRows);
                this.datagrid.cache.paginatedRowsCache = paginatedRows;
                return paginatedRows;
            })
            .execute(this.metrics);
    }

    filterOriginalRowsWithGlobalSearch(data: TOriginalRow[]): TOriginalRow[] {
        if (!this.datagrid.globalSearch.value) return data;

        const searchValue = this.datagrid.globalSearch.value.toLowerCase();
        const searchableColumns = getSearchableColumns(this.datagrid.columns);

        // Fuzzy search
        if (this.datagrid.globalSearch.fuzzy) {
            const fuseInstance = this.datagrid.globalSearch.fuseInstance;
            if (!fuseInstance) throw new Error('Fuse instance is null or undefined');
            return fuseInstance.search(searchValue).map((result) => result.item);
        }

        // Cache the column accessor functions for searchable columns
        const accessorCache = new Map<string, (item: TOriginalRow) => any>();
        searchableColumns.forEach((column) => {
            // Ensure type safety by accessing the correct getValueFn
            accessorCache.set(column.columnId, column.getValueFn);
        });

        // Column-level search
        return data.filter((item) =>
            searchableColumns.some((col) => {
                const accessor = accessorCache.get(col.columnId);
                if (!accessor) return false;

                const value = accessor(item);
                return String(value).toLowerCase().includes(searchValue);
            })
        );
    }

    filterOriginalRowsWithColumnFilters(data: TOriginalRow[]): TOriginalRow[] {
        // Filter out inactive conditions (empty value)
        const activeConditions = this.datagrid.filtering.conditions.filter(condition => condition.value !== '');

        if (activeConditions.length === 0) return data;

        const isRowMatching = (row: TOriginalRow): boolean => {
            return activeConditions.every(condition =>
                this.datagrid.filtering.evaluateCondition(condition.getValueFn(row), condition)
            );
        };

        return data.filter(isRowMatching);
    }



    paginateGridRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const startIndex = (this.datagrid.pagination.page - 1) * this.datagrid.pagination.pageSize;
        const endIndex = startIndex + this.datagrid.pagination.pageSize;
        return data.slice(startIndex, endIndex);
    }


    transformOriginalRowsIntoGridBasicRows(
        rows: TOriginalRow[],
        parentIndex: string | null = null
    ): GridRow<TOriginalRow>[] {
        const gridRows: GridBasicRow<TOriginalRow>[] = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const gridRow: GridRow<TOriginalRow> = {
                // Always use a hyphenated index with parent index
                index: parentIndex
                    ? `${parentIndex}-${i + 1}`
                    : `${i + 1}`,
                parentIndex: parentIndex,
                original: row
            };
            gridRows.push(gridRow);
        }
        return gridRows;
    }


    createHierarchicalData(data: TOriginalRow[]): GridRow<TOriginalRow>[] {
        const groupByColumns = this.datagrid.grouping.groupByColumns;

        if (groupByColumns.length < 1) return this.transformOriginalRowsIntoGridBasicRows(data);

        const columnAccessors = groupByColumns.map(col => {
            let column = findColumnById(this.datagrid.columns, col);
            if (!column) throw new Error(`Column ${col} not found`);
            column = column as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
            return column.getValueFn;
        })

        const recursiveGroup = (
            rows: TOriginalRow[],
            columnIndex: number,
            parentGroupKeys: Record<string, any> = {},
            parentIndex: string = ''
        ): GridRow<TOriginalRow>[] => {
            if (columnIndex >= groupByColumns.length) {
                return this.transformOriginalRowsIntoGridBasicRows(rows, parentIndex);
            }

            const currentAccessor = columnAccessors[columnIndex];
            const groupedData: Record<string, TOriginalRow[]> = {};

            // Efficient grouping
            rows.forEach((row) => {
                // TODO some workaround for ts types, need to improve
                // Prefer getGroupValue if it exists, fall back to default accessor
                const column = findColumnById(this.datagrid.original.columns, groupByColumns[columnIndex]) as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
                const groupKey = column?.getGroupValueFn
                    ? String(column.getGroupValueFn(row) ?? 'Unknown')
                    : String(currentAccessor(row) ?? 'Unknown');

                (groupedData[groupKey] = groupedData[groupKey] || []).push(row);
            });


            return Object.entries(groupedData).map(([groupKey, groupRows], groupIndex) => {
                const currentGroupKeys = {
                    ...parentGroupKeys,
                    [groupByColumns[columnIndex]]: groupKey
                };

                const currentIndex = parentIndex
                    ? `${parentIndex}-${groupIndex + 1}`
                    : `${groupIndex + 1}`;

                const groupId = Object.values(currentGroupKeys).join('|');

                return {
                    index: currentIndex,
                    groupId: groupId,
                    groupKey: groupByColumns[columnIndex],
                    groupValue: [groupKey],
                    depth: columnIndex,
                    isExpanded: false,
                    children: recursiveGroup(
                        groupRows,
                        columnIndex + 1,
                        currentGroupKeys,
                        currentIndex
                    )
                };
            });
        };

        return recursiveGroup(data, 0);
    }

    sortOriginalRows(data: TOriginalRow[]): TOriginalRow[] {
        if (this.datagrid.sorting.sortConfigs.length === 0) return data;

        type SortInstruction = {
            asc?: (row: TOriginalRow) => any;
            desc?: (row: TOriginalRow) => any;
        };
        const sortInstructions: SortInstruction[] = [];

        for (const sortConfig of this.datagrid.sorting.sortConfigs) {
            let column = findColumnById(this.datagrid.original.columns, sortConfig.id);
            if (!column || isGroupColumn(column)) continue;
            column = isColumnSortable(column);
            if (!column) continue;
            const getValueFn = (row: TOriginalRow) => column.getValueFn(row);
            const sortInstruction: SortInstruction = sortConfig.desc
                ? { desc: getValueFn }
                : { asc: getValueFn };

            sortInstructions.push(sortInstruction);
        }

        return sort(data).by(sortInstructions as any);
    }


    flattenExpandedHierarchicalData(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);

            if (isGridGroupRow(row)) {
                // Only flatten children if the group row is expanded
                if (this.datagrid.grouping.expandedGroups.has(row.groupId)) {
                    flattened.push(...this.flattenExpandedHierarchicalData(row.children));
                }
            }
        }

        return flattened;
    }




}