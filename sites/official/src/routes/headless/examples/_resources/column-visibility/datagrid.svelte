<script lang="ts">
	import { basicColumns } from './columns.svelte';
	import { DataGrid } from '$lib/datagrid/core/index.svelte';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import RenderBasicHeaderCellContent from '$lib/datagrid/prebuilt/core/render-basic-header-cell-content.svelte';
	import RenderBasicRowCellContent from '$lib/datagrid/prebuilt/core/render-basic-row-cell-content.svelte';

	import { generateUser } from '$lib/data-generators/generate/user';
	import { generateData } from '$lib/data-generators/generate-data';
	const data = generateData(generateUser, 100);

	let datagrid = new DataGrid({
		columns: basicColumns,
		data: data
	});

	let columns = $derived(datagrid.columnManager.getLeafColumnsInOrder());

</script>

<div class="flex flex-col border p-2 px-4 mb-4">
	{#each columns as column}
		<div class="flex flex-row gap-2">
			<input
				type="checkbox"
				checked={column.isVisible()}
				onchange={() => datagrid.handlers.columnVisibility.toggleColumnVisibility(column.columnId)}
			/>
			{column.header}
		</div>
	{/each}
</div>

<div class="content">
	<div class="header">
		<div class="header-row">
			{#each columns as column (column.columnId)}
				{#if column.isVisible()}
					<div class="header-cell">
						<RenderBasicHeaderCellContent {datagrid} {column}>
							{#snippet title(header)}
								<span class="grid-header-cell-content-header">{header}</span>
							{/snippet}
						</RenderBasicHeaderCellContent>
					</div>
				{/if}
			{/each}
		</div>
	</div>
	<div class="body">
		{#each datagrid.rows.getBasicRows() as row (row.identifier)}
			<div class="body-row">
				{#each columns as column (column.columnId)}
					{#if column.isVisible()}
						<div class="body-cell">
							<RenderBasicRowCellContent {datagrid} {column} {row} />
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
<MadeWithLoveByTzezar />

<div class='p-2 px-4 border'>
	Column visibility:
	{JSON.stringify($state.snapshot(datagrid.columns.map(col => col.isVisible())))}
</div>

<style>
	.content {
		@apply flex flex-col border;
	}
	.header {
		@apply flex flex-col border-b p-2 px-4;
	}
	.header-row {
		@apply flex flex-row;
	}
	.header-cell {
		@apply flex w-40 flex-col font-semibold;
	}
	.body {
		@apply flex flex-col p-2 px-4;
	}
	.body-row {
		@apply flex flex-row;
	}
	.body-cell {
		@apply flex w-40 flex-col text-nowrap;
	}
</style>
