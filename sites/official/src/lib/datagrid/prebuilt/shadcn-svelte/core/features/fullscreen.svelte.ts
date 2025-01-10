export class FullscreenFeature {
    isFullscreen: boolean = $state(true);

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
    }

    exitFullscreen() {
        this.isFullscreen = false;
    }

    enterFullscreen() {
        this.isFullscreen = true;
    }

}