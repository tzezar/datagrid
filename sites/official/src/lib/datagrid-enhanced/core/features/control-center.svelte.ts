import type { EnhancedDatagrid } from "../index.svelte";
import type { Feature } from "./types";

export type ControlCenterFeatureConfig = {
    displayControlCenter?: boolean;
}


export class ControlCenterFeature implements Feature {
    datagrid: EnhancedDatagrid

    displayControlCenter: boolean = $state(true);

    constructor(datagrid: EnhancedDatagrid, config?: ControlCenterFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: ControlCenterFeatureConfig) {
        this.displayControlCenter = config?.displayControlCenter ?? this.displayControlCenter;
    }

}