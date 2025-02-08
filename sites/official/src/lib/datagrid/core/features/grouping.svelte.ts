import { SvelteSet } from "svelte/reactivity";
import type { ColumnId, GridGroupRowIdentifier } from "../types";
import type { DatagridCore } from "../index.svelte";



export type GroupingFeatureState = {
    manual: boolean;
    groupByColumns: ColumnId[];
    expandedGroups: SvelteSet<GridGroupRowIdentifier>;
    maxExpandedGroups: number
    onGroupingChange: (expandedGroups: string[]) => void
}


export type GroupingFeatureConfig = Partial<GroupingFeatureState>
export type IGroupingFeature = GroupingFeature


export class GroupingFeature implements IGroupingFeature {
    private readonly datagrid: DatagridCore
    manual: boolean = $state(false);

    activeGroups: ColumnId[] = $state([]);
    expandedGroups: SvelteSet<GridGroupRowIdentifier> = $state(new SvelteSet([]))
    maxExpandedGroups: number = $state(Infinity)

    onGroupingChange: (expandedGroups: string[]) => void = () => { };

    constructor(datagrid: DatagridCore, config?: GroupingFeatureConfig) {
        this.datagrid = datagrid
        Object.assign(this, config);
    }

    isColumnWithinGroup(columnId: ColumnId): boolean {
        return this.activeGroups.includes(columnId);
    }

    expandGroup(groupIdentifier: GridGroupRowIdentifier) {
        if (this.expandedGroups.size >= this.maxExpandedGroups) {
            this.datagrid.events.emit('onGroupExpansionLimitExceeded', { maxExpandedGroups: this.maxExpandedGroups });
            return 
        }
        this.datagrid.events.emit('onGroupExpand', { groupIdentifier });
        this.expandedGroups.add(groupIdentifier);
    }

    collapseGroup(groupIdentifier: GridGroupRowIdentifier) {
        this.datagrid.events.emit('onGroupCollapse', { groupIdentifier });
        this.expandedGroups.delete(groupIdentifier);
    }


}