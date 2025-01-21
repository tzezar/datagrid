<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { shouldHighlightSelectedRow } from '$lib/datagrid/prebuilt/shadcn/utils';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridBasicRow<any>;
		children: Snippet;
		class?: string;
	};
	let { datagrid, row, children, class: _class }: Props = $props();
</script>

<div
	class={cn(
		'flex h-full items-center justify-center px-2 py-1',
		shouldHighlightSelectedRow(datagrid, row) && 'bg-blue-400/10',
		_class
	)}
>
	{@render children()}
</div>

<style>
</style>
