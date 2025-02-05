<script lang="ts">
	import type { ColumnMetaEnhanced } from '$lib/datagrid-enhanced/core/types';
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DatagridCore<any>;
		column: LeafColumn<any, ColumnMetaEnhanced>;
		row: GridGroupRow<any>;
		children: Snippet<[DatagridCore<any>, LeafColumn<any, ColumnMetaEnhanced>, GridGroupRow<any>]>;
	};

	let { datagrid, column, row, children }: Props = $props();
</script>

{#if column.isVisible()}
	<div
		class={cn('grid-body-cell')}
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
