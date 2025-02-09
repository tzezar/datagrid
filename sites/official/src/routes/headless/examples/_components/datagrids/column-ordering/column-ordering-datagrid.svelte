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
			_meta: {
				grow: true
			}
		}),
		accessorColumn({
			accessorKey: 'category'
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
					{#each datagrid.columns.getLeafColumns() as column}
						{@render LeafHeader(column)}
					{/each}
				</div>
			</div>
			<div class="tbody">
				{#each datagrid.rows.getPaginatedRows() as row}
					<div class="tr">
						{#each datagrid.columns.getLeafColumns() as column}
							{#if !row.isGroupRow()}
								<div
									class={cn(
										'td  min-w-40 max-w-40  gap-2 px-4 py-2',
										column._meta.grow && '!max-w-full !grow'
									)}
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
		class={cn('th  min-w-40 max-w-40  gap-2 px-4 py-2', column._meta.grow && '!max-w-full !grow')}
	>
		<div class="flex justify-between elf-center h-full">
			{column.header}
			{#if column.options.moveable}
				<div class="flex flex-row gap-2">
					<button onclick={() => datagrid.handlers.column.moveLeft(column.columnId)}>
						<ArrowMoveLeft />
					</button>
					<button onclick={() => datagrid.handlers.column.moveRight(column.columnId)}>
						<ArrowMoveRight />
					</button>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

<style lang="postcss">
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
	.th {
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
