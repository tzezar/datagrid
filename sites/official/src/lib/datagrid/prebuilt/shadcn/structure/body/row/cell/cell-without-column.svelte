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
		'grid-body-cell',
		datagrid.extra.state.highlightSelectedRow &&
			datagrid.features.rowSelection.isRowSelected(row.identifier)
			? 'bg-blue-400/10'
			: '',
		_class
	)}
>
	{@render children()}
</div>
