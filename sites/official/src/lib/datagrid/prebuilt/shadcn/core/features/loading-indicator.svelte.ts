

export class LoadingIndicatorFeature {
    enableLoadingIndicator: boolean = $state(true);
    isLoading: boolean = $state(false);
    isSaving: boolean = $state(false);
    isError: boolean = $state(false);
    onLoadingIndicatorChange(isLoading: boolean, isSaving: boolean, isError: boolean) {

    }
}