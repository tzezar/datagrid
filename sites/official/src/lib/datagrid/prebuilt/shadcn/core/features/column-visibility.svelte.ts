import type { ColumnVisibilityFeature, ColumnVisibilityFeatureConfig } from "$lib/datagrid/core/features/column-visibility.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnVisibilityEnchancedFeatureConfig = {
    enabled?: boolean;
} & ColumnVisibilityFeatureConfig

export class ColumnVisibilityEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnVisibilityEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnVisibilityFeature { return this.datagrid.features.columnVisibility }

    initialize(config?: ColumnVisibilityEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

}