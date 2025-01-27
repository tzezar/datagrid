import type { AnyColumn, ColumnId } from "$lib/datagrid/core/types";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { flattenColumnStructureAndClearGroups } from "$lib/datagrid/core/utils.svelte";

import {
    CredentialsFeature,
    DensityToggleFeature,
    ExportingFeature,
    ColumnPinningEnchancedFeature,
    ColumnSizingEnchancedFeature,
    ColumnVisibilityEnchancedFeature,
    GroupingEnchancedFeature,
    StatusIndicatorFeature,
    RowExpandingEnchancedFeature,
    RowNumbersFeature,
    RowSelectionEnchancedFeature,
    SortingEnchancedFeature,
    FullscreenFeature,
    GroupHeadersVisibilityFeature,
    PaginationEnchancedFeature,
    GlobalSearchEnchancedFeature,
    ClickToCopyFeature,
    ColumnFilteringEnchancedFeature,
    type ClickToCopyFeatureConfig,
    type ColumnFilteringEnchancedFeatureConfig,
    type ColumnPinningEnchancedFeatureConfig,
    type ColumnSizingEnchancedFeatureConfig,
    type ColumnVisibilityEnchancedFeatureConfig,
    type CredentialsFeatureConfig,
    type DensityToggleFeatureConfig,
    type ExportingFeatureConfig,
    type FullscreenFeatureConfig,
    type GlobalSearchEnchancedFeatureConfig,
    type GroupHeadersVisibilityFeatureConfig,
    type GroupingEnchancedFeatureConfig,
    type StatusIndicatorFeatureConfig,
    type PaginationEnchancedFeatureConfig,
    type RowExpandingEnchancedFeatureConfig,
    type RowNumbersFeatureConfig,
    type RowSelectionEnchancedFeatureConfig,
    type SortingEnchancedFeatureConfig,
    ColumnOrderingEnchancedFeature,
    type ColumnOrderingEnchancedFeatureConfig,
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



export type TzezarsDatagridConfig<TOriginalRow = any> = GridConfig<TOriginalRow> & {
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;
    extra?: TzezarsDatagridExtraStateConfig;
}


export type TrzezarsDatagridFeatures = {
    clickToCopy: ClickToCopyFeature,
    columnFiltering: ColumnFilteringEnchancedFeature,
    columnPinning: ColumnPinningEnchancedFeature,
    columnSizing: ColumnSizingEnchancedFeature,
    columnVisibility: ColumnVisibilityEnchancedFeature,
    credentials: CredentialsFeature,
    densityToggle: DensityToggleFeature,
    exporting: ExportingFeature,
    fullscreen: FullscreenFeature,
    globalSearch: GlobalSearchEnchancedFeature,
    groupHeadersVisibility: GroupHeadersVisibilityFeature,
    grouping: GroupingEnchancedFeature,
    loadingIndicator: StatusIndicatorFeature,
    pagination: PaginationEnchancedFeature,
    rowExpanding: RowExpandingEnchancedFeature,
    rowNumbers: RowNumbersFeature,
    rowSelection: RowSelectionEnchancedFeature,
    sorting: SortingEnchancedFeature,
    columnOrdering: ColumnOrderingEnchancedFeature,
    controlCenter: ControlCenterFeature,
    animations: AnimationsFeature,
    overlay: OverlayFeature
}




export type TzezarsDatagridExtraStateConfig = {
    features?: {
        clickToCopy?: ClickToCopyFeatureConfig,
        columnFiltering?: ColumnFilteringEnchancedFeatureConfig,
        columnPinning?: ColumnPinningEnchancedFeatureConfig,
        columnSizing?: ColumnSizingEnchancedFeatureConfig,
        columnVisibility?: ColumnVisibilityEnchancedFeatureConfig,
        credentials?: CredentialsFeatureConfig,
        densityToggle?: DensityToggleFeatureConfig,
        exporting?: ExportingFeatureConfig,
        fullscreen?: FullscreenFeatureConfig,
        globalSearch?: GlobalSearchEnchancedFeatureConfig,
        groupHeadersVisibility?: GroupHeadersVisibilityFeatureConfig,
        grouping?: GroupingEnchancedFeatureConfig & GroupingFeatureConfig,
        statusIndicator?: StatusIndicatorFeatureConfig,
        pagination?: PaginationEnchancedFeatureConfig & PaginationFeatureConfig,
        rowExpanding?: RowExpandingEnchancedFeatureConfig,
        rowNumbers?: RowNumbersFeatureConfig,
        rowSelection?: RowSelectionEnchancedFeatureConfig,
        sorting?: SortingEnchancedFeatureConfig & SortingFeatureConfig
        columnOrdering?: ColumnOrderingEnchancedFeatureConfig & ColumnOrderingFeatureConfig
        controlCenter?: ControlCenterFeatureConfig,
        animations?: AnimationsFeatureConfig,
        overlay?: OverlayFeatureConfig
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

const createAdditionalColumns = (datagrid: TzezarsDatagrid): {
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
            leftCols.push(createColumn('left', 'selection', RowSelectionCell, RowSelectionColumnHeaderCell));
        }

        if (rowSelection?.position === 'right') {
            rightCols.push(createColumn('right', 'selection', RowSelectionCell, RowSelectionColumnHeaderCell));
        }

    }

    if (rowExpanding?.displayBuiltInComponents === true) {
        if (rowExpanding?.position === 'right') {
            rightCols.push(createColumn('right', 'expand', RowExpandingCell, RowExpandingColumnHeaderCell));
        }
        if (rowExpanding?.position === 'left') {
            leftCols.push(createColumn('left', 'expand', RowExpandingCell, RowExpandingColumnHeaderCell));
        }
    }


    return { leftCols, rightCols };
};


export class TzezarsDatagrid<TOriginalRow = any> extends DataGrid<TOriginalRow> {
    extra: Extra;

    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        super(config, true);
        this.extra = new Extra(this, config.extra);

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

    isFullscreenEnabled(): boolean {
        return this.extra.features.fullscreen.isFullscreen;
    }
}





export class Extra {
    datagrid: TzezarsDatagrid<any>;
    title: string | undefined;
    features = {} as TrzezarsDatagridFeatures;

    constructor(datagrid: TzezarsDatagrid<any>, config?: TzezarsDatagridExtraStateConfig) {
        this.datagrid = datagrid;
        this.initializeFeatures(config);
        this.title = config?.title || "Your data, Tzezar's Datagrid"
    }

    initializeFeatures(config?: TzezarsDatagridExtraStateConfig) {
        this.features.clickToCopy = new ClickToCopyFeature(this.datagrid, config?.features?.clickToCopy);
        this.features.columnFiltering = new ColumnFilteringEnchancedFeature(this.datagrid, config?.features?.columnFiltering);
        this.features.columnPinning = new ColumnPinningEnchancedFeature(this.datagrid, config?.features?.columnPinning);
        this.features.columnSizing = new ColumnSizingEnchancedFeature(this.datagrid, config?.features?.columnSizing);
        this.features.columnVisibility = new ColumnVisibilityEnchancedFeature(this.datagrid, config?.features?.columnVisibility);
        this.features.credentials = new CredentialsFeature(this.datagrid, config?.features?.credentials);
        this.features.densityToggle = new DensityToggleFeature(this.datagrid, config?.features?.densityToggle);
        this.features.exporting = new ExportingFeature(this.datagrid, config?.features?.exporting);
        this.features.fullscreen = new FullscreenFeature(this.datagrid, config?.features?.fullscreen);
        this.features.globalSearch = new GlobalSearchEnchancedFeature(this.datagrid, config?.features?.globalSearch);
        this.features.groupHeadersVisibility = new GroupHeadersVisibilityFeature(this.datagrid, config?.features?.groupHeadersVisibility);
        this.features.grouping = new GroupingEnchancedFeature(this.datagrid, config?.features?.grouping);
        this.features.loadingIndicator = new StatusIndicatorFeature(this.datagrid, config?.features?.statusIndicator);
        this.features.pagination = new PaginationEnchancedFeature(this.datagrid, config?.features?.pagination);
        this.features.rowExpanding = new RowExpandingEnchancedFeature(this.datagrid, config?.features?.rowExpanding);
        this.features.rowNumbers = new RowNumbersFeature(this.datagrid, config?.features?.rowNumbers);
        this.features.sorting = new SortingEnchancedFeature(this.datagrid, config?.features?.sorting);
        this.features.columnOrdering = new ColumnOrderingEnchancedFeature(this.datagrid, config?.features?.columnOrdering);
        this.features.controlCenter = new ControlCenterFeature(this.datagrid, config?.features?.controlCenter);
        this.features.animations = new AnimationsFeature(this.datagrid, config?.features?.animations);
        this.features.rowSelection = new RowSelectionEnchancedFeature(this.datagrid, config?.features?.rowSelection);
        this.features.overlay = new OverlayFeature(this.datagrid, config?.features?.overlay);
    }

    getTitle(): string | undefined {
        return this.title; // Getter for consistent access
    }

}
