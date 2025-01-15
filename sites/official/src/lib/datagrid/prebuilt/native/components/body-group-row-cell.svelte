<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DataGrid<any>;
		column: LeafColumn<any>;
		row: GridGroupRow<any>;
		children: Snippet<[DataGrid<any>, LeafColumn<any>, GridGroupRow<any>]>;
	};

	let { datagrid, column, row, children }: Props = $props();
</script>

{#if column.isVisible()}
	<div
		class={cn('grid-body-cell')}
		class:justify-center={column?._meta?.align === 'center'}
		data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
		style:--pin-left-offset={column.state.pinning.offset + 'px'}
		style:--pin-right-offset={column.state.pinning.offset + 'px'}
	>
		{@render children(datagrid, column, row)}
	</div>
{/if}
