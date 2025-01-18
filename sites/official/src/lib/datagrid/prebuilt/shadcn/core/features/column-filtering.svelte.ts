import { ColumnFilteringFeature } from "$lib/datagrid/core/features";
import type { ColumnFilteringFeatureConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { TzezarsDatagrid } from "../index.svelte";


export type ExtraColumnFilteringFeatureConfig = {
    enabled?: boolean;
} & ColumnFilteringFeatureConfig


export class ExtraColumnFilteringFeature {
    base: ColumnFilteringFeature<any> = new ColumnFilteringFeature()
    enabled: boolean = $state(false);

    constructor(datagrid: TzezarsDatagrid, config?: ExtraColumnFilteringFeatureConfig & ColumnFilteringFeatureConfig) {
        this.base = datagrid.features.filtering;
        this.base.initialize(config);

        if (config) {
            this.enabled = config.enabled ?? this.enabled;
        }
    }

    enableColumnFiltering() {
        this.enabled = true;
    }

    disableColumnFiltering() {
        this.enabled = false;
    }

    toggleColumnFiltering() {
        this.enabled = !this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }


}