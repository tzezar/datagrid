import type { GridBasicRow } from "$lib/datagrid/core/types";


type IStripedRows = {
    enabled: boolean;
    getClasses(row: GridBasicRow<any>, rowIndex: number): string;
}

export type StripedRowsFeatureConfig = {
    enabled?: boolean;
}


export class StripedRowsFeature implements IStripedRows {
    enabled: boolean = $state(true);

    constructor(config?: StripedRowsFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    initialize(config?: StripedRowsFeatureConfig) {
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