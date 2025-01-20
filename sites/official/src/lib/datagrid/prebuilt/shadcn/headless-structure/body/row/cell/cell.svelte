<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: LeafColumn<any>;
		row: GridBasicRow<any>;
		children: Snippet;
	};
	let { datagrid, row, column, children }: Props = $props();
</script>

{#if column.isVisible()}
	<div
		class={cn(
			'grid-body-cell',
			datagrid.extra.features.rowSelection.highlightSelectedRow &&
				datagrid.features.rowSelection.isRowSelected(row.identifier)
				? 'bg-blue-400/10'
				: '',
			column._meta.styles?.bodyCell
		)}
		class:justify-center={column?._meta?.align === 'center'}
		data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
		style:--pin-left-offset={column.state.pinning.offset + 'px'}
		style:--pin-right-offset={column.state.pinning.offset + 'px'}
	>
		{@render children()}
	</div>
{/if}