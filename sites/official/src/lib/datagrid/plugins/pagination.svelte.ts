import type { DatagridCore } from "../core/index.svelte";
import type { DatagridPlugin } from "../core/managers/plugin-manager.svelte";

export type PaginationPosition = 'top' | 'bottom' | 'both' | 'none';

export type PaginationPluginConfig = {
    position?: PaginationPosition;
}

type IPaginationEnhancedFeature = {
    position: PaginationPosition;
}


export class PaginationPlugin implements IPaginationEnhancedFeature {
    position: PaginationPosition = $state('bottom');

    constructor(config?: PaginationPluginConfig) {
        this.position = config?.position ?? this.position;
    }

    isPaginationVisible() {
        return this.position !== 'none'
    }

}

const paginationPlugin: DatagridPlugin<PaginationPlugin> = {
    name: 'pagination',
    initialize: (datagrid: DatagridCore) => {
        // Create a new instance of PaginationPlugin and register it
        const plugin = new PaginationPlugin(datagrid.config.paginationConfig);
        return plugin;
    }
};