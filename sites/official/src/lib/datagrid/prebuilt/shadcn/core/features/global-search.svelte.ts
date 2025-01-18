import { GlobalSearchFeature } from "$lib/datagrid/core/features";
import type { GlobalSearchFeatureConfig } from "$lib/datagrid/core/features/global-search.svelte";
import type { TzezarsDatagrid } from "../index.svelte";


export type ExtraGlobalSearchFeatureConfig = {
    enableGlobalSearch?: boolean;
    onEnableGlobalSearchChange?(value: boolean): void;
} & GlobalSearchFeatureConfig


export class ExtraGlobalSearchFeature {
    base: GlobalSearchFeature = new GlobalSearchFeature();

    enableGlobalSearch: boolean = $state(true);
    onEnableGlobalSearchChange: (value: boolean) => void = () => { };

    constructor(datagrid: TzezarsDatagrid, config?: ExtraGlobalSearchFeatureConfig) {
        this.base = datagrid.features.globalSearch;
        this.base.initialize(config);

        if (config) {
            this.enableGlobalSearch = config.enableGlobalSearch ?? this.enableGlobalSearch;
            this.onEnableGlobalSearchChange = config.onEnableGlobalSearchChange ?? this.onEnableGlobalSearchChange;
        }
    }
}