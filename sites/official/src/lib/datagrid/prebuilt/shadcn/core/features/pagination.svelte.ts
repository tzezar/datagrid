import { PaginationFeature } from "$lib/datagrid/core/features";
import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";



export type PaginationEnchancedFeatureConfig = {
    displayPagination?: boolean;
    paginationPosition?: 'top' | 'bottom' | 'both';
}

export class PaginationEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    displayPagination: boolean = $state(true);
    paginationPosition: 'top' | 'bottom' | 'both' = $state('bottom');

    constructor(datagrid: TzezarsDatagrid, config?: PaginationEnchancedFeatureConfig & PaginationFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): PaginationFeature { return this.datagrid.features.pagination }

    initialize(config?: PaginationEnchancedFeatureConfig) {
        this.displayPagination = config?.displayPagination ?? this.displayPagination;
    }

    shouldDisplayPagination() {
        return this.displayPagination;
    }

}