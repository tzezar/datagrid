<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import type { EnhancedCore } from '..';

	let { datagrid, column }: { datagrid: EnhancedCore; column: LeafColumn<any> } = $props();
</script>

<div class="sort-indicator">
	{#if datagrid.features.sorting.getSortDirection(column.columnId) === 'descending'}
		<SortDescending />
	{:else if datagrid.features.sorting.getSortDirection(column.columnId) === 'ascending'}
		<SortAscending />
	{:else if datagrid.features.sorting.getSortDirection(column.columnId) === 'intermediate'}
		<ArrowsSort />
	{/if}
	{#if datagrid.features.sorting.getSortConfigIndex(column.columnId)}
		<span class="text-xs">{datagrid.features.sorting.getSortConfigIndex(column.columnId)}</span>
	{/if}
</div>
