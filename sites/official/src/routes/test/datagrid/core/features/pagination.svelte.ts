export class Pagination {
    page = $state(1);
    pageSize = $state(10);

    pageCount: number = $state(0)


    

    setPage(page: number) {
        this.page = page;
    }

    canGoToPrevPage () {
        return this.page > 1
    }
    
    canGoToNextPage () {
        return this.page + 1 < this.pageCount
    }

}