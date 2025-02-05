import { GroupingFeature } from "$lib/datagrid/core/features";
import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";
import type { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";


export type GroupingEnhancedFeatureConfig = {
    enabled?: boolean;
}

export class GroupingEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid

    enabled: boolean = $state(true);

    constructor(datagrid: EnhancedDatagrid, config?: GroupingEnhancedFeatureConfig & GroupingFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);

    }

    get base(): GroupingFeature { return this.datagrid.features.grouping }

    initialize(config?: GroupingEnhancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

}