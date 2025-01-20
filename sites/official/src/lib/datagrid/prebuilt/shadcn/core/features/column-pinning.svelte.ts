import { ColumnPinningFeature } from "$lib/datagrid/core/features";
import type { ColumnPinningFeatureConfig } from "$lib/datagrid/core/features/column-pinning.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnPinningEnchancedFeatureConfig = {
    enableColumnPinning?: boolean;
} & ColumnPinningFeatureConfig

export class ColumnPinningEnchancedFeature implements EnchancedFeature {
    base: ColumnPinningFeature = new ColumnPinningFeature({} as DataGrid);
    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnPinningEnchancedFeatureConfig) {
        this.initializeBase(datagrid, config);
        this.initialize(config);
    }

    initialize(config?: ColumnPinningEnchancedFeatureConfig) {
        this.enabled = config?.enableColumnPinning ?? this.enabled;
    }

    initializeBase(datagrid: TzezarsDatagrid, config?: ColumnPinningFeatureConfig) {
        this.base = datagrid.features.columnPinning;
        this.base.initialize(config);
    }



}