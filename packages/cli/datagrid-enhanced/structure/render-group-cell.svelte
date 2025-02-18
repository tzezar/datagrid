<script lang="ts">
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import GroupCell from './group-cell.svelte';

	type Props = {
		datagrid: EnhancedDatagrid;
		row: GridGroupRow<any>;
		column: LeafColumn<any>;
	};

	let { datagrid, row, column }: Props = $props();
</script>

{#if column.isVisible()}
	<GroupCell {column}>
		{#if column.columnId == row.groupKey}
			{@render GroupCellHeaderSnippet(column, row)}
		{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
			{@render GroupCellAggregationSnippet(row, column)}
		{/if}
	</GroupCell>
{/if}

{#snippet GroupCellHeaderSnippet(column: LeafColumn<any>, row: GridGroupRow<any>)}
	<!-- padding: 4px 8px; -->
	<div
		class="group-row-cell flex !h-full !min-h-full overflow-hidden !px-[8px] !py-[4px]"
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		<button
			class="flex w-full items-center justify-start gap-1 overflow-hidden"
			onclick={() => datagrid.handlers.rows.toggleGroupExpansion(row)}
		>
			<span class="border-primary/30 rounded-sm border-[1px]">
				<ArrowRight
					class={`${row.isExpanded() && 'rotate-90'} transition-all `}
				/>
			</span>
			<span class="overflow-hidden text-ellipsis whitespace-nowrap leading-normal">
				{row.groupValue[0]}
			</span>
			<span class="text-muted-foreground flex place-items-center pl-1 text-xs leading-none">
				[{row.children.length}]
			</span>
		</button>
	</div>
{/snippet}

{#snippet GroupCellAggregationSnippet(row: GridGroupRow<any>, column: LeafColumn<any>)}
	<div class="text-muted-foreground text-xs px-4 py-2 h-full">
		{#each row.aggregations.filter((agg) => agg.columnId === column.columnId) as aggregation}
			<p>
				{aggregation.type}: {#if aggregation.type === 'percentChange'}
					{aggregation.value.toFixed(2)}%
				{:else if typeof aggregation.value === 'number'}
					{aggregation.value.toLocaleString()}
				{:else}
					{aggregation.value}
				{/if}
			</p>
		{/each}
	</div>
{/snippet}
