export type ControlCenterFeatureConfig = {
    enableControlCenter?: boolean;
}


export class ControlCenterFeature {
    enabled: boolean = $state(true);

    constructor(config?: ControlCenterFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: ControlCenterFeatureConfig) {
        this.enabled = config?.enableControlCenter ?? this.enabled;
    }

}