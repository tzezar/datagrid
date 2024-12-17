import { SvelteSet } from "svelte/reactivity";
import type { ColumnId } from "../types";

export class Grouping {
    groupByColumns: ColumnId[] = ['status', 'role'];
    expandedGroups: SvelteSet<string> = new SvelteSet([]);
}