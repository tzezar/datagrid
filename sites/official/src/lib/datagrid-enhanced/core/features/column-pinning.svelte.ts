import { ColumnPinningFeature } from "$lib/datagrid/core/features";
import type { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type ColumnPinningEnhancedFeatureConfig = {
    displayControls?: boolean;
} 

export class ColumnPinningEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid
    displayControls: boolean = $state(true);

    constructor(datagrid: EnhancedDatagrid, config?: ColumnPinningEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnPinningFeature { return this.datagrid.features.columnPinning }

    initialize(config?: ColumnPinningEnhancedFeatureConfig) {
        this.displayControls = config?.displayControls ?? this.displayControls;
    }


}