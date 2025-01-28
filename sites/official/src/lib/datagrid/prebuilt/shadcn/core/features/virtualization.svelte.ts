import type { TzezarsDatagrid } from "../index.svelte";



export type VirtualizationFeatureConfig = {
    enableVirtualization?: boolean;
}


export class VirtualizationFeature {
    datagrid: TzezarsDatagrid
    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: VirtualizationFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    initialize(config?: VirtualizationFeatureConfig) {
        this.enabled = config?.enableVirtualization ?? this.enabled;
    }

    

}
