import {
    ColumnFacetingFeature, ColumnFilteringFeature, ColumnGroupingFeature, ColumnOrderingFeature,
    ColumnPinningFeature, ColumnSizingFeature, ColumnVisibilityFeature, GlobalSearchFeature,
    GroupingFeature, RowExpandingFeature, RowPinningFeature, RowSelectionFeature, SortingFeature,
    PaginationFeature
} from "../features";
import type { DatagridCore } from "../index.svelte";
import type { DatagridCoreConfig } from "../types";

/**
 * A class that manages the various features of a DataGrid, including sorting, filtering, pagination, row selection, column visibility, and more.
 * It allows for the dynamic configuration and initialization of features, enabling an extensible and customizable DataGrid.
 */
export class DatagridFeatures<TOriginalRow = any> {
    /**
     * The DataGrid instance that this feature set is operating on.
     */
    datagrid: DatagridCore<any>;

    /**
     * Pagination feature for the DataGrid, enabling pagination controls.
     */
    pagination: PaginationFeature;

    /**
     * Sorting feature for the DataGrid, allowing columns to be sorted in ascending or descending order.
     */
    sorting: SortingFeature;

    /**
     * Grouping feature for the DataGrid, enabling the grouping of rows based on specified column values.
     */
    grouping: GroupingFeature;

    /**
     * Filtering feature for the DataGrid, allowing rows to be filtered based on column values.
     */
    filtering: ColumnFilteringFeature;

    /**
     * Global search feature for the DataGrid, allowing for a search across multiple columns.
     */
    globalSearch: GlobalSearchFeature;

    /**
     * Column sizing feature for the DataGrid, enabling the resizing of columns.
     */
    columnSizing: ColumnSizingFeature;

    /**
     * Column visibility feature for the DataGrid, allowing columns to be shown or hidden dynamically.
     */
    columnVisibility: ColumnVisibilityFeature;

    /**
     * Column pinning feature for the DataGrid, allowing columns to be pinned to the left or right.
     */
    columnPinning: ColumnPinningFeature;

    /**
     * Column faceting feature for the DataGrid, enabling the grouping of data by column facets.
     */
    columnFaceting: ColumnFacetingFeature;

    /**
     * Column ordering feature for the DataGrid, allowing the reordering of columns.
     */
    columnOrdering: ColumnOrderingFeature;

    /**
     * Column grouping feature for the DataGrid, enabling the grouping of columns.
     */
    columnGrouping: ColumnGroupingFeature;

    /**
     * Row expanding feature for the DataGrid, allowing rows to be expanded to show additional details.
     */
    rowExpanding: RowExpandingFeature;

    /**
     * Row selection feature for the DataGrid, enabling the selection of rows for batch actions.
     */
    rowSelection: RowSelectionFeature;

    /**
     * Row pinning feature for the DataGrid, allowing rows to be pinned at the top or bottom.
     */
    rowPinning: RowPinningFeature;

    /**
     * Initializes the DataGrid features with the provided DataGrid instance and optional configuration.
     * This constructor sets up all the core features for sorting, filtering, pagination, and more based on the provided configuration.
     * 
     * @param {DatagridCore<any>} datagrid - The DataGrid instance that these features will operate on.
     * @param {DatagridCoreConfig<TOriginalRow>} [config] - Optional configuration for the features, including initial states and feature overrides.
     */
    constructor(datagrid: DatagridCore<any>, config?: DatagridCoreConfig<TOriginalRow>) {
        this.datagrid = datagrid;

        // Initialize features with provided config or fallback to default features
        this.sorting = new (config?.features?.sorting || SortingFeature)(this.datagrid, config?.initialState?.sorting || {});
        this.rowSelection = new (config?.features?.rowSelection || RowSelectionFeature)(this.datagrid, config?.initialState?.rowSelection || {});
        this.rowPinning = new (config?.features?.rowPinning || RowPinningFeature)(this.datagrid, config?.initialState?.rowPinning || {});
        this.rowExpanding = new (config?.features?.rowExpanding || RowExpandingFeature)(this.datagrid, config?.initialState?.rowExpanding || {});
        this.pagination = new (config?.features?.pagination || PaginationFeature)(this.datagrid, config?.initialState?.pagination || {});
        this.grouping = new (config?.features?.grouping || GroupingFeature)(this.datagrid, config?.initialState?.grouping || {});
        this.globalSearch = new (config?.features?.globalSearch || GlobalSearchFeature)(this.datagrid, config?.initialState?.globalSearch || {});
        this.columnGrouping = new (config?.features?.columnGrouping || ColumnGroupingFeature)(this.datagrid, config?.initialState?.columnGrouping || {});
        this.columnPinning = new (config?.features?.columnPinning || ColumnPinningFeature)(this.datagrid, config?.initialState?.columnPinning || {});
        this.columnSizing = new (config?.features?.columnSizing || ColumnSizingFeature)(this.datagrid, config?.initialState?.columnSizing || {});
        this.columnVisibility = new (config?.features?.columnVisibility || ColumnVisibilityFeature)(this.datagrid, config?.initialState?.columnVisibility || {});
        this.columnOrdering = new (config?.features?.columnOrdering || ColumnOrderingFeature)(this.datagrid, config?.initialState?.columnOrdering || {});
        this.filtering = new (config?.features?.filtering || ColumnFilteringFeature)(this.datagrid, config?.initialState?.filtering || {});
        this.columnFaceting = new (config?.features?.faceting || ColumnFacetingFeature)(this.datagrid, config?.initialState?.faceting || {});
    }
}
