<script lang="ts">
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';

	let { datagrid, column }: { datagrid: any; column: any } = $props();
</script>

<div class="sort-indicator">
	{#if datagrid.features.sorting.getSortDirection(column.columnId) === 'desc'}
		<SortDescending />
	{:else if datagrid.features.sorting.getSortDirection( column.columnId) === 'asc'}
		<SortAscending />
	{:else if datagrid.features.sorting.getSortDirection(column.columnId) === 'intermediate'}
		<ArrowsSort />
	{/if}
	{#if datagrid.features.sorting.getSortIndex(column.columnId)}
		<span class="text-xs">{datagrid.features.sorting.getSortIndex(column.columnId)}</span>
	{/if}
</div>
