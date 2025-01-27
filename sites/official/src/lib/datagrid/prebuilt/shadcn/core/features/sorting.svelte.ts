import { SortingFeature } from "$lib/datagrid/core/features";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type SortingEnchancedFeatureConfig = {
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    displayInControlCenter?: boolean;
    // enableSortingRemoval?: boolean;
} 

export class SortingEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    enableSorting: boolean = $state(true);
    enableMultiSort: boolean = $state(true);
    // enableSortingRemoval: boolean = $state(true);
    displayInControlCenter: boolean = $state(false);

    constructor(datagrid: TzezarsDatagrid<any>, config?: SortingEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): SortingFeature { return this.datagrid.features.sorting }

    initialize(config?: SortingEnchancedFeatureConfig) {
        this.enableSorting = config?.enableSorting ?? this.enableSorting;
        // this.enableSortingRemoval = config?.enableSortingRemoval ?? this.enableSortingRemoval;
        this.enableMultiSort = config?.enableMultiSort ?? this.enableMultiSort;
        this.displayInControlCenter = config?.displayInControlCenter ?? this.displayInControlCenter;
    }


}