import type { GroupingFeatureConfig } from "$lib/datagrid/core/features/grouping.svelte";


export type GroupingEnhancedFeatureConfig = {
    enableInControlCenter?: boolean;
}

export class GroupingEnhancedFeature {

    enableInControlCenter: boolean = $state(true);

    constructor(config?: GroupingEnhancedFeatureConfig & GroupingFeatureConfig) {
        this.enableInControlCenter = config?.enableInControlCenter ?? this.enableInControlCenter;

    }

}