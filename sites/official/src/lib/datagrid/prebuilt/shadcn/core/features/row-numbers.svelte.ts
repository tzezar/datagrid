



export type RowNumbersFeatureConfig = {
    enableRowNumbers?: boolean;
    rowNumberMode?: 'original' | 'static';
}

export class RowNumbersFeature {
    enableRowNumbers: boolean = $state(true);
    rowNumberMode: 'original' | 'static' = $state('static');

    constructor(config?: RowNumbersFeatureConfig) {
        if (config) {
            this.enableRowNumbers = config.enableRowNumbers ?? this.enableRowNumbers;
            this.rowNumberMode = config.rowNumberMode ?? this.rowNumberMode;
        }
    }
}