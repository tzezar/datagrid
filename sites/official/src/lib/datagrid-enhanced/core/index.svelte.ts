import type { AnyColumn, ColumnId } from "$lib/datagrid/core/types";
import { DatagridCore, type DatagridCoreConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { flattenColumnStructureAndClearGroups } from "$lib/datagrid/core/utils.svelte";

import {
    CredentialsPlugin,
    ColumnPinningEnhancedFeature,
    ColumnSizingEnhancedFeature,
    ColumnVisibilityEnhancedFeature,
    GroupingEnhancedFeature,
    StatusIndicatorPlugin,
    RowExpandingEnhancedFeature,
    RowSelectionEnhancedFeature,
    SortingEnhancedFeature,
    FullscreenPlugin,
    ColumnGroupsPlugin,
   PaginationPlugin,
    GlobalSearchEnhancedFeature,
    ClickToCopyPlugin,
    ColumnFilteringEnhancedFeature,
    type ClickToCopyPluginConfig,
    type ColumnFilteringEnhancedPluginConfig,
    type ColumnPinningEnhancedPluginConfig,
    type ColumnSizingEnhancedPluginConfig,
    type ColumnVisibilityEnhancedPluginConfig,
    type CredentialsPluginConfig,
    type FullscreenPluginConfig,
    type GlobalSearchEnhancedPluginConfig,
    type ColumnGroupsPluginConfig,
    type GroupingEnhancedPluginConfig,
    type StatusIndicatorPluginConfig,
    type RowExpandingEnhancedPluginConfig,
    type RowSelectionEnhancedPluginConfig,
    type SortingEnhancedPluginConfig,
    ColumnOrderingEnhancedFeature,
    type ColumnOrderingEnhancedPluginConfig,
    ControlCenterFeature,
    type ControlCenterPluginConfig,
     AnimationsPlugin,
    type AnimationsPluginConfig,
} from "./features";


import type { SortingPluginConfig } from "$lib/datagrid/core/features/sorting.svelte";
import type { PaginationPluginConfig } from "$lib/datagrid/core/features/pagination.svelte";
import type { GroupingPluginConfig } from "$lib/datagrid/core/features/grouping.svelte";
import type { ColumnOrderingPluginConfig } from "$lib/datagrid/core/features/column-ordering.svelte";
import { createDisplayColumn } from "$lib/datagrid/core/column-creation/display-column-creator";
import RowSelectionCell from "../built-in/row-selection-cell.svelte";
import RowExpandingCell from "../built-in/row-expanding-cell.svelte";
import RowSelectionColumnHeaderCell from "../built-in/row-selection-column-header-cell.svelte";
import RowExpandingColumnHeaderCell from "../built-in/row-expanding-column-header-cell.svelte";
import { OverlayPlugin, type OverlayPluginConfig } from "../../datagrid/plugins/overlay.svelte";
import { StripedRowsPlugin, type StripedRowsPluginConfig } from "../../datagrid/plugins/striped-rows.svelte";
import { CustomizationFeature, type CustomizationPluginConfig } from "./features/customization.svelte";
import { VirtualizationPlugin, type VirtualizationPluginConfig } from "../../datagrid/plugins/virtualization.svelte";
import { ExportingPlugin, type ExportingPluginConfig } from "$lib/datagrid/plugins/exporting.svelte";



export type EnhancedDatagridConfig<TOriginalRow = any> = DatagridCoreConfig<TOriginalRow> & {
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;
    extra?: EnhancedDatagridExtraStateConfig
    customization?: Omit<CustomizationPluginConfig<TOriginalRow>, 'datagrid'>
}

export type TrzezarsDatagridFeatures = {
    clickToCopy: ClickToCopyPlugin,
    columnFiltering: ColumnFilteringEnhancedFeature,
    columnPinning: ColumnPinningEnhancedFeature,
    columnSizing: ColumnSizingEnhancedFeature,
    columnVisibility: ColumnVisibilityEnhancedFeature,
    credentials: CredentialsPlugin,
    exporting: ExportingPlugin,
    fullscreen: FullscreenPlugin,
    globalSearch: GlobalSearchEnhancedFeature,
    columnGroups: ColumnGroupsPlugin,
    grouping: GroupingEnhancedFeature,
    statusIndicator: StatusIndicatorPlugin,
    pagination: PaginationPlugin,
    rowExpanding: RowExpandingEnhancedFeature,
    rowSelection: RowSelectionEnhancedFeature,
    sorting: SortingEnhancedFeature,
    columnOrdering: ColumnOrderingEnhancedFeature,
    controlCenter: ControlCenterFeature,
    animations: AnimationsPlugin,
    overlay: OverlayPlugin,
    stripedRows: StripedRowsPlugin,
    virtualization: VirtualizationPlugin

}




export type EnhancedDatagridExtraStateConfig = {
    features?: {
        clickToCopy?: ClickToCopyPluginConfig,
        columnFiltering?: ColumnFilteringEnhancedPluginConfig,
        columnPinning?: ColumnPinningEnhancedPluginConfig,
        columnSizing?: ColumnSizingEnhancedPluginConfig,
        columnVisibility?: ColumnVisibilityEnhancedPluginConfig,
        credentials?: CredentialsPluginConfig,
        exporting?: ExportingPluginConfig,
        fullscreen?: FullscreenPluginConfig,
        globalSearch?: GlobalSearchEnhancedPluginConfig,
        groupHeadersVisibility?: ColumnGroupsPluginConfig,
        grouping?: GroupingEnhancedPluginConfig & GroupingPluginConfig,
        statusIndicator?: StatusIndicatorPluginConfig,
        pagination?: PaginationPlugin & PaginationPluginConfig;
        rowExpanding?: RowExpandingEnhancedPluginConfig,
        rowSelection?: RowSelectionEnhancedPluginConfig,
        sorting?: SortingEnhancedPluginConfig & SortingPluginConfig
        columnOrdering?: ColumnOrderingEnhancedPluginConfig & ColumnOrderingPluginConfig
        controlCenter?: ControlCenterPluginConfig,
        animations?: AnimationsPluginConfig,
        overlay?: OverlayPluginConfig,
        stripedRows?: StripedRowsPluginConfig,
        virtualization?: VirtualizationPluginConfig
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
                tooltip: col._meta?.tooltip ?? true,
                showColumnManagerDropdownMenu: col._meta?.showColumnManagerDropdownMenu ?? true
            }
        }
    })
    return newCols
}


function updateColumnPinningOffsets(columns: AnyColumn<any>[]) {
    function calculateOffset(columns: AnyColumn<any>[], columnId: ColumnId, position: 'left' | 'right' | null): number {
        if (position === null) return -1; // No offset for unpinned columns

        // Get all visible columns pinned to the specified position
        const pinnedColumns = columns.filter(
            (column) => column.state.visible !== false && column.state.pinning.position === position
        );

        // Find the index of the column with the specified ID
        const index = pinnedColumns.findIndex((column) => column.columnId === columnId);

        // If column not found or if it's left-pinned and first, or right-pinned and last
        if (index === -1 || (position === 'left' && index === 0) ||
            (position === 'right' && index === pinnedColumns.length - 1)) {
            return 0;
        }

        if (position === 'left') {
            // For left-pinned columns, calculate from left to right
            return pinnedColumns
                .slice(0, index)
                .reduce((sum, column) => sum + (column.state.size.width || 0), 0);
        } else {
            // For right-pinned columns, calculate from right to left
            return pinnedColumns
                .slice(index + 1)
                .reduce((sum, column) => sum + (column.state.size.width || 0), 0);
        }
    }

    const newColumns: AnyColumn<any>[] = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.state.pinning.position === 'none') {
            col.state.pinning.offset = 0;
        } else {
            col.state.pinning.offset = calculateOffset(columns, col.columnId, col.state.pinning.position);
        }

        newColumns.push(col);
    }
    return newColumns;
}

const createAdditionalColumns = (datagrid: EnhancedDatagrid): {
    leftCols: AnyColumn<any>[];
    rightCols: AnyColumn<any>[];
} => {
    const createColumn = (
        position: 'left' | 'right',
        columnId: string,
        component: any,
        headerComponent: any,
        headerProps?: Record<string, any>
    ) => createDisplayColumn({
        header: '',
        columnId,
        cell: ({ column, datagrid, row }) => ({
            component,
            props: { column, datagrid, row },
        }),
        state: {
            pinning: { position },
            size: { maxWidth: 40, minWidth: 40, width: 40 },
        },
        headerCell: () => ({
            component: headerComponent,
            props: headerProps,
        }),
    });

    const leftCols: AnyColumn<any>[] = [];
    const rightCols: AnyColumn<any>[] = [];
    const { rowSelection, rowExpanding } = datagrid.extra.features;


    if (rowSelection?.createColumnManually === false) {
        if (rowSelection?.position === 'left') {
            leftCols.push(createColumn('left', '_selection', RowSelectionCell, RowSelectionColumnHeaderCell));
        }

        if (rowSelection?.position === 'right') {
            rightCols.push(createColumn('right', '_selection', RowSelectionCell, RowSelectionColumnHeaderCell));
        }

    }

    if (rowExpanding?.createColumnManually === false) {
        if (rowExpanding?.position === 'right') {
            rightCols.push(createColumn('right', '_expand', RowExpandingCell, RowExpandingColumnHeaderCell));
        }
        if (rowExpanding?.position === 'left') {
            leftCols.push(createColumn('left', '_expand', RowExpandingCell, RowExpandingColumnHeaderCell));
        }
    }


    return { leftCols, rightCols };
};


export class EnhancedDatagrid<TOriginalRow = any, TMeta = any> extends DatagridCore<TOriginalRow, TMeta> {
    extra: Extra<TOriginalRow>
    customization = {} as CustomizationFeature<TOriginalRow>

    constructor(config: EnhancedDatagridConfig<TOriginalRow>) {
        super(config, true);
        this.extra = new Extra(this, config.extra);

        this.customization = new CustomizationFeature(this, config.customization);

        this.registerLifecycleHooks();
        this.initializeState(config);
    }



    private registerLifecycleHooks() {
        // * It might be better to place this logic into datagrid component itselt, it might allow easier styling
        this.lifecycleHooks.register(
            LifecycleHooks.HOOKS.PRE_PROCESS_ORIGINAL_COLUMNS,
            (columns: AnyColumn<TOriginalRow>[]) => this.processColumnsWithExtras(columns)
        );

        this.lifecycleHooks.register(
            LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS,
            (columns: AnyColumn<TOriginalRow>[]) => this.processColumns(columns)
        );
    }

    private processColumnsWithExtras(columns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
        const flattenedColumns = flattenColumnStructureAndClearGroups([...columns]);
        const additionalColumns = createAdditionalColumns(this);
        const allColumns = [
            ...additionalColumns.leftCols,
            ...flattenedColumns,
            ...additionalColumns.rightCols,
        ];
        return this.createHierarchicalColumns(allColumns);
    }

    private processColumns(columns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
        const flattenedColumns = flattenColumnStructureAndClearGroups([...columns]);
        return this.createHierarchicalColumns(flattenedColumns);
    }

    private createHierarchicalColumns(columns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
        let transformedColumns = transformColumns(columns);
        transformedColumns = updateColumnPinningOffsets(transformedColumns);
        return this.processors.column.createColumnHierarchy(transformedColumns);
    }

}

export class Extra<TOriginalRow> {
    datagrid: EnhancedDatagrid<TOriginalRow>;
    title: string | undefined;
    features = {} as TrzezarsDatagridFeatures


    constructor(datagrid: EnhancedDatagrid<any>, config?: EnhancedDatagridExtraStateConfig) {
        this.datagrid = datagrid;

        this.initializeFeatures(config);
        this.title = config?.title || "Your data, Tzezar's Datagrid"
    }

    initializeFeatures(config?: EnhancedDatagridExtraStateConfig) {

        // register plugins
        this.features.exporting = new ExportingPlugin(this.datagrid, config?.features?.exporting);
        this.features.animations = new AnimationsPlugin(this.datagrid, config?.features?.animations);
        this.features.pagination = new PaginationPlugin(config?.features?.pagination);
        this.features.stripedRows = new StripedRowsPlugin(config?.features?.stripedRows);
        this.features.statusIndicator = new StatusIndicatorPlugin(config?.features?.statusIndicator);
        this.features.virtualization = new VirtualizationPlugin(config?.features?.virtualization);
        this.features.overlay = new OverlayPlugin(config?.features?.overlay);
        this.features.columnGroups = new ColumnGroupsPlugin(config?.features?.groupHeadersVisibility);
        this.features.credentials = new CredentialsPlugin(config?.features?.credentials);
        this.features.fullscreen = new FullscreenPlugin(config?.features?.fullscreen);
        this.features.clickToCopy = new ClickToCopyPlugin(config?.features?.clickToCopy);

        // maybe plugins after refactor 
        this.features.rowSelection = new RowSelectionEnhancedFeature(config?.features?.rowSelection);
        this.features.rowExpanding = new RowExpandingEnhancedFeature(config?.features?.rowExpanding);

        // control center
        this.features.grouping = new GroupingEnhancedFeature(config?.features?.grouping);
        this.features.controlCenter = new ControlCenterFeature(config?.features?.controlCenter);

        // control center && header cells
        this.features.columnOrdering = new ColumnOrderingEnhancedFeature(config?.features?.columnOrdering);
        this.features.columnPinning = new ColumnPinningEnhancedFeature(config?.features?.columnPinning);
        this.features.columnSizing = new ColumnSizingEnhancedFeature(config?.features?.columnSizing);
        this.features.columnVisibility = new ColumnVisibilityEnhancedFeature(config?.features?.columnVisibility);

        // toolbar
        this.features.globalSearch = new GlobalSearchEnhancedFeature(config?.features?.globalSearch);

        // customization

        // extra

        // enhanced
        this.features.sorting = new SortingEnhancedFeature(this.datagrid, config?.features?.sorting);
    }

    getTitle(): string | undefined {
        return this.title; // Getter for consistent access
    }

}
