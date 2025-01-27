import { ColumnPinningFeature } from "$lib/datagrid/core/features";
import type { ColumnPinningFeatureConfig } from "$lib/datagrid/core/features/column-pinning.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnPinningEnchancedFeatureConfig = {
    displayControls?: boolean;
} & ColumnPinningFeatureConfig

export class ColumnPinningEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid
    displayControls: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnPinningEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnPinningFeature { return this.datagrid.features.columnPinning }

    initialize(config?: ColumnPinningEnchancedFeatureConfig) {
        this.displayControls = config?.displayControls ?? this.displayControls;
    }


}