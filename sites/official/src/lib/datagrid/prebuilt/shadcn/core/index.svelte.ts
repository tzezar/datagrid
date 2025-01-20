import type { AnyColumn } from "$lib/datagrid/core/types";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { ColumnProcessor } from "$lib/datagrid/core/processors";
import { flattenColumnStructureAndClearGroups } from "$lib/datagrid/core/utils.svelte";

import {
    CredentialsFeature,
    DensityToggleFeature,
    ExportingFeature,
    ExtraColumnPinningFeature,
    ExtraColumnSizingFeature,
    ExtraColumnVisibilityFeature,
    ExtraGroupingFeature,
    LoadingIndicatorFeature,
    RowActionsFeature,
    ExtraRowExpandingFeature,
    RowNumbersFeature,
    ExtraRowSelectionFeature,
    ExtraSortingFeature,
    FullscreenFeature,
    GroupHeadersVisibilityFeature,
    ExtraPaginationFeature,
    ExtraGlobalSearchFeature,
    ClickToCopyFeature,
    ColumnFilteringFeature,
    type ClickToCopyFeatureConfig,
    type ColumnFilteringFeatureConfig,
    type ExtraColumnPinningFeatureConfig,
    type ExtraColumnSizingFeatureConfig,
    type ExtraColumnVisibilityFeatureConfig,
    type CredentialsFeatureConfig,
    type DensityToggleFeatureConfig,
    type ExportingFeatureConfig,
    type FullscreenFeatureConfig,
    type ExtraGlobalSearchFeatureConfig,
    type GroupHeadersVisibilityFeatureConfig,
    type ExtraGroupingFeatureConfig,
    type StatusIndicatorFeatureConfig,
    type ExtraPaginationFeatureConfig,
    type RowActionsFeatureConfig,
    type ExtraRowExpandingFeatureConfig,
    type RowNumbersFeatureConfig,
    type ExtraRowSelectionFeatureConfig,
    type ExtraSortingFeatureConfig,
    ExtraColumnOrderingFeature,
    type ExtraColumnOrderingFeatureConfig,
    ControlCenterFeature,
    type ControlCenterFeatureConfig,
} from "./features";
import type { SortingFeatureConfig } from "$lib/datagrid/core/features/sorting.svelte";
import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";
import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";
import type { ColumnOrderingFeatureConfig } from "$lib/datagrid/core/features/column-ordering.svelte";



export type TzezarsDatagridConfig<TOriginalRow = any> = GridConfig<TOriginalRow> & {
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;
    extra?: TzezarsDatagridExtraStateConfig;
}

export type Density = 'xs' | 'sm' | 'md' | 'lg' | 'xl'


export type TrzezarsDatagridFeatures = {
    clickToCopy: ClickToCopyFeature,
    columnFiltering: ColumnFilteringFeature,
    columnPinning: ExtraColumnPinningFeature,
    columnSizing: ExtraColumnSizingFeature,
    columnVisibility: ExtraColumnVisibilityFeature,
    credentials: CredentialsFeature,
    densityToggle: DensityToggleFeature,
    exporting: ExportingFeature<any>,
    fullscreen: FullscreenFeature,
    globalSearch: ExtraGlobalSearchFeature,
    groupHeadersVisibility: GroupHeadersVisibilityFeature,
    grouping: ExtraGroupingFeature,
    loadingIndicator: LoadingIndicatorFeature,
    pagination: ExtraPaginationFeature<any>,
    rowActions: RowActionsFeature,
    rowExpanding: ExtraRowExpandingFeature,
    rowNumbers: RowNumbersFeature,
    rowSelection: ExtraRowSelectionFeature,
    sorting: ExtraSortingFeature,
    columnOrdering: ExtraColumnOrderingFeature,
    controlCenter: ControlCenterFeature,
}




export type TzezarsDatagridExtraStateConfig = {
    features?: {
        clickToCopy?: ClickToCopyFeatureConfig,
        columnFiltering?: ColumnFilteringFeatureConfig,
        columnPinning?: ExtraColumnPinningFeatureConfig,
        columnSizing?: ExtraColumnSizingFeatureConfig,
        columnVisibility?: ExtraColumnVisibilityFeatureConfig,
        credentials?: CredentialsFeatureConfig,
        densityToggle?: DensityToggleFeatureConfig,
        exporting?: ExportingFeatureConfig,
        fullscreen?: FullscreenFeatureConfig,
        globalSearch?: ExtraGlobalSearchFeatureConfig,
        groupHeadersVisibility?: GroupHeadersVisibilityFeatureConfig,
        grouping?: ExtraGroupingFeatureConfig & GroupingFeatureConfig,
        statusIndicator?: StatusIndicatorFeatureConfig,
        pagination?: ExtraPaginationFeatureConfig & PaginationFeatureConfig,
        rowActions?: RowActionsFeatureConfig,
        rowExpanding?: ExtraRowExpandingFeatureConfig,
        rowNumbers?: RowNumbersFeatureConfig,
        rowSelection?: ExtraRowSelectionFeatureConfig,
        sorting?: ExtraSortingFeatureConfig & SortingFeatureConfig
        columnOrdering?: ExtraColumnOrderingFeatureConfig & ColumnOrderingFeatureConfig
        controlCenter?: ControlCenterFeatureConfig
    }

    title?: string
    state?: {
        highlightSelectedRow?: boolean
        showCredentials?: boolean,
        enablePagination?: boolean
    }
}



function transformColumns(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const newCols = columns.map(col => {
        return {
            ...col,
            _meta: {
                ...col._meta,
                showColumnManagerDropdownMenu: col._meta?.showColumnManagerDropdownMenu ?? true
            }
        }
    })
    return newCols
}



export class TzezarsDatagrid<TOriginalRow = any> extends DataGrid<TOriginalRow> {
    extra: Extra;

    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        const columnProcessor = new ColumnProcessor<TOriginalRow>({} as DataGrid<TOriginalRow>);
        config.lifecycleHooks = new LifecycleHooks<TOriginalRow>();
        config.lifecycleHooks.register(
            LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS,
            (columns: AnyColumn<TOriginalRow>[]) => {
                const flattenedColumns = flattenColumnStructureAndClearGroups([...columns]);
                const transformedColumns = transformColumns([...flattenedColumns]);
                const hierarchicalColumns = columnProcessor.createColumnHierarchy(transformedColumns);
                return hierarchicalColumns;
            }
        );

        super(config);
        this.extra = new Extra(this, config.extra);
    }

    isFullscreenEnabled() {
        return this.extra.features.fullscreen.isFullscreen;
    }
}




export class Extra {
    private datagrid: TzezarsDatagrid<any>;
    title: string | undefined;
    features = {} as TrzezarsDatagridFeatures;

    constructor(datagrid: TzezarsDatagrid<any>, config?: TzezarsDatagridExtraStateConfig) {
        this.datagrid = datagrid;
        this.initializeFeatures(config);
        this.title = config?.title; // Assign the title from config.extra
    }

    initializeFeatures(config?: TzezarsDatagridExtraStateConfig) {
        this.features.clickToCopy = new ClickToCopyFeature(config?.features?.clickToCopy);
        this.features.columnFiltering = new ColumnFilteringFeature(this.datagrid, config?.features?.columnFiltering);
        this.features.columnPinning = new ExtraColumnPinningFeature(this.datagrid, config?.features?.columnPinning);
        this.features.columnSizing = new ExtraColumnSizingFeature(this.datagrid, config?.features?.columnSizing);
        this.features.columnVisibility = new ExtraColumnVisibilityFeature(this.datagrid, config?.features?.columnVisibility);
        this.features.credentials = new CredentialsFeature(config?.features?.credentials);
        this.features.densityToggle = new DensityToggleFeature(config?.features?.densityToggle);
        this.features.exporting = new ExportingFeature(this.datagrid, config?.features?.exporting);
        this.features.fullscreen = new FullscreenFeature(config?.features?.fullscreen);
        this.features.globalSearch = new ExtraGlobalSearchFeature(this.datagrid, config?.features?.globalSearch);
        this.features.groupHeadersVisibility = new GroupHeadersVisibilityFeature(config?.features?.groupHeadersVisibility);
        this.features.grouping = new ExtraGroupingFeature(this.datagrid, config?.features?.grouping);
        this.features.loadingIndicator = new LoadingIndicatorFeature(config?.features?.statusIndicator);
        this.features.pagination = new ExtraPaginationFeature(this.datagrid, config?.features?.pagination);
        this.features.rowActions = new RowActionsFeature(config?.features?.rowActions);
        this.features.rowExpanding = new ExtraRowExpandingFeature(this.datagrid, config?.features?.rowExpanding);
        this.features.rowNumbers = new RowNumbersFeature(config?.features?.rowNumbers);
        this.features.rowSelection = new ExtraRowSelectionFeature(this.datagrid, config?.features?.rowSelection);
        this.features.sorting = new ExtraSortingFeature(this.datagrid, config?.features?.sorting);
        this.features.columnOrdering = new ExtraColumnOrderingFeature(this.datagrid, config?.features?.columnOrdering);
        this.features.controlCenter = new ControlCenterFeature(config?.features?.controlCenter);
        // this.datagrid.processors.data.executeFullDataTransformation();
    }



    getTitle(): string | undefined {
        return this.title; // Getter for consistent access
    }

}
