<!-- <script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import {
		accessorColumn,
		columnGroup,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';

	export const columns = [
		columnGroup({
			header: 'Inventory',
			columnId: 'inventory',
			columns: [
				accessorColumn({
					accessorKey: 'id',
					width: 160 // Fixed width
				}),
				accessorColumn({
					accessorKey: 'name',
				}),
				accessorColumn({
					accessorKey: 'category',
					width: 160 // Fixed width
				})
			]
		}),
		accessorColumn({
			accessorKey: 'price',
			width: 160 // Fixed width
		})
	] satisfies ColumnDef<InventoryItem>[];

	let { data }: { data: { inventory: InventoryItem[] } } = $props();

	function normalizeColumnWidths(columns: ColumnDef[], totalWidth: number): ColumnDef[] {
		let remainingWidth = totalWidth;
		let fillColumns = 0;

		// First, determine how much space is occupied
		columns.forEach((col) => {
			if (!isGroupColumn(col)) {
				if (col.fillWidth) {
					fillColumns++;
				} else {
					remainingWidth -= col.width || 160;
				}
			}
		});

		// Assign width to "fillWidth" columns
		const fillColumnWidth = fillColumns > 0 ? remainingWidth / fillColumns : 160;

		return columns.map((column) => {
			if (isGroupColumn(column)) {
				const childColumns = normalizeColumnWidths(column.columns, totalWidth);
				const totalChildWidth = childColumns.reduce((sum, col) => sum + (col.width || 160), 0);
				return { ...column, width: totalChildWidth, columns: childColumns };
			}
			return { ...column, width: column.fillWidth ? fillColumnWidth : column.width || 160 };
		});
	}

	const datagrid = new DatagridCore({
		columns: normalizeColumnWidths(columns),
		data: data.inventory
	});

	$effect(() => {
		console.log($state.snapshot(datagrid._columns));
	});
</script>
{#snippet TH(column)}
	<div class="flex flex-col h-full grow" style="width: {column.width}px">
		<div class=" bg-red-400 h-full min-h-full flex grow">{column.header}</div>

		{#if isGroupColumn(column)}
			<div class="flex w-full">
				{#each column.columns as subColumn}
					<div style="width: {subColumn.width}px">
						{@render TH(subColumn)}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div class="wrapper">
	<div class="table">
		<div class="thead w-fit  h-full grow flex flex-col">
			<div class="flex flex-row items-end h-full grow">
				{#each datagrid.columns.getColumns() as column}
					{@render TH(column)}
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

<style lang="postcss">
	.spacer {
	flex-grow: 1; /* Takes up remaining space */
}
	.wrapper {
		@apply max-h-96 overflow-auto;
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
		@apply bg-red-400 px-4 py-2 text-left;
	}

	.td {
		@apply w-full max-w-40 overflow-hidden text-ellipsis text-nowrap px-4 py-1 align-top;
	}

	/* Column groups take full width */
	.tr {
		@apply flex w-full;
	} /* Ensure sub-columns have correct width constraints */
	.tr > .flex-1 {
		@apply min-w-40 max-w-40;
	}
	/* .td,
	.th {
		&:nth-child(2) {
			@apply max-w-full;
		}
	} */
	.wrapper,
	.th,
	.td {
		/* margin: -1px; */
		/* border: 1px solid hsl(var(--border)); */
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style> -->
