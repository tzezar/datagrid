
export type ControlCenterPluginConfig = {
    displayOrderingMenu?: boolean
    displayVisibilityMenu?: boolean
    displayResizingMenu?: boolean
    displayPinningMenu?: boolean
    displaySortingMenu?: boolean
    displayGroupingMenu?: boolean
}


export class ControlCenterFeature {

    displaySortingMenu: boolean = $state(true);
    displayOrderingMenu: boolean = $state(true)
    displayVisibilityMenu: boolean = $state(true)
    displayResizingMenu: boolean = $state(true)
    displayPinningMenu: boolean = $state(true)
    displayGroupingMenu: boolean = $state(true)

    constructor(config?: ControlCenterPluginConfig) {
        this.displayVisibilityMenu = config?.displayVisibilityMenu ?? this.displayVisibilityMenu;
        this.displayResizingMenu = config?.displayResizingMenu ?? this.displayResizingMenu;
        this.displayPinningMenu = config?.displayPinningMenu ?? this.displayPinningMenu;
        this.displayOrderingMenu = config?.displayOrderingMenu ?? this.displayOrderingMenu;
        this.displaySortingMenu = config?.displaySortingMenu ?? this.displaySortingMenu;
        this.displayGroupingMenu = config?.displayGroupingMenu ?? this.displayGroupingMenu;
    }


}