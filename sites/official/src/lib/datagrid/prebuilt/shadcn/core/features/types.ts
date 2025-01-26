import type { BuiltInFeature } from "$lib/datagrid/core/features/types";
import type { TzezarsDatagrid } from "../index.svelte";

export type EnchancedFeature = {
    datagrid: TzezarsDatagrid
    get base(): BuiltInFeature

}

export type Feature = {
    datagrid: TzezarsDatagrid
}