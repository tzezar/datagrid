import type { TzezarsDatagrid } from "../index.svelte";


export type VirtualizationFeatureConfig = {
    enabled?: boolean;
}

export class VirtualizationFeature {
    datagrid: TzezarsDatagrid
    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: VirtualizationFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    initialize(config?: VirtualizationFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    enableVirtualization() {
        this.enabled = true;
    }

    disableVirtualization() {
        this.enabled = false;
    }

    toggleVirtualization() {
        this.enabled = !this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

}
