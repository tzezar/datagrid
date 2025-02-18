import type { RowExpansionConfig } from "$lib/datagrid/core/features/row-expanding.svelte";
import type { EnhancedDatagrid } from "../index.svelte";
import type { AutoColumnPosition } from "../types";



export type RowExpandingEnhancedPluginConfig = {
    createColumnManually?: boolean;
    enableRowExpanding?: boolean;
    expandingMode?: 'single' | 'multiple';
    maxExpandedRows?: number;
    position?: AutoColumnPosition
}


export class RowExpandingEnhancedFeature  {
    datagrid: EnhancedDatagrid
    
    createColumnManually: boolean = $state(false);
    position: AutoColumnPosition = $state('right')

    constructor(datagrid: EnhancedDatagrid, config?: RowExpandingEnhancedPluginConfig & RowExpansionConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    changePosition(position: AutoColumnPosition) {
        const col = this.datagrid.features.columnOrdering.findColumnOrThrow('_expand');
        col.state.pinning.position = position;
        
        this.position = position;
        this.datagrid.processors.column.refreshColumnPinningOffsets()
    }

}