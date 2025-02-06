export type HeaderCellDropdownMenuPluginConfig = {
    displaySortingMenu?: boolean
    displayMovementControls?: boolean
    displayColumnPinningControls?: boolean
    displayColumnVisibilityControls?: boolean
}

export class HeaderCellDropdownMenu {
    displaySortingMenu: boolean = $state(true)
    displayMovementControls: boolean = $state(true)
    displayColumnPinningControls: boolean = $state(true)
    displayColumnVisibilityControls: boolean = $state(true)

    constructor(config?: HeaderCellDropdownMenuPluginConfig) {
        Object.assign(this, config)
    }

}