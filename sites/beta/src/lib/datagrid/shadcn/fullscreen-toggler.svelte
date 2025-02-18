<script lang="ts">
	import MaterialSymbolsFullscreen from '../icones/MaterialSymbolsFullscreen.svelte'; 
	import MaterialSymbolsFullscreenExit from '../icones/MaterialSymbolsFullscreenExit.svelte'; 
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		enabledIcon,
		disabledIcon,
		class: _class
	}: {
		enabledIcon?: Snippet;
		disabledIcon?: Snippet;
		class?: string;
	} = $props();
</script>

<Button size="sm" class={_class} onclick={() => datagrid.toggleFullscreen()}>
	{#if datagrid.state.isFullscreenActive}
		{#if disabledIcon}
			{@render disabledIcon()}
		{:else}
			<MaterialSymbolsFullscreenExit />
		{/if}
	{:else if enabledIcon}
		{@render enabledIcon()}
	{:else}
		<MaterialSymbolsFullscreen />
	{/if}
</Button>
