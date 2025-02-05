
export type ControlCenterFeatureConfig = {
    displayControlCenter?: boolean;
}


export class ControlCenterFeature  {

    displayControlCenter: boolean = $state(true);

    constructor(config?: ControlCenterFeatureConfig) {
        this.displayControlCenter = config?.displayControlCenter ?? this.displayControlCenter;
    }


}