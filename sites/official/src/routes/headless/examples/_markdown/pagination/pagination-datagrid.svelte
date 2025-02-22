<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import {
		accessorColumn,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';
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
						{:else}{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<!-- Pagination Controls -->
	<div class="pagination-controls flex !items-center">
		<div class="page-size-selector flex items-center gap-2">
			<span class="text-nowrap">Per page:</span>
			<select
				value={datagrid.features.pagination.pageSize}
				onchange={(e) => datagrid.handlers.pagination.changePageSize(Number(e.currentTarget.value))}
			>
				{#each datagrid.features.pagination.pageSizes as pageSize}
					<option value={pageSize}>{pageSize}</option>
				{/each}
			</select>
		</div>

		<div class="pagination-navigation">
			<button
				disabled={datagrid.features.pagination.canGoToPrevPage()}
				onclick={() => datagrid.handlers.pagination.goToPrevPage()}
			>
				Previous
			</button>

			<span class="page-indicator">
				Page {datagrid.features.pagination.page} of {datagrid.features.pagination.pageCount}
			</span>

			<button
				disabled={datagrid.features.pagination.canGoToNextPage()}
				onclick={() => datagrid.handlers.pagination.goToNextPage()}
			>
				Next
			</button>
		</div>
		<div class="row-range-display">
			Showing
			{datagrid.features.pagination.pageSize * (datagrid.features.pagination.page - 1) + 1}
			to
			{Math.min(
				datagrid.features.pagination.pageSize * datagrid.features.pagination.page,
				(datagrid.cacheManager.rows || []).length
			)}
			of {(datagrid.cacheManager.rows || []).length} rows
		</div>
	</div>
</div>

<pre>{JSON.stringify(
		{
			page: datagrid.features.pagination.page,
			pageSize: datagrid.features.pagination.pageSize,
			pageSizes: datagrid.features.pagination.pageSizes,
			pageCount: datagrid.features.pagination.pageCount
		},
		null,
		2
	)}</pre>

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
