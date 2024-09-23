<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDataGrid } from '../tzezar-datagrid.svelte';
	import Row from '../row.svelte';
	const datagrid = getContext<TzezarDataGrid>('datagrid');

	let {
		children,
		rowId,
		classNames
	}: {
		rowId: number;
		children: Snippet;
		classNames?: string;
	} = $props();
</script>

<!-- ? this one probably not needed to new api -->

<Row class={cn(datagrid.state.expandedRows.includes(rowId) ? 'sticky top-[54px]' : 'z-[4000]')}>
	{#if children}
		{@render children()}
	{/if}
</Row>
