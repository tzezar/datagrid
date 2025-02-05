import { ColumnSizingFeature } from "$lib/datagrid/core/features";
import type { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type ColumnSizingEnhancedFeatureConfig = {
    displayControls?: boolean;
    columnResizeMode?: 'standard' | 'fluid';
} 

export class ColumnSizingEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid

    displayControls: boolean = $state(true);
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(datagrid: EnhancedDatagrid, config?: ColumnSizingEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnSizingFeature { return this.datagrid.features.columnSizing }

    initialize(config?: ColumnSizingEnhancedFeatureConfig) {
        this.displayControls = config?.displayControls ?? this.displayControls;
        this.columnResizeMode = config?.columnResizeMode ?? this.columnResizeMode;
    }

}