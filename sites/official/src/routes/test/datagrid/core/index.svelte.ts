import { sort } from "fast-sort";
import { isGroupColumn } from "./column-guards";
import { Grouping } from "./features/grouping.svelte";
import { Pagination } from "./features/pagination.svelte";
import { Sorting } from "./features/sorting.svelte";
import type { ColumnDef } from "./helpers/column-creators";
import type { ColumnId, FilterCondition, FilterOperator, GridBasicRow, GridGroupRow, GridRow } from "./types";
import { findColumnById, getSearchableColumns, isGridGroupRow } from "./utils.svelte";
import { Filtering } from "./features/column-filtering.svelte";
import { GlobalSearch } from "./features/global-search.svelte";

export class Datagrid<TOriginalRow> {
    original = $state.raw({
        columns: [] as ColumnDef<TOriginalRow>[],
        data: [] as TOriginalRow[]
    });

    pagination = new Pagination();
    sorting = new Sorting();
    grouping = new Grouping();
    filtering = new Filtering();

    globalSearch = new GlobalSearch();

    columns: ColumnDef<TOriginalRow>[] = $state([]);

    processedRowsCache: GridRow<TOriginalRow>[] = $state([]);


    groupedRowsCache: GridRow<TOriginalRow>[] = $state([]);
    flattenedRowsCache: GridRow<TOriginalRow>[] = $state([]);

    constructor(columns: ColumnDef<TOriginalRow>[], data: TOriginalRow[]) {
        this.original = {
            columns,
            data
        };

        this.columns = this.transformColumns(columns);
        this.executeFullDataTransformation();
    }

    getPageCount(data: Array<any>): number {
        return Math.ceil(data.length / this.pagination.pageSize);
    }

    executeFullDataTransformation() {
        // Global search first
        let filteredOriginalRows = this.executeSearch(this.original.data);
        // Filter original data
        filteredOriginalRows = this.filterOriginalRows(filteredOriginalRows);
        // Sort original data
        const sortedOriginalRows = this.sortOriginalRows(filteredOriginalRows);

        // Create hierarchical groups
        const groupedRows = this.createHierarchicalData(sortedOriginalRows);
        // Flatten the hierarchical data, respecting expanded states
        const flattenedRows = this.flattenHierarchicalData(groupedRows);
        this.pagination.pageCount = this.getPageCount(flattenedRows);
        // Paginate the flattened rows
        this.processedRowsCache = this.paginateFlattenedRows(flattenedRows);
    }

    executeSearch(data: TOriginalRow[]): TOriginalRow[] {
        if (!this.globalSearch.value) return data;

        const searchValue = this.globalSearch.value.toLowerCase();
        const searchableColumns = getSearchableColumns(this.columns);

        // Fuzzy search
        if (this.globalSearch.fuzzy) {
            const fuseInstance = this.globalSearch.fuseInstance;
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

    filterOriginalRows(data: TOriginalRow[]): TOriginalRow[] {
        // Filter out inactive conditions (empty value)
        const activeConditions = this.filtering.conditions.filter(condition => condition.value !== '');

        if (activeConditions.length === 0) return data;

        const isRowMatching = (row: TOriginalRow): boolean => {
            return activeConditions.every(condition =>
                this.evaluateCondition(condition.getValueFn(row), condition)
            );
        };

        return data.filter(isRowMatching);
    }

    private evaluateCondition(cellValue: any, condition: FilterCondition<TOriginalRow>): boolean {
        const value = condition.value;
        const valueTo = condition.valueTo;

        // Handle null/undefined cell values
        if (cellValue === null || cellValue === undefined) {
            return condition.operator === 'empty';
        }

        // Convert to string for string operations
        const stringCellValue = String(cellValue).toLowerCase();
        const stringValue = String(value).toLowerCase();

        switch (condition.operator) {
            case 'equals':
                return cellValue === value;

            case 'notEquals':
                return cellValue !== value;

            case 'contains':
                return stringCellValue.includes(stringValue);

            case 'notContains':
                return !stringCellValue.includes(stringValue);

            case 'startsWith':
                return stringCellValue.startsWith(stringValue);

            case 'endsWith':
                return stringCellValue.endsWith(stringValue);

            case 'greaterThan':
                return cellValue > value;

            case 'lessThan':
                return cellValue < value;

            case 'greaterThanOrEqual':
                return cellValue >= value;

            case 'lessThanOrEqual':
                return cellValue <= value;

            case 'between':
                return cellValue >= value && cellValue <= valueTo;

            case 'inList':
                return Array.isArray(value) && value.includes(cellValue);

            case 'notInList':
                return Array.isArray(value) && !value.includes(cellValue);

            case 'empty':
                return cellValue === '' || cellValue === null || cellValue === undefined;

            case 'notEmpty':
                return cellValue !== '' && cellValue !== null && cellValue !== undefined;

            default:
                return true;
        }
    }

    paginateFlattenedRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const startIndex = (this.pagination.page - 1) * this.pagination.pageSize;
        const endIndex = startIndex + this.pagination.pageSize;
        return data.slice(startIndex, endIndex);
    }

    transformOriginalRowsIntoGridBasicRows(
        rows: TOriginalRow[],
        parentIndex: string = ''
    ): GridRow<TOriginalRow>[] {
        const gridRows: GridBasicRow<TOriginalRow>[] = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const gridRow: GridRow<TOriginalRow> = {
                // Always use a hyphenated index with parent index
                index: parentIndex
                    ? `${parentIndex}-${i + 1}`
                    : `${i + 1}`,
                original: row
            };
            gridRows.push(gridRow);
        }
        return gridRows;
    }

    flattenHierarchicalData(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);

            if (isGridGroupRow(row)) {
                // Only flatten children if the group row is expanded
                if (this.grouping.expandedGroups.has(row.groupId)) {
                    flattened.push(...this.flattenHierarchicalData(row.children));
                }
            }
        }

        return flattened;
    }


    createHierarchicalData(data: TOriginalRow[]): GridRow<TOriginalRow>[] {
        const groupByColumns = this.grouping.groupByColumns;

        if (groupByColumns.length < 1) return this.transformOriginalRowsIntoGridBasicRows(data);

        // Memoize column access functions for performance
        const columnAccessors = groupByColumns.map(col =>
            (row: TOriginalRow) => {
                try {
                    // Use deep property access that's null-safe
                    return col.split('.').reduce((obj, key) => obj?.[key], row);
                } catch {
                    return null;
                }
            }
        );

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
                // Prefer getGroupValue if it exists, fall back to default accessor
                const column = findColumnById(this.original.columns, groupByColumns[columnIndex]);
                const groupKey = column?.getGroupValue
                    ? String(column.getGroupValue(row) ?? 'Unknown')
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
        if (this.sorting.sortConfigs.length === 0) return data;

        type SortInstruction = {
            asc?: (row: TOriginalRow) => any;
            desc?: (row: TOriginalRow) => any;
        };
        const sortInstructions: SortInstruction[] = [];

        for (const sortConfig of this.sorting.sortConfigs) {
            const column = findColumnById(this.original.columns, sortConfig.id);
            if (!column || isGroupColumn(column)) continue;

            const getValueFn = (row: TOriginalRow) => column.getValueFn(row);
            const sortInstruction: SortInstruction = sortConfig.desc
                ? { desc: getValueFn }
                : { asc: getValueFn };

            sortInstructions.push(sortInstruction);
        }

        return sort(data).by(sortInstructions as any);
    }

    transformColumns = (columns: ColumnDef<TOriginalRow>[]): ColumnDef<TOriginalRow>[] => {
        const groupByColumns = this.grouping.groupByColumns;

        // Completely rework the column transformation
        const groupedColumns: ColumnDef<TOriginalRow>[] = [];
        const nonGroupedColumns: ColumnDef<TOriginalRow>[] = [];

        columns.forEach((column) => {
            // Check if the column's columnId is in the groupByColumns
            if (groupByColumns.includes(column.columnId)) {
                groupedColumns.push(column);
            } else {
                nonGroupedColumns.push(column);
            }
        });

        // Return grouped columns first, followed by non-grouped columns
        return [...groupedColumns, ...nonGroupedColumns];
    };


    toggleGroupRowIsExpanded(row: GridGroupRow<TOriginalRow>) {
        if (this.grouping.expandedGroups.has(row.groupId)) {
            this.grouping.expandedGroups.delete(row.groupId);
        } else {
            this.grouping.expandedGroups.add(row.groupId);
        }
        this.executeFullDataTransformation();
    }

    changePage(page: number) {
        this.pagination.page = page;
        this.executeFullDataTransformation();
    }
}