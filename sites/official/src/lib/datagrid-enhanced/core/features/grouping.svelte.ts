import type { GroupingPluginConfig } from "$lib/datagrid/core/features/grouping.svelte";


export type GroupingEnhancedPluginConfig = {
    enableInControlCenter?: boolean;
}

export class GroupingEnhancedFeature {

    enableInControlCenter: boolean = $state(true);

    constructor(config?: GroupingEnhancedPluginConfig & GroupingPluginConfig) {
        this.enableInControlCenter = config?.enableInControlCenter ?? this.enableInControlCenter;

    }

}