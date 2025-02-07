import { SvelteSet } from "svelte/reactivity";
import type { ColumnId, GridGroupRowIdentifier } from "../types";



export type GroupingFeatureState = {
    manual: boolean;
    groupByColumns: ColumnId[];
    expandedGroups: SvelteSet<GridGroupRowIdentifier>;
    onGroupingChange: (expandedGroups: string[]) => void
}


export type GroupingFeatureConfig = Partial<GroupingFeatureState>
export type IGroupingFeature = GroupingFeature


export class GroupingFeature implements IGroupingFeature {
    manual: boolean = $state(false);

    groupByColumns: ColumnId[] = $state([]);
    expandedGroups: SvelteSet<GridGroupRowIdentifier> = $state(new SvelteSet([]))

    onGroupingChange: (expandedGroups: string[]) => void = () => { };

    constructor(config?: GroupingFeatureConfig) {
        Object.assign(this, config);
    }

    isColumnWithinGroup(columnId: ColumnId): boolean {
        return this.groupByColumns.includes(columnId);
    }

}