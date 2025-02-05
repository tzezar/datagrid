import type { AutoColumnPosition } from "../types";


export type RowSelectionEnhancedPluginConfig = {
    enableSelectAll?: boolean;
    enableSelectAllOnPage?: boolean;
    highlightSelectedRow?: boolean;
    position?: AutoColumnPosition
    createColumnManually?: boolean
}


export class RowSelectionEnhancedFeature {

    createColumnManually: boolean = $state(true);
    position: AutoColumnPosition = $state('right')
    highlightSelectedRow: boolean = $state(true);
    enableSelectAll: boolean = $state(true);
    enableSelectAllOnPage: boolean = $state(true);

    constructor(config?: RowSelectionEnhancedPluginConfig) {
        this.createColumnManually = config?.createColumnManually ?? this.createColumnManually;
        this.enableSelectAll = config?.enableSelectAll ?? this.enableSelectAll;
        this.enableSelectAllOnPage = config?.enableSelectAllOnPage ?? this.enableSelectAllOnPage;
        this.highlightSelectedRow = config?.highlightSelectedRow ?? this.highlightSelectedRow;
        this.position = config?.position ?? this.position
    }

}