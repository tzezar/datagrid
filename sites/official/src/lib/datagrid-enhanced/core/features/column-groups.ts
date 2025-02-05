export type ColumnGroupsFeatureConfig = {
    showGroupHeaders?: boolean;
    enableGroupHeadersToggling?: boolean;
    enableColumnGroupsCreation?: boolean;
}

export class ColumnGroupsFeature {

    enableGroupHeadersToggling: boolean = $state(true);
    enableColumnGroupsCreation: boolean = $state(true);

    showColumnGroups: boolean = $state(true);

    constructor(config?: ColumnGroupsFeatureConfig) {
        this.enableGroupHeadersToggling = config?.showGroupHeaders ?? this.enableGroupHeadersToggling;
        this.enableColumnGroupsCreation = config?.showGroupHeaders ?? this.enableColumnGroupsCreation;
        this.showColumnGroups = config?.showGroupHeaders ?? this.showColumnGroups;
    }

    show() {
        this.showColumnGroups = true;
    }

    hide() {
        this.showColumnGroups = false;
    }

    toggleVisibility() {
        if (this.showColumnGroups) {
            this.hide();
        } else {
            this.show();
        }
    }

}