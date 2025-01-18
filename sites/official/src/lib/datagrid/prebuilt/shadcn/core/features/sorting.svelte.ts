import { SortingFeature } from "$lib/datagrid/core/features";
import type { SortingFeatureConfig } from "$lib/datagrid/core/features/sorting.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { TzezarsDatagrid } from "../index.svelte";

export type ExtraSortingFeatureConfig = {
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    enableSortingRemoval?: boolean;
} & SortingFeatureConfig

export class ExtraSortingFeature {
    base: SortingFeature = new SortingFeature({} as DataGrid<any>);

    enableSorting: boolean = $state(true);
    enableMultiSort: boolean = $state(true);
    // ? not used yet
    enableSortingRemoval: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid<any>, config?: ExtraSortingFeatureConfig) {
        this.base = datagrid.features.sorting
        this.base.initialize(config);

        if (config) {
            this.enableSorting = config.enableSorting ?? this.enableSorting;
            this.enableSortingRemoval = config.enableSortingRemoval ?? this.enableSortingRemoval;
            this.enableMultiSort = config.enableMultiSort ?? this.enableMultiSort;
        }
    }

}