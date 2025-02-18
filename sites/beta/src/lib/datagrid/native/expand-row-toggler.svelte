<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { toggleExpandedRow } from '../fns/toggle-is-row-expanded';
	import type { TzezarDataGrid } from '../tzezar-datagrid.svelte';
	import type { ExpandedRows } from '../types';
	const datagrid = getContext<TzezarDataGrid>('datagrid');

	let {
		rowId,
		hidedIndicator,
		expandedIndicator,
		classNames
	}: {
		rowId: number;
		children?: Snippet;
		hidedIndicator?: Snippet;
		expandedIndicator?: Snippet;
		classNames?: string;
	} = $props();

	export const isRowExpanded = (identifier: number, expandedRows: ExpandedRows) => {
		return expandedRows.includes(identifier);
	};
</script>

<button
	class=""
	onclick={() => (datagrid.state.expandedRows = toggleExpandedRow(rowId, datagrid.state.expandedRows))}
>
	{#if isRowExpanded(rowId, datagrid.state.expandedRows)}
		{#if expandedIndicator}
			{@render expandedIndicator()}
		{:else}
		<span >▲</span>
		{/if}
	{:else if hidedIndicator}
		{@render hidedIndicator()}
	{:else}
	<span>▼</span>

	{/if}
</button>
