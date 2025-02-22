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
	import { codeToHtml } from 'shiki';
	import Pagination from '../../_blocks/pagination.svelte';
	import { inventoryData as data } from '$lib/data/data-storage.svelte';

	export const columns = [
		accessorColumn({
			accessorKey: 'id',
			state: {
				size: {
					width: 100,
					maxWidth: 200,
					minWidth: 50
				}
			}
		}),
		accessorColumn({
			accessorKey: 'name'
		}),
		accessorColumn({
			accessorKey: 'category'
		}),
		accessorColumn({
			accessorKey: 'price.retail',
			options: {
				resizable: false
			}
		})
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];

	const datagrid = new DatagridCore({
		columns,
		data
	});

	let columnResizeMode: 'standard' | 'fluid' = $state('fluid');

	let html = $state('');

	// @ts-ignore
	$effect(async () => {
		html = await codeToHtml(
			JSON.stringify(
				datagrid.columns.getLeafColumns().map((c) => {
					return {
						columnId: c.columnId,
						resizable: c.options.resizable,
						size: c.state.size
					};
				}),
				null,
				2
			),
			{ lang: 'json', theme: 'poimandres' }
		);
	});

</script>


<div class="flex w-full flex-col">
	<div class="flex gap-4">
		<label>
			<input
				type="checkbox"
				checked={columnResizeMode === 'fluid'}
				onchange={() => (columnResizeMode = 'fluid')}
			/>
			Fluid (resize on drag)
		</label>
	
		<label>
			<input
				type="checkbox"
				checked={columnResizeMode === 'standard'}
				onchange={() => (columnResizeMode = 'standard')}
			/>
			Standard (resize on end)
		</label>
	</div>
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
									style:--width={column.state.size.width + 'px'}
									style:--min-width={column.state.size.minWidth + 'px'}
									style:--max-width={column.state.size.maxWidth + 'px'}
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

	{@html html}
</div>

{#snippet LeafHeader(column: LeafColumn<any>)}
	<div
		class={cn('th  min-w-40 max-w-40  gap-2 px-4 py-2', column._meta.grow && '!max-w-full !grow')}
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		<div class="flex justify-between self-center">
			{column.header}
		</div>
		{#if column.options.moveable}
			<div class="flex flex-row gap-2">
				<input
					disabled={column.options.resizable === false}
					type="range"
					min={column.state.size.minWidth}
					max={column.state.size.maxWidth}
					value={column.state.size.width}
					oninput={(e) => {
						if (columnResizeMode !== 'fluid') return;
						datagrid.handlers.column.updateColumnSize(
							column.columnId,
							Number(e.currentTarget.value)
						);
					}}
					onchange={(e) => {
						if (columnResizeMode !== 'standard') return;
						datagrid.handlers.column.updateColumnSize(
							column.columnId,
							Number(e.currentTarget.value)
						);
					}}
				/>
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
