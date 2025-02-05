
export type ColumnSizingEnhancedFeatureConfig = {
    enableInControlCenter?: boolean;
    columnResizeMode?: 'standard' | 'fluid';
}

export class ColumnSizingEnhancedFeature {

    enableInControlCenter: boolean = $state(true);
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(config?: ColumnSizingEnhancedFeatureConfig) {
        this.enableInControlCenter = config?.enableInControlCenter ?? this.enableInControlCenter;
    }


}