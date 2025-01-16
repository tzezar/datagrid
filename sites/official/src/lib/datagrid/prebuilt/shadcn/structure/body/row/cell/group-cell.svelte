<script lang="ts">
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import GroupCellContent from './group-cell-content.svelte';
	import GroupCellAggregations from '$lib/datagrid/prebuilt/shadcn/components/group-cell-aggregations.svelte';

	type Props = {
		column: LeafColumn<any>;
		row: GridGroupRow<any>;
		datagrid: TzezarsDatagrid;

		children?: Snippet;

		content?: Snippet;
		aggregations?: Snippet;
	};
	let {
		column,
		row,
		datagrid,
		children,
		content: groupCell,
		aggregations: aggregationCell
	}: Props = $props();
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
		{#if column.columnId == row.groupKey}
			{#if groupCell}
				{@render groupCell()}
			{:else}
				<GroupCellContent {column} {row} {datagrid} />
			{/if}
		{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
			{#if aggregationCell}
				{@render aggregationCell()}\
			{:else}
				<GroupCellAggregations {column} {row} {datagrid} />
			{/if}
		{/if}

		<!-- {@render children()} -->
	</div>
{/if}
