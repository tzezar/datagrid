import {
    ColumnFacetingFeature, ColumnFilteringFeature, ColumnGroupingFeature, ColumnOrderingFeature,
    ColumnPinningFeature, ColumnSizingFeature, ColumnVisibilityFeature, GlobalSearchFeature,
    GroupingFeature, RowExpandingFeature, RowPinningFeature, RowSelectionFeature, SortingFeature,
    PaginationFeature
} from "../features";
import type { Datagrid, DatagridConfig } from "../index.svelte";
import { flattenColumnStructureAndClearGroups, initializeFuseInstance } from "../utils.svelte";

export class FeatureManager<TOriginalRow = any> {
    datagrid: Datagrid<any>;

    pagination!: PaginationFeature
    sorting!: SortingFeature;
    grouping!: GroupingFeature;
    filtering!: ColumnFilteringFeature;
    globalSearch!: GlobalSearchFeature;
    columnSizing!: ColumnSizingFeature;
    columnVisibility!: ColumnVisibilityFeature;
    columnPinning!: ColumnPinningFeature;
    columnFaceting!: ColumnFacetingFeature;
    columnOrdering!: ColumnOrderingFeature;
    columnGrouping!: ColumnGroupingFeature;
    rowExpanding!: RowExpandingFeature;
    rowSelection!: RowSelectionFeature;
    rowPinning!: RowPinningFeature;

    constructor(datagrid: Datagrid<any>, config?: DatagridConfig<TOriginalRow>) {
        this.datagrid = datagrid;

        this.columnFaceting = new ColumnFacetingFeature(this.datagrid, config?.features?.columnFaceting);
        this.filtering = new ColumnFilteringFeature(this.datagrid, config?.features?.filtering);
        this.columnOrdering = new ColumnOrderingFeature(this.datagrid, config?.features?.columnOrdering);
        this.columnSizing = new ColumnSizingFeature(this.datagrid, config?.features?.columnSizing);
        this.columnVisibility = new ColumnVisibilityFeature(this.datagrid, config?.features?.columnVisibility);
        this.columnPinning = new ColumnPinningFeature(this.datagrid, config?.features?.columnPinning);
        this.columnGrouping = new ColumnGroupingFeature(this.datagrid, config?.features?.columnGrouping);


        this.globalSearch = new GlobalSearchFeature({
            manual: config?.features?.globalSearch?.manual,
            delay: config?.features?.globalSearch?.delay,
            fuzzy: config?.features?.globalSearch?.fuzzy,
            fuseInstance: config?.features?.globalSearch?.fuseInstance || initializeFuseInstance(this.datagrid.initial.data || [], flattenColumnStructureAndClearGroups(this.datagrid.columns).map(col => col.columnId as string)),
            value: config?.features?.globalSearch?.value
        });

        this.grouping = new GroupingFeature(config?.features?.grouping);
        this.pagination = new PaginationFeature(this.datagrid, config?.features?.pagination);
        this.rowExpanding = new RowExpandingFeature(this.datagrid, config?.features?.rowExpanding);
        this.rowPinning = new RowPinningFeature(this.datagrid, config?.features?.rowPinning);
        this.rowSelection = new RowSelectionFeature(this.datagrid, config?.features?.rowSelection);
        this.sorting = new SortingFeature(this.datagrid, config?.features?.sorting);
    }
}
