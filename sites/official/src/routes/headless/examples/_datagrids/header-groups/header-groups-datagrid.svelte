<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { LeafColumn, GroupColumn } from '$lib/datagrid/core/types';
	import {
		accessorColumn,
		columnGroup,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';

	export const columns = [
		columnGroup({
			header: 'Product',
			columns: [
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
				})
			]
		}),
		columnGroup({
			header: 'Inventory',
			columns: [
				accessorColumn({
					accessorKey: 'id'
				}),
				accessorColumn({
					accessorKey: 'name',
					_meta: {}
				}),
				columnGroup({
					header: 'Informations',
					columns: [
						accessorColumn({
							accessorKey: 'id'
						}),
						accessorColumn({
							accessorKey: 'name',
							_meta: {}
						}),
						accessorColumn({
							accessorKey: 'category'
						})
					]
				}),
				columnGroup({
					header: 'Something else',
					columns: [
						accessorColumn({
							accessorKey: 'id'
						}),
						accessorColumn({
							accessorKey: 'name',
							_meta: {}
						}),
						accessorColumn({
							accessorKey: 'category'
						})
					]
				}),
				accessorColumn({
					accessorKey: 'category'
				})
			]
		}),
		accessorColumn({
			accessorKey: 'price.retail'
		})
	] satisfies ColumnDef<InventoryItem>[];

	let { data }: { data: InventoryItem[] } = $props();

	const datagrid = new DatagridCore({
		columns,
		data
	});
</script>

<div class="wrapper">
	<div class="table">
		<div class="thead">
			<div class="flex items-end">
				{#each datagrid.columns.getColumns() as column}
					{#if column.type === 'group'}
						{@render GroupHeader(column)}
					{:else}
						{@render LeafHeader(column)}
					{/if}
				{/each}
			</div>
		</div>
		<div class="tbody">
			{#each datagrid.rows.getVisibleBasicRows() as row}
				<div class="tr">
					{#each datagrid.columns.getLeafColumns() as column}
						<div class="td">
							{getCellContent(column, row.original)}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

{#snippet GroupHeader(column: GroupColumn<any>)}
	<div class="th flex w-full flex-col">
		<div class="px-4 py-2 font-bold">
			{column.header}
		</div>
		<div class="flex">
			{#each column.columns ?? [] as subColumn (subColumn.columnId)}
				{#if isGroupColumn(subColumn)}
					{@render GroupHeader(subColumn)}
				{:else if subColumn.state.visible === true}
					{@render LeafHeader(subColumn)}
				{/if}
			{/each}
		</div>
	</div>
{/snippet}

{#snippet LeafHeader(column: LeafColumn<any>)}
	<div class={cn('th min-w-40 self-end px-4 py-2 ', column._meta.grow && '!grow')}>
		{column.header}
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
