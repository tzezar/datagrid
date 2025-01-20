import { ColumnOrderingFeature } from "$lib/datagrid/core/features";
import type { ColumnOrderingFeatureConfig } from "$lib/datagrid/core/features/column-ordering.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnOrderingEnchancedFeatureConfig = {
    enableColumnOrdering?: boolean;
}

export class ColumnOrderingEnchancedFeature implements EnchancedFeature {
    base: ColumnOrderingFeature<any> = new ColumnOrderingFeature({} as DataGrid<any>);
    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnOrderingEnchancedFeatureConfig) {
        this.initializeBase(datagrid);
        this.initialize(config);
    }

    initializeBase(datagrid: TzezarsDatagrid, config?: ColumnOrderingFeatureConfig) {
        this.base = datagrid.features.columnOrdering;
        this.base.initialize(config);
    }

    initialize(config?: ColumnOrderingEnchancedFeatureConfig) {
        this.enabled = config?.enableColumnOrdering ?? this.enabled;
    }


}