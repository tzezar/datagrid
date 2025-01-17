import { PaginationFeature } from "$lib/datagrid/core/features";



export class ExtraPaginationFeature<TOriginalRow> extends PaginationFeature<TOriginalRow> {

    enablePagination: boolean = $state(true);
    manualPagination: boolean = $state(false);
    positionPagination: 'top' | 'bottom' | 'both' = $state('bottom');

    onPaginationChange(page: number, pageSize: number) {
        
    }




}