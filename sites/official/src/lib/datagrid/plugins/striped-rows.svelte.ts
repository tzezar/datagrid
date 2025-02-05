import type { GridBasicRow } from "$lib/datagrid/core/types";


type IStripedRows = {
    enabled: boolean;
    getClasses(row: GridBasicRow<any>, rowIndex: number): string;
}

export type StripedRowsPluginConfig = {
    enabled?: boolean;
}


export class StripedRowsPlugin implements IStripedRows {
    enabled: boolean = $state(true);

    constructor(config?: StripedRowsPluginConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    initialize(config?: StripedRowsPluginConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    getClasses(row: GridBasicRow<any>, rowIndex: number) {
        let styles = ''
        if (!this.enabled) return styles
        if (rowIndex % 2 === 0) {
            styles += 'bg-grid-secondary'
        } else if (rowIndex % 2 === 1) {
            styles += 'bg-grid-primary'
        }
        return styles
    }

}