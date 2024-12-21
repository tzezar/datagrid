import { sort } from "fast-sort";
import { isGroupColumn } from "../column-guards";
import type { AccessorColumn, ComputedColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import type { GridBasicRow, GridRow } from "../types";
import { findColumnById, getSearchableColumns, isColumnSortable, isGridGroupRow } from "../utils.svelte";



export class DataProcessor<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    executeFullDataTransformation() {
        // Global search first
        let data = this.datagrid.original.data;
        let timeStart = performance.now();
        if (this.datagrid.globalSearch.value !== '') {
            data = this.filterOriginalRowsWithGlobalSearch(data);
        }
        console.log(`Global search took ${performance.now() - timeStart}ms`)
        timeStart = performance.now();
        if (this.datagrid.filtering.conditions.length > 0) {
            data = this.filterOriginalRowsWithColumnFilters(data);
        }
        console.log(`Filtering took ${performance.now() - timeStart}ms`)
        this.datagrid.cache.filteredOriginalRowsCache = data;


        // Recompute faceted values
        // Sort original data
        timeStart = performance.now();
        if (this.datagrid.sorting.sortConfigs.length > 0) {
            data = this.sortOriginalRows(data);
        }
        console.log(`Sorting took ${performance.now() - timeStart}ms`)
        this.datagrid.cache.sortedOriginalRowsCache = data;


        if (this.datagrid.grouping.groupByColumns.length > 0) {
            // Create hierarchical groups
            timeStart = performance.now();

            // ! should only be done when grouping changes or when data changes or when sorting or filtering changes
            // ! not on group expansion or pagination

            const groupedRows = this.datagrid.cache.getGroupedRowsCache(data);
            console.log(`Grouping took ${performance.now() - timeStart}ms`)
            // Flatten the hierarchical data, respecting expanded states
            timeStart = performance.now();
            const flattenedRows = this.flattenExpandedHierarchicalData(groupedRows);
            console.log(`Flattening expanded hierarchies took ${performance.now() - timeStart}ms`)
            timeStart = performance.now();
            this.datagrid.cache.flattenedRowsCache = this.datagrid.rowManager.getFlattenedRows(this.datagrid.cache.groupedRowsCache);
            console.log(`Flattening took ${performance.now() - timeStart}ms`)
            this.datagrid.cache.processedRowsCache = flattenedRows
            // Some performance hit
            timeStart = performance.now();
            this.datagrid.rowPinning.updatePinnedRows();
            console.log(`Pinning took ${performance.now() - timeStart}ms`)
            this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(flattenedRows);
            // Paginate the flattened rows
            timeStart = performance.now();
            this.datagrid.cache.paginatedRowsCache = this.paginateGridRows(flattenedRows);
            console.log(`Pagination took ${performance.now() - timeStart}ms`)
            return
        }


        timeStart = performance.now();
        // transform data into rows
        this.datagrid.cache.processedRowsCache = this.transformOriginalRowsIntoGridBasicRows(data);
        console.log(`Transformation took ${performance.now() - timeStart}ms`)
        console.log(this.datagrid.cache.processedRowsCache)
        this.datagrid.pagination.pageCount = this.datagrid.pagination.getPageCount(data);

        // paginate 
        timeStart = performance.now();
        this.datagrid.cache.paginatedRowsCache = this.paginateGridRows(this.datagrid.cache.processedRowsCache);
        console.log(`Pagination took ${performance.now() - timeStart}ms`)

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