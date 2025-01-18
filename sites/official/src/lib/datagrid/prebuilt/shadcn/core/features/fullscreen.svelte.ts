


export type FullscreenFeatureConfig = {
    isFullscreen?: boolean;
    enableFullscreen?: boolean;
    onFullscreenChange?(config: FullscreenFeatureConfig): void;
};

export class FullscreenFeature {
    isFullscreen: boolean = $state(false);
    enableFullscreen: boolean = $state(true);
    onFullscreenChange: (config: FullscreenFeatureConfig) => void = () => { };

    constructor(config?: FullscreenFeatureConfig) {
        if (config) {
            this.isFullscreen = config.isFullscreen ?? this.isFullscreen;
            this.enableFullscreen = config.enableFullscreen ?? this.enableFullscreen;
            this.onFullscreenChange = config.onFullscreenChange ?? this.onFullscreenChange;
        }
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.onFullscreenChange(this);
    }

    exitFullscreen() {
        this.isFullscreen = false;
        this.onFullscreenChange(this);
    }

    enterFullscreen() {
        this.isFullscreen = true;
        this.onFullscreenChange(this);
    }
}
