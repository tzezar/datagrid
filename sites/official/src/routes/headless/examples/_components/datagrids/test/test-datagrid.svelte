<!-- DataGrid.svelte -->
<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { accessorColumn, columnGroup, DatagridCore, type ColumnDef } from '$lib/datagrid';

	type Column = {
		header?: string;
		accessorKey?: string;
		columns?: Column[];
		columnId?: string;
		grow?: boolean; // Add grow property for flexible width
	};

	export const columns = [
		columnGroup({
			header: 'Inventory',
			columnId: 'inventory',
			columns: [
				accessorColumn({
					accessorKey: 'id'
				}),
				accessorColumn({
					accessorKey: 'name',
					grow: true // Make this column flexible
				}),
				accessorColumn({
					accessorKey: 'category'
				}),
				columnGroup({
					header: 'Inventory2',
					columnId: 'inventory2',
					columns: [
						accessorColumn({
							columnId: 'id2',
							accessorKey: 'id'
						}),
						accessorColumn({
							columnId: 'name2',
							accessorKey: 'name'
						}),
						accessorColumn({
							columnId: 'category2',
							accessorKey: 'category'
						})
					]
				})
			]
		}),
		accessorColumn({
			accessorKey: 'price'
		})
	] satisfies ColumnDef<InventoryItem>[];

	let { data }: { data: { inventory: InventoryItem[] } } = $props();

	const datagrid = new DatagridCore({
		columns,
		data: data.inventory
	})

	// Get maximum depth of column nesting





	

	const maxDepth = datagrid.processors.column.getMaxDepth(columns);
	const leafColumns = datagrid.columns.getLeafColumns();
	const totalColumns = leafColumns.length;

	// Generate grid template columns with flexible column support
	const gridTemplateColumns = leafColumns
		.map(col => col.grow ? 'minmax(var(--col-width), 1fr)' : 'var(--col-width)')
		.join(' ');
</script>

<div class="grid-wrapper">
	<div class="grid">
		<!-- Headers -->
		<div class="header-group">
			{#each datagrid.processors.column.generateHeaderRows(columns) as row, rowIndex}
				<div class="row" style="grid-template-columns: {gridTemplateColumns}">
					{#each row as cell}
						{#if cell}
							<div
								class="header-cell"
								style="
									grid-column: {cell.colStart + 1} / span {cell.colSpan};
									{cell.columns ? 'text-align: center;' : ''}
								"
							>
								{cell.header || cell.accessorKey || ''}
							</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>

		<!-- Body -->
		<div class="body">
			{#each data.inventory as row}
				<div class="row" style="grid-template-columns: {gridTemplateColumns}">
					{#each leafColumns as col}
						<div class="cell">
							{row[col.accessorKey || '']}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	:root {
		--col-width: 100px;
	}

	.grid-wrapper {
		width: 100%;
		overflow-x: auto;
	}

	.grid {
		display: block;
		width: fit-content;
		min-width: 100%;
		border: 1px solid #ddd;
	}

	.header-group {
		position: sticky;
		top: 0;
		background: white;
		z-index: 1;
	}

	.row {
		display: grid;
	}

	.header-cell,
	.cell {
		padding: 8px;
		border-right: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
		min-width: var(--col-width);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background: white;
		box-sizing: border-box;
	}

	.header-cell {
		background: #f5f5f5;
		font-weight: bold;
	}

	.body .row:nth-child(even) {
		background: #fafafa;
	}
</style>