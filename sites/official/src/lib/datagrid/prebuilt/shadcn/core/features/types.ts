import type { BuiltInFeature } from "$lib/datagrid/core/features/types";

export type EnchancedFeature = {
    base: BuiltInFeature;
    initialize(config?: any): void;
    initializeBase(datagrid: any, config?: any): void;
}