import { SvelteSet } from "svelte/reactivity";
import type { ColumnId, GridGroupRowIdentifier } from "../types";
import type { DatagridCore } from "../index.svelte";



export type GroupingFeatureState = {
    manual: boolean;
    activeGroups: ColumnId[];
    expandedGroups: SvelteSet<GridGroupRowIdentifier>;
    maxExpandedGroups: number
    onGroupingChange: (expandedGroups: string[]) => void
}


export type GroupingFeatureConfig = Partial<GroupingFeatureState>


export class GroupingFeature implements GroupingFeatureState {
    private readonly datagrid: DatagridCore
    manual: boolean = $state(false);

    activeGroups: ColumnId[] = $state([]);
    expandedGroups: SvelteSet<GridGroupRowIdentifier> = $state(new SvelteSet([]))
    maxExpandedGroups: number = $state(Infinity)
    maxActiveGroups: number = $state(2)

    onGroupingChange: (expandedGroups: string[]) => void = () => { };

    constructor(datagrid: DatagridCore, config?: GroupingFeatureConfig) {
        this.datagrid = datagrid
        Object.assign(this, config);
    }

    isColumnWithinGroup(columnId: ColumnId): boolean {
        return this.activeGroups.includes(columnId);
    }

    isGroupExpanded(groupIdentifier: GridGroupRowIdentifier): boolean {
        return this.expandedGroups.has(groupIdentifier);
    }

    expandGroup(groupIdentifier: GridGroupRowIdentifier) {
        if (this.maxExpandedGroups < this.expandedGroups.size) {
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

    toggleGrouping(columnId: ColumnId) {
        if (this.activeGroups.includes(columnId)) {
            this.collapseGroup(columnId);
        } else {
            this.expandGroup(columnId);
        }
    }

    updateActiveGroups(activeGroups: ColumnId[]): Error | void {
        if (activeGroups.length > this.maxActiveGroups) {
            this.datagrid.events.emit('onActiveGroupsLimitExceeded', { maxActiveGroups: this.maxActiveGroups });
            throw new Error('Too many active groups');            
        }

        this.activeGroups = activeGroups;
        this.datagrid.events.emit('onGroupingChange', { activeGroups });
    }


}