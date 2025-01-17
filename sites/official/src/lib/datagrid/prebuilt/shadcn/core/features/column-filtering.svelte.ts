


export class ColumnFilteringFeature {
    enabled: boolean = $state(true);
    onColumnFilteringChange?: (filteredColumns: string[]) => void



    showColumnFiltering: boolean = $state(false);

    constructor() {
    }

    enableColumnFiltering() {
        this.showColumnFiltering = true;
    }

    disableColumnFiltering() {
        this.showColumnFiltering = false;
    }

    toggleColumnFiltering() {
        this.showColumnFiltering = !this.showColumnFiltering;
    }

    isEnabled() {
        return this.showColumnFiltering;
    }


}