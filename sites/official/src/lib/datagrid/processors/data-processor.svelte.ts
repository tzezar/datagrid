import { SvelteSet } from "svelte/reactivity";
import type { DatagridInstance } from "../index.svelte";
import type { Data } from "../types";
import { sort } from 'fast-sort';
import type { Accessor } from "./column-processor.svelte";

export interface Row {
    index: number;
    subRows: Row[];
    groupId: string | null;
    parentId: string | null;
    original: Data | null;
    depth: number;
    isExpanded?: boolean;
}

export interface GroupingState {
    groupBy: string[];
}

export interface DataProcessorInstance {
    process(): Row[];
    getVisibleRows(page: number, pageSize: number): Row[];
    toggleGroupExpansion(groupId: string): void;
    getVisibleRowCount: () => number;
}

export class DataProcessor implements DataProcessorInstance {
    private grid: DatagridInstance;
    private allRows: Row[] = [];
    private rowsMap: Map<string, Row> = new Map();

    constructor(grid: DatagridInstance) {
        this.grid = grid;
        this.grid.grouping.state.expandedRows = new SvelteSet([]);
        // this.initialize();
    }


    process(): Row[] {
        console.log('data processing');
        this.grid.grouping.state._groupedDataCache = null;
        this.rowsMap.clear();

        // Apply filters first
        let processedData = this.grid.original.data.filter(item =>
            this.grid.filtering.isRowMatching(item)
        );

        if (this.grid.grouping.state.groupBy.length > 0) {
            this.allRows = this.createGroupedRows();
        } else {
            if (this.grid.sorting.sortBy.length > 0) {
                processedData = this.sortData(processedData);
            }
            this.allRows = processedData.map((item, i) => ({
                index: i,
                subRows: [],
                groupId: null,
                parentId: null,
                original: item,
                depth: 0,
            }));
        }

        const visibleRows = this.getVisibleRows(this.grid.pagination.page, this.grid.pagination.pageSize);
        this.grid.rows = visibleRows;
        return visibleRows;
    }

    private getSortValue(row: any, accessor: Accessor) {
        const value = accessor(row)
        // Handle null/undefined values to ensure consistent sorting
        return value === null || value === undefined ? '' : value;
    }

    private sortData(data: Data[]): Data[] {
        if (this.grid.sorting.sortBy.length === 0) return data;

        const sortInstructions = this.grid.sorting.sortBy.map(({ columnId, direction }) => {
            const accessor = this.grid.columnsProcessor.getAccessor(columnId);
            return { [direction]: (item: Data) => this.getSortValue(item, accessor) }
        });

        return sort(data).by(sortInstructions as any);
    }

    private sortGroups(groups: Map<string, any>): [string, any][] {
        const entries = Array.from(groups.entries());

        if (this.grid.sorting.sortBy.length === 0) return entries;

        return sort(entries).by(
            //@ts-expect-error TS7031
            this.grid.sorting.sortBy.map(({ columnId, direction }) => {
                const accessor = this.grid.columnsProcessor.getAccessor(columnId);
                return {
                    //@ts-expect-error TS7031
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    [direction]: ([_, group]) => {
                        // If the sort column matches the group's key, use the group value
                        if (group.key === accessor) {
                            return this.getSortValue({ [columnId]: group.value }, accessor);
                        }
                        // Otherwise, use the first item's value or a default
                        const firstItem = group.items[0];
                        return firstItem ? this.getSortValue(firstItem, accessor) : '';
                    }
                }
            })
        );
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
            // Only process items that match the filters
            if (!this.grid.filtering.isRowMatching(item)) {
                return;
            }

            let currentLevel = groups;
            let groupPath = '';

            groupBy.forEach((columnId, depth) => {
                // * there is room for improvement here
                // accessing value by row[columnId] is 50% faster
                const accessor = this.grid.columnsProcessor.getAccessor(columnId);
                const groupValue = accessor(item);
                groupPath = groupPath ? `${groupPath}/${groupValue}` : groupValue;

                if (!currentLevel.has(groupValue)) {
                    currentLevel.set(groupValue, {
                        items: [],
                        subgroups: new Map(),
                        groupPath,
                        value: groupValue,
                        key: columnId,
                        depth
                    });
                }

                const group = currentLevel.get(groupValue);
                if (depth === groupBy.length - 1) {
                    group.items.push(item);
                }
                currentLevel = group.subgroups;
            });
        });

        // Second pass: sort groups and their contents
        this.applyGroupSorting(groups, 0);

        return groups;
    }

    private applyGroupSorting(groups: Map<string, any>, depth: number) {
        // Sort the items within each group
        groups.forEach(group => {
            if (group.items.length > 0) {
                group.items = this.sortData(group.items);
            }

            // Recursively sort subgroups
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
        this.processGroups(this.getGroupedData(), rows);
        return rows;
    }

    private processGroups(groups: Map<string, any>, rows: Row[], depth = 0, parentId: string | null = null) {
        // Get sorted groups
        const sortedGroups = Array.from(groups.entries());

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sortedGroups.forEach(([_, group]) => {
            const groupRow: Row = {
                index: rows.length,
                subRows: [],
                groupId: group.groupPath,
                parentId,
                original: null,
                depth,
                isExpanded: this.grid.grouping.state.expandedRows.has(group.groupPath)
            };

            rows.push(groupRow);
            this.rowsMap.set(group.groupPath, groupRow);

            if (this.grid.grouping.state.expandedRows.has(group.groupPath)) {
                // Process nested groups
                this.processGroups(group.subgroups, rows, depth + 1, group.groupPath);

                // Add sorted items
                const sortedItems = this.sortData(group.items);
                sortedItems.forEach((item: Data) => {
                    rows.push({
                        index: rows.length,
                        subRows: [],
                        groupId: null,
                        parentId: group.groupPath,
                        original: item,
                        depth: depth + 1
                    });
                });
            }
        });
    }

    getVisibleRows(page: number, pageSize: number): Row[] {
        const visibleRows = this.allRows.filter(row => this.isRowVisible(row));
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return visibleRows.slice(startIndex, endIndex);
    }

    getVisibleRowCount(): number {
        return this.allRows.filter(row => this.isRowVisible(row)).length;
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

        this.allRows = this.createGroupedRows();
    }
}