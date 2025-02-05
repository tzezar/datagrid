import { ColumnPinningFeature } from "$lib/datagrid/core/features";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type ColumnPinningEnhancedFeatureConfig = {
    displayControls?: boolean;
} 

export class ColumnPinningEnhancedFeature implements EnhancedFeature {
    datagrid: TzezarsDatagrid
    displayControls: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnPinningEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnPinningFeature { return this.datagrid.features.columnPinning }

    initialize(config?: ColumnPinningEnhancedFeatureConfig) {
        this.displayControls = config?.displayControls ?? this.displayControls;
    }


}