<script lang="ts">
	import type { GridBasicRow, GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { ColumnMeta, TzezarsDatagrid } from '../../types';
	import { isColumnVisible } from '$lib/datagrid/core/utils.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: LeafColumn<any, ColumnMeta>;
		row: GridGroupRow<any>;
		children: Snippet<[TzezarsDatagrid, LeafColumn<any, ColumnMeta>, GridGroupRow<any>]>;
	};

	let { datagrid, column, row, children }: Props = $props();
    
</script>

{#if isColumnVisible(column)}
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
