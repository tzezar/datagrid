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
	import ColumnFiltersInput from '../../_blocks/column-filters-input.svelte';
	import Pagination from '../../_blocks/pagination.svelte';

	export const columns = [
		accessorColumn({
			accessorKey: 'id',
			options: {
				filterable: true
			},
			_meta: {
				filterType: 'number'
			}
		}),
		accessorColumn({
			accessorKey: 'name',
			_meta: {
				filterType: 'text',
				grow: true
			}
		}),
		accessorColumn({
			accessorKey: 'category',
			_meta: {
				filterType: 'select',
				filterOptions: [
					{
						label: 'Computers',
						value: 'Computers'
					},
					{
						label: 'Clothing',
						value: 'clothing'
					}
				]
			}
		}),
		accessorColumn({
			accessorKey: 'price.retail',
			_meta: {
				filterType: 'range'
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
								<div class="td">
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
	<div class={cn('th  min-w-40 max-w-40  gap-2 px-4 py-2', column._meta.grow && '!grow')}>
		<div class="pb-2">{column.header}</div>

		{#if column.options.filterable}
			<div class="flex flex-col gap-2">
				<ColumnFiltersInput {datagrid} {column} />
			</div>
		{/if}
	</div>
{/snippet}

<style lang="postcss">
	.wrapper {
		@apply max-h-[400px] overflow-auto;
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
		@apply w-full max-w-40 overflow-hidden text-ellipsis text-nowrap px-4 py-1 align-top;
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
