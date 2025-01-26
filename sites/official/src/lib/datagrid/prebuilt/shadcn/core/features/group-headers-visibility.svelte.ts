import type { TzezarsDatagrid } from "../index.svelte";
import type { Feature } from "./types";


export type GroupHeadersVisibilityFeatureConfig = {
    showGroupHeaders?: boolean;
}


export class GroupHeadersVisibilityFeature implements Feature {
    datagrid: TzezarsDatagrid

    enableGroupHeadersHiding: boolean = $state(true);
    enableColumnGroupsCreation: boolean = $state(true);
    
    showGroupHeaders: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: GroupHeadersVisibilityFeatureConfig) {
        this.datagrid = datagrid;
        if (config) {
            this.showGroupHeaders = config.showGroupHeaders ?? this.showGroupHeaders;
        }
    }

    show() {
        this.showGroupHeaders = true;
    }

    hide() {
        this.showGroupHeaders = false;
    }

    toggleGroupHeaders() {
        this.showGroupHeaders = !this.showGroupHeaders;
    }

}