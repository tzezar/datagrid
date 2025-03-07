<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import {
		accessorColumn,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';
	import Pagination from '../../_blocks/pagination.svelte';
	import SortingIndicator from '../../_blocks/sorting-indicator.svelte';
	import { inventoryData as data } from '$lib/data/data-storage.svelte';

	export const columns = [
		accessorColumn({
			accessorKey: 'id'
		}),
		accessorColumn({
			accessorKey: 'name',
			_meta: {
				grow: true
			},
			options: {
				sortable: false
			}
		}),
		accessorColumn({
			accessorKey: 'category'
		}),
		accessorColumn({
			accessorKey: 'price.retail'
		}),
		accessorColumn({
			accessorKey: 'status'
		})
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];

	const datagrid = new DatagridCore({
		columns,
		data
	});
</script>

<div class="flex w-full flex-col">
	<div class="wrapper">
		<div class="relative table">
			<div class="thead">
				<div class="flex">
					{#each datagrid.columns.getLeafColumnsInOrder() as column}
						{@render LeafHeader(column)}
					{/each}
				</div>
			</div>
			<div class="tbody contents">
				{#each datagrid.rows.getPaginatedRows() as row}
					<div class="tr">
						{#if !row.isGroupRow()}
							{#each datagrid.columns.getLeafColumnsInOrder() as column}
								{@render RenderBodyCell(column, row)}
							{/each}
						{:else}{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<Pagination {datagrid} />
</div>

{#snippet RenderBodyCell(column: LeafColumn<any>, row: GridBasicRow<any>)}
	{@const cellContent = column.cell ? column.cell({ datagrid, column, row }) : null}
	{#if cellContent}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {row} {column} />
		{/if}
	{:else}
		<div
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
			class={cn(
				'td  min-w-40 max-w-40  gap-2 px-4 py-2 ',
				column._meta.grow && '!max-w-full !grow'
			)}
		>
			{getCellContent(column, row.original)}
		</div>
	{/if}
{/snippet}

{#snippet LeafHeader(column: LeafColumn<any>)}
	{#if column.isVisible()}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={(e) => datagrid.handlers.sorting.toggleColumnSort(column, e.ctrlKey)}
			class={cn(
				'th flex min-w-40  max-w-40 items-center justify-between gap-2 px-4 py-2',
				column._meta.grow && '!max-w-full !grow',
				column.isSortable() && 'cursor-pointer'
			)}
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
		>
			<div class="flex justify-between self-center">
				{column.header}
			</div>
			{#if column.isSortable()}
				<SortingIndicator {datagrid} {column} />
			{/if}
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
		@apply leading-relaxed;
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

	.pagination-controls {
		@apply border-border flex flex-col items-center gap-4 border p-2 sm:flex-row;
	}
	
	.page-indicator {
		@apply border p-2;
	}
</style>
