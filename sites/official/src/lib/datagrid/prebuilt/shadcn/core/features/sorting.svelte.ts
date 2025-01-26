import { SortingFeature } from "$lib/datagrid/core/features";
import type { SortingFeatureConfig } from "$lib/datagrid/core/features/sorting.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type SortingEnchancedFeatureConfig = {
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    enableSortingRemoval?: boolean;
} & SortingFeatureConfig

export class SortingEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    enableSorting: boolean = $state(true);
    enableMultiSort: boolean = $state(true);
    // ? not used yet, maybe in future
    enableSortingRemoval: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid<any>, config?: SortingEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): SortingFeature { return this.datagrid.features.sorting }

    initialize(config?: SortingEnchancedFeatureConfig) {
        this.enableSorting = config?.enableSorting ?? this.enableSorting;
        this.enableSortingRemoval = config?.enableSortingRemoval ?? this.enableSortingRemoval;
        this.enableMultiSort = config?.enableMultiSort ?? this.enableMultiSort;
    }


}