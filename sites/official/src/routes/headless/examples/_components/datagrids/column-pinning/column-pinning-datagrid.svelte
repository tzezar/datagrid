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
			accessorKey: 'name',
			options: {
				pinnable: false
			},
            state: {
                size: {
                    minWidth: 1000,
                    maxWidth: 1000,
                    width: 1000
                }
            },
			_meta: {
				grow: true
			}
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
			accessorKey: 'price'
		})
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];

	let { data }: { data: { inventory: InventoryItem[] } } = $props();

	const datagrid = new DatagridCore({
		columns: columns,
		data: data.inventory
	});
</script>

<div>
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
						{#each datagrid.columns.getLeafColumnsInOrder() as column}
							{#if !row.isGroupRow()}
								<div
									class={cn(
										'td  max-w-40  gap-2 px-4 py-2',
										column._meta.grow && '!max-w-full !grow'
									)}
									data-pinned={column.state.pinning.position !== 'none'
										? column.state.pinning.position
										: null}
									style:--pin-left-offset={column.state.pinning.offset + 'px'}
									style:--pin-right-offset={column.state.pinning.offset + 'px'}
									style:--width={column.state.size.width + 'px'}
									style:--min-width={column.state.size.minWidth + 'px'}
									style:--max-width={column.state.size.maxWidth + 'px'}
								>
									{getCellContent(column, row.original)}
								</div>
							{:else}{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<Pagination {datagrid} />
</div>

{#snippet LeafHeader(column: LeafColumn<any>)}
	<div
		class={cn(
			'th  max-w-40 gap-2 px-4 py-2',
			column._meta.grow && 'min-w-[1000px] !max-w-full !grow'
		)}
		data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
		style:--pin-left-offset={column.state.pinning.offset + 'px'}
		style:--pin-right-offset={column.state.pinning.offset + 'px'}
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
		@apply sticky top-0 bg-background;
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
