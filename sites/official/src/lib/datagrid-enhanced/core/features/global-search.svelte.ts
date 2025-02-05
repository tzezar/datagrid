import { GlobalSearchFeature } from "$lib/datagrid/core/features";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";


export type GlobalSearchEnhancedFeatureConfig = {
    enabled?: boolean;
    onEnableGlobalSearchChange?(value: boolean): void;
}


export class GlobalSearchEnhancedFeature implements EnhancedFeature {
    datagrid: TzezarsDatagrid

    private inputVisible: boolean = $state(false);
    enabled: boolean = $state(true);
    onEnableGlobalSearchChange: (value: boolean) => void = () => { };

    constructor(datagrid: TzezarsDatagrid, config?: GlobalSearchEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): GlobalSearchFeature { return this.datagrid.features.globalSearch }

    initialize(config?: GlobalSearchEnhancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    hideInput() {
        this.inputVisible = false;
    }

    showInput() {
        this.inputVisible = true;
    }

    toggleInputVisibility() {
        this.inputVisible = !this.inputVisible;
    }

    shouldDisplayInput() {
        return this.inputVisible && this.enabled;
    }

}