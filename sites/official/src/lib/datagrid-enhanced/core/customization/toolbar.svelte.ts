
export type ToolbarCustomizationConfig = {
    showGlobalSearchInput?: boolean
    showColumnFilteringToggler?: boolean
}

export class ToolbarCustomization {
    showGlobalSearchInput: boolean = $state(false)
    showColumnFilteringToggler: boolean = $state(false)
    
    constructor(config?: ToolbarCustomizationConfig) {
        Object.assign(this, config)
    }

    hideInput() {
        this.showColumnFilteringToggler = false;
    }

    showInput() {
        this.showColumnFilteringToggler = true;
    }

    toggleInputVisibility() {
        if (this.showColumnFilteringToggler) {
            this.hideInput();
        } else {
            this.showInput();
        }
    }

    shouldDisplayInput() {
        return this.showColumnFilteringToggler
    }

}