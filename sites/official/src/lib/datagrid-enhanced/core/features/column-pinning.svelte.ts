export type ColumnPinningEnhancedPluginConfig = {

    enableInControlCenter?: boolean;
    enableInHeaderCell?: boolean;
}

export class ColumnPinningEnhancedFeature {

    enableInControlCenter: boolean = $state(true);
    enableInHeaderCell: boolean = $state(true);

    constructor(config?: ColumnPinningEnhancedPluginConfig) {
        this.enableInControlCenter = config?.enableInControlCenter ?? this.enableInControlCenter;
        this.enableInHeaderCell = config?.enableInHeaderCell ?? this.enableInHeaderCell;
    }

}