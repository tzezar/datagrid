import {
    ColumnFacetingFeature, ColumnFilteringFeature, ColumnGroupingFeature, ColumnOrderingFeature,
    ColumnPinningFeature, ColumnSizingFeature, ColumnVisibilityFeature, GlobalSearchFeature,
    GroupingFeature, RowExpandingFeature, RowPinningFeature, RowSelectionFeature, SortingFeature,
    PaginationFeature
} from "../features";
import type { DatagridCore } from "../index.svelte";
import type { DatagridCoreConfig } from "../types";
import { flattenColumnStructureAndClearGroups, initializeFuseInstance } from "../utils.svelte";

export class FeatureManager<TOriginalRow = any> {
    datagrid: DatagridCore<any>;

    pagination: PaginationFeature
    sorting: SortingFeature;
    grouping: GroupingFeature;
    filtering: ColumnFilteringFeature;
    globalSearch: GlobalSearchFeature;
    columnSizing: ColumnSizingFeature;
    columnVisibility: ColumnVisibilityFeature;
    columnPinning: ColumnPinningFeature;
    columnFaceting: ColumnFacetingFeature;
    columnOrdering: ColumnOrderingFeature;
    columnGrouping: ColumnGroupingFeature;
    rowExpanding: RowExpandingFeature;
    rowSelection: RowSelectionFeature;
    rowPinning: RowPinningFeature;

    constructor(datagrid: DatagridCore<any>, config?: DatagridCoreConfig<TOriginalRow>) {
        this.datagrid = datagrid;

        // this.globalSearch = new GlobalSearchFeature({
        //     manual: config?.features?.globalSearch?.manual,
        //     delay: config?.features?.globalSearch?.delay,
        //     fuzzy: config?.features?.globalSearch?.fuzzy,
        //     fuseInstance: config?.features?.globalSearch?.fuseInstance || initializeFuseInstance(this.datagrid.initial.data || [], flattenColumnStructureAndClearGroups(this.datagrid.columns).map(col => col.columnId as string)),
        //     value: config?.features?.globalSearch?.value
        // });


        this.sorting = new (config?.features?.sorting || SortingFeature)(this.datagrid, config?.initialState?.sorting || {});
        this.rowSelection = new (config?.features?.rowSelection || RowSelectionFeature)(this.datagrid, config?.initialState?.rowSelection || {});
        this.rowPinning = new (config?.features?.rowPinning || RowPinningFeature)(this.datagrid, config?.initialState?.rowPinning || {});
        this.rowExpanding = new (config?.features?.rowExpanding || RowExpandingFeature)(this.datagrid, config?.initialState?.rowExpanding || {});
        this.pagination = new (config?.features?.pagination || PaginationFeature)(this.datagrid, config?.initialState?.pagination || {});
        this.grouping = new (config?.features?.grouping || GroupingFeature)(this.datagrid, config?.initialState?.grouping || {});
        this.globalSearch = new (config?.features?.globalSearch || GlobalSearchFeature)(this.datagrid, config?.initialState?.globalSearch || {});
        this.globalSearch.setFuseInstance(initializeFuseInstance(this.datagrid.initial.data || [], flattenColumnStructureAndClearGroups(this.datagrid.columns).map(col => col.columnId as string)))
        this.columnGrouping = new (config?.features?.columnGrouping || ColumnGroupingFeature)(this.datagrid, config?.initialState?.columnGrouping || {});
        this.columnPinning = new (config?.features?.columnPinning || ColumnPinningFeature)(this.datagrid, config?.initialState?.columnPinning || {});
        this.columnSizing = new (config?.features?.columnSizing || ColumnSizingFeature)(this.datagrid, config?.initialState?.columnSizing || {});
        this.columnVisibility = new (config?.features?.columnVisibility || ColumnVisibilityFeature)(this.datagrid, config?.initialState?.columnVisibility || {});
        this.columnOrdering = new (config?.features?.columnOrdering || ColumnOrderingFeature)(this.datagrid, config?.initialState?.columnOrdering || {});
        this.filtering = new (config?.features?.filtering || ColumnFilteringFeature)(this.datagrid, config?.initialState?.filtering || {});
        this.columnFaceting = new (config?.features?.faceting || ColumnFacetingFeature)(this.datagrid, config?.initialState?.faceting || {});

    }
}
