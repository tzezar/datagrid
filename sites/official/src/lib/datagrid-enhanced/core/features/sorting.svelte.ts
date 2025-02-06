
export type SortingEnhancedPluginConfig = {
    enableInControlCenter: boolean
    enableInHeaderCell: boolean
} 

export class SortingEnhancedFeature  {

    enableInControlCenter: boolean = $state(true);
    enableInHeaderCell: boolean = $state(true);

    constructor(config?: SortingEnhancedPluginConfig) {
        this.enableInControlCenter = config?.enableInControlCenter ?? this.enableInControlCenter
        this.enableInHeaderCell = config?.enableInHeaderCell ?? this.enableInHeaderCell
    }

}