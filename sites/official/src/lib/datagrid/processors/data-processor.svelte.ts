import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";
import type { Data } from "../types";
import { sort } from 'fast-sort';
import type { SortBy } from "../features/sorting-manager.svelte";
import type { GroupData } from "../features/grouping-manager.svelte";

export interface Row {
    index: string;
    subRows: Row[];
    groupId: string | null;
    parentId: string | null;
    original: Data
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
    process(): void,
    toggleGroupExpansion(groupId: string): void;
    rowsMap: Map<string, Row>;
}


export class DataProcessor implements DataProcessorInstance {
    private grid: DatagridInstance;
    processedRowsCache: Row[] = [];
    rowsMap: Map<string, Row> = new Map();
    private compiledSortConfigs: SortBy = [];

    constructor(grid: DatagridInstance) {
        this.grid = grid;
        this.grid.grouping.state.expandedRows = new SvelteSet([]);
    }

    process(): void {
        this.grid.grouping.state._groupedDataCache = null;
        this.rowsMap.clear();
        
        let processedData: Data[] = [...this.grid.original.data];
        if (this.grid.filtering.search.value) processedData = this.applyGlobalFilter(processedData);
        if (this.grid.filtering.conditions) processedData = processedData.filter(item => this.grid.filtering.isRowMatching(item));
        if (this.grid.grouping.hasGroups()) {
            this.processedRowsCache = this.applyGrouping()
        } else {
            if (this.grid.sorting.sortBy.length > 0) processedData = this.sortData(processedData);
            this.processedRowsCache = this.createRows(processedData);
        }
        this.grid.rows = this.grid.getVisibleRows(this.grid.pagination.page, this.grid.pagination.pageSize);
    }

    // Data
    createRows(data: Data[]): Row[] {
        return data.map((item, i) => ({
            index: i.toString(),
            subRows: [],
            groupId: null,
            parentId: null,
            original: item,
            depth: 0,
            aggregates: {}
        }));
    }
    applyGlobalFilter(data: Data[]) {
        const { search } = this.grid.filtering;
        if (!search.value) return data;

        const searchValue = search.value.toLowerCase();
        const searchableColumns = this.grid.columnManager.getSearchableColumns();

        // Fuzzy search
        if (search.fuzzy) {
            const fuseInstance = this.grid.filtering.fuse
            if (!fuseInstance) throw new Error('fuse is null')
            return fuseInstance.search(search.value).map(result => result.item);
        }

        // Cache the column accessor functions for searchable columns
        const accessorCache = new Map<string, (item: Data) => any>();
        searchableColumns.forEach(col => {
            accessorCache.set(col.columnId as string, col.accessor);
        });

        // Column-level search
        return data.filter(item =>
            searchableColumns.some(col => {
                const accessor = accessorCache.get(col.columnId as string);
                if (!accessor) return false;

                const value = accessor(item);
                return String(value).toLowerCase().includes(searchValue);
            })
        );
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

    // Grouping
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
                        allItems: []
                    });
                }

                const group = currentLevel.get(groupValue);
                group.allItems.push(item);

                if (depth === groupBy.length - 1) {
                    group.items.push(item);
                }

                currentLevel = group.subgroups;
            });
        });

        // Second pass: calculate aggregates and sort
        this.applyGroupSorting(groups, 0);

        return groups;
    }
    private applyGrouping(): Row[] {
        const rows: Row[] = [];
        this.createGroups(this.getGroupedData(), rows);
        return rows;
    }
    private getGroupedData(): Map<string, any> {
        if (!this.grid.grouping.state._groupedDataCache) {
            this.grid.grouping.state._groupedDataCache = this.groupData(this.grid.original.data);
        }
        return this.grid.grouping.state._groupedDataCache;
    }
    private sortGroups(groups: Map<string, GroupData>): [string, GroupData][] {
        const entries = Array.from(groups.entries());

        if (this.grid.sorting.sortBy.length === 0) return entries;
        const sortConfigs = this.setupSortingConfig(this.grid.sorting.sortBy);

        const sortInstructions = sortConfigs.map(({ columnId, direction, accessor }) => {
            return {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    private createGroups(groups: Map<string, any>, rows: Row[], parentIndex: string = '', depth = 0, parentId: string | null = null) {
        const sortedGroups = Array.from(groups.entries());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sortedGroups.forEach(([_, group], groupIndex) => {
            // Create hierarchical index
            const currentIndex = parentIndex ? `${parentIndex}.${groupIndex}` : `${groupIndex}`;

            const groupRow: Row = {
                index: currentIndex,
                subRows: [],
                groupId: group.groupPath,
                parentId,
                original: {},
                depth,
                isExpanded: this.grid.grouping.state.expandedRows.has(group.groupPath),
                aggregates: group.aggregates || {},
            };

            rows.push(groupRow);
            this.rowsMap.set(group.groupPath, groupRow);

            if (this.grid.grouping.state.expandedRows.has(group.groupPath)) {
                // Process nested groups
                this.createGroups(group.subgroups, rows, currentIndex, depth + 1, group.groupPath);

                // Add leaf items
                if (group.items.length > 0) {
                    const sortedItems = this.sortData(group.items);
                    sortedItems.forEach((item: Data, itemIndex: number) => {
                        rows.push({
                            index: `${currentIndex}.${itemIndex}`,
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
    private applyGroupSorting(groups: Map<string, any>, depth: number) {
        // Calculate aggregates and sort items within each group
        groups.forEach(group => {
            // Calculate aggregates for the current group

            // ! here is bottleneck when grouping by eg id (100k groups)
            group.aggregates = this.grid.grouping.calculateGroupAggregates(group);

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
    toggleGroupExpansion(groupId: string) {
        if (this.grid.grouping.state.expandedRows.has(groupId)) {
            this.grid.grouping.state.expandedRows.delete(groupId);
        } else {
            this.grid.grouping.state.expandedRows.add(groupId);
        }

        this.processedRowsCache = this.applyGrouping();
    }

    // Helpers

    private setupSortingConfig(sortingDirections: SortBy): SortBy {
        return sortingDirections.map(config => ({
            columnId: config.columnId,
            direction: config.direction,
            accessor: this.grid.columnManager.getAccessor(config.columnId)
        }));
    }
}