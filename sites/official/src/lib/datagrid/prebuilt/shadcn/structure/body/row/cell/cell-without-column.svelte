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
		'test flex relative box-border h-full w-full grow p-2',
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
	.test {
	width: var(--width);
	min-width: var(--min-width);
	max-width: var(--max-width);
	
}
</style>