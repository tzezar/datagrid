import { RowExpandingFeature } from "$lib/datagrid/core/features";
import type { RowExpandingFeatureConfig } from "$lib/datagrid/core/features/row-expanding.svelte";
import { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";


const DEFAULT_MAX_EXPANDED_ROWS = 999999999;

export type RowExpandingEnchancedFeatureConfig = {
    enableRowExpanding?: boolean;
    expandingMode?: 'single' | 'multiple';
    expandingPosition?: 'left' | 'right';
    maxExpandedRows?: number;
    displayBuiltInButtonPosition: 'left' | "right" | 'none'
} & RowExpandingFeatureConfig


export class RowExpandingEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    enableRowExpanding: boolean = $state(true);
    expandingMode: 'single' | 'multiple' = $state('single');
    expandingPosition: 'left' | 'right' = $state('left');
    maxExpandedRows: number = $state(DEFAULT_MAX_EXPANDED_ROWS);
    displayBuiltInButtonPosition: "left" | "right" | 'none' = $state('left')

    constructor(datagrid: TzezarsDatagrid, config?: RowExpandingEnchancedFeatureConfig & RowExpandingFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): RowExpandingFeature { return this.datagrid.features.rowExpanding }

    initialize(config?: RowExpandingEnchancedFeatureConfig) {
        this.enableRowExpanding = config?.enableRowExpanding ?? this.enableRowExpanding;
        this.expandingMode = config?.expandingMode ?? this.expandingMode;
        this.expandingPosition = config?.expandingPosition ?? this.expandingPosition;
        this.maxExpandedRows = config?.maxExpandedRows ?? this.maxExpandedRows;
        this.displayBuiltInButtonPosition = config?.displayBuiltInButtonPosition ?? this.displayBuiltInButtonPosition
    }

}