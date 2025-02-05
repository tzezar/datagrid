import { ColumnOrderingFeature } from "$lib/datagrid/core/features";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type ColumnOrderingEnhancedFeatureConfig = {
    enableColumnOrdering?: boolean;
}

export class ColumnOrderingEnhancedFeature implements EnhancedFeature {
    datagrid: TzezarsDatagrid

    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnOrderingEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnOrderingFeature { return this.datagrid.features.columnOrdering }

    initialize(config?: ColumnOrderingEnhancedFeatureConfig) {
        this.enabled = config?.enableColumnOrdering ?? this.enabled;
    }

}