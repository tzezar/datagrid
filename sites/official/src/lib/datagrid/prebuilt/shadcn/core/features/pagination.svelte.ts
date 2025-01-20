import { PaginationFeature } from "$lib/datagrid/core/features";
import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { EnchancedFeature } from "./types";



export type PaginationEnchancedFeatureConfig = {
    enabled?: boolean;
    paginationPosition?: 'top' | 'bottom' | 'both';
}

export class PaginationEnchancedFeature<TOriginalRow = any> implements EnchancedFeature {
    base: PaginationFeature<TOriginalRow> = new PaginationFeature<TOriginalRow>({} as DataGrid<TOriginalRow>);
    enabled: boolean = $state(true);
    paginationPosition: 'top' | 'bottom' | 'both' = $state('bottom');

    constructor(datagrid: DataGrid<TOriginalRow>, config?: PaginationEnchancedFeatureConfig & PaginationFeatureConfig) {
        this.initializeBase(datagrid, config);
        this.initialize(config);
    }

    initialize(config?: PaginationEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    initializeBase(datagrid: DataGrid<TOriginalRow>, config?: PaginationFeatureConfig) {
        this.base = datagrid.features.pagination;
        this.base.initialize(config);
    }

    shouldDisplayPagination() {
        return this.enabled;
    }

}