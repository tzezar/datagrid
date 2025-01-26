import type { TzezarsDatagrid } from "../index.svelte";
import type { Feature } from "./types";

export type ControlCenterFeatureConfig = {
    enableControlCenter?: boolean;
}


export class ControlCenterFeature implements Feature {
    datagrid: TzezarsDatagrid

    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ControlCenterFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: ControlCenterFeatureConfig) {
        this.enabled = config?.enableControlCenter ?? this.enabled;
    }

}