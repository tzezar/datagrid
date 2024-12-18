import { SvelteSet } from "svelte/reactivity";
import type { ColumnId } from "../types";

export class Grouping {
    groupByColumns: ColumnId[] = [];
    expandedGroups: SvelteSet<string> = new SvelteSet([]);
}