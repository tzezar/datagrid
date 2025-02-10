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

	import { VirtualList } from 'svelte-virtuallists';

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
			accessorKey: 'price'
		}),
		accessorColumn({
			accessorKey: 'status'
		})
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];

	let { data }: { data: { inventory: InventoryItem[] } } = $props();

	const datagrid = new DatagridCore({
		columns: columns,
		data: data.inventory,
		initialState: {
			pagination: {
				pageSize: 1_000,
				pageSizes: [1_000, 5_000, 10_000, 50_000, 100_000]
			}
		}
	});
</script>

<div class="wrapper w-full overflow-auto">
	<VirtualList items={datagrid.rows.getPaginatedRows()} style="height:600px; position:relative; overflow:auto;">
		{#snippet header()}
			<div class="thead">
				<div class="flex">
					{#each datagrid.columns.getLeafColumnsInOrder() as column}
						{@render LeafHeader(column)}
					{/each}
				</div>
			</div>
		{/snippet}
		{#snippet vl_slot({ index, item })}
			<div class="tr">
				{#if !item.isGroupRow()}
					{#each datagrid.columns.getLeafColumnsInOrder() as column}
						{@render RenderBodyCell(column, item)}
					{/each}
				{:else}{/if}
			</div>
		{/snippet}
	</VirtualList>
	<Pagination {datagrid} />
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
	.th,
	.td {
		@apply leading-relaxed;
		width: var(--width);
		min-width: 200;
		max-width: var(--max-width);
	}

	:global(.vtlist) {
	}

	:global(.vtlist-inner) {
		@apply !flex w-full min-w-full;
	}

	.tr {
		@apply flex;
	}
	.thead {
		@apply sticky top-0 bg-background;
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
