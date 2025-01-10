export class GroupHeadersVisibilityFeature {
    showGroupHeaders: boolean = $state(false);

    show() {
        this.showGroupHeaders = true;
    }

    hide() {
        this.showGroupHeaders = false;
    }

    toggleGroupHeaders() {
        this.showGroupHeaders = !this.showGroupHeaders;
    }

}