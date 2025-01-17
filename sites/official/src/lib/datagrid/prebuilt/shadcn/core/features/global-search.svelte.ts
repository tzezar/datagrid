import { GlobalSearchFeature } from "$lib/datagrid/core/features";


export class ExtraGlobalSearchFeature extends GlobalSearchFeature {
    enableGlobalSearch: boolean = $state(true);
    onGlobalSearchChange(value: string) {}
}