import { BaseService } from "./base-service";

export type PaginationOperations = {
    goToPrevPage: () => void;
    goToNextPage: () => void;
    changePageSize: (newPageSize: number) => void;
    goToPage: (newPage: number) => void;
}

export class PaginationService extends BaseService implements PaginationOperations {
    goToPrevPage() {
        this.datagrid.refresh(() => this.datagrid.features.pagination.goToPrevPage(), {
            recalculateAll: false,
            recalculateGroups: false,
            recalculatePagination: true
        })
    }
    goToNextPage() {
        this.datagrid.refresh(() => this.datagrid.features.pagination.goToNextPage(), {
            recalculateAll: false,
            recalculateGroups: false,
            recalculatePagination: true
        })
    }
    changePageSize(newPageSize: number) {
        this.datagrid.refresh(() => this.datagrid.features.pagination.setPageSize(newPageSize), {
            recalculatePagination: true
        });
    }
    goToPage(newPage: number) {
        this.datagrid.refresh(() => {
            this.datagrid.features.pagination.page = Math.min(
                Math.max(newPage, 1),
                this.datagrid.features.pagination.pageCount
            );
        });
    }
}