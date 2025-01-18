
export type LoadingIndicatorFeatureConfig = {
    enableLoadingIndicator?: boolean;
    isLoading?: boolean;
    isSaving?: boolean;
    isError?: boolean;
    onLoadingIndicatorChange?(isLoading: boolean, isSaving: boolean, isError: boolean): void;
}


export class LoadingIndicatorFeature {
    enableLoadingIndicator: boolean = $state(true);
    isLoading: boolean = $state(false);
    isSaving: boolean = $state(false);
    isError: boolean = $state(false);
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
}