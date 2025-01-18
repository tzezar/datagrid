import { PaginationFeature } from "$lib/datagrid/core/features";
import type { PaginationFeatureConfig } from "$lib/datagrid/core/features/pagination.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";



export type ExtraPaginationFeatureConfig = {
    enablePagination?: boolean;
    positionPagination?: 'top' | 'bottom' | 'both';
    onPaginationChange?(page: number, pageSize: number): void;
}

export class ExtraPaginationFeature<TOriginalRow> {
    base: PaginationFeature<TOriginalRow> = new PaginationFeature<TOriginalRow>({} as DataGrid<TOriginalRow>);

    enablePagination: boolean = $state(true);
    positionPagination: 'top' | 'bottom' | 'both' = $state('bottom');

    onPaginationChange: (page: number, pageSize: number) => void = () => { };

    constructor(datagrid: DataGrid<TOriginalRow>, config?: ExtraPaginationFeatureConfig & PaginationFeatureConfig) {
        this.base = datagrid.features.pagination;
        this.base.initialize(config);

        if (config) {
            this.enablePagination = config.enablePagination ?? this.enablePagination;
            this.positionPagination = config.positionPagination ?? this.positionPagination;
            this.onPaginationChange = config.onPaginationChange ?? this.onPaginationChange;
        }
    }

}