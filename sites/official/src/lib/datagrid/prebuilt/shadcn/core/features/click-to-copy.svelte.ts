
export type ClickToCopyFeatureConfig = {
    enableClickToCopy?: boolean;
    onClickToCopy?(row: any, column: any): void;
}


export class ClickToCopyFeature {
    enableClickToCopy: boolean = $state(true);
    onClickToCopy: (row: any, column: any) => void = () => { };

    constructor(config?: ClickToCopyFeatureConfig) {
        if (config) {
            this.enableClickToCopy = config.enableClickToCopy ?? this.enableClickToCopy;
            this.onClickToCopy = config.onClickToCopy ?? this.onClickToCopy;
        }
    }
}