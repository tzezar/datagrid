export type ColumnGroupsPluginConfig = {
    showGroupHeaders?: boolean;
    enableGroupHeadersToggling?: boolean;
    enableColumnGroupsCreation?: boolean;
}

export class ColumnGroupsPlugin {


    showColumnGroups: boolean = $state(true);

    constructor(config?: ColumnGroupsPluginConfig) {
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