<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import {
		accessorColumn,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';

	export const columns = [
		accessorColumn({
			accessorKey: 'id'
		}),
		accessorColumn({
			accessorKey: 'name'
		}),
		accessorColumn({
			accessorKey: 'category'
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
