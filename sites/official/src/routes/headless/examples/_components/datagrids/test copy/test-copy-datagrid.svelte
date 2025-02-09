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
		parentId: string | null;
		columnId: string;
	};

	export const columns = [
		{
			type: 'accessor',
			header: 'Id',
			accessorKey: 'id',
			columnId: 'id',
			parentId: null,
			width: 100,
			left: 0,
			depth: 0,
			pinned: 'left'
		},
		{
			type: 'group',
			header: 'Product',
			columnId: 'product',
			parentId: null,
			width: 500,
			left: 100,
			depth: 1,
			columns: [
				{
					type: 'group',
					header: 'Details',
					columnId: 'details',
					parentId: 'product',
					width: 200,
					left: 100,
					depth: 2,
					columns: [
						{
							type: 'accessor',
							header: 'Name',
							accessorKey: 'name',
							columnId: 'name',
							parentId: 'details',
							width: 100,
							left: 0,
							depth: 2,
							pinned: 'left'
						},
						{
							type: 'accessor',
							header: 'Category',
							accessorKey: 'category',
							columnId: 'category',
							parentId: 'details',
							width: 100,
							left: 0,
							depth: 2
						}
					]
				},
				{
					type: 'group',
					header: 'Informations',
					columnId: 'informations',
					parentId: 'product',
					width: 300,
					left: 0,
					depth: 2,
					columns: [
						{
							type: 'accessor',
							header: 'Price',
							accessorKey: 'price',
							columnId: 'price',
							parentId: 'informations',
							width: 100,
							left: 0,
							depth: 3
						},
						{
							type: 'accessor',
							header: 'Quantity',
							accessorKey: 'quantity',
							columnId: 'quantity',
							parentId: 'informations',
							width: 100,
							left: 0,
							depth: 3
						},
						{
							type: 'accessor',
							header: 'Status',
							accessorKey: 'status',
							columnId: 'status',
							parentId: 'informations',
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
			columnId: 'supplier',
			parentId: null,
			width: 100,
			left: 0,
			depth: 1
		},
		{
			type: 'group',
			header: 'Restock',
			columnId: 'restock',
			parentId: null,
			width: 100,
			left: 100,
			depth: 1,
			columns: [
				{
					type: 'accessor',
					header: 'Date',
					accessorKey: 'restockDate',
					columnId: 'restockDate',
					parentId: 'restock',
					width: 100,
					left: 0,
					depth: 2
				}
			]
		}
	] satisfies Column<InventoryItem>[];

	const rowHeight = 30;

	let { data }: { data: { inventory: InventoryItem[] } } = $props();

	function transformColumns(columns: Column[]) {
		console.log(columns);

		// It will calculate width, left, and depth for each flat column
		const flattened: Column[] = [];
		let left = 0;

		function traverse(cols: Column[], depth = 0, parentId: string | null = null) {
			cols.forEach((col) => {
				const isLeaf = col.type !== 'group';

				let width = 100;

				// If not a leaf, sum up children's width
				if (col.type === 'group') {
					left = 100;
					// width = col.columns.reduce((sum, child) => sum + child.width, 0);
				}

				// Add the column's left offset and width
				const transformedCol = {
					...col,
					parentId,
					width,
					left: 0,
					depth
				};

				flattened.push(transformedCol);

				left = 0;
				// Increment the leftOffset for the next column at the same depth level
				if (col.type !== 'group') {
					left = 0;
				}

				// Recursively process children for group columns, but don't update leftOffset for groups
				if (col.type === 'group') {
					traverse(col.columns, depth + 1, col.columnId);
				}
			});
		}

		traverse(columns);

		return flattened;
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

	function flattenColumns(columns: Column[]): Column[] {
		const flattened: Column[] = [];

		columns.forEach((col) => {
			if (col.type === 'group') {
				// Flatten the group column with its inner columns
				flattened.push(...flattenColumns(col.columns));
				flattened.push({ ...col, columns: [] });
				// Recursively flatten the inner columns and add them
			} else {
				// Directly add the regular column
				flattened.push(col);
			}
		});

		console.log('flattened', flattened);

		return flattened;
	}

	function restoreHierarchy(columns: Column[]): Column[] {
		const columnMap = new Map<string, Column>(); // Map columnId to column
		const rootColumns: Column[] = [];

		// Populate the column map
		columns.forEach((col) => {
			columnMap.set(col.columnId, { ...col, columns: col.type === 'group' ? [] : undefined });
		});

		// Rebuild hierarchy
		columns.forEach((col) => {
			if (col.parentId && columnMap.has(col.parentId)) {
				const parent = columnMap.get(col.parentId);
				if (parent && isGroupColumn(parent)) {
					parent.columns.push(columnMap.get(col.columnId)!);
				}
			} else {
				rootColumns.push(columnMap.get(col.columnId)!);
			}
		});

		return rootColumns;
	}

	function getPinnedColumns(columns: Column[], pinnedSide: 'left' | 'right'): Column[] {
		const pinnedSet = new Set<string>(); // To store columnIds of pinned and required parent columns
		const flattened = flattenColumns(columns);

		// Step 1: Find all pinned columns
		flattened.forEach((col) => {
			if (col.pinned === pinnedSide) {
				pinnedSet.add(col.columnId);
				let parentId = col.parentId;
				// Step 2: Add all its parents to the pinned set
				while (parentId) {
					pinnedSet.add(parentId);
					parentId = flattened.find((c) => c.columnId === parentId)?.parentId || null;
				}
			}
		});

		// Step 3: Restore hierarchy only for pinned columns
		let pinnedColumns = flattened.filter((col) => pinnedSet.has(col.columnId));

		return restoreHierarchy(transformColumns(restoreHierarchy(pinnedColumns)));
	}

	let columnsPinnedLeft = $state(getPinnedColumns([...columns], 'left'));
	let columnsPinnedRight = getPinnedColumns([...columns], 'right');

	let columnsNotPinned = transformColumns(
		flattenColumns([...columns]).filter((col) => col.pinned !== 'left')
	);

	console.log(getHeaderRows(columnsNotPinned));

	function getLeafColumns(columns: Column[]) {
		return columns.filter((col) => col.type !== 'group');
	}
</script>

<div class="table-wrapper">
	<div class="table">
		<div class="thead flex sticky top-0">
			<div>
				{#each getHeaderRows(columnsPinnedLeft) as row}
					<div
						class="tr flex min-w-full max-w-fit bg-white"
						style="
				max-width: fit-content;
				overflow-hidden;
			"
					>
						{#each row as cell}
							<div
								class="th bg-white"
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
			<div>
				{#each getHeaderRows(columnsNotPinned) as row}
					<div
						class="tr flex min-w-full max-w-fit bg-white"
						style="
					max-width: fit-content;
					overflow-hidden;
				"
					>
						{#each row as cell}
							<div
								class="th bg-white"
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
		</div>
		<div class="tbody flex flex-col">
			{#each data.inventory.splice(0, 10) as row}
				<div class="tr flex">
					<div class="sticky left-0 flex">
						{#each getLeafColumns(flattenColumns(columnsPinnedLeft)) as col}
							<div class="td w-[100px] px-2 py-1">{row[col.accessorKey]}</div>
						{/each}
					</div>
					{#each getLeafColumns(flattenColumns(columnsNotPinned)) as col}
						<div class="td w-[100px] px-2 py-1">{row[col.accessorKey]}</div>
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
