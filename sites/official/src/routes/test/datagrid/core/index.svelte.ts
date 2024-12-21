import { sort } from "fast-sort";
import { isGroupColumn } from "./column-guards";
import { Grouping } from "./features/grouping.svelte";
import { Pagination } from "./features/pagination.svelte";
import { DataSorting } from "./features/column-sorting.svelte";
import type { AccessorColumn, AnyColumn, ComputedColumn, GroupColumn } from "./helpers/column-creators";
import type { GridBasicRow, GridGroupRow, GridRow } from "./types";
import { findColumnById, getSearchableColumns, isColumnSortable, isGridGroupRow } from "./utils.svelte";
import { Filtering } from "./features/column-filtering.svelte";
import { GlobalSearch } from "./features/global-search.svelte";
import { ColumnSizing } from "./features/column-sizing.svelte";
import { ColumnVisibility } from "./features/column-visibility.svelte";
import { RowExpanding } from "./features/row-expanding.svelte";
import { RowSelection } from "./features/row-selection.svelte";
import { ColumnPinning } from "./features/column-pinning.svelte";
import { ColumnFaceting } from "./features/column-faceting.svelte";
import { RowPinning } from "./features/row-pinning.svelte";
import { ColumnOrdering } from "./features/column-ordering.svelte";
import { ColumnGrouping } from "./features/column-grouping.svelte";
import { Fullscreen } from "./features/fullscreen.svelte";

export class Datagrid<TOriginalRow> {
    original = $state.raw({
        columns: [] as AnyColumn<TOriginalRow>[],
        data: [] as TOriginalRow[]
    });
    columns: AnyColumn<TOriginalRow>[] = $state([]);


    pagination = new Pagination(this);
    sorting = new DataSorting();
    grouping = new Grouping();
    filtering = new Filtering();
    globalSearch = new GlobalSearch();

    columnSizing = new ColumnSizing(this);
    columnVisibility = new ColumnVisibility(this);
    columnPinning = new ColumnPinning(this);
    columnFaceting = new ColumnFaceting(this);
    columnOrdering = new ColumnOrdering(this);
    columnGrouping = new ColumnGrouping(this);

    rowExpanding = new RowExpanding(this);
    rowSelection = new RowSelection();
    rowPinning = new RowPinning(this);

    fullscreen = new Fullscreen();

    // Caches
    filteredOriginalRowsCache: TOriginalRow[] = $state.raw([]);
    processedRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);
    paginatedRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);
    groupedRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);
    flattenedRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);

    constructor(columns: AnyColumn<TOriginalRow>[], data: TOriginalRow[]) {
        this.original = {
            columns,
            data
        };

        this.columns = this.transformColumns(columns);
        this.executeFullDataTransformation();

        // Recompute faceted values
        // Moved out of executeFullDataTransformation to avoid unnecessary recomputation
        this.recomputeFacetedValues(this.filteredOriginalRowsCache, this.columns);

        this.globalSearch.fuseInstance = this.globalSearch.initializeFuseInstance(this.original.data, this.columns.map(col => col.columnId as string))
    }


    recomputeFacetedValues(rows: TOriginalRow[], columns: AnyColumn<TOriginalRow>[]) {
        this.columnFaceting.calculateFacets(rows, columns);
    }

    refreshColumnPinningOffsets() {
        const newColumns: AnyColumn<TOriginalRow>[] = [];
        for (let i = 0; i < this.columns.length; i++) {
            const col = this.columns[i];
            if (col.state.pinning.position === 'none') {
                col.state.pinning.offset = 0;
            } else {
                col.state.pinning.offset = this.columnPinning.getOffset(col.columnId, col.state.pinning.position);
            }

            newColumns.push(col);
        }
        this.columns = newColumns;
    };

    getSelectedRows(): TOriginalRow[] {
        return Array.from(this.rowSelection.selectedRowIds)
            .map(id => this.original.data.find(row => row.id === id))
            .filter((row): row is TOriginalRow => row !== undefined); // Type guard for filtering
    }



    getPageCount(data: Array<any>): number {
        return Math.ceil(data.length / this.pagination.pageSize);
    }

    executeFullDataTransformation() {
        // Global search first
        let totalTime = performance.now();

        let timeStart = performance.now();
        let filteredOriginalRows = this.filterOriginalRowsWithGlobalSearch(this.original.data);
        console.log('Filtering took', performance.now() - timeStart);
        // Filter original data

        timeStart = performance.now();
        filteredOriginalRows = this.filterOriginalRowsWithColumnFilters(filteredOriginalRows);
        console.log('Filtering took', performance.now() - timeStart);
        timeStart = performance.now();
        this.filteredOriginalRowsCache = filteredOriginalRows;
        console.log('Filtering took', performance.now() - timeStart);
        // Recompute faceted values

        // Sort original data
        timeStart = performance.now();
        const sortedOriginalRows = this.sortOriginalRows(filteredOriginalRows);
        console.log('Sorting took', performance.now() - timeStart);
        // Create hierarchical groups
        timeStart = performance.now();
        const groupedRows = this.createHierarchicalData(sortedOriginalRows);
        console.log('Grouping took', performance.now() - timeStart);

        timeStart = performance.now();
        this.groupedRowsCache = groupedRows;
        console.log('Grouping took', performance.now() - timeStart);
        // Flatten the hierarchical data, respecting expanded states
        timeStart = performance.now();
        const flattenedRows = this.flattenExpandedHierarchicalData(groupedRows);
        console.log('Flattening took', performance.now() - timeStart);

        timeStart = performance.now();
        this.flattenedRowsCache = this.getAllFlattenedRows(this.groupedRowsCache);
        console.log('Flattening took', performance.now() - timeStart);
        timeStart = performance.now();
        this.processedRowsCache = flattenedRows
        console.log('Flattening took', performance.now() - timeStart);

        // Some performance hit
        timeStart = performance.now();
        this.rowPinning.updatePinnedRows();
        console.log('Pinning took', performance.now() - timeStart);

        timeStart = performance.now();
        this.pagination.pageCount = this.getPageCount(flattenedRows);
        console.log('Pagination took', performance.now() - timeStart);
        
        // Paginate the flattened rows
        timeStart = performance.now();
        this.paginatedRowsCache = this.paginateFlattenedGridRows(flattenedRows);
        console.log('Setting paginatedRowsCache took', performance.now() - timeStart);
        console.log('Total time', performance.now() - totalTime);
    }




    getAllFlattenedRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);
            if (isGridGroupRow(row)) {
                flattened.push(...this.getAllFlattenedRows(row.children));
            }
        }
        return flattened;
    }

    filterOriginalRowsWithGlobalSearch(data: TOriginalRow[]): TOriginalRow[] {
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

    filterOriginalRowsWithColumnFilters(data: TOriginalRow[]): TOriginalRow[] {
        // Filter out inactive conditions (empty value)
        const activeConditions = this.filtering.conditions.filter(condition => condition.value !== '');

        if (activeConditions.length === 0) return data;

        const isRowMatching = (row: TOriginalRow): boolean => {
            return activeConditions.every(condition =>
                this.filtering.evaluateCondition(condition.getValueFn(row), condition)
            );
        };

        return data.filter(isRowMatching);
    }



    paginateFlattenedGridRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const startIndex = (this.pagination.page - 1) * this.pagination.pageSize;
        const endIndex = startIndex + this.pagination.pageSize;
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

    flattenExpandedHierarchicalData(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);

            if (isGridGroupRow(row)) {
                // Only flatten children if the group row is expanded
                if (this.grouping.expandedGroups.has(row.groupId)) {
                    flattened.push(...this.flattenExpandedHierarchicalData(row.children));
                }
            }
        }

        return flattened;
    }


    createHierarchicalData(data: TOriginalRow[]): GridRow<TOriginalRow>[] {
        const groupByColumns = this.grouping.groupByColumns;

        if (groupByColumns.length < 1) return this.transformOriginalRowsIntoGridBasicRows(data);

        const columnAccessors = groupByColumns.map(col => {
            let column = findColumnById(this.columns, col);
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
                const column = findColumnById(this.original.columns, groupByColumns[columnIndex]) as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
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
        if (this.sorting.sortConfigs.length === 0) return data;

        type SortInstruction = {
            asc?: (row: TOriginalRow) => any;
            desc?: (row: TOriginalRow) => any;
        };
        const sortInstructions: SortInstruction[] = [];

        for (const sortConfig of this.sorting.sortConfigs) {
            let column = findColumnById(this.original.columns, sortConfig.id);
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




    assignParentColumnIds(columns: AnyColumn<TOriginalRow>[], parentColumnId: string | null = null) {
        columns.forEach(column => {
            if (isGroupColumn(column)) {
                const groupColumn = column as GroupColumn<TOriginalRow>;
                this.assignParentColumnIds(groupColumn.columns, groupColumn.columnId);
            }
            column.parentColumnId = parentColumnId;
        })
    }


    transformColumns = (columns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] => {
        this.assignParentColumnIds(columns);

        const groupByColumns = this.grouping.groupByColumns;

        // Completely rework the column transformation
        const groupedColumns: AnyColumn<TOriginalRow>[] = [];
        const nonGroupedColumns: AnyColumn<TOriginalRow>[] = [];

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
        if (this.isGroupRowExpanded(row)) {
            this.grouping.expandedGroups.delete(row.groupId);
        } else {
            this.grouping.expandedGroups.add(row.groupId);
        }
        this.executeFullDataTransformation();
    }

    isGroupRowExpanded(row: GridGroupRow<TOriginalRow>) {
        return this.grouping.expandedGroups.has(row.groupId);
    }


    refresh(operation: () => void): void {
        const timeStart = performance.now();
        operation();
        this.executeFullDataTransformation();
        console.log(`Operation took ${performance.now() - timeStart}ms`)
    }

}