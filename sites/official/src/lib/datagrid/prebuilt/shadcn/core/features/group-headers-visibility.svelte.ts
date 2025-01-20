

export type GroupHeadersVisibilityFeatureConfig = {
    showGroupHeaders?: boolean;
}


export class GroupHeadersVisibilityFeature {
    enableGroupHeadersHiding: boolean = $state(true);
    enableColumnGroupsCreation: boolean = $state(true);
    
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