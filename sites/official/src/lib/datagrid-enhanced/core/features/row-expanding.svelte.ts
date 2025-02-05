import { RowExpandingFeature } from "$lib/datagrid/core/features";
import type { RowExpandingFeatureConfig } from "$lib/datagrid/core/features/row-expanding.svelte";
import { EnhancedDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";


const DEFAULT_MAX_EXPANDED_ROWS = 999999999;

export type RowExpandingEnhancedFeatureConfig = {
    displayBuiltInComponents?: boolean;
    enableRowExpanding?: boolean;
    expandingMode?: 'single' | 'multiple';
    expandingPosition?: 'left' | 'right';
    maxExpandedRows?: number;
    position: 'left' | "right" | 'none'
}


export class RowExpandingEnhancedFeature implements EnhancedFeature {
    datagrid: EnhancedDatagrid
    displayBuiltInComponents: boolean = $state(false);
    expandingMode: 'single' | 'multiple' = $state('single');
    expandingPosition: 'left' | 'right' = $state('left');
    maxExpandedRows: number = $state(DEFAULT_MAX_EXPANDED_ROWS);
    position: "left" | "right" | 'none' = $state('right')

    constructor(datagrid: EnhancedDatagrid, config?: RowExpandingEnhancedFeatureConfig & RowExpandingFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): RowExpandingFeature { return this.datagrid.features.rowExpanding }

    initialize(config?: RowExpandingEnhancedFeatureConfig) {
        this.displayBuiltInComponents = config?.displayBuiltInComponents ?? this.displayBuiltInComponents;
        this.expandingMode = config?.expandingMode ?? this.expandingMode;
        this.expandingPosition = config?.expandingPosition ?? this.expandingPosition;
        this.maxExpandedRows = config?.maxExpandedRows ?? this.maxExpandedRows;
        this.position = config?.position ?? this.position
    }

}