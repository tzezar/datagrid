
export type GlobalSearchEnhancedFeatureConfig = {
    isVisible?: boolean;
    onEnableGlobalSearchChange?(value: boolean): void;
}


export class GlobalSearchEnhancedFeature  {

    isVisible: boolean = $state(false);
    onEnableGlobalSearchChange: (value: boolean) => void = () => { };

    constructor(config?: GlobalSearchEnhancedFeatureConfig) {
        this.isVisible = config?.isVisible ?? this.isVisible;

    }

    hideInput() {
        this.isVisible = false;
    }

    showInput() {
        this.isVisible = true;
    }

    toggleInputVisibility() {
        if (this.isVisible) {
            this.hideInput();
        } else {
            this.showInput();
        }
    }

    shouldDisplayInput() {
        return this.isVisible
    }

}