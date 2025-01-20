import { SortingFeature } from "$lib/datagrid/core/features";
import type { SortingFeatureConfig } from "$lib/datagrid/core/features/sorting.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type SortingEnchancedFeatureConfig = {
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    enableSortingRemoval?: boolean;
} & SortingFeatureConfig

export class SortingEnchancedFeature implements EnchancedFeature {
    base: SortingFeature = new SortingFeature({} as DataGrid<any>);

    enableSorting: boolean = $state(true);
    enableMultiSort: boolean = $state(true);
    // ? not used yet, maybe in future
    enableSortingRemoval: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid<any>, config?: SortingEnchancedFeatureConfig) {
        this.initializeBase(datagrid, config);
        this.initialize(config);
    }

    initialize(config?: SortingEnchancedFeatureConfig) {
        this.enableSorting = config?.enableSorting ?? this.enableSorting;
        this.enableSortingRemoval = config?.enableSortingRemoval ?? this.enableSortingRemoval;
        this.enableMultiSort = config?.enableMultiSort ?? this.enableMultiSort;
    }

    initializeBase(datagrid: TzezarsDatagrid<any>, config?: SortingFeatureConfig) {
        this.base = datagrid.features.sorting
        this.base.initialize(config);
    }

}