


export type RowActionsFeatureConfig = {
    enableRowActions?: boolean;
    positionRowActions?: 'left' | 'right';
    onRowActionClick?(row: any, action: string): void;
}


export class RowActionsFeature {
    enableRowActions: boolean = $state(true);
    positionRowActions: 'left' | 'right' = $state('right');

    onRowActionClick: (row: any, action: string) => void = () => { };

    constructor(config?: RowActionsFeatureConfig) {
        if (config) {
            this.enableRowActions = config.enableRowActions ?? this.enableRowActions;
            this.positionRowActions = config.positionRowActions ?? this.positionRowActions;
            this.onRowActionClick = config.onRowActionClick ?? this.onRowActionClick;
        }
    }
}