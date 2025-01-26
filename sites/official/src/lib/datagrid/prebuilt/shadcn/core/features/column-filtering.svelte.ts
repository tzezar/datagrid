import { ColumnFilteringFeature } from "$lib/datagrid/core/features";
import type { ColumnFilteringFeatureConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnFilteringEnchancedFeatureConfig = {
    enabled?: boolean;
    visible?: boolean;
} & ColumnFilteringFeatureConfig

export class ColumnFilteringEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    enabled: boolean = $state(true);
    isButtonVisible: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnFilteringEnchancedFeatureConfig & ColumnFilteringFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnFilteringFeature { return this.datagrid.features.filtering }

    initialize(config?: ColumnFilteringEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
        this.isButtonVisible = config?.visible ?? this.isButtonVisible;
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }

    toggle() {
        this.enabled = !this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    showButton() {
        this.isButtonVisible = true;
    }

    hideButton() {
        this.isButtonVisible = false;
    }

    toggleButtonVisibility() {
        this.isButtonVisible = !this.isButtonVisible;
    }

    shouldDisplayButton() {
        return this.isButtonVisible;
    }

}