import type { EnhancedMeta } from "$lib/datagrid-enhanced";
import type { ColumnFilteringPluginConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { DatagridCore } from "$lib/datagrid/core/index.svelte";

export type ColumnFilteringEnhancedPluginConfig = {
    columnFiltersVisible?: boolean;
    isToggleButtonVisible?: boolean;
}

export class ColumnFilteringEnhancedFeature  {
    datagrid: DatagridCore<any, EnhancedMeta>

    columnFiltersVisible: boolean = $state(false);

    constructor(datagrid: DatagridCore, config?: ColumnFilteringEnhancedPluginConfig & ColumnFilteringPluginConfig) {
        this.datagrid = datagrid;
        this.columnFiltersVisible = config?.columnFiltersVisible ?? this.columnFiltersVisible;
    }

    toggle() {
        this.columnFiltersVisible = !this.columnFiltersVisible;
    }

    isEnabled() {
        return this.columnFiltersVisible;
    }

    shouldDisplayHeaderCellFilter() {
        return this.columnFiltersVisible && this.datagrid.columns.some(col => col.options.filterable === true && col._meta.filterType && col.isVisible());
    }

}