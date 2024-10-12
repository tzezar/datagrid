<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import MaterialSymbolsFilterAltOffOutline from '~icons/material-symbols/filter-alt-off-outline';
	import MaterialSymbolsFilterAltOutline from '~icons/material-symbols/filter-alt-outline';
	import Button from '$lib/components/ui/button/button.svelte';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		class: _class,
		iconEnabled,
		iconDisabled
	}: {
		iconEnabled?: Snippet;
		iconDisabled?: Snippet;
		class?: string;
	} = $props();
</script>

<Button
	size="sm"
	class={_class}
	onclick={() => datagrid.toggleHeadFilter()}
>
	{#if datagrid.state.isHeadFilterVisible}
		{#if iconEnabled}
			{@render iconEnabled()}
		{:else}
			<MaterialSymbolsFilterAltOutline />
		{/if}
	{:else if iconDisabled}
		{@render iconDisabled()}
	{:else}
		<MaterialSymbolsFilterAltOffOutline />
	{/if}
</Button>
