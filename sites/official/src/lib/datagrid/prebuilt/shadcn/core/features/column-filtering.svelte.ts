import { ColumnFilteringFeature } from "$lib/datagrid/core/features";
import type { ColumnFilteringFeatureConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnFilteringEnchancedFeatureConfig = {
    columnFiltersVisible?: boolean;
    isToggleButtonVisible?: boolean;
} 

export class ColumnFilteringEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    columnFiltersVisible: boolean = $state(false);
    isToggleButtonVisible: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnFilteringEnchancedFeatureConfig & ColumnFilteringFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnFilteringFeature { return this.datagrid.features.filtering }

    initialize(config?: ColumnFilteringEnchancedFeatureConfig) {
        this.columnFiltersVisible = config?.columnFiltersVisible ?? this.columnFiltersVisible;
        this.isToggleButtonVisible = config?.isToggleButtonVisible ?? this.isToggleButtonVisible;
    }

    disable() {
        this.columnFiltersVisible = false;
    }

    enable() {
        this.columnFiltersVisible = true;
    }

    toggle() {
        this.columnFiltersVisible = !this.columnFiltersVisible;
    }

    isEnabled() {
        return this.columnFiltersVisible;
    }

    showButton() {
        this.isToggleButtonVisible = true;
    }

    hideButton() {
        this.isToggleButtonVisible = false;
    }

    toggleButtonVisibility() {
        this.isToggleButtonVisible = !this.isToggleButtonVisible;
    }

    shouldDisplayButton() {
        return this.isToggleButtonVisible;
    }

}