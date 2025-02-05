import { SvelteSet } from "svelte/reactivity";
import type { ColumnId, GridGroupRowIdentifier } from "../types";

export type GroupingPluginConfig = {
    manual: boolean;
    groupByColumns?: ColumnId[];
    expandedGroups?: SvelteSet<GridGroupRowIdentifier>;
    onGroupingChange?(expandedGroups: string[]): void;

}

export class GroupingFeature {
    manual: boolean = $state(false);

    groupByColumns: ColumnId[] = $state([]);
    expandedGroups: SvelteSet<GridGroupRowIdentifier> = $state(new SvelteSet([]))

    onGroupingChange: (expandedGroups: string[]) => void = () => { };

    constructor(config?: GroupingPluginConfig) {
        this.initialize(config);
    }

    initialize(config?: GroupingPluginConfig) {
        this.manual = config?.manual ?? this.manual;
        this.groupByColumns = config?.groupByColumns ?? this.groupByColumns;
        this.expandedGroups = config?.expandedGroups ?? this.expandedGroups;
        this.onGroupingChange = config?.onGroupingChange ?? this.onGroupingChange;
    }

    isColumnWithinGroup(columnId: ColumnId): boolean {
        return this.groupByColumns.includes(columnId);
    }

}