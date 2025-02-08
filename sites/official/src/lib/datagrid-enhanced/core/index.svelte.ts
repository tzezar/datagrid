import type { ColumnDef, ColumnId, DatagridCoreConfig } from "$lib/datagrid/core/types";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";

import {
    CredentialsPlugin,
    ColumnSizingEnhancedFeature,
    StatusIndicatorPlugin,
    RowExpandingEnhancedFeature,
    RowSelectionEnhancedFeature,
    FullscreenPlugin,
    ColumnGroupsPlugin,
    PaginationPlugin,
    ClickToCopyPlugin,
    type ClickToCopyPluginConfig,
    type ColumnSizingEnhancedPluginConfig,
    type CredentialsPluginConfig,
    type FullscreenPluginConfig,
    type ColumnGroupsPluginConfig,
    type StatusIndicatorPluginConfig,
    type RowExpandingEnhancedPluginConfig,
    type RowSelectionEnhancedPluginConfig,
    AnimationsPlugin,
    type AnimationsPluginConfig,
} from "./features";


import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";
import { createDisplayColumn } from "$lib/datagrid/core/column-creation/display-column-creator";
import RowSelectionCell from "../built-in/row-selection-cell.svelte";
import RowExpandingCell from "../built-in/row-expanding-cell.svelte";
import RowSelectionColumnHeaderCell from "../built-in/row-selection-column-header-cell.svelte";
import RowExpandingColumnHeaderCell from "../built-in/row-expanding-column-header-cell.svelte";
import { OverlayPlugin, type OverlayPluginConfig } from "../../datagrid/plugins/overlay.svelte";
import { StripedRowsPlugin, type StripedRowsPluginConfig } from "../../datagrid/plugins/striped-rows.svelte";
import { CustomizationFeature, type CustomizationPluginConfig } from "./customization/customization.svelte";
import { VirtualizationPlugin, type VirtualizationPluginConfig } from "../../datagrid/plugins/virtualization.svelte";
import { ExportingPlugin, type ExportingPluginConfig } from "$lib/datagrid/plugins/exporting.svelte";
import { DatagridCore } from "$lib/datagrid/core/index.svelte";



export type EnhancedDatagridConfig<TOriginalRow = any> = DatagridCoreConfig<TOriginalRow> & {
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;
    extra?: EnhancedDatagridExtraStateConfig
    customization?: Omit<CustomizationPluginConfig<TOriginalRow>, 'datagrid'>
}

export type TrzezarsDatagridFeatures = {
    clickToCopy: ClickToCopyPlugin,
    columnSizing: ColumnSizingEnhancedFeature,
    credentials: CredentialsPlugin,
    exporting: ExportingPlugin,
    fullscreen: FullscreenPlugin,
    columnGroups: ColumnGroupsPlugin,
    statusIndicator: StatusIndicatorPlugin,
    pagination: PaginationPlugin,
    rowExpanding: RowExpandingEnhancedFeature,
    rowSelection: RowSelectionEnhancedFeature,
    animations: AnimationsPlugin,
    overlay: OverlayPlugin,
    stripedRows: StripedRowsPlugin,
    virtualization: VirtualizationPlugin

}




export type EnhancedDatagridExtraStateConfig = {
    features?: {
        clickToCopy?: ClickToCopyPluginConfig,
        columnSizing?: ColumnSizingEnhancedPluginConfig,
        credentials?: CredentialsPluginConfig,
        exporting?: ExportingPluginConfig,
        fullscreen?: FullscreenPluginConfig,
        groupHeadersVisibility?: ColumnGroupsPluginConfig,
        statusIndicator?: StatusIndicatorPluginConfig,
        pagination?: PaginationPlugin & PaginationFeatureConfig;
        rowExpanding?: RowExpandingEnhancedPluginConfig,
        rowSelection?: RowSelectionEnhancedPluginConfig,
        animations?: AnimationsPluginConfig,
        overlay?: OverlayPluginConfig,
        stripedRows?: StripedRowsPluginConfig,
        virtualization?: VirtualizationPluginConfig,
    }

    title?: string
    state?: {
        highlightSelectedRow?: boolean
        showCredentials?: boolean,
        enablePagination?: boolean
    }
}



function transformColumns(columns: ColumnDef<any>[]): ColumnDef<any>[] {
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


function updateColumnPinningOffsets(columns: ColumnDef<any>[]) {
    function calculateOffset(columns: ColumnDef<any>[], columnId: ColumnId, position: 'left' | 'right' | null): number {
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

    const newColumns: ColumnDef<any>[] = [];
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
    leftCols: ColumnDef<any>[];
    rightCols: ColumnDef<any>[];
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

    const leftCols: ColumnDef<any>[] = [];
    const rightCols: ColumnDef<any>[] = [];
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

        this.initializeGridState(config);
        if (this.extra.features.virtualization.enabled === true) {
            this.features.pagination.pageSizes.push(10_000, 25_000, 50_000, 100_000)
        }
    }



    private registerLifecycleHooks() {
        // * It might be better to place this logic into datagrid component itselt, it might allow easier styling
        this.lifecycleHooks.register(
            LifecycleHooks.HOOKS.PRE_PROCESS_ORIGINAL_COLUMNS,
            (columns: ColumnDef<TOriginalRow>[]) => this.processColumnsWithExtras(columns)
        );

        this.lifecycleHooks.register(
            LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS,
            (columns: ColumnDef<TOriginalRow>[]) => this.processColumns(columns)
        );
    }

    private processColumnsWithExtras(columns: ColumnDef<TOriginalRow>[]): ColumnDef<TOriginalRow>[] {
        const flattenedColumns = this.columns.flattenColumnStructure([...columns], false);
        const additionalColumns = createAdditionalColumns(this);
        const allColumns = [
            ...additionalColumns.leftCols,
            ...flattenedColumns,
            ...additionalColumns.rightCols,
        ];
        return this.createHierarchicalColumns(allColumns);
    }

    private processColumns(columns: ColumnDef<TOriginalRow>[]): ColumnDef<TOriginalRow>[] {
        const flattenedColumns = this.columns.flattenColumnStructure([...columns], false);
        return this.createHierarchicalColumns(flattenedColumns);
    }

    private createHierarchicalColumns(columns: ColumnDef<TOriginalRow>[]): ColumnDef<TOriginalRow>[] {
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
        this.features.rowSelection = new RowSelectionEnhancedFeature(this.datagrid, config?.features?.rowSelection);
        this.features.rowExpanding = new RowExpandingEnhancedFeature(this.datagrid, config?.features?.rowExpanding);

        // control center
        // control center && header cells
        this.features.columnSizing = new ColumnSizingEnhancedFeature(config?.features?.columnSizing);

    }

    getTitle(): string | undefined {
        return this.title; // Getter for consistent access
    }

}
