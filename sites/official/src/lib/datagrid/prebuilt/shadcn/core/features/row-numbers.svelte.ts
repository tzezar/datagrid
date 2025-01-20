

export type RowNumbersFeatureConfig = {
    enableRowNumbers?: boolean;
    rowNumberMode?: 'original' | 'static';
}

export class RowNumbersFeature {
    enableRowNumbers: boolean = $state(true);
    rowNumberMode: 'original' | 'static' = $state('static');

    constructor(config?: RowNumbersFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: RowNumbersFeatureConfig) {
        this.enableRowNumbers = config?.enableRowNumbers ?? this.enableRowNumbers;
        this.rowNumberMode = config?.rowNumberMode ?? this.rowNumberMode;
    }

}