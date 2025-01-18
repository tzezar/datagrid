import { SortingFeature } from "$lib/datagrid/core/features";
import type { SortingFeatureConfig } from "$lib/datagrid/core/features/sorting.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { TzezarsDatagrid } from "../index.svelte";



export type ExtraSortingFeatureConfig = {
    enableSorting?: boolean;
    isMultiSortEvent?: boolean;
    enableSortingRemoval?: boolean;
    onSortingChange?(config: ExtraSortingFeatureConfig): void;
}


export class ExtraSortingFeature {
    base: SortingFeatureConfig = new SortingFeature({} as DataGrid<any>);

    enableSorting: boolean = $state(true);
    isMultiSortEvent: boolean = $state(false) // multi-sorting will be the default click behavior without the need to hold shift
    enableSortingRemoval: boolean = $state(true); // users will not be able to remove a sort on a column
    onSortingChange: (config: ExtraSortingFeatureConfig) => void = () => { };

    constructor(datagrid: TzezarsDatagrid<any>, config?: ExtraSortingFeatureConfig & SortingFeatureConfig) {
        this.base = new SortingFeature(datagrid, config);

        if (config) {
            this.enableSorting = config.enableSorting ?? this.enableSorting;
            this.isMultiSortEvent = config.isMultiSortEvent ?? this.isMultiSortEvent;
            this.enableSortingRemoval = config.enableSortingRemoval ?? this.enableSortingRemoval;
            this.onSortingChange = config.onSortingChange ?? this.onSortingChange;
        }
    }

}