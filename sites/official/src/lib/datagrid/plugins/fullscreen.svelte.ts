
export type FullscreenPluginConfig = {
    isFullscreen?: boolean;
    displayFullscreenToggleButton?: boolean;
};

export class FullscreenPlugin {

    fullscreenModeEnabled: boolean = $state(false);
    displayFullscreenToggleButton: boolean = $state(true);

    onFullscreenChange: (config: FullscreenPluginConfig) => void = () => { };

    constructor(config?: FullscreenPluginConfig) {
        this.fullscreenModeEnabled = config?.isFullscreen ?? this.fullscreenModeEnabled;
        this.displayFullscreenToggleButton = config?.displayFullscreenToggleButton ?? this.displayFullscreenToggleButton;
    }

    toggleFullscreen() {
        this.fullscreenModeEnabled = !this.fullscreenModeEnabled;
        this.onFullscreenChange(this);
    }


    isFullscreenModeEnabled() {
        return this.fullscreenModeEnabled;
    }

}
