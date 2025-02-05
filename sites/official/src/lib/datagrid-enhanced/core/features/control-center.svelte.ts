
export type ControlCenterPluginConfig = {
    displayControlCenter?: boolean;
}


export class ControlCenterFeature  {

    displayControlCenter: boolean = $state(true);

    constructor(config?: ControlCenterPluginConfig) {
        this.displayControlCenter = config?.displayControlCenter ?? this.displayControlCenter;
    }


}