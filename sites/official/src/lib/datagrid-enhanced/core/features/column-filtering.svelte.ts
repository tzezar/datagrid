import { ColumnFilteringFeature } from "$lib/datagrid/core/features";
import type { ColumnFilteringFeatureConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type ColumnFilteringEnhancedFeatureConfig = {
    columnFiltersVisible?: boolean;
    isToggleButtonVisible?: boolean;
} 

export class ColumnFilteringEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid

    columnFiltersVisible: boolean = $state(false);
    isToggleButtonVisible: boolean = $state(true);

    constructor(datagrid: EnhancedDatagrid, config?: ColumnFilteringEnhancedFeatureConfig & ColumnFilteringFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnFilteringFeature { return this.datagrid.features.filtering }

    initialize(config?: ColumnFilteringEnhancedFeatureConfig) {
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