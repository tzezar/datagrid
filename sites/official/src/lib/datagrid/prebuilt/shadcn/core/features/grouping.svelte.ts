import { GroupingFeature } from "$lib/datagrid/core/features";
import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";
import { DataGrid } from "$lib/datagrid/core/index.svelte";


export type ExtraGroupingFeatureConfig = {
    enableGrouping?: boolean;
    onGroupingChange?(expandedGroups: string[]): void;
}


export class ExtraGroupingFeature {
    base: GroupingFeature = new GroupingFeature();


    enableGrouping: boolean = $state(true);
    onGroupingChange: (expandedGroups: string[]) => void = () => { };
    constructor(datagrid: DataGrid<any>, config?: ExtraGroupingFeatureConfig & GroupingFeatureConfig) {
        this.base = new GroupingFeature(config);

        if (config) {
            this.enableGrouping = config.enableGrouping ?? this.enableGrouping;
            this.onGroupingChange = config.onGroupingChange ?? this.onGroupingChange;
        }
    }
}