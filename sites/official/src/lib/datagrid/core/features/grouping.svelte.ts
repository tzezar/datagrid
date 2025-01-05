import { SvelteSet } from "svelte/reactivity";
import type { ColumnId, GridGroupRowIdentifier } from "../types";

export class GroupingFeature {
    groupByColumns: ColumnId[] = $state([]);
    expandedGroups: SvelteSet<GridGroupRowIdentifier> = $state(new SvelteSet([]))
}