export type HeaderCellDropdownMenuPluginConfig = {
    displayColumnSortingControls?: boolean
    displayColumnFiteringControls?: boolean
    displayGroupingByColumnControls?: boolean
    displayColumnPinningControls?: boolean
    displayColumnVisibilityControls?: boolean
    displayColumnMovementControls?: boolean
}

export class HeaderCellDropdownMenu {
    
    displayColumnSortingControls: boolean = $state(true)
    displayColumnFiteringControls: boolean = $state(true)
    displayGroupingByColumnControls: boolean = $state(true)
    displayColumnPinningControls: boolean = $state(true)
    displayColumnVisibilityControls: boolean = $state(true)
    displayColumnMovementControls: boolean = $state(true)

    constructor(config?: HeaderCellDropdownMenuPluginConfig) {
        Object.assign(this, config)
    }

}