<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import Pagination from './shadcn/pagination.svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';

	let { pagination }: { pagination: Snippet | undefined } = $props();
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

{#if datagrid.options.pagination.display}
	{#if !pagination}
		<Pagination />
	{:else}
		{@render pagination()}
	{/if}
{/if}
