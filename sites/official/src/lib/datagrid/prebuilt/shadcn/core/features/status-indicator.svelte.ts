
export type StatusIndicatorFeatureConfig = {
    enableLoadingIndicator?: boolean;
    isLoading?: boolean;
    isSaving?: boolean;
    isError?: boolean;
    onLoadingIndicatorChange?(isLoading: boolean, isSaving: boolean, isError: boolean): void;
}


export class StatusIndicatorFeature {
    enableLoadingIndicator: boolean = $state(true);
    position: 'top' | 'bottom' | 'both' = $state('top');
    isLoading: boolean = $state(false);
    isSaving: boolean = $state(false);
    isError: boolean = $state(false);
    onLoadingIndicatorChange: (isLoading: boolean, isSaving: boolean, isError: boolean) => void = () => { };

    constructor(config?: StatusIndicatorFeatureConfig) {
        if (config) {
            this.enableLoadingIndicator = config.enableLoadingIndicator ?? this.enableLoadingIndicator;
            this.isLoading = config.isLoading ?? this.isLoading;
            this.isSaving = config.isSaving ?? this.isSaving;
            this.isError = config.isError ?? this.isError;
            this.onLoadingIndicatorChange = config.onLoadingIndicatorChange ?? this.onLoadingIndicatorChange;
        }
    }

    shouldShowLoadingIndicator(target: 'top' | 'bottom' | 'both') {
        // loading indicator is disabled
        if (!this.enableLoadingIndicator) return false;

        if (target === 'top') {
            if (this.position === 'top' || this.position === 'both') return true;
        } else if (target === 'bottom') {
            if (this.position === 'bottom' || this.position === 'both') return true;
        } else if (target === 'both') {
            if (this.position === 'both') return true;
        }
        return false;
    }

    changeLoadingIndicatorState(isLoading: boolean, isSaving: boolean, isError: boolean) {
        this.isLoading = isLoading;
        this.isSaving = isSaving;
        this.isError = isError;
        this.onLoadingIndicatorChange(isLoading, isSaving, isError);
    }

}