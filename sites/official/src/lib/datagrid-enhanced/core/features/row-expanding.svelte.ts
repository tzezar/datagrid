import type { RowExpandingPluginConfig } from "$lib/datagrid/core/features/row-expanding.svelte";
import type { AutoColumnPosition } from "../types";



export type RowExpandingEnhancedPluginConfig = {
    createColumnManually?: boolean;
    enableRowExpanding?: boolean;
    expandingMode?: 'single' | 'multiple';
    maxExpandedRows?: number;
    position?: AutoColumnPosition
}


export class RowExpandingEnhancedFeature  {
    createColumnManually: boolean = $state(false);
    position: AutoColumnPosition = $state('right')

    constructor(config?: RowExpandingEnhancedPluginConfig & RowExpandingPluginConfig) {
        Object.assign(this, config);
    }

    changePosition(position: AutoColumnPosition) {
        // TODO recalculate offset
        this.position = position;
    }

}