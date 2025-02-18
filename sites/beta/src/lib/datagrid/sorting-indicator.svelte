<script lang="ts">
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import type { ColumnId } from './types';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		class: _class,
		columnId
	}: {
		class?: {
			wrapper?: string;
			ascending?: string;
			descending?: string;
			position?: string;
		};
		columnId: ColumnId;
	} = $props();

	// Find the sorting object for the given field
	let sort = $derived(datagrid.state.sortingArray.find((s) => s.columnId === columnId));
	// Determine the sorting direction for the given field
	let direction = $derived(sort ? sort.direction : null);
	// Determine the position of the column in the sorting order
	let position = $derived(datagrid.state.sortingArray.findIndex((s) => s.columnId === columnId) + 1);
</script>

{#if direction}
	<div class={cn('flex items-center gap-1 text-muted-foreground', _class?.wrapper)}>
		<span class={cn('', _class?.position)}>#{position}</span>
		{#if direction === 'asc'}
			<span class={_class?.ascending}>▲</span>
		{:else if direction === 'desc'}
			<span class={_class?.descending}>▼</span>
		{/if}
	</div>
{/if}
