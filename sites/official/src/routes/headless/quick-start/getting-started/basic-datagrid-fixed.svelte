<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import { type GridBasicRow, type LeafColumn } from '$lib/datagrid/core/types';
	import { isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import {
		accessorColumn,
		columnGroup,
		computedColumn,
		DatagridCore,
		displayColumn,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';

	export const columns = [
		accessorColumn({
			accessorKey: 'id'
		}),
		columnGroup({
			header: 'Product',
			columns: [
				accessorColumn({
					accessorKey: 'name'
				}),
				computedColumn({
					header: 'Price',
					getValueFn: (row) => row.price.retail + " " + row.price.currency
				})
			]
		}),
		displayColumn({
			columnId: 'expansion',
			header: '',
			cell: () => '<div>+</div>'
		})
	] satisfies ColumnDef<InventoryItem>[];

	let { data }: { data: InventoryItem[] } = $props();

	const datagrid = new DatagridCore({
		columns,
		data: data.slice(0, 100)
	});
</script>

<div class="wrapper">
	<div class="table">
		<div class="thead">
			<div class="tr">
				{#each datagrid.columns.getLeafColumns() as column}
					<div class="th">
						{column.header}
					</div>
				{/each}
			</div>
		</div>
		<div class="tbody">
			{#each datagrid.rows.getVisibleBasicRows() as row}
				<div class="tr">
					{#each datagrid.columns.getLeafColumns() as column}
						{@render CellRenderer(column, row)}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

{#snippet CellRenderer(column: LeafColumn<any>, row: GridBasicRow<any>)}
	{@const cellContent = column.cell ? column.cell({ datagrid, column, row }) : null}
	<div class="td">
		{#if cellContent}
			{#if typeof cellContent === 'string'}
				{@html cellContent}
			{:else if isCellComponent(cellContent)}
				<cellContent.component {datagrid} {row} {column} />
			{/if}
		{:else}
			<span>
				{@html getCellContent(column, row.original)}
			</span>
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
		@apply sticky top-0;
	}

	.table {
		@apply w-full;
	}
	.th {
		@apply w-full max-w-40 overflow-hidden text-ellipsis text-nowrap px-4 py-2 text-left;
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
		/* margin: -1px; */
		/* border: 1px solid hsl(var(--border)); */
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>
