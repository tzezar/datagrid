
export type FullscreenFeatureConfig = {
    isFullscreen?: boolean;
    displayFullscreenToggleButton?: boolean;
};

export class FullscreenFeature {

    fullscreenModeEnabled: boolean = $state(false);
    displayFullscreenToggleButton: boolean = $state(true);

    onFullscreenChange: (config: FullscreenFeatureConfig) => void = () => { };

    constructor(config?: FullscreenFeatureConfig) {
        this.fullscreenModeEnabled = config?.isFullscreen ?? this.fullscreenModeEnabled;
        this.displayFullscreenToggleButton = config?.displayFullscreenToggleButton ?? this.displayFullscreenToggleButton;
    }

    toggleFullscreen() {
        this.fullscreenModeEnabled = !this.fullscreenModeEnabled;
        this.onFullscreenChange(this);
    }

    shouldDisplayFullscreenToggleButton() {
        return this.displayFullscreenToggleButton;
    }

    isFullscreenModeEnabled() {
        return this.fullscreenModeEnabled;
    }

}
