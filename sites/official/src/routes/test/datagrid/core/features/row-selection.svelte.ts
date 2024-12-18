import { SvelteSet } from "svelte/reactivity";



export class RowSelection {
    selectedRowIds: SvelteSet<string> = $state(new SvelteSet());

    toggleRowSelection(identifier: string) {
        if (this.selectedRowIds.has(identifier)) {
            this.selectedRowIds.delete(identifier);
        } else {
            this.selectedRowIds.add(identifier);
        }
    }

    isRowSelected(identifier: string) {
        return this.selectedRowIds.has(identifier);
    }



}