


export class Fullscreen {
    isFullscreen: boolean = $state(false);

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