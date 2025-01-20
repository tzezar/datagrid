
export type LoadingIndicatorFeatureConfig = {
    enableLoadingIndicator?: boolean;
    isLoading?: boolean;
    isSaving?: boolean;
    isError?: boolean;
    onLoadingIndicatorChange?(isLoading: boolean, isSaving: boolean, isError: boolean): void;
}


export class LoadingIndicatorFeature {
    enableLoadingIndicator: boolean = $state(true);
    position: 'top' | 'bottom' | 'both' = $state('both');
    isLoading: boolean = $state(true);
    isSaving: boolean = $state(true);
    isError: boolean = $state(true);
    onLoadingIndicatorChange: (isLoading: boolean, isSaving: boolean, isError: boolean) => void = () => { };

    constructor(config?: LoadingIndicatorFeatureConfig) {
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
}