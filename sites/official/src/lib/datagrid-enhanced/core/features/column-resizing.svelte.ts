
export type ColumnSizingEnhancedPluginConfig = {
    columnResizeMode?: 'standard' | 'fluid';
}

export class ColumnSizingEnhancedFeature {

    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(config?: ColumnSizingEnhancedPluginConfig) {
        Object.assign(this, config)

    }


}