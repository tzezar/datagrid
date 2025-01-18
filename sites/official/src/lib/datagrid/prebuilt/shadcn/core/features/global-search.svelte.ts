import { GlobalSearchFeature } from "$lib/datagrid/core/features";


export type ExtraGlobalSearchFeatureConfig = {
    enableGlobalSearch?: boolean;
    onGlobalSearchChange?(value: string): void;
}


export class ExtraGlobalSearchFeature {
    base: GlobalSearchFeature = new GlobalSearchFeature();
    
    enableGlobalSearch: boolean = $state(true);
    onGlobalSearchChange: (value: string) => void = () => { };
    constructor(config?: ExtraGlobalSearchFeatureConfig) {
        if (config) {
            this.enableGlobalSearch = config.enableGlobalSearch ?? this.enableGlobalSearch;
            this.onGlobalSearchChange = config.onGlobalSearchChange ?? this.onGlobalSearchChange;
        }
    }
}