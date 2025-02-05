import { SortingFeature } from "$lib/datagrid/core/features";
import type { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type SortingEnhancedPluginConfig = {
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    displayInControlCenter?: boolean;
} 

export class SortingEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid

    enableInControlCenter: boolean = $state(false);
    enableInHeaderCell: boolean = $state(false);

    enableSorting: boolean = $state(true);
    displayInControlCenter: boolean = $state(false);

    constructor(datagrid: EnhancedDatagrid<any>, config?: SortingEnhancedPluginConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): SortingFeature { return this.datagrid.features.sorting }

    initialize(config?: SortingEnhancedPluginConfig) {
        this.enableSorting = config?.enableSorting ?? this.enableSorting;
        this.displayInControlCenter = config?.displayInControlCenter ?? this.displayInControlCenter;
    }


}