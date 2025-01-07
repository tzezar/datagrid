<script lang="ts">
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import { getSortDirection, getSortIndex } from '$lib/datagrid/core/utils.svelte';

	let { datagrid, column }: { datagrid: any; column: any } = $props();
</script>

<div class="sort-indicator">
	{#if getSortDirection(datagrid, column) === 'desc'}
		<SortDescending />
	{:else if getSortDirection(datagrid, column) === 'asc'}
		<SortAscending />
	{:else if getSortDirection(datagrid, column) === 'intermediate'}
		<ArrowsSort />
	{/if}
	{#if getSortIndex(datagrid, column)}
		<span class="text-xs">{getSortIndex(datagrid, column)}</span>
	{/if}
</div>
