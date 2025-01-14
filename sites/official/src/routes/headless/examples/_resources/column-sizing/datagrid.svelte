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

<div class="flex flex-col gap-4">
	<div class="flex flex-col border p-2 px-4">
		{#each columns as column}
			<div class="flex flex-row gap-2">
				<input
					type="range"
					value={column.state.size.width}
					min={column.state.size.minWidth}
					max={column.state.size.maxWidth}
					oninput={(e) => {
						datagrid.handlers.columnSizing.updateColumnSize(
							column.columnId,
							Number(e.currentTarget.value)
						);
					}}
				/>
				{column.header}
			</div>
		{/each}
	</div>

	<div>
		<div class="content">
			<div class="header">
				<div class="header-row">
					{#each columns as column (column.columnId)}
						{#if column.isVisible()}
							<div
								class="header-cell"
								style:--width={column.state.size.width + 'px'}
								style:--min-width={column.state.size.minWidth + 'px'}
								style:--max-width={column.state.size.maxWidth + 'px'}
							>
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
								<div
									class="body-cell"
									style:--width={column.state.size.width + 'px'}
									style:--min-width={column.state.size.minWidth + 'px'}
									style:--max-width={column.state.size.maxWidth + 'px'}
								>
									<RenderBasicRowCellContent {datagrid} {column} {row} />
								</div>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<MadeWithLoveByTzezar />
	</div>

	<div class="flex flex-col gap-1 border p-2 px-4">
		{#each datagrid.columns as row}
			<div class="flex">
				<div class="w-40">{row.header}</div>
				{JSON.stringify(row.state.size)}
			</div>
		{/each}
	</div>
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
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
		@apply flex flex-col font-semibold;
	}
	.body {
		@apply flex flex-col p-2 px-4;
	}
	.body-row {
		@apply flex flex-row;
	}
	.body-cell {
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
		@apply flex flex-col text-nowrap;
	}
</style>
