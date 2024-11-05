import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";
import type { Data } from "../types";
import { sort } from 'fast-sort';
import type { SortBy } from "../features/sorting-manager.svelte";
import type { GroupData } from "../features/grouping-manager.svelte";

export interface Row {
    index: number;
    subRows: Row[];
    groupId: string | null;
    parentId: string | null;
    original: Data | null;
    depth: number;
    isExpanded?: boolean;
    aggregates: {
        [columnId: string]: {
            sum?: number;
            count?: number;
            min?: number;
            max?: number;
            mean?: number;
        };
    };
}

export interface GroupingState {
    groupBy: string[];
}

export interface DataProcessorInstance {
    processedRowsCache: Row[]
    process(): Row[];
    getVisibleRows(page: number, pageSize: number): Row[];
    toggleGroupExpansion(groupId: string): void;
    getVisibleRowCount: () => number;
}


export class DataProcessor implements DataProcessorInstance {
    private grid: DatagridInstance;
    processedRowsCache: Row[] = [];
    private rowsMap: Map<string, Row> = new Map();
    private compiledSortConfigs: SortBy = [];

    constructor(grid: DatagridInstance) {
        this.grid = grid;
        this.grid.grouping.state.expandedRows = new SvelteSet([]);
    }


    createRows(data: Data[]): Row[] {
        return data.map((item, i) => ({
            index: i,
            subRows: [],
            groupId: null,
            parentId: null,
            original: item,
            depth: 0,
            aggregates: {}
        }));
    }

    process(): Row[] {
        console.log('data processing');
        this.grid.grouping.state._groupedDataCache = null;
        this.rowsMap.clear();

        // Apply global search first
        let processedData: Data[] = [...this.grid.original.data];

        if (this.grid.filtering.search.value) {
            processedData = this.applyGlobalFilter(processedData);
        }

        // Apply filters first
        processedData = processedData.filter(item =>
            this.grid.filtering.isRowMatching(item)
        );

        if (this.grid.grouping.isGrouped()) {
            this.processedRowsCache = this.createGroupedRows();
        } else {
            if (this.grid.sorting.sortBy.length > 0) processedData = this.sortData(processedData);
            this.processedRowsCache = this.createRows(processedData);
        }

        const visibleRows = this.getVisibleRows(this.grid.pagination.page, this.grid.pagination.pageSize);
        this.grid.rows = visibleRows;
        return visibleRows;
    }

    applyGlobalFilter(data: Data[]) {
        const { search } = this.grid.filtering;
        if (!search.value) return data;

        const searchValue = search.value.toLowerCase();
        const searchableColumns = this.grid.columnManager.getSearchableColumns();

        // Fuzzy search
        if (search.fuzzy) {
            const fuse = this.grid.filtering.fuse
            if (!fuse) throw new Error('fuse is null')
            return fuse.search(search.value).map(result => result.item);
        }

        // Cache the column accessor functions for searchable columns
        const accessorCache = new Map<string, (item: Data) => any>();
        searchableColumns.forEach(col => {
            accessorCache.set(col.accessorKey as string, col.accessor);
        });

        // Column-level search
        return data.filter(item =>
            searchableColumns.some(col => {
                const accessor = accessorCache.get(col.accessorKey as string);
                if (!accessor) return false;

                const value = accessor(item);
                return String(value).toLowerCase().includes(searchValue);
            })
        );
    }

    private setupSortingConfig(sortingDirections: SortBy): SortBy {
        return sortingDirections.map(config => ({
            columnId: config.columnId,
            direction: config.direction,
            accessor: this.grid.columnsProcessor.getAccessor(config.columnId)
        }));
    }

    private sortData(data: Data[]): Data[] {
        if (this.grid.sorting.sortBy.length === 0) return data;
        // not sure why, but when precompiled, sorting is 70% faster
        const sortConfigs = this.setupSortingConfig(this.grid.sorting.sortBy);

        const sortInstructions = sortConfigs.map(({ direction, accessor }) => {
            return { [direction]: (item: Data) => accessor(item) }
        });

        return sort(data).by(sortInstructions as any);
    }

    private sortGroups(groups: Map<string, GroupData>): [string, GroupData][] {
        const entries = Array.from(groups.entries());

        if (this.grid.sorting.sortBy.length === 0) return entries;
        const sortConfigs = this.setupSortingConfig(this.grid.sorting.sortBy);

        const sortInstructions = sortConfigs.map(({ columnId, direction, accessor }) => {
            return {
                [direction]: ([_, group]: [string, GroupData]) => {
                    // If sorting by the grouped column, use the group's own value
                    if (columnId === group.key) {
                        return group.value;
                    }
                    // Otherwise sort by the first item's value
                    if (group.items.length > 0) {
                        return accessor(group.items[0]);
                    }
                    return '';
                }
            };
        });

        return sort(entries).by(sortInstructions as any);
    }

    private getGroupedData(): Map<string, any> {
        if (!this.grid.grouping.state._groupedDataCache) {
            this.grid.grouping.state._groupedDataCache = this.groupData(this.grid.original.data);
        }
        return this.grid.grouping.state._groupedDataCache;
    }

    private groupData(data: Data[]): Map<string, any> {
        const groups = new Map();
        const groupBy = this.grid.grouping.state.groupBy;

        // First pass: group the filtered data
        data.forEach((item) => {
            if (!this.grid.filtering.isRowMatching(item)) {
                return;
            }

            let currentLevel = groups;
            let groupPath = '';
            let currentItems: Data[] = [];

            groupBy.forEach(({ columnId, accessor }, depth) => {
                const groupValue = accessor(item);
                groupPath = groupPath ? `${groupPath}/${groupValue}` : groupValue;

                if (!currentLevel.has(groupValue)) {
                    currentLevel.set(groupValue, {
                        items: [],
                        subgroups: new Map(),
                        groupPath,
                        value: groupValue,
                        key: columnId,
                        depth,
                        allItems: [] // Store all nested items for aggregate calculations
                    });
                }

                const group = currentLevel.get(groupValue);
                group.allItems.push(item); // Add item to all levels for aggregation

                if (depth === groupBy.length - 1) {
                    group.items.push(item);
                }
                
                currentLevel = group.subgroups;
                currentItems = group.items;
            });
        });

        // Second pass: calculate aggregates and sort
        this.applyGroupSorting(groups, 0);

        return groups;
    }

    private applyGroupSorting(groups: Map<string, any>, depth: number) {
        // Calculate aggregates and sort items within each group
        groups.forEach(group => {
            // Calculate aggregates for the current group
            group.aggregates = this.calculateGroupAggregates(group);

            if (group.items.length > 0) {
                group.items = this.sortData(group.items);
            }

            // Recursively handle subgroups
            if (group.subgroups.size > 0) {
                this.applyGroupSorting(group.subgroups, depth + 1);
            }
        });

        // Sort the groups themselves
        const sortedEntries = this.sortGroups(groups);
        groups.clear();
        sortedEntries.forEach(([key, value]) => groups.set(key, value));
    }

    private createGroupedRows(): Row[] {
        const rows: Row[] = [];
        this.createGroups(this.getGroupedData(), rows);
        return rows;
    }

    private calculateAggregates(items: Data[], column: any): any {
        if (!items.length) return null;

        const accessor = this.grid.columnsProcessor.getAccessor(column.accessorKey);
        const values = items.map(item => accessor(item)).filter(val => val !== null && val !== undefined);

        if (!values.length) return null;

        const aggregates: any = {};

        if (column.aggregationFn === 'sum' || column.aggregationFn === 'all') {
            aggregates.sum = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
        }

        if (column.aggregationFn === 'count' || column.aggregationFn === 'all') {
            aggregates.count = values.length;
        }

        if (column.aggregationFn === 'min' || column.aggregationFn === 'all') {
            aggregates.min = Math.min(...values);
        }

        if (column.aggregationFn === 'max' || column.aggregationFn === 'all') {
            aggregates.max = Math.max(...values);
        }

        if (column.aggregationFn === 'mean' || column.aggregationFn === 'all') {
            aggregates.mean = aggregates.sum / aggregates.count;
        }

        return aggregates;
    }

    private calculateGroupAggregates(group: any): any {
        const aggregates: any = {};
        
        // Get all columns that have aggregation functions
        const columnsWithAggregation = this.grid.columns.filter(
            col => col.aggregationFn
        );

        // Calculate aggregates for each column using allItems for complete aggregation
        columnsWithAggregation.forEach(column => {
            aggregates[column.accessorKey] = this.calculateAggregates(group.allItems, column);
        });

        return aggregates;
    }

    private createGroups(groups: Map<string, any>, rows: Row[], depth = 0, parentId: string | null = null) {
        const sortedGroups = Array.from(groups.entries());

        sortedGroups.forEach(([_, group]) => {
            const groupRow: Row = {
                index: rows.length,
                subRows: [],
                groupId: group.groupPath,
                parentId,
                original: null,
                depth,
                isExpanded: this.grid.grouping.state.expandedRows.has(group.groupPath),
                aggregates: group.aggregates || {},
            };

            rows.push(groupRow);
            this.rowsMap.set(group.groupPath, groupRow);

            if (this.grid.grouping.state.expandedRows.has(group.groupPath)) {
                // Process nested groups
                this.createGroups(group.subgroups, rows, depth + 1, group.groupPath);

                // Add leaf items
                if (group.items.length > 0) {
                    const sortedItems = this.sortData(group.items);
                    sortedItems.forEach((item: Data) => {
                        rows.push({
                            index: rows.length,
                            subRows: [],
                            groupId: null,
                            parentId: group.groupPath,
                            original: item,
                            depth: depth + 1,
                            aggregates: {},
                        });
                    });
                }
            }
        });
    }

    getVisibleRows(page: number, pageSize: number): Row[] {
        const visibleRows = this.processedRowsCache.filter(row => this.isRowVisible(row));
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return visibleRows.slice(startIndex, endIndex);
    }

    getVisibleRowCount(): number {
        return this.processedRowsCache.filter(row => this.isRowVisible(row)).length;
    }

    private isRowVisible(row: Row): boolean {
        if (!row.parentId) return true;

        let currentParentId: string | null = row.parentId;
        while (currentParentId) {
            if (!this.grid.grouping.state.expandedRows.has(currentParentId)) {
                return false;
            }
            const parentRow = this.rowsMap.get(currentParentId);
            currentParentId = parentRow?.parentId ?? null;
        }

        return true;
    }

    toggleGroupExpansion(groupId: string) {
        if (this.grid.grouping.state.expandedRows.has(groupId)) {
            this.grid.grouping.state.expandedRows.delete(groupId);
        } else {
            this.grid.grouping.state.expandedRows.add(groupId);
        }

        this.processedRowsCache = this.createGroupedRows();
    }
}