import Fuse from "fuse.js";
import type { AccessorFn, ColumnDef, SearchableColumn } from "./helpers/column-creation";
import { SvelteSet } from "svelte/reactivity";

export type Accessor<TData> = (row: TData) => any
export type ColumnId = string;
export type Row<TData> = {
    index: string;
    // parentId: string | null;
    original: TData;

    // ? is this needed?
    depth: number;
    // ? is this needed?
    isExpanded?: boolean;

    columnId: ColumnId;

}

export type GroupRow<TData> = {
    index: string,
    children: (Row<TData> | GroupRow<TData>)[];
    groupId: string,
    depth: number;
    parentId: string | null;
    isExpanded: boolean;
    aggregates: {
        [columnId: string]: {
            sum?: number;
            count?: number;
            min?: number;
            max?: number;
            mean?: number;
        };
    };
    columnId: ColumnId;
}

export interface FlatGroup<TData> {
    originalRows: TData[];
    subgroups: Map<string, any>;
    groupPath: string;
    value: any;
    columnId: ColumnId;
    depth: number;
    aggregates: any;
}

// Pagination
interface IPaginationState {
    page: number;
    pageSize: number;
    pageSizes: number[];
    pageCount: number;
    rowsCount: number;
    filteredRowsCount: number;
}

interface IPaginationFeature {

    state: IPaginationState;

    canGoToPrevPage(): boolean;
    canGoToNextPage(): boolean;

    goToPage(page: number): void;
    goToNextPage(): void;
    goToPrevPage(): void;
    goToFirstPage(): void;
    goToLastPage(): void;
    goToClosestPage(): void;

    setPage(page: number): void;
    setPageSize(pageSize: number): void;
    setPageCount(pageCount: number): void;
    setRowsCount(rowsCount: number): void;
    setPageSizes(pageSizes: number[]): void;

}

// Sorting
type SortDirection = 'ascending' | 'descending';
type SortingMode = 'singleColumnSort' | 'multiColumnSort' | 'noSorting';

type ColumnSortConfiguration<TData> = {
    columnId: ColumnId;
    direction: SortDirection;
    accessor: Accessor<TData>;
}

type SortingCriteria<TData> = ColumnSortConfiguration<TData>[]

interface ISortingFeatureState<TData> {
    sortingCriteria: SortingCriteria<TData>;
    sortingStrategy: SortingMode;
}

interface ISortingFeature<TData> {

    state: ISortingFeatureState<TData>;

    setSortingStrategy(sortingStrategy: SortingMode): void;
    addSortingCriteria(columnSortConfiguration: ColumnSortConfiguration<TData>): void;
    removeSortingCriteria(columnId: ColumnId): void;
    clearSortingCriteria(): void;
    toggleSortingCriteria(columnId: ColumnId): void;

}

// Filtering

export const universalComparisonOperators: ComparisonOperator[] = [
    'equals',
    'notEquals',
    'contains',
    'notContains',
    'startsWith',
    'endsWith',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    'between',
    'inList',
    'notInList',
    'empty',
    'notEmpty'
];

export const numericComparisonOperators: ComparisonOperator[] = [
    'equals',
    'notEquals',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    'between',
    'empty',
    'notEmpty'
]

export const textComparisonOperators: ComparisonOperator[] = [
    'equals',
    'notEquals',
    'contains',
    'notContains',
    'startsWith',
    'endsWith',
    'empty',
    'notEmpty'
]

export type ComparisonOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'between'
    | 'inList'
    | 'notInList'
    | 'empty'
    | 'notEmpty';

export interface FilterCriteria<TData> {
    columnId: ColumnId;
    accessor: Accessor<TData>
    comparisonOperator: ComparisonOperator;
    comparisonValue: any;
    comparisonUpperBound?: any; // For 'between' operator
}

export interface GlobalSearchConfiguration {
    searchTerm: string;
    fuzzyMatchEnabled: boolean;
    debounceInterval: number;
}


interface IFilteringFeatureState<TData> {
    fuse: Fuse<any> | null;
    filterCriteria: FilterCriteria<TData>[];
    globalSearch: GlobalSearchConfiguration;
}
interface IFilteringFeature<TData> {
    state: IFilteringFeatureState<TData>;

    initializeFuseInstance(items: any[], keys: string[]): Fuse<any>;
    assignFuseInstance(items: any[]): void;

    addFilterCriteria(filterCriteria: FilterCriteria<TData>): void;
    removeFilterCriteria(accessorKey: string): void;
    clearFilterCriteria(): void;
    isRowMatching(row: any): boolean;
    evaluateCondition(cellValue: any, filterCriteria: FilterCriteria<TData>): boolean;

}

// Grouping

type GroupingCriteria = {
    columnId: ColumnId
    accessor: (row: any) => any
}

interface IGroupingFeatureState<TData> {
    groupingCriteria: GroupingCriteria[];
    expandedRows: Set<string>;
}

interface IGroupingFeature<TData> {
    state: IGroupingFeatureState<TData>;

    hasGroups(): boolean;
}

interface IDatagrid<TData> {
    rows: Row<TData>[];

    pagination: IPaginationFeature;
    sorting: ISortingFeature<TData>;
    filtering: IFilteringFeature<TData>;
}


type Column<TData> = ColumnDef<TData> & {
    columnId: ColumnId
}

export class Datagrid<TData> implements IDatagrid<TData> {
    constructor() {

    }


    original = {
        data: [],
        columns: [] as ColumnDef<TData>[]
    }


    _cache = {
        _sortedDataCache: [],
        _filteredDataCache: [],
        _groupedDataCache: [],
        // TODO
        _rowsCache: new Map(),

        _flatGroupRowsCache: new Map(),
    }

    rows: Row<TData>[] = []
    columns: Column<TData>[] = []

    // Data
    pagination: IPaginationFeature = {
        state: {
            page: (1),
            pageSize: (10),
            pageSizes: ([10, 20, 50, 100]),
            pageCount: (0),
            rowsCount: (0),
            filteredRowsCount: (0)
        },
        canGoToPrevPage: () => false,
        canGoToNextPage: () => false,
        goToPage: () => { },
        goToNextPage: () => { },
        goToPrevPage: () => { },
        goToFirstPage: () => { },
        goToLastPage: () => { },
        goToClosestPage: () => { },

        setPage: () => { },
        setPageSize: () => { },
        setPageCount: () => { },
        setRowsCount: () => { },
        setPageSizes: () => { },
    }
    sorting: ISortingFeature<TData> = {
        state: {
            sortingCriteria: ([]),
            sortingStrategy: ('noSorting')
        },
        setSortingStrategy: () => { },
        addSortingCriteria: () => { },
        removeSortingCriteria: () => { },
        clearSortingCriteria: () => { },
        toggleSortingCriteria: () => { },
    }
    filtering: IFilteringFeature<TData> = {
        state: {
            fuse: null,
            filterCriteria: ([]),
            globalSearch: {
                searchTerm: '',
                fuzzyMatchEnabled: true,
                debounceInterval: 500
            }
        },
        initializeFuseInstance: () => new Fuse([]),
        assignFuseInstance: () => { },
        addFilterCriteria: () => { },
        removeFilterCriteria: () => { },
        clearFilterCriteria: () => { },
        isRowMatching: (row: TData) => {
            return this.filtering.state.filterCriteria.every(condition =>
                this.filtering.evaluateCondition(condition.accessor(row), condition)
            );
        },
        evaluateCondition(cellValue: any, condition: FilterCriteria<TData>): boolean {
            const value = condition.comparisonValue;
            const valueTo = condition.comparisonUpperBound

            // Handle null/undefined cell values
            if (cellValue === null || cellValue === undefined) {
                return condition.comparisonOperator === 'empty';
            }

            // Convert to string for string operations
            const stringCellValue = String(cellValue).toLowerCase();
            const stringValue = String(value).toLowerCase();

            switch (condition.comparisonOperator) {
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

    }
    grouping: IGroupingFeature<TData> = {
        state: {
            groupingCriteria: ([]),
            expandedRows: new SvelteSet([])
        },
        hasGroups: () => this.grouping.state.groupingCriteria.length > 0
    }

    dataProcessor = {
        convertSourceDataToGridRows: (data: TData[]): Row<TData>[] => {
            const rows: Row<TData>[] = [];
            for (let i = 0; i < data.length; i++) {
                const entry = data[i];
                const row: Row<TData> = {
                    index: String(i),
                    original: entry,
                    depth: 0,
                    isExpanded: false,
                    columnId: ''
                };
                rows.push(row);
            }
            return rows;
        },
        executeFullDataTransormation: () => {
            // Clear grouping cache
            // Clear rows cache

            // Copy original data to prevent mutation
            const originalData = [...this.original.data]
            // Apply global search filter
            let filteredData = this.dataProcessor.applyGlobalSearchFilter(originalData)
            // Apply column search filters
            if (this.filtering.state.filterCriteria) filteredData = this.dataProcessor.applyColumnSearchFilter(filteredData)
            // Update filtered rows counts 
            // TODO
            // If grouping is enabled, apply grouping
            if (this.grouping.hasGroups()) {
                // > Create flat group rows
                let flatGroupRows = this.dataProcessor.createFlatGroupRows(filteredData)
                // > Sort flat group rows
                flatGroupRows = this.dataProcessor.sortFlatGroupRows(flatGroupRows)
                // > Create hierarchical group rows
                this.dataProcessor.createHierarchicalGroupRows(flatGroupRows)

            }

            // Sort data
            // Create rows from data

            // Set visible rows
        },
        applyGlobalSearchFilter: (data: TData[]) => {
            const { searchTerm, fuzzyMatchEnabled } = this.filtering.state.globalSearch
            if (!searchTerm) return data

            const searchValue = searchTerm.toLowerCase()
            const searchableColumns = this.helpers.getSearchableColumns()

            // Fuzzy search if enabled
            if (fuzzyMatchEnabled) {
                const fuseInstance = this.filtering.initializeFuseInstance(data, searchableColumns.map(col => col.columnId as string))
                if (!fuseInstance) throw new Error('fuse is null')
                return fuseInstance.search(searchValue).map(result => result.item)
            }

            // Handle non-fuzzy search
            // Cache the column accessor functions for searchable columns to boost performance
            const accessorCache = new Map<string, AccessorFn<TData>>()
            searchableColumns.forEach(col => {
                accessorCache.set(col.columnId as string, col.accessorFn)
            })

            // Column-level search
            return data.filter(item =>
                searchableColumns.some(col => {
                    const accessor = accessorCache.get(col.columnId as string)
                    if (!accessor) return false
                    const value = accessor(item)
                    return String(value).toLowerCase().includes(searchValue)
                })
            )
        },
        applyColumnSearchFilter: (data: TData[]) => {
            return data.filter(item => this.filtering.isRowMatching(item));
        },


        getFlatGroupRows: (data: TData[]) => {
            if (!this._cache._flatGroupRowsCache) {
                this._cache._flatGroupRowsCache = this.dataProcessor.createFlatGroupRows(data)
            }
            return this._cache._flatGroupRowsCache
        },

        sortFlatGroupRows: (flatGroupRows: Map<string, FlatGroup<TData>>) => {
            return flatGroupRows
        },

        createFlatGroupRows: (data: TData[]): Map<string, FlatGroup<TData>> => {
            // Create a new Map to store the grouped data
            const groups = new Map<string, FlatGroup<TData>>();

            // Get the grouping criteria from the state
            const groupingCriteria = this.grouping.state.groupingCriteria;

            // Iterate through each data item
            data.forEach((item) => {
                // Skip items that don't match the current filtering
                if (!this.filtering.isRowMatching(item)) {
                    return;
                }
                // Start at the top-level groups
                let currentLevel = groups;
                let groupPath = '';

                // Iterate through each grouping criterion
                groupingCriteria.forEach(({ columnId, accessor }, depth) => {
                    // Extract the grouping value for this item and column
                    const groupValue = accessor(item);

                    // Build the group path
                    groupPath = groupPath
                        ? `${groupPath}/${groupValue}`
                        : `${groupValue}`;

                    // Create a new group if it doesn't exist
                    if (!currentLevel.has(groupValue)) {
                        currentLevel.set(groupValue, {
                            originalRows: [],            // Items directly in this group
                            subgroups: new Map(), // Nested subgroups
                            groupPath,            // Full path to this group
                            value: groupValue,    // The grouping value
                            columnId,             // Column used for grouping
                            depth,                // Depth in the grouping hierarchy
                            aggregates: {}        // Placeholder for potential aggregations
                        });
                    }

                    // Get the existing or newly created group
                    const group = currentLevel.get(groupValue)!;


                    // Add the item to the items array only if it's the deepest level
                    if (depth === groupingCriteria.length - 1) {
                        group.originalRows.push(item);
                    }

                    // Move to the subgroups for the next iteration
                    currentLevel = group.subgroups;
                });
            });

            return groups;
        },

        createHierarchicalGroupRows: (flatGroupRows: Map<string, FlatGroup<TData>>): (Row<TData> | GroupRow<TData>)[] => {
            const buildHierarchy = (group: FlatGroup<TData>): GroupRow<TData> => {
                const { groupPath, value, columnId, depth, originalRows, subgroups, aggregates } = group;

                // Process subgroups recursively
                const children: (Row<TData> | GroupRow<TData>)[] = [];

                if (subgroups && subgroups.size > 0) {
                    for (const [subgroupKey, subgroup] of subgroups.entries()) {
                        children.push(buildHierarchy(subgroup));
                    }
                }

                // Add the original rows at the lowest level
                if (originalRows.length > 0) {
                    children.push(
                        ...originalRows.map((row, index) => ({
                            index: `${groupPath}/${index}`,
                            original: row,
                            depth: depth + 1,
                            columnId,
                        } as Row<TData>))
                    );
                }

                // Return the group row with its children
                return {
                    index: groupPath,
                    children,
                    groupId: groupPath,
                    depth,
                    parentId: groupPath.includes("/") ? groupPath.substring(0, groupPath.lastIndexOf("/")) : null,
                    isExpanded: true, // Default to expanded; can be adjusted as needed
                    aggregates: aggregates || {},
                    columnId,
                };
            };

            // Start building the hierarchy from the top-level groups
            const hierarchicalRows: (Row<TData> | GroupRow<TData>)[] = [];

            for (const flatGroup of flatGroupRows.values()) {
                hierarchicalRows.push(buildHierarchy(flatGroup));
            }

            return hierarchicalRows;
        }
    }

    helpers = {
        getSearchableColumns: (): (SearchableColumn<TData> & { visible: true })[] => {
            // Filter columns that have the type 'accessor'
            const columns = this.columns.filter(
                (col): col is SearchableColumn<TData> => col.type === 'accessor'
            );

            // Further filter columns that are searchable and visible
            return columns.filter(
                col => col.options?.searchable && col.state.visible === true
            ) as (SearchableColumn<TData> & { visible: true })[];
        },
    }

    // Columns
    columnVisibility = {
        hideColumn: () => { },
        showColumn: () => { },
        toggleColumnVisibility: () => { },
        getVisibleColumns: () => { },
        isColumnVisible: () => { }
    }
    columnMovement = {
        moveColumnLeft: () => { },
        moveColumnRight: () => { },
        moveColumnToPosition: () => { },
    }
    columnResizing = {
        resizeColumn: () => { },
    }
    columnFiltering = {
        addFilter: () => { },
        removeFilter: () => { },
        clearFilters: () => { },
        isRowMatching: () => { },
        isColumnFilterable: () => { }
    }
    columnSorting = {
        sortColumnAscending: () => { },
        sortColumnDescending: () => { },
        canSortColumnAcending: () => { },
        canSortColumnDescending: () => { },
        canSortColumn: () => { },
    }

    // Rows 
    rowExpansion = {
        state: {
            expandedRows: ([]),
            rowsExpansionStrategy: ('none'),
        },
        expandRow: () => { },
        collapseRow: () => { },
        toggleRowExpansion: () => { },
        getExpandedRows: () => { },
        setExpandedRows: () => { },
        isRowExpanded: () => { },
    }
    rowSelection = {
        state: {
            selectedRows: ([]),
            rowsSelectionStrategy: ('none'),
        },
        selectRow: () => { },
        unselectRow: () => { },
        toggleRowSelection: () => { },
        getSelectedRows: () => { },
        setSelectedRows: () => { },
        isRowSelected: () => { },
    }
    rowPinning = {
        state: {
            pinnedRows: ({
                top: [],
                bottom: []
            }),
            rowsPinningStrategy: ('none'),
        },
        pinRow: () => { },
        unpinRow: () => { },
        toggleRowPinning: () => { },
        getPinnedRows: () => { },
        setPinnedRows: () => { },
        isRowPinned: () => { },
    }
}
