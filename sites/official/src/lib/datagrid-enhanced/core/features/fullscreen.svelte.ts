import type { EnhancedDatagrid } from "../index.svelte";
import type { Feature } from "./types";


export type FullscreenFeatureConfig = {
    isFullscreen?: boolean;
    enableFullscreen?: boolean;
    onFullscreenChange?(state: FullscreenFeatureConfig): void;
};

export class FullscreenFeature implements Feature {
    datagrid: EnhancedDatagrid;

    isFullscreen: boolean = $state(false);
    enabled: boolean = $state(true);
    onFullscreenChange: (config: FullscreenFeatureConfig) => void = () => { };

    constructor(datagrid: EnhancedDatagrid, config?: FullscreenFeatureConfig) {
        this.datagrid = datagrid;
        if (config) {
            this.isFullscreen = config.isFullscreen ?? this.isFullscreen;
            this.enabled = config.enableFullscreen ?? this.enabled;
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

    shouldDisplayFullscreenToggleButton() {
        return this.enabled;
    }

    isFullscreenEnabled() {
        return this.enabled && this.isFullscreen;
    }

}
