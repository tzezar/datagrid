<!-- DataGrid.svelte -->
<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { accessorColumn, columnGroup } from '$lib/datagrid';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import { cn } from '$lib/utils';

	type ColumnGroup<TOriginalRow = any> = {
		type: 'group';
		header: string;
		columns: Column<TOriginalRow>[];
	};

	type AccessorColumn<TOriginalRow = any> = {
		type: 'accessor';
		header: string;
		accessorKey: keyof TOriginalRow;
	};

	type Column<TOriginalRow = any> = (ColumnGroup<TOriginalRow> | AccessorColumn<TOriginalRow>) & {
		width: number;
		left: number;
		depth: number;
		pinned?: 'left' | 'right';
	};

	export const columns = [
		{
			type: 'accessor',
			header: 'Id',
			accessorKey: 'id',
			width: 100,
			left: 0,
			depth: 0,
			pinned: 'left'
		},
		{
			type: 'group',
			header: 'Product',
			width: 500,
			left: 100,
			depth: 1,
			columns: [
				{
					type: 'group',
					header: 'Details',
					width: 200,
					left: 100,
					depth: 2,
					columns: [
						{
							type: 'accessor',
							header: 'Name',
							accessorKey: 'name',
							width: 100,
							left: 0,
							depth: 2,
							pinned: 'left'
						},
						{
							type: 'accessor',
							header: 'Category',
							accessorKey: 'category',
							width: 100,
							left: 0,
							depth: 2
						}
					]
				},
				{
					type: 'group',
					header: 'Informations',
					width: 300,
					left: 0,
					depth: 2,
					columns: [
						{
							type: 'accessor',
							header: 'Price',
							accessorKey: 'price',
							width: 100,
							left: 0,
							depth: 3
						},
						{
							type: 'accessor',
							header: 'Quantity',
							accessorKey: 'quantity',
							width: 100,
							left: 0,
							depth: 3
						},
						{
							type: 'accessor',
							header: 'Status',
							accessorKey: 'status',
							width: 100,
							left: 0,
							depth: 3
						}
					]
				}
			]
		},
		{
			type: 'accessor',
			header: 'Supplier',
			accessorKey: 'supplier',
			width: 100,
			left: 0,
			depth: 1
		},
		{
			type: 'group',
			header: 'Restock',
			width: 100,
			left: 100,
			depth: 1,
			columns: [
				{
					type: 'accessor',
					header: 'Date',
					accessorKey: 'restockDate',
					width: 100,
					left: 0,
					depth: 2
				}
			]
		}
	] satisfies Column<InventoryItem>[];

	const rowHeight = 30;

	let { data }: { data: { inventory: InventoryItem[] } } = $props();

	function calculateColSpan<TOriginalRow>(col: Column<TOriginalRow>): number {
		// if (col.state.visible === false) return 0;

		if (col.type === 'group') {
			const visibleChildrenSpan = col.columns.reduce(
				(sum, child) => sum + calculateColSpan(child),
				0
			);

			return visibleChildrenSpan === 0 ? 0 : visibleChildrenSpan;
		}

		return 1;
	}

	function getMaxDepth<TOriginalRow>(cols: Column<TOriginalRow>[]): number {
		return cols.reduce((max, col) => {
			if (col.type === 'group') {
				return Math.max(max, getMaxDepth(col.columns) + 1);
			}
			return max;
		}, 0);
	}

	function getHeaderRows(columns: Column[]) {
		const depth = getMaxDepth(columns);
		const rows: Column[][] = Array(depth + 1)
			.fill(null)
			.map(() => []);

		const processColumn = (col: Column, level: number) => {
			// If the column is a group, place it at the current level
			if (col.type === 'group') {
				rows[level].push({
					...col
				});

				// Process child columns at the next level
				col.columns.forEach((child) => {
					processColumn(child, level + 1);
				});
			} else {
				// If it's not a group (accessor column), always push it to the last row
				rows[depth].push({
					...col
				});
			}
		};

		// Start processing all columns
		columns.forEach((col) => {
			processColumn(col, 0);
		});

		return rows;
	}
</script>

<div class="table-wrapper">
	<div class="table">
		<div class="thead">
			{#each getHeaderRows(columns) as row}
				<div
					class="tr flex min-w-full max-w-fit bg-white"
					style="
						max-width: fit-content;
						overflow-hidden;
					"
				>
					{#each row as cell}
						<div
							class="th  bg-white "
							data-pinned={cell.pinned}
							style="
								margin-left: {cell.left}px;
								width: {cell.width}px;
								max-width: {cell.width}px;
							"
						>
							<span class="sticky px-2">
								{cell.header}
							</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="tbody">
			{#each Array(30) as _, i}
				<div class="tr flex">
					{#each Array(30) as _, i}
						<div class="td w-[100px] px-2 py-1">{i + 1}</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.sticky {
		position: sticky;
		left: 0;
	}
	.table-wrapper {
		max-width: 800px;
		overflow-x: auto;
		outline: 1px solid black;
	}
	.td {
		min-width: 40px;
	}
	.th {
		outline: 1px solid black;
		/* background-color: white; */
		text-align: left;
	}
</style>
