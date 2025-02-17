
export type ToolbarCustomizationConfig = {
    isToolbarVisible?: boolean
    isGlobalSearchInputVisible?: boolean
    isColumnHeaderFilterTogglerVisible?: boolean
    isControlCenterTogglerVisible?: boolean
    isFullscreenModeTogglerVisible?: boolean
}

export class ToolbarCustomization {
    isToolbarVisible: boolean = $state(true)

    isGlobalSearchInputVisible: boolean = $state(false)
    isColumnHeaderFilterTogglerVisible: boolean = $state(true)
    isControlCenterTogglerVisible: boolean = $state(true)
    isFullscreenModeTogglerVisible: boolean = $state(true)

    constructor(config?: ToolbarCustomizationConfig) {
        Object.assign(this, config)
    }

    
    // Toolbar visibility
    shouldDisplayToolbar() { return this.isToolbarVisible }
    hideToolbar() { this.isToolbarVisible = false }
    showToolbar() { this.isToolbarVisible = true }
    changeToolbarVisibility(show: boolean) {
        if (show) this.showToolbar();
        else this.hideToolbar();
    }
    toggleToolbarVisibility() {
        if (this.isToolbarVisible) this.hideToolbar();
        else this.showToolbar();
    }


    // Global search
    shouldDisplayGlobalSearchInput() { return this.isGlobalSearchInputVisible }
    hideGlobalSearchInput() { this.isGlobalSearchInputVisible = false }
    showGlobalSearchInput() { this.isGlobalSearchInputVisible = true }
    changeGlobalSearchInputVisibility(show: boolean) {
        if (show) this.showGlobalSearchInput();
        else this.hideGlobalSearchInput();
    }
    toggleGlobalSearchVisibility() {
        if (this.isGlobalSearchInputVisible) this.hideGlobalSearchInput();
        else this.showGlobalSearchInput();
    }


    // Fullscreen toggler
    shouldDisplayFullscreenToggleButton() { return this.isFullscreenModeTogglerVisible }
    hideFullscreenToggleButton() { this.isFullscreenModeTogglerVisible = false }
    showFullscreenToggleButton() { this.isFullscreenModeTogglerVisible = true }
    changeFullscreenModeTogglerVisibility(show: boolean) {
        if (show) this.showFullscreenToggleButton();
        else this.hideFullscreenToggleButton();
    }
    toggleFullscreenButtonVisibility() {
        if (this.isFullscreenModeTogglerVisible) this.hideFullscreenToggleButton();
        else this.showFullscreenToggleButton();
    }


    // Control center
    shouldDisplayControlCenter() { return this.isControlCenterTogglerVisible }
    hideControlCenter() { this.isControlCenterTogglerVisible = false }
    showControlCenter() { this.isControlCenterTogglerVisible = true }
    changeControlCenterVisibility(show: boolean) {
        if (show) this.showControlCenter();
        else this.hideControlCenter();
    }
    toggleControlCenterVisibility() {
        if (this.isControlCenterTogglerVisible) this.hideControlCenter();
        else this.showControlCenter();
    }


    // Column filtering toggler
    shouldDisplayColumnFilteringToggler() { return this.isColumnHeaderFilterTogglerVisible }
    hideColumnFilteringToggler() { this.isColumnHeaderFilterTogglerVisible = false }
    showColumnFilteringToggler() { this.isColumnHeaderFilterTogglerVisible = true }
    changeColumnFilteringTogglerVisibility(show: boolean) {
        if (show) this.showColumnFilteringToggler();
        else this.hideColumnFilteringToggler();
    }
    toggleColumnFilteringTogglerVisibility() {
        if (this.isColumnHeaderFilterTogglerVisible) this.hideColumnFilteringToggler();
        else this.showColumnFilteringToggler();
    }



}