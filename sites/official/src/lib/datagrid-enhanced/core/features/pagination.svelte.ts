import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";

export type PaginationPosition = 'top' | 'bottom' | 'both' | 'none';

export type PaginationEnhancedFeatureConfig = {
    paginationPosition?: PaginationPosition;
}

type IPaginationEnhancedFeature = {
    paginationPosition: PaginationPosition;
}


export class PaginationEnhancedFeature implements IPaginationEnhancedFeature {
    paginationPosition: PaginationPosition = $state('bottom');

    constructor(config?: PaginationEnhancedFeatureConfig & PaginationFeatureConfig) {
        this.paginationPosition = config?.paginationPosition ?? this.paginationPosition;
    }

    isPaginationVisible() {
        return this.paginationPosition !== 'none'
    }

}