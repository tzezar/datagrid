import type { RowExpandingFeatureConfig } from "$lib/datagrid/core/features/row-expanding.svelte";
import { EnhancedDatagrid } from "../index.svelte";
import type { AutoColumnPosition } from "../types";



export type RowExpandingEnhancedFeatureConfig = {
    createColumnManually?: boolean;
    enableRowExpanding?: boolean;
    expandingMode?: 'single' | 'multiple';
    maxExpandedRows?: number;
    position?: AutoColumnPosition
}


export class RowExpandingEnhancedFeature  {
    createColumnManually: boolean = $state(false);
    position: AutoColumnPosition = $state('right')

    constructor(datagrid: EnhancedDatagrid, config?: RowExpandingEnhancedFeatureConfig & RowExpandingFeatureConfig) {

        Object.assign(this, config);
    }



}