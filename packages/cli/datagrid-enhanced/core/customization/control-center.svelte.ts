
export type ControlCenterPluginConfig = {
    displayOrderingMenu?: boolean
    displayVisibilityMenu?: boolean
    displayResizingMenu?: boolean
    displayPinningMenu?: boolean
    displaySortingMenu?: boolean
    displayGroupingMenu?: boolean
    displayExportingMenu?: boolean
    displayColumnGroupCreationMenu?: boolean
    displayHideColumnGroupsMenu?: boolean
}


export class ControlCenterFeature {

    displaySortingMenu: boolean = $state(true);
    displayOrderingMenu: boolean = $state(true)
    displayVisibilityMenu: boolean = $state(true)
    displayResizingMenu: boolean = $state(true)
    displayPinningMenu: boolean = $state(true)
    displayGroupingMenu: boolean = $state(true)
    displayExportingMenu: boolean = $state(true)
    displayColumnGroupCreationMenu: boolean = $state(true)
    displayHideColumnGroupsMenu: boolean = $state(true)

    constructor(config?: ControlCenterPluginConfig) {
        this.displayVisibilityMenu = config?.displayVisibilityMenu ?? this.displayVisibilityMenu;
        this.displayResizingMenu = config?.displayResizingMenu ?? this.displayResizingMenu;
        this.displayPinningMenu = config?.displayPinningMenu ?? this.displayPinningMenu;
        this.displayOrderingMenu = config?.displayOrderingMenu ?? this.displayOrderingMenu;
        this.displaySortingMenu = config?.displaySortingMenu ?? this.displaySortingMenu;
        this.displayGroupingMenu = config?.displayGroupingMenu ?? this.displayGroupingMenu;
    }

    hideSortingMenu() { this.displaySortingMenu = false }
    showSortinMenu() { this.displaySortingMenu = true }
    toggleSortingMenu() { this.displaySortingMenu = !this.displaySortingMenu }
    setSortingMenu(value: boolean) { this.displaySortingMenu = value }

    hideOrderingMenu() { this.displayOrderingMenu = false }
    showOrderingMenu() { this.displayOrderingMenu = true }
    toggleOrderingMenu() { this.displayOrderingMenu = !this.displayOrderingMenu }
    setOrderingMenu(value: boolean) { this.displayOrderingMenu = value }

    hideVisibilityMenu() { this.displayVisibilityMenu = false }
    showVisibilityMenu() { this.displayVisibilityMenu = true }
    toggleVisibilityMenu() { this.displayVisibilityMenu = !this.displayVisibilityMenu }
    setVisibilityMenu(value: boolean) { this.displayVisibilityMenu = value }

    hideResizingMenu() { this.displayResizingMenu = false }
    showResizingMenu() { this.displayResizingMenu = true }
    toggleResizingMenu() { this.displayResizingMenu = !this.displayResizingMenu }
    setResizingMenu(value: boolean) { this.displayResizingMenu = value }

    hidePinningMenu() { this.displayPinningMenu = false }
    showPinningMenu() { this.displayPinningMenu = true }
    togglePinningMenu() { this.displayPinningMenu = !this.displayPinningMenu }
    setPinningMenu(value: boolean) { this.displayPinningMenu = value }

    hideGroupingMenu() { this.displayGroupingMenu = false }
    showGroupingMenu() { this.displayGroupingMenu = true }
    toggleGroupingMenu() { this.displayGroupingMenu = !this.displayGroupingMenu }
    setGroupingMenu(value: boolean) { this.displayGroupingMenu = value }

    hideExportingMenu() { this.displayExportingMenu = false }
    showExportingMenu() { this.displayExportingMenu = true }
    toggleExportingMenu() { this.displayExportingMenu = !this.displayExportingMenu }
    setExportingMenu(value: boolean) { this.displayExportingMenu = value }

    hideColumnGroupCreationMenu() { this.displayColumnGroupCreationMenu = false }
    showColumnGroupCreationMenu() { this.displayColumnGroupCreationMenu = true }
    toggleColumnGroupCreationMenu() { this.displayColumnGroupCreationMenu = !this.displayColumnGroupCreationMenu }
    setColumnGroupCreationMenu(value: boolean) { this.displayColumnGroupCreationMenu = value }

    hideHideColumnGroupsMenu() { this.displayHideColumnGroupsMenu = false }
    showHideColumnGroupsMenu() { this.displayHideColumnGroupsMenu = true }
    toggleHideColumnGroupsMenu() { this.displayHideColumnGroupsMenu = !this.displayHideColumnGroupsMenu }
    setHideColumnGroupsMenu(value: boolean) { this.displayHideColumnGroupsMenu = value }


}