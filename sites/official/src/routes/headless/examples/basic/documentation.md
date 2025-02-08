
```svelte
<script lang="ts">
	import Readme from './documentation.md';

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
			accessorKey: 'price'
		})
	] satisfies ColumnDef<InventoryItem>[];

	let { data } = $props();

	const datagrid = new DatagridCore({
		columns,
		data: data.inventory
	});
</script>

<!-- 
	In order to display the datagrid nicely within the page, 
	I decided to introduce a wrapper with some extra classes, this clutters the code, but 
	extra classes fixes some styling issues and allows eg. to use borders on grid rows 
	that takes full width of scrollable container. Of course this is 
	just an example, your implementation might be different.
-->

<!-- WRAPPER -->
<div class="flex max-h-[600px] w-fit max-w-full flex-col" id="wrapper">
	<div class="inline-block overflow-auto border" id="content-wrapper">
		<!-- THE DATAGRID -->

		<!-- HTML structure simillar to table -->
		<!-- we got Head, Body, Row, Cell -->
		<div class="inline-block" id="content">
			<div id="head" class="flex">
				<div id="head-row" class="flex flex-row gap-4 border px-4 py-2">
					<!-- simply iterate over columns to display them, you get the idea -->
					<!-- we gonna use `getLeafColumns` method to get only leaf columns without support for groups  -->
					<!-- (see the docs for examples with column hierarchy) -->
					{#each datagrid.columns.getLeafColumns() as column}
						<!-- for each column we will display a head cell -->
						<div id="head-cell" class="min-w-32 max-w-32">
							<!-- to make things simpler in this example I will just use the column header -->
							{column.header}
						</div>
					{/each}
				</div>
			</div>
			<div id="body" class="flex w-full flex-col">
				<!-- simply iterate over rows to display them  -->
				<!-- you may notice usage of rather werid `getVisibleBasicRows` method -->
				<!-- datagrid distinguish between group rows and basic rows -->
				<!-- to satisfy typescript we will use this method, among others -->
				{#each datagrid.rows.getVisibleBasicRows() as row}
					<!-- for each row we will display a row -->
					<div id="row" class="flex gap-4 border px-4 py-4">
						<!-- and then iterate over columns to obtain cells -->
						<!-- I found it more flexible to use `getLeafColumns` instead of attaching column getters to each row -->
						<!-- this might feel odd at first if you are famillar with other datagrid libraries -->
						<!-- this is not much longer to write then row.getColumns(), but it might make your life easier, trust me -->
						{#each datagrid.columns.getLeafColumns() as column}
							<!-- for each column we will display a cell -->
							<div id="cell" class="min-w-32 max-w-32 overflow-hidden text-ellipsis text-nowrap">
								<!-- We will use `getCellContent` method to get content of the cell. -->
								<!-- It handles picking what to display based on column type and definitions. -->
								<!-- In this example we will use just accessor columns so it will render just the value, -->
								<!-- but you can customize it to render whatever you want by passing cell component as prop -->
								<!-- or format the value (accessor and computed columns only) with `formatterCellFn` passed to column def -->
								{getCellContent(column, row.original)}

								<!-- WORTH NOTING -->
								<!-- You can not access value directly with eg. row.original[column.accessorKey] or other way -->
								<!-- using `getLeafColumns`, because `LeafColumn` can also be a displayColumn that is used -->
								<!-- for adding additional columns, so it does not have `accessorKey` specified -->
							</div>
						{/each}
					</div>
				{/each}
			</div>
			<!-- ACTUAL CONTENT -->
		</div>
	</div>
</div>
```