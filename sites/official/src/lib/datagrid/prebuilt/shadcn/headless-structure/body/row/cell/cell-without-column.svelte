<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
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
		'flex p-2 items-center justify-center',
		datagrid.extra.features.rowSelection.highlightSelectedRow &&
			datagrid.features.rowSelection.isRowSelected(row.identifier)
			? 'bg-blue-400/10'
			: '',
		_class
	)}
>
	{@render children()}
</div>

<style>
</style>
