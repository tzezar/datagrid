import { SvelteSet } from "svelte/reactivity";
import type { ColumnId, GridGroupRowIdentifier } from "../types";

export type GroupingFeatureConfig = {
    groupByColumns?: ColumnId[];
    expandedGroups?: SvelteSet<GridGroupRowIdentifier>;
}

export class GroupingFeature {
    groupByColumns: ColumnId[] = $state([]);
    expandedGroups: SvelteSet<GridGroupRowIdentifier> = $state(new SvelteSet([]))

    constructor(config?: GroupingFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: GroupingFeatureConfig) {
        this.groupByColumns = config?.groupByColumns ?? this.groupByColumns;
        this.expandedGroups = config?.expandedGroups ?? this.expandedGroups;
    }

    isColumnWithinGroup(columnId: ColumnId): boolean {
        return this.groupByColumns.includes(columnId);
    }

}