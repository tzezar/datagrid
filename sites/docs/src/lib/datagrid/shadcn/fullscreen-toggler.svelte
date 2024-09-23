<script lang="ts">
	import MaterialSymbolsFullscreen from '~icons/material-symbols/fullscreen';
	import MaterialSymbolsFullscreenExit from '~icons/material-symbols/fullscreen-exit';
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');

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

<Button
	size="sm"
	class={_class}
	onclick={() => (datagrid.state.isFullscreenActive = !datagrid.state.isFullscreenActive)}
>
	{#if datagrid.state.isFullscreenActive}
		{#if disabledIcon}
			{@render disabledIcon()}
		{:else}
			<MaterialSymbolsFullscreenExit />
		{/if}
	{:else}
		{#if enabledIcon}
			{@render enabledIcon()}
		{:else}
			<MaterialSymbolsFullscreen />
		{/if}
	{/if}
</Button>
