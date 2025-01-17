export class FullscreenFeature {
    isFullscreen: boolean = $state(false);

    enableFullscreen: boolean = $state(true);

    onFullscreenChange(isFullscreen: boolean) {

    }

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