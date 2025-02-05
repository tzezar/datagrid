import type { AnyColumn, ColumnId } from "$lib/datagrid/core/types";
import { Datagrid, type DatagridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { flattenColumnStructureAndClearGroups } from "$lib/datagrid/core/utils.svelte";

import {
    CredentialsFeature,
    DensityToggleFeature,
    ExportingFeature,
    ColumnPinningEnhancedFeature,
    ColumnSizingEnhancedFeature,
    ColumnVisibilityEnhancedFeature,
    GroupingEnhancedFeature,
    StatusIndicatorFeature,
    RowExpandingEnhancedFeature,
    RowNumbersFeature,
    RowSelectionEnhancedFeature,
    SortingEnhancedFeature,
    FullscreenFeature,
    GroupHeadersVisibilityFeature,
    PaginationEnhancedFeature,
    GlobalSearchEnhancedFeature,
    ClickToCopyFeature,
    ColumnFilteringEnhancedFeature,
    type ClickToCopyFeatureConfig,
    type ColumnFilteringEnhancedFeatureConfig,
    type ColumnPinningEnhancedFeatureConfig,
    type ColumnSizingEnhancedFeatureConfig,
    type ColumnVisibilityEnhancedFeatureConfig,
    type CredentialsFeatureConfig,
    type DensityToggleFeatureConfig,
    type ExportingFeatureConfig,
    type FullscreenFeatureConfig,
    type GlobalSearchEnhancedFeatureConfig,
    type GroupHeadersVisibilityFeatureConfig,
    type GroupingEnhancedFeatureConfig,
    type StatusIndicatorFeatureConfig,
    type PaginationEnhancedFeatureConfig,
    type RowExpandingEnhancedFeatureConfig,
    type RowNumbersFeatureConfig,
    type RowSelectionEnhancedFeatureConfig,
    type SortingEnhancedFeatureConfig,
    ColumnOrderingEnhancedFeature,
    type ColumnOrderingEnhancedFeatureConfig,
    ControlCenterFeature,
    type ControlCenterFeatureConfig,
    AnimationsFeature,
    type AnimationsFeatureConfig,
} from "./features";


import type { SortingFeatureConfig } from "$lib/datagrid/core/features/sorting.svelte";
import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";
import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";
import type { ColumnOrderingFeatureConfig } from "$lib/datagrid/core/features/column-ordering.svelte";
import { createDisplayColumn } from "$lib/datagrid/core/column-creation/display-column-creator";
import RowSelectionCell from "../built-in/row-selection-cell.svelte";
import RowExpandingCell from "../built-in/row-expanding-cell.svelte";
import RowSelectionColumnHeaderCell from "../built-in/row-selection-column-header-cell.svelte";
import RowExpandingColumnHeaderCell from "../built-in/row-expanding-column-header-cell.svelte";
import { OverlayFeature, type OverlayFeatureConfig } from "./features/overlay.svelte";
import { StripedRowsFeature, type StripedRowsFeatureConfig } from "./features/striped-rows.svelte";
import { CustomizationFeature, type CustomizationFeatureConfig } from "./features/customization.svelte";
import { VirtualizationFeature, type VirtualizationFeatureConfig } from "./features/virtualization.svelte";



export type EnhancedDatagridConfig<TOriginalRow = any> = DatagridConfig<TOriginalRow> & {
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;
    extra?: EnhancedDatagridExtraStateConfig
    customization?: Omit<CustomizationFeatureConfig<TOriginalRow>, 'datagrid'>
}

export type TrzezarsDatagridFeatures = {
    clickToCopy: ClickToCopyFeature,
    columnFiltering: ColumnFilteringEnhancedFeature,
    columnPinning: ColumnPinningEnhancedFeature,
    columnSizing: ColumnSizingEnhancedFeature,
    columnVisibility: ColumnVisibilityEnhancedFeature,
    credentials: CredentialsFeature,
    densityToggle: DensityToggleFeature,
    exporting: ExportingFeature,
    fullscreen: FullscreenFeature,
    globalSearch: GlobalSearchEnhancedFeature,
    groupHeadersVisibility: GroupHeadersVisibilityFeature,
    grouping: GroupingEnhancedFeature,
    loadingIndicator: StatusIndicatorFeature,
    pagination: PaginationEnhancedFeature,
    rowExpanding: RowExpandingEnhancedFeature,
    rowNumbers: RowNumbersFeature,
    rowSelection: RowSelectionEnhancedFeature,
    sorting: SortingEnhancedFeature,
    columnOrdering: ColumnOrderingEnhancedFeature,
    controlCenter: ControlCenterFeature,
    animations: AnimationsFeature,
    overlay: OverlayFeature,
    stripedRows: StripedRowsFeature,
    virtualization: VirtualizationFeature

}




export type EnhancedDatagridExtraStateConfig = {
    features?: {
        clickToCopy?: ClickToCopyFeatureConfig,
        columnFiltering?: ColumnFilteringEnhancedFeatureConfig,
        columnPinning?: ColumnPinningEnhancedFeatureConfig,
        columnSizing?: ColumnSizingEnhancedFeatureConfig,
        columnVisibility?: ColumnVisibilityEnhancedFeatureConfig,
        credentials?: CredentialsFeatureConfig,
        densityToggle?: DensityToggleFeatureConfig,
        exporting?: ExportingFeatureConfig,
        fullscreen?: FullscreenFeatureConfig,
        globalSearch?: GlobalSearchEnhancedFeatureConfig,
        groupHeadersVisibility?: GroupHeadersVisibilityFeatureConfig,
        grouping?: GroupingEnhancedFeatureConfig & GroupingFeatureConfig,
        statusIndicator?: StatusIndicatorFeatureConfig,
        pagination?: PaginationEnhancedFeatureConfig & PaginationFeatureConfig,
        rowExpanding?: RowExpandingEnhancedFeatureConfig,
        rowNumbers?: RowNumbersFeatureConfig,
        rowSelection?: RowSelectionEnhancedFeatureConfig,
        sorting?: SortingEnhancedFeatureConfig & SortingFeatureConfig
        columnOrdering?: ColumnOrderingEnhancedFeatureConfig & ColumnOrderingFeatureConfig
        controlCenter?: ControlCenterFeatureConfig,
        animations?: AnimationsFeatureConfig,
        overlay?: OverlayFeatureConfig,
        stripedRows?: StripedRowsFeatureConfig,
        virtualization?: VirtualizationFeatureConfig
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

    if (rowSelection?.displayBuiltInComponents === true) {
        if (rowSelection?.position === 'left') {
            leftCols.push(createColumn('left', '_selection', RowSelectionCell, RowSelectionColumnHeaderCell));
        }

        if (rowSelection?.position === 'right') {
            rightCols.push(createColumn('right', '_selection', RowSelectionCell, RowSelectionColumnHeaderCell));
        }

    }

    if (rowExpanding?.displayBuiltInComponents === true) {
        if (rowExpanding?.position === 'right') {
            rightCols.push(createColumn('right', '_expand', RowExpandingCell, RowExpandingColumnHeaderCell));
        }
        if (rowExpanding?.position === 'left') {
            leftCols.push(createColumn('left', '_expand', RowExpandingCell, RowExpandingColumnHeaderCell));
        }
    }


    return { leftCols, rightCols };
};


export class EnhancedDatagrid<TOriginalRow = any, TMeta = any> extends Datagrid<TOriginalRow, TMeta> {
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
        // extra
        this.features.clickToCopy = new ClickToCopyFeature(this.datagrid, config?.features?.clickToCopy);
        this.features.credentials = new CredentialsFeature(this.datagrid, config?.features?.credentials);
        this.features.exporting = new ExportingFeature(this.datagrid, config?.features?.exporting);
        this.features.fullscreen = new FullscreenFeature(this.datagrid, config?.features?.fullscreen);
        this.features.groupHeadersVisibility = new GroupHeadersVisibilityFeature(this.datagrid, config?.features?.groupHeadersVisibility);
        this.features.rowNumbers = new RowNumbersFeature(this.datagrid, config?.features?.rowNumbers);
        this.features.stripedRows = new StripedRowsFeature(this.datagrid, config?.features?.stripedRows);
        this.features.overlay = new OverlayFeature(this.datagrid, config?.features?.overlay);
        this.features.animations = new AnimationsFeature(this.datagrid, config?.features?.animations);
        this.features.controlCenter = new ControlCenterFeature(this.datagrid, config?.features?.controlCenter);
        this.features.loadingIndicator = new StatusIndicatorFeature(this.datagrid, config?.features?.statusIndicator);
        this.features.densityToggle = new DensityToggleFeature(this.datagrid, config?.features?.densityToggle);
        // this.features.customization = new CustomizationFeature(this.datagrid, config?.features?.customization);
        this.features.virtualization = new VirtualizationFeature(this.datagrid, config?.features?.virtualization);

        // enhanced
        this.features.columnFiltering = new ColumnFilteringEnhancedFeature(this.datagrid, config?.features?.columnFiltering);
        this.features.columnPinning = new ColumnPinningEnhancedFeature(this.datagrid, config?.features?.columnPinning);
        this.features.columnSizing = new ColumnSizingEnhancedFeature(this.datagrid, config?.features?.columnSizing);
        this.features.columnVisibility = new ColumnVisibilityEnhancedFeature(this.datagrid, config?.features?.columnVisibility);
        this.features.globalSearch = new GlobalSearchEnhancedFeature(this.datagrid, config?.features?.globalSearch);
        this.features.grouping = new GroupingEnhancedFeature(this.datagrid, config?.features?.grouping);
        this.features.pagination = new PaginationEnhancedFeature(this.datagrid, config?.features?.pagination);
        this.features.rowExpanding = new RowExpandingEnhancedFeature(this.datagrid, config?.features?.rowExpanding);
        this.features.sorting = new SortingEnhancedFeature(this.datagrid, config?.features?.sorting);
        this.features.columnOrdering = new ColumnOrderingEnhancedFeature(this.datagrid, config?.features?.columnOrdering);
        this.features.rowSelection = new RowSelectionEnhancedFeature(this.datagrid, config?.features?.rowSelection);
    }

    getTitle(): string | undefined {
        return this.title; // Getter for consistent access
    }

}
