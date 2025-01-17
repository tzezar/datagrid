import { SortingFeature } from "$lib/datagrid/core/features";
import type { Sorting } from "$lib/datagrid/core/types";



export class ExtraSortingFeature extends SortingFeature {
    enableSorting: boolean = $state(true);
    isMultiSortEvent: boolean = $state(false) // multi-sorting will be the default click behavior without the need to hold shift
    enableSortingRemoval: boolean = $state(true); // users will not be able to remove a sort on a column
    manualSorting: boolean = $state(false)  // server side sorting
    onSortingChange(sortConfig: Sorting[]) {}
}