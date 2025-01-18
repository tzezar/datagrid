import { ColumnPinningFeature } from "$lib/datagrid/core/features";
import type { ColumnPinningFeatureConfig } from "$lib/datagrid/core/features/column-pinning.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";


export type ExtraColumnPinningFeatureConfig = {
    enableColumnPinning?: boolean;
} & ColumnPinningFeatureConfig

export class ExtraColumnPinningFeature {
    base: ColumnPinningFeature = new ColumnPinningFeature({} as DataGrid<any>);
    enableColumnPinning: boolean = $state(true);

    constructor(datagrid: DataGrid<any>, config?: ExtraColumnPinningFeatureConfig) {
        this.base = datagrid.features.columnPinning;
        this.base.initialize(config);

        if (config) {
            this.enableColumnPinning = config.enableColumnPinning ?? this.enableColumnPinning;
        }
    }
}