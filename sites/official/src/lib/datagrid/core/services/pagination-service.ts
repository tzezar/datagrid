import { BaseService } from "./base-service";

export class PaginationService extends BaseService {
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