<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { GridBasicRow, GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import { convertSelectedOptionsToArray } from '$lib/datagrid/core/utils.svelte';
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';
	import {
		accessorColumn,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import Pagination from '../../_blocks/pagination.svelte';
	import { inventoryData as data } from '$lib/data/data-storage.svelte';

	export const columns = [
		accessorColumn({
			accessorKey: 'id'
		}),
		accessorColumn({
			accessorKey: 'name',
			_meta: {
				grow: true
			}
		}),
		accessorColumn({
			accessorKey: 'category',
			aggregate: 'count'
		}),
		accessorColumn({
			accessorKey: 'price.retail',
			aggregate: 'median'
		}),
		accessorColumn({
			accessorKey: 'status',
			aggregate: 'uniqueCount'
		})
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];


	const datagrid = new DatagridCore({
		columns,
		data,
		initialState: {
			grouping: {
				maxExpandedGroups: 1
			}
		}
	});

	datagrid.events.on('onActiveGroupsLimitExceeded', () => {
		toast.error('Maximum number of expanded groups exceeded');
	});
</script>

<select
	class="bg-background h-40 border p-4"
	multiple
	onchange={(event) =>
		datagrid.handlers.grouping.updateGrouping(convertSelectedOptionsToArray(event))}
>
	{#each datagrid.columns.getLeafColumns() as column (column.columnId)}
		<option
			selected={datagrid.features.grouping.activeGroups.includes(column.columnId)}
			value={column.columnId}>{column.header}</option
		>
	{/each}
</select>

<div class="flex w-full flex-col">
	<div class="wrapper">
		<div class="table">
			<div class="thead">
				<div class="flex">
					{#each datagrid.columns.getLeafColumnsInOrder() as column}
						{@render LeafHeader(column)}
					{/each}
				</div>
			</div>
			<div class="tbody">
				{#each datagrid.rows.getPaginatedRows() as row}
					<div class="tr">
						{#if !row.isGroupRow()}
							{#each datagrid.columns.getLeafColumnsInOrder() as column}
								{@render RenderBodyCell(column, row)}
							{/each}
						{:else}
							{#each datagrid.columns.getLeafColumnsInOrder() as column, columnIndex (column.columnId)}
								{@render RenderGroupCell(column, row)}
							{/each}
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<Pagination {datagrid} />

	<pre>{JSON.stringify(
		{
			activeGroups: datagrid.features.grouping.activeGroups
		},
		null,
		2
	)}</pre>
</div>

{#snippet RenderBodyCell(column: LeafColumn<any>, row: GridBasicRow<any>)}
	<div
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
		class={cn('td  min-w-40 max-w-40  gap-2 px-4 py-2 ', column._meta.grow && '!max-w-full !grow')}
	>
		{getCellContent(column, row.original)}
	</div>
{/snippet}

{#snippet RenderGroupCell(column: LeafColumn<any>, row: GridGroupRow<any>)}
	<div
		data-depth={row.depth}
		data-expanded={row.isExpanded()}
		class={cn('group-row-cell ', column._meta.grow && '!max-w-full !grow')}
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		{#if column.columnId == row.groupKey}
			{@render GroupCellHeaderSnippet(column, row)}
		{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
			{@render GroupCellAggregationSnippet(row, column)}
		{/if}
	</div>
{/snippet}

{#snippet GroupCellHeaderSnippet(column: LeafColumn<any>, row: GridGroupRow<any>)}
	<button
		class="flex items-center gap-1 overflow-hidden px-4 py-2"
		onclick={() => datagrid.handlers.rows.toggleGroupExpansion(row)}
	>
		<span class="border-primary/30 rounded-sm border-[1px]">
			<ArrowRight class={`${row.isExpanded() && 'rotate-90'} transition-all `} />
		</span>
		<span class="w-full overflow-hidden text-ellipsis whitespace-nowrap leading-normal">
			{row.groupValue[0]}
		</span>
		<span class="text-muted-foreground flex place-items-center pl-1 text-xs leading-none">
			[{row.children.length}]
		</span>
	</button>
{/snippet}

{#snippet GroupCellAggregationSnippet(row: GridGroupRow<any>, column: LeafColumn<any>)}
	<div class="text-muted-foreground flex h-full items-center px-4 py-2 text-xs">
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



{#snippet LeafHeader(column: LeafColumn<any>)}
	{#if column.isVisible()}
		<div
			class={cn('th min-w-40 max-w-40  gap-2 px-4 py-2', column._meta.grow && '!max-w-full !grow')}
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
		>
			<div class="flex justify-between self-center">
				{column.header}
			</div>
		</div>
	{/if}
{/snippet}

<style lang="postcss">
	.group-row-cell {
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}

	.th,
	.td {
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
	}

	.wrapper {
		@apply max-h-[600px] overflow-auto;
	}
	.tr {
		@apply flex;
	}
	.thead {
		@apply bg-background sticky top-0;
	}

	.table {
		@apply w-full;
	}
	.th {
	}
	.td {
		@apply overflow-hidden text-ellipsis text-nowrap px-4 py-1 align-top;
	}

	.wrapper,
	.th,
	.td {
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>
