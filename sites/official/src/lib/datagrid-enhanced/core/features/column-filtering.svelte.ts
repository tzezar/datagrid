import type { EnhancedMeta } from "$lib/datagrid-enhanced";
import type { ColumnFilteringFeatureConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { EnhancedDatagrid } from "../index.svelte";

export type ColumnFilteringEnhancedFeatureConfig = {
    columnFiltersVisible?: boolean;
    isToggleButtonVisible?: boolean;
}

export class ColumnFilteringEnhancedFeature  {
    datagrid: EnhancedDatagrid<any, EnhancedMeta>

    columnFiltersVisible: boolean = $state(false);
    isToggleButtonVisible: boolean = $state(true);

    constructor(datagrid: EnhancedDatagrid, config?: ColumnFilteringEnhancedFeatureConfig & ColumnFilteringFeatureConfig) {
        this.datagrid = datagrid;
        this.columnFiltersVisible = config?.columnFiltersVisible ?? this.columnFiltersVisible;
        this.isToggleButtonVisible = config?.isToggleButtonVisible ?? this.isToggleButtonVisible;
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

    shouldDisplayButton() {
        return this.isToggleButtonVisible;
    }

}