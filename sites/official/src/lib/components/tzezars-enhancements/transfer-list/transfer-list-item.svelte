<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { Snippet } from 'svelte';
	import type { TransferListCore } from './transfer-list-core.svelte';

	type Props = {
		side: 'source' | 'target';
		core: TransferListCore<any>;
		row: any;
		onclick?: () => void;
		withCheckbox?: boolean;
		children: Snippet;
	};

	let {
		core,
		side,
		row,
		withCheckbox = true,
		onclick = () => core.toggleSelection(side, row),
		children
	}: Props = $props();
</script>

<button {onclick} class="flex w-full cursor-pointer items-center gap-2 p-2 hover:bg-muted">
	{#if withCheckbox}
		<Checkbox checked={core?.isSelected(side, row)} />
	{/if}
	{@render children()}
</button>
