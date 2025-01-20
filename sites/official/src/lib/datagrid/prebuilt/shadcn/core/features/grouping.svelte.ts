import { GroupingFeature } from "$lib/datagrid/core/features";
import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";
import { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { EnchancedFeature } from "./types";


export type GroupingEnchancedFeatureConfig = {
    enabled?: boolean;
}

export class GroupingEnchancedFeature implements EnchancedFeature {
    base: GroupingFeature = new GroupingFeature();
    enabled: boolean = $state(true);

    constructor(datagrid: DataGrid<any>, config?: GroupingEnchancedFeatureConfig & GroupingFeatureConfig) {
        this.initializeBase(datagrid, config);
        this.initialize(config);
    }

    initialize(config?: GroupingEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    initializeBase(datagrid: DataGrid<any>, config?: GroupingFeatureConfig) {
        this.base = datagrid.features.grouping;
        this.base.initialize(config);
    }
}