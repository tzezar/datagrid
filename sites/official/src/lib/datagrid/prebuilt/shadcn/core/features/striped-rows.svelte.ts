import type { GridBasicRow } from "$lib/datagrid/core/types";
import type { TzezarsDatagrid } from "../index.svelte";


export type StripedRowsFeatureConfig = {
    enableStripedRows?: boolean;
}


export class StripedRowsFeature {
    datagrid: TzezarsDatagrid
    enabled: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: StripedRowsFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    initialize(config?: StripedRowsFeatureConfig) {
        this.enabled = config?.enableStripedRows ?? this.enabled;
    }

    applyStripedRows(row: GridBasicRow<any>, rowIndex: number) {
        let styles = ''
        if (!this.enabled) return styles
        if (rowIndex % 2 === 0) {
            styles += 'bg-secondary/30'
        }
        if (rowIndex % 2 === 1) {
            styles += 'bg-secondary/90'
        }
        return styles
    }

}