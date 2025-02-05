export type ColumnOrderingEnhancedPluginConfig = {
    enableInControlCenter?: boolean;
    enableInHeaderCellDropdownMenu?: boolean;
}

export class ColumnOrderingEnhancedFeature {

    enableInControlCenter: boolean = $state(false);
    enableInHeaderCell: boolean = $state(false);


    constructor(config?: ColumnOrderingEnhancedPluginConfig) {
        this.enableInControlCenter = config?.enableInControlCenter ?? this.enableInControlCenter;
        this.enableInHeaderCell = config?.enableInHeaderCellDropdownMenu ?? this.enableInHeaderCell;
    }
}


