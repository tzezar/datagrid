export type ControlCenterFeatureConfig = {
    enableControlCenter?: boolean;
}


export class ControlCenterFeature {
    enableControlCenter: boolean = $state(true);

    constructor(config?: ControlCenterFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: ControlCenterFeatureConfig) {
        this.enableControlCenter = config?.enableControlCenter ?? this.enableControlCenter;
    }

}