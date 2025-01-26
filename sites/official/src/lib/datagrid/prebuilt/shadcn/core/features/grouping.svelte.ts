import { GroupingFeature } from "$lib/datagrid/core/features";
import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";


export type GroupingEnchancedFeatureConfig = {
    enabled?: boolean;
}

export class GroupingEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: GroupingEnchancedFeatureConfig & GroupingFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);

    }

    get base(): GroupingFeature { return this.datagrid.features.grouping }

    initialize(config?: GroupingEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

}