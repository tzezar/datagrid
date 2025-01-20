import { GroupingFeature } from "$lib/datagrid/core/features";
import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";
import { DataGrid } from "$lib/datagrid/core/index.svelte";


export type ExtraGroupingFeatureConfig = {
    enableGrouping?: boolean;
}

export class ExtraGroupingFeature {
    base: GroupingFeature = new GroupingFeature();
    enableGrouping: boolean = $state(true);
    
    constructor(datagrid: DataGrid<any>, config?: ExtraGroupingFeatureConfig & GroupingFeatureConfig) {
        this.base = datagrid.features.grouping;
        this.base.initialize(config);

        if (config) {
            this.enableGrouping = config.enableGrouping ?? this.enableGrouping;
        }
    }
}