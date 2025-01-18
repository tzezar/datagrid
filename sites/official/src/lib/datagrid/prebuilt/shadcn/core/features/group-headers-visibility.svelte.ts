

export type GroupHeadersVisibilityFeatureConfig = {
    showGroupHeaders?: boolean;
}


export class GroupHeadersVisibilityFeature {
    showGroupHeaders: boolean = $state(true);

    constructor(config?: GroupHeadersVisibilityFeatureConfig) {
        if (config) {
            this.showGroupHeaders = config.showGroupHeaders ?? this.showGroupHeaders;
        }
    }

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