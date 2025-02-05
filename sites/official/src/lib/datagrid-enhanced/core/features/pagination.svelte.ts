import { PaginationFeature } from "$lib/datagrid/core/features";
import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";



export type PaginationEnhancedFeatureConfig = {
    displayPagination?: boolean;
    paginationPosition?: 'top' | 'bottom' | 'both';
}

export class PaginationEnhancedFeature implements EnhancedFeature {
    datagrid: TzezarsDatagrid

    displayPagination: boolean = $state(true);
    paginationPosition: 'top' | 'bottom' | 'both' = $state('bottom');

    constructor(datagrid: TzezarsDatagrid, config?: PaginationEnhancedFeatureConfig & PaginationFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): PaginationFeature { return this.datagrid.features.pagination }

    initialize(config?: PaginationEnhancedFeatureConfig) {
        this.displayPagination = config?.displayPagination ?? this.displayPagination;
    }

    shouldDisplayPagination() {
        return this.displayPagination;
    }

}