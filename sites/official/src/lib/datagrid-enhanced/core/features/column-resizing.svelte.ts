
export type ColumnSizingEnhancedPluginConfig = {
    enableInControlCenter?: boolean;
    columnResizeMode?: 'standard' | 'fluid';
}

export class ColumnSizingEnhancedFeature {

    enableInControlCenter: boolean = $state(true);
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(config?: ColumnSizingEnhancedPluginConfig) {
        this.enableInControlCenter = config?.enableInControlCenter ?? this.enableInControlCenter;
    }


}