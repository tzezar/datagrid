import { GlobalSearchFeature } from "$lib/datagrid/core/features";
import type { GlobalSearchFeatureConfig } from "$lib/datagrid/core/features/global-search.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";


export type GlobalSearchEnchancedFeatureConfig = {
    enabled?: boolean;
    onEnableGlobalSearchChange?(value: boolean): void;
} & GlobalSearchFeatureConfig


export class GlobalSearchEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    private inputVisible: boolean = $state(false);
    enabled: boolean = $state(true);
    onEnableGlobalSearchChange: (value: boolean) => void = () => { };

    constructor(datagrid: TzezarsDatagrid, config?: GlobalSearchEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): GlobalSearchFeature { return this.datagrid.features.globalSearch }

    initialize(config?: GlobalSearchEnchancedFeatureConfig) {
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