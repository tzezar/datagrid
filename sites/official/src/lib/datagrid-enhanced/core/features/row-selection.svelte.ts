import type { EnhancedDatagrid } from "../index.svelte";
import type { AutoColumnPosition } from "../types";


export type RowSelectionEnhancedPluginConfig = {
    enableSelectAll?: boolean;
    enableSelectAllOnPage?: boolean;
    highlightSelectedRow?: boolean;
    position?: AutoColumnPosition
    createColumnManually?: boolean
}


export class RowSelectionEnhancedFeature {
    datagrid: EnhancedDatagrid


    createColumnManually: boolean = $state(false);
    position: AutoColumnPosition = $state('right')
    highlightSelectedRow: boolean = $state(true);
    enableSelectAll: boolean = $state(true);
    enableSelectAllOnPage: boolean = $state(true);

    constructor(datagrid: EnhancedDatagrid, config?: RowSelectionEnhancedPluginConfig) {
        this.datagrid = datagrid;

        this.createColumnManually = config?.createColumnManually ?? this.createColumnManually;
        this.enableSelectAll = config?.enableSelectAll ?? this.enableSelectAll;
        this.enableSelectAllOnPage = config?.enableSelectAllOnPage ?? this.enableSelectAllOnPage;
        this.highlightSelectedRow = config?.highlightSelectedRow ?? this.highlightSelectedRow;
        this.position = config?.position ?? this.position
    }


    changePosition(position: AutoColumnPosition) {
        const col = this.datagrid.features.columnOrdering.findColumnOrThrow('_selection');
        col.state.pinning.position = position;
        
        this.position = position;
        this.datagrid.processors.column.refreshColumnPinningOffsets()
    }

}