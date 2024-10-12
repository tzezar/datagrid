<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import TopBar from './top-bar.svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';

	let { topBar }: { topBar: Snippet | undefined } = $props();

	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

{#if datagrid.options.topbar.display}
	{#if topBar}
		{@render topBar()}
	{:else}
		<TopBar />
	{/if}
{/if}
