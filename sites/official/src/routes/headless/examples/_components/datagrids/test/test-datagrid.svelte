<!-- DataGrid.svelte
<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { accessorColumn, columnGroup, DatagridCore, type ColumnDef } from '$lib/datagrid';
	import { ColumnGroupingFeature } from '$lib/datagrid/core/features';
	import { SvelteSet } from 'svelte/reactivity';

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
					state: {
						size: {
							grow: true
						}
					}
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
	});

	let expandedRows: SvelteSet<string> = new SvelteSet([]);
	const toggle = (id: string) => {
		if (expandedRows.has(id)) {
			expandedRows.delete(id);
		} else {
			expandedRows.add(id);
		}
	};
</script>

<div class="grid-wrapper relative">
	<div class=" !contents">
		<div class="head">
			{#each datagrid.columns.getHeaderRows() as row, rowIndex}
				<div class="row" style="grid-template-columns: {datagrid.columns.getGridTemplateColumns()}">
					{#each row as column}
						<div
							class="header-cell"
							style="
									grid-column: {column.colStart + 1} / span {column.colSpan};
									{column.type === 'group' ? 'text-align: center;' : ''}
								"
						>
							{column.header || column.accessorKey || ''}
						</div>
					{/each}
				</div>
			{/each}
		</div>

		{#each datagrid.rows.getVisibleBasicRows() as row}
			<div class="row" style="grid-template-columns: {datagrid.columns.getGridTemplateColumns()}">
				{#each datagrid.columns.getLeafColumns() as col}
					<div class="cell">
						{#if col.columnId === 'id'}
							<button onclick={() => toggle(row.index)}>3212</button>
						{:else}
							{row.original[col.accessorKey as keyof typeof row.original]}
						{/if}
					</div>
				{/each}
			</div>
			{#if expandedRows.has(row.index)}
				<div class="row sticky left-0" style="grid-template-columns: 100">
					<div class="cell !bg-red-400">
						{row.index}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	:root {
		--col-width: 100px;
	}

	.grid-wrapper {
		width: 100%;
		overflow-x: auto;
		border: 1px solid #ddd;
	}

	.grid {
		display: block;
		width: fit-content;
		min-width: 100%;
		border: 1px solid #ddd;
	}

	.head {
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
</style> -->
