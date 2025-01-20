import { ColumnFilteringFeature } from "$lib/datagrid/core/features";
import type { ColumnFilteringFeatureConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { TzezarsDatagrid } from "../index.svelte";


export type ExtraColumnFilteringFeatureConfig = {
    enabled?: boolean;
    visible?: boolean;
} & ColumnFilteringFeatureConfig


export class ExtraColumnFilteringFeature {
    base: ColumnFilteringFeature<any> = new ColumnFilteringFeature()

    enabled: boolean = $state(true);
    visible: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ExtraColumnFilteringFeatureConfig & ColumnFilteringFeatureConfig) {
        this.base = datagrid.features.filtering;
        this.base.initialize(config);

        if (config) {
            this.enabled = config.enabled ?? this.enabled;
            this.visible = config.visible ?? this.visible;
        }
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
        this.visible = true;
    }

    hideButton() {
        this.visible = false;
    }

    toggleButtonVisibility() {
        this.visible = !this.visible;
    }

    isButtonVisible() {
        return this.visible;
    }

}