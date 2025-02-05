import { SortingFeature } from "$lib/datagrid/core/features";
import type { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type SortingEnhancedFeatureConfig = {
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    displayInControlCenter?: boolean;
    // enableSortingRemoval?: boolean;
} 

export class SortingEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid

    enableSorting: boolean = $state(true);
    enableMultiSort: boolean = $state(true);
    // enableSortingRemoval: boolean = $state(true);
    displayInControlCenter: boolean = $state(false);

    constructor(datagrid: EnhancedDatagrid<any>, config?: SortingEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): SortingFeature { return this.datagrid.features.sorting }

    initialize(config?: SortingEnhancedFeatureConfig) {
        this.enableSorting = config?.enableSorting ?? this.enableSorting;
        // this.enableSortingRemoval = config?.enableSortingRemoval ?? this.enableSortingRemoval;
        this.enableMultiSort = config?.enableMultiSort ?? this.enableMultiSort;
        this.displayInControlCenter = config?.displayInControlCenter ?? this.displayInControlCenter;
    }


}