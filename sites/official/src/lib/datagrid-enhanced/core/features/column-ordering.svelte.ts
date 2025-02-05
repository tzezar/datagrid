import { ColumnOrderingFeature } from "$lib/datagrid/core/features";
import type { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type ColumnOrderingEnhancedFeatureConfig = {
    enableColumnOrdering?: boolean;
}

export class ColumnOrderingEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid

    enabled: boolean = $state(true);

    constructor(datagrid: EnhancedDatagrid, config?: ColumnOrderingEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnOrderingFeature { return this.datagrid.features.columnOrdering }

    initialize(config?: ColumnOrderingEnhancedFeatureConfig) {
        this.enabled = config?.enableColumnOrdering ?? this.enabled;
    }

}