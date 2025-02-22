<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { LeafColumn } from '$lib/datagrid/core/types';
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
				hideable: false
			},
			_meta: {
				grow: true
			}
		}),
		accessorColumn({
			accessorKey: 'category'
		}),
		accessorColumn({
			accessorKey: 'price.retail',
			options: {
				resizable: false
			},
			state: {
				visible: false
			}
		})
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];

	let { data }: { data: InventoryItem[] } = $props();

	const datagrid = new DatagridCore({
		columns,
		data
	});
</script>

<div>
	{#each datagrid.columns.getLeafColumns() as column}
		<div>
			<input
				disabled={column.options.hideable === false}
				type="checkbox"
				checked={datagrid.columns.findColumnByIdOrThrow(column.columnId).state.visible}
				onchange={() => {
					datagrid.handlers.column.toggleColumnVisibility(column.columnId);
				}}
			/>
			{column.header}
		</div>
	{/each}
</div>

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
							{#if column.isVisible()}
								{#if !row.isGroupRow()}
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
								{:else}{/if}
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<Pagination {datagrid} />
</div>

<pre>
	{JSON.stringify(
		datagrid.columns.getLeafColumns().map((c) => {
			return {
				columnId: c.columnId,
				visible: c.state.visible,
				hideable: c.options.hideable
			};
		}),
		null,
		2
	)}
</pre>

{#snippet LeafHeader(column: LeafColumn<any>)}
	{#if column.isVisible()}
		<div
			class={cn('th  min-w-40 max-w-40  gap-2 px-4 py-2', column._meta.grow && '!max-w-full !grow')}
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
