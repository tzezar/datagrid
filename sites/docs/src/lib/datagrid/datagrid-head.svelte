<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import Header from './header.svelte';

	let { head }: { head: Snippet | undefined } = $props();
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<div class="w sticky top-0 z-[16] flex min-w-fit" data-datagrid-head={datagrid.identifier}>
	{#if head}
		{@render head()}
	{:else}
		{#each datagrid.columns as column (column.id)}
			<Header {column} />
		{/each}
	{/if}
</div>
