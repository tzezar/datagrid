<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import ArrowMoveLeft from '$lib/datagrid/icons/tabler/arrow-move-left.svelte';
	import ArrowMoveRight from '$lib/datagrid/icons/tabler/arrow-move-right.svelte';
	import {
		accessorColumn,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';
	import Pagination from '../../_blocks/pagination.svelte';

	export const columns = [
		accessorColumn({
			accessorKey: 'id'
		}),
		accessorColumn({
			accessorKey: 'name'
		}),
		accessorColumn({
			accessorKey: 'category',
			state: {
				pinning: {
					position: 'right'
					// ! offset - do not set offset manually, it will be calculated automatically
				}
			}
		}),
		accessorColumn({
			accessorKey: 'price.retail'
		})
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];

	let { data }: { data: InventoryItem[] } = $props();

	const datagrid = new DatagridCore({
		columns,
		data
	});

	const cols = $derived(datagrid.columns.getPinnedAndCenterColumns());
</script>

<div class="w-fit max-w-full">
	<div class="wrapper w-fit max-w-full">
		<div class="table">
			<div class="thead">
				<div class="flex">
					<div class="flex"></div>
					<div class="flex gap-20">
						{@render RenderHeaderCell(cols.left, 'left')}
						{@render RenderHeaderCell(cols.center, 'center')}
						{@render RenderHeaderCell(cols.right, 'right')}
					</div>
				</div>
			</div>
			<div class="tbody">
				{#each datagrid.rows.getPaginatedRows() as row}
					<div class="tr gap-20">
						{@render RenderCell(cols.left, row)}
						{@render RenderCell(cols.center, row)}
						{@render RenderCell(cols.right, row)}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<Pagination {datagrid} />
</div>

{#snippet RenderHeaderCell(columns: ColumnDef<any>[], side: 'left' | 'center' | 'right' = 'center')}
	<div class="min-w-20">
		<p class="p-2 font-semibold uppercase">{side}</p>
		{#if columns.length > 0}
			<div class="flex">
				{#each columns as column}
					{#if column.type !== 'group'}
						{@render LeafHeader(column)}
					{:else}{/if}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet RenderCell(columns: ColumnDef<any>[], row: any)}
	<div class="min-w-20">
		{#if columns.length > 0}
			<div class="flex">
				{#each columns as column}
					{#if !row.isGroupRow()}
						<div
							class={cn('td  max-w-40  gap-2 px-4 py-2', column._meta.grow && '!max-w-full !grow')}
							style:--width={column.state.size.width + 'px'}
							style:--min-width={column.state.size.minWidth + 'px'}
							style:--max-width={column.state.size.maxWidth + 'px'}
						>
							{getCellContent(column, row.original)}
						</div>
					{:else}{/if}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet LeafHeader(column: LeafColumn<any>)}
	<div
		class={cn(
			'th  max-w-40 gap-2 px-4 py-2',
			column._meta.grow && 'min-w-[1000px] !max-w-full !grow'
		)}
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		<div class="flexjustify-between self-center">
			{column.header}
		</div>
		{#if column.options.pinnable}
			<div class="flex flex-row gap-2">
				<button onclick={() => datagrid.handlers.column.pinColumn(column.columnId, 'left')}>
					<ArrowMoveLeft />
				</button>
				<button onclick={() => datagrid.handlers.column.pinColumn(column.columnId, 'none')}>
					unpin
				</button>
				<button onclick={() => datagrid.handlers.column.pinColumn(column.columnId, 'right')}>
					<ArrowMoveRight />
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<style lang="postcss">
	.th,
	.td {
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);

		&[data-pinned] {
			@apply border-grid-border bg-grid-primary;
		}

		&[data-pinned='right'] {
			@apply border-l border-r-0;
			right: var(--pin-right-offset, 0);
		}

		&[data-pinned='left'] {
			@apply border-l-0 border-r;
			left: var(--pin-left-offset, 0);
		}
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

	.td {
		@apply overflow-hidden text-ellipsis text-nowrap px-4 py-1 align-top;
	}
	.td,
	.th {
		&:nth-child(2) {
			@apply max-w-full;
		}
	}
	.wrapper,
	.th,
	.td {
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>
