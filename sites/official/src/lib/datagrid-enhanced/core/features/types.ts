import type { BuiltInFeature } from "$lib/datagrid/core/features/types";
import type { EnhancedDatagrid } from "../index.svelte";

export type EnhancedFeature = {
    datagrid: EnhancedDatagrid
    get base(): BuiltInFeature

}

export type Feature = {
    datagrid: EnhancedDatagrid
}