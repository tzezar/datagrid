
export type ColumnVisibilityEnhancedFeatureConfig = {
    displayControlCenterControls?: boolean;
    displayInColumnDropdown?: boolean;
}

export class ColumnVisibilityEnhancedFeature {

    displayControlCenterControls: boolean = $state(true);
    displayInColumnDropdown: boolean = $state(true);

    constructor(config?: ColumnVisibilityEnhancedFeatureConfig) {
        this.displayControlCenterControls = config?.displayControlCenterControls ?? this.displayControlCenterControls;
        this.displayInColumnDropdown = config?.displayInColumnDropdown ?? this.displayInColumnDropdown;
    }

}