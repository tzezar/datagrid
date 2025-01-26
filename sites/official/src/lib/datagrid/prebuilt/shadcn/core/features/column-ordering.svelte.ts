import { ColumnOrderingFeature } from "$lib/datagrid/core/features";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnOrderingEnchancedFeatureConfig = {
    enableColumnOrdering?: boolean;
}

export class ColumnOrderingEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid
    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnOrderingEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnOrderingFeature { return this.datagrid.features.columnOrdering }

    initialize(config?: ColumnOrderingEnchancedFeatureConfig) {
        this.enabled = config?.enableColumnOrdering ?? this.enabled;
    }

}