import { SvelteSet } from "svelte/reactivity";
import type { ColumnId, GridGroupRowIdentifier } from "../types";
import type { DatagridCore } from "../index.svelte";

/**
 * Represents the state of the grouping feature in the datagrid, managing active and expanded groups.
 * @typedef {Object} GroupingFeatureState
 * @property {boolean} manual - Indicates whether grouping is manually controlled.
 * @property {ColumnId[]} activeGroups - The list of columns currently used for grouping.
 * @property {SvelteSet<GridGroupRowIdentifier>} expandedGroups - A set of currently expanded group identifiers.
 * @property {number} maxExpandedGroups - The maximum number of groups that can be expanded at any time.
 * @property {(expandedGroups: string[]) => void} onGroupingChange - A callback function that is triggered when grouping changes.
 */
export type GroupingFeatureState = {
    manual: boolean;
    activeGroups: ColumnId[];
    expandedGroups: SvelteSet<GridGroupRowIdentifier>;
    maxExpandedGroups: number;
    onGroupingChange: (expandedGroups: string[]) => void;
}

/**
 * Configuration options for initializing the grouping feature.
 * @typedef {Partial<GroupingFeatureState>} GroupingFeatureConfig
 */
export type GroupingFeatureConfig = Partial<GroupingFeatureState>;

/**
 * A class that provides grouping functionality for the datagrid, allowing columns to be grouped and expanded/collapsed.
 */
export class GroupingFeature implements GroupingFeatureState {
    private readonly datagrid: DatagridCore;

    /** Whether grouping is manually controlled. */
    manual: boolean = $state(false);

    /** The list of columns currently used for grouping. */
    activeGroups: ColumnId[] = $state([]);

    /** A set of currently expanded group identifiers. */
    expandedGroups: SvelteSet<GridGroupRowIdentifier> = $state(new SvelteSet([]));

    /** The maximum number of groups that can be expanded at any time. */
    maxExpandedGroups: number = $state(Infinity);

    /** The maximum number of groups that can be active at once. */
    maxActiveGroups: number = $state(2);

    /** Callback function triggered when the grouping state changes. */
    onGroupingChange: (expandedGroups: string[]) => void = () => { };

    /**
     * Creates an instance of the GroupingFeature class, initializing it with the datagrid and optional configuration.
     * @param {DatagridCore} datagrid - The datagrid instance to associate with the grouping feature.
     * @param {GroupingFeatureConfig} [config] - Optional configuration for the grouping feature.
     */
    constructor(datagrid: DatagridCore, config?: GroupingFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Checks if a column is part of the active grouping.
     * @param {ColumnId} columnId - The column identifier to check.
     * @returns {boolean} True if the column is part of the active grouping, false otherwise.
     */
    isColumnWithinGroup(columnId: ColumnId): boolean {
        return this.activeGroups.includes(columnId);
    }

    /**
     * Checks if a group is expanded.
     * @param {GridGroupRowIdentifier} groupIdentifier - The identifier for the group to check.
     * @returns {boolean} True if the group is expanded, false otherwise.
     */
    isGroupExpanded(groupIdentifier: GridGroupRowIdentifier): boolean {
        return this.expandedGroups.has(groupIdentifier);
    }

    /**
     * Expands a specific group, notifying the datagrid and ensuring the group limit is not exceeded.
     * @param {GridGroupRowIdentifier} groupIdentifier - The identifier of the group to expand.
     */
    expandGroup(groupIdentifier: GridGroupRowIdentifier): void {
        if (this.maxExpandedGroups < this.expandedGroups.size) {
            this.datagrid.events.emit('onGroupExpansionLimitExceeded', { maxExpandedGroups: this.maxExpandedGroups });
            return;
        }
        this.datagrid.events.emit('onGroupExpand', { groupIdentifier });
        this.expandedGroups.add(groupIdentifier);
    }

    /**
     * Collapses a specific group and notifies the datagrid.
     * @param {GridGroupRowIdentifier} groupIdentifier - The identifier of the group to collapse.
     */
    collapseGroup(groupIdentifier: GridGroupRowIdentifier): void {
        this.datagrid.events.emit('onGroupCollapse', { groupIdentifier });
        this.expandedGroups.delete(groupIdentifier);
    }

    /**
     * Toggles the grouping state of a column. If the column is already in the group, it will be collapsed;
     * if not, it will be expanded.
     * @param {ColumnId} columnId - The identifier of the column to toggle.
     */
    toggleGrouping(columnId: ColumnId): void {
        if (this.activeGroups.includes(columnId)) {
            this.collapseGroup(columnId);
        } else {
            this.expandGroup(columnId);
        }
    }

    /**
     * Updates the list of active groups, ensuring it does not exceed the maximum limit of active groups.
     * Emits an event notifying the datagrid of the change.
     * @param {ColumnId[]} activeGroups - The new list of active groups.
     * @throws {Error} If the number of active groups exceeds the maximum allowed.
     */
    updateActiveGroups(activeGroups: ColumnId[]): Error | void {
        if (activeGroups.length > this.maxActiveGroups) {
            this.datagrid.events.emit('onActiveGroupsLimitExceeded', { maxActiveGroups: this.maxActiveGroups });
            throw new Error('Too many active groups');
        }

        this.activeGroups = activeGroups;
        this.datagrid.events.emit('onGroupingChange', { activeGroups });
    }
}
