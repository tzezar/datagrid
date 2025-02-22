<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { accessorColumn, DatagridCore, type ColumnDef } from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import Pagination from '../../_blocks/pagination.svelte';
	import SortingIndicator from '../../_blocks/sorting-indicator.svelte';
	import { inventoryData as data } from '$lib/data/data-storage.svelte';

	export const columns = [
		accessorColumn({
			accessorKey: 'id',
			_meta: {
				dataType: 'number'
			}
		}),
		accessorColumn({
			accessorKey: 'name',
			_meta: {
				grow: true,
				dataType: 'text'
			},
			options: {
				sortable: false
			}
		}),
		accessorColumn({
			accessorKey: 'category',
			_meta: {
				dataType: 'text'
			}
		}),
		accessorColumn({
			accessorKey: 'price.retail',
			_meta: {
				dataType: 'number'
			}
		}),
		accessorColumn({
			accessorKey: 'status',
			_meta: {
				dataType: 'text'
			}
		})
	] satisfies ColumnDef<InventoryItem, { dataType?: 'number' | 'text'; grow?: boolean }>[];

	const datagrid = new DatagridCore({
		columns,
		data
	});
	datagrid.events.on('onCellEdit', ({ newOriginalRow, newValue, prevOriginalRow, prevValue }) => {
		toast.success(`Updated value from ${prevValue} to ${newValue}`);
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
	{#if column.type !== 'display' && column.type !== 'computed'}
		{#if column._meta.dataType === 'number'}
			<input
				type="number"
				value={row.original[column.accessorKey]}
				oninput={(e) =>
					datagrid.handlers.editing.updateCellValue(row, column, +e.currentTarget.value)}
				style:--width={column.state.size.width + 'px'}
				style:--min-width={column.state.size.minWidth + 'px'}
				style:--max-width={column.state.size.maxWidth + 'px'}
				class={cn(
					'td  focus-within:!bg-foreground/10 min-w-40  max-w-40 gap-2 px-4 py-2 focus-within:outline-none ',
					column._meta.grow && '!max-w-full !grow'
				)}
			/>
		{:else}
			<input
				type="text"
				value={row.original[column.accessorKey]}
				oninput={(e) =>
					datagrid.handlers.editing.updateCellValue(row, column, e.currentTarget.value)}
				style:--width={column.state.size.width + 'px'}
				style:--min-width={column.state.size.minWidth + 'px'}
				style:--max-width={column.state.size.maxWidth + 'px'}
				class={cn(
					'td  focus-within:!bg-foreground/10 min-w-40  max-w-40 gap-2 px-4 py-2 focus-within:outline-none ',
					column._meta.grow && '!max-w-full !grow'
				)}
			/>
		{/if}
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

<pre class="max-h-[400px] overflow-auto">{JSON.stringify(
		{
			data: datagrid.rows.getPaginatedRows().map((r) => {
				if (r.isGroupRow()) return;
				return r.original;
			})
		},
		null,
		2
	)}</pre>

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

	.page-size-selector select {
		@apply bg-background h-10 w-full max-w-[150px] border px-2 py-2;
	}

	.pagination-navigation button {
		@apply h-10 border p-1 px-3 disabled:opacity-50;
	}

	.page-indicator {
		@apply border p-2;
	}
</style>
