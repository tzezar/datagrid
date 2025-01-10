export class GroupHeadersVisibilityFeature {
    showGroupHeaders: boolean = $state(true);

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