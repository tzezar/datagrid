import type { AnyColumn, ColumnId } from "$lib/datagrid/core/types";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { ColumnProcessor } from "$lib/datagrid/core/processors";
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
        animations?: AnimationsFeatureConfig
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

        // If the column is not found or is the first in the pinned list, return 0
        if (index === -1 || index === 0) {
            return 0;
        }

        // Calculate the total width of all columns before the specified column
        const widthSumOfPreviousIndexes = pinnedColumns
            .slice(0, index) // Get all columns before the specified column
            .reduce((sum, column) => {
                // Use a default width of 0 if column width is not defined
                const width = column.state.size.width || 0;
                return sum + width;
            }, 0);

        return widthSumOfPreviousIndexes; // Return the total width as the offset
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


export class TzezarsDatagrid<TOriginalRow = any> extends DataGrid<TOriginalRow> {
    extra: Extra;

    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        const columnProcessor = new ColumnProcessor<TOriginalRow>({} as DataGrid<TOriginalRow>);
        config.lifecycleHooks = new LifecycleHooks<TOriginalRow>();
        config.lifecycleHooks.register(
            LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS,
            (columns: AnyColumn<TOriginalRow>[]) => {
                const flattenedColumns = flattenColumnStructureAndClearGroups([...columns]);

                const additionalColumns = [
                    createDisplayColumn({
                        header: '',
                        columnId: 'selection',
                        cell: () => {
                            return {
                                component: RowSelectionCell,
                            }
                        },
                        state: {
                            pinning: {
                                position: 'left',
                            },
                            size: {
                                maxWidth: 40,
                                minWidth: 40,
                                width: 40
                            }
                        },
                        headerCell: () => {
                            return {
                                component: RowSelectionColumnHeaderCell
                            }
                        }
                    }),
                    createDisplayColumn({
                        header: '',
                        columnId: 'expand',
                        cell: () => {
                            return {
                                component: RowExpandingCell,
                            }
                        },
                        state: {
                            pinning: {
                                position: 'left',
                            },
                            size: {
                                maxWidth: 40,
                                minWidth: 40,
                                width: 40
                            }
                        },
                        headerCell: ({column}) => {
                            return {
                                component: RowExpandingColumnHeaderCell,
                                props: {
                                    column
                                }
                            }
                        }
                    })
                ]

                let transformedColumns = transformColumns([...additionalColumns, ...flattenedColumns,]);
                transformedColumns = updateColumnPinningOffsets(transformedColumns);

                // const transformedColumns = transformColumns([...flattenedColumns]);
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
        this.features.columnFiltering = new ColumnFilteringEnchancedFeature(this.datagrid, config?.features?.columnFiltering);
        this.features.columnPinning = new ColumnPinningEnchancedFeature(this.datagrid, config?.features?.columnPinning);
        this.features.columnSizing = new ColumnSizingEnchancedFeature(this.datagrid, config?.features?.columnSizing);
        this.features.columnVisibility = new ColumnVisibilityEnchancedFeature(this.datagrid, config?.features?.columnVisibility);
        this.features.credentials = new CredentialsFeature(config?.features?.credentials);
        this.features.densityToggle = new DensityToggleFeature(config?.features?.densityToggle);
        this.features.exporting = new ExportingFeature(this.datagrid, config?.features?.exporting);
        this.features.fullscreen = new FullscreenFeature(config?.features?.fullscreen);
        this.features.globalSearch = new GlobalSearchEnchancedFeature(this.datagrid, config?.features?.globalSearch);
        this.features.groupHeadersVisibility = new GroupHeadersVisibilityFeature(config?.features?.groupHeadersVisibility);
        this.features.grouping = new GroupingEnchancedFeature(this.datagrid, config?.features?.grouping);
        this.features.loadingIndicator = new StatusIndicatorFeature(config?.features?.statusIndicator);
        this.features.pagination = new PaginationEnchancedFeature(this.datagrid, config?.features?.pagination);
        this.features.rowExpanding = new RowExpandingEnchancedFeature(this.datagrid, config?.features?.rowExpanding);
        this.features.rowNumbers = new RowNumbersFeature(config?.features?.rowNumbers);
        this.features.rowSelection = new RowSelectionEnchancedFeature(this.datagrid, config?.features?.rowSelection);
        this.features.sorting = new SortingEnchancedFeature(this.datagrid, config?.features?.sorting);
        this.features.columnOrdering = new ColumnOrderingEnchancedFeature(this.datagrid, config?.features?.columnOrdering);
        this.features.controlCenter = new ControlCenterFeature(config?.features?.controlCenter);
        this.features.animations = new AnimationsFeature(config?.features?.animations);
    }



    getTitle(): string | undefined {
        return this.title; // Getter for consistent access
    }

}
