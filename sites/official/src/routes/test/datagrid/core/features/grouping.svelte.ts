import { SvelteSet } from "svelte/reactivity";
import type { ColumnId } from "../types";

export class GroupingFeature {
    groupByColumns: ColumnId[] = [];
    expandedGroups: SvelteSet<string> = new SvelteSet([]);
}