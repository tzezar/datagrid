<script lang="ts">
	import '$lib/datagrid/styles.css';

	import { userColumns } from './columns.svelte';
	import { DatagridCore } from '$lib/datagrid/core/index.svelte';

	import { generateUser } from '$lib/data-generators/generate/user';
	import { generateData } from '$lib/data-generators/generate-data';

	import { HeaderBasicCell } from '$lib/datagrid/prebuilt/native/components';

	import {
		RenderBasicHeaderCellContent,
		RenderBasicRowCellContent
	} from '$lib/datagrid/prebuilt/core';

	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import ColumnFilter from '$lib/datagrid/prebuilt/native/blocks/column-filter.svelte';
	import SortingIndicator from '$lib/datagrid/prebuilt/native/blocks/sorting-indicator.svelte';

	const data = generateData(generateUser, 100);

	let datagrid = new DatagridCore({
		columns: userColumns,
		data: data
	});

	const columns = datagrid.columnManager.getLeafColumnsInOrder();
</script>

{#snippet Header()}
	<div class="grid-header">
		<div class="grid-header-row">
			{#each columns as column (column.columnId)}
				<HeaderBasicCell {datagrid} {column}>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="grid-header-cell-content items-end {column.options.sortable ? 'sortable' : ''}"
						onclick={(e) => {
							const multisort = e.shiftKey;
							datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
						}}
					>
						<RenderBasicHeaderCellContent {datagrid} {column}>
							{#snippet title(header)}
								<span class="grid-header-cell-content-header">{header}</span>
							{/snippet}
						</RenderBasicHeaderCellContent>
						{#if column.isSortable()}
							<SortingIndicator {datagrid} {column} />
						{/if}
					</div>
					<ColumnFilter {datagrid} {column} />
				</HeaderBasicCell>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet BodyRow(row: GridBasicRow<any>)}
	<div class="grid-body-row">
		{#each datagrid.columnManager.getLeafColumnsInOrder() as column (column.columnId)}
			{#if column.isVisible()}
				<div
					class="grid-body-cell"
					style:--width={column.state.size.width + 'px'}
					style:--min-width={column.state.size.minWidth + 'px'}
					style:--max-width={column.state.size.maxWidth + 'px'}
				>
					<RenderBasicRowCellContent {datagrid} {column} {row} />
				</div>
			{/if}
		{/each}
	</div>
{/snippet}

<div class="flex flex-col">
	<div class="grid-wrapper">
		<div class="grid-container">
			{@render Header()}
			<div class="grid-body">
				{#each datagrid.rowManager.getBasicRows() as row (row.identifier)}
					{@render BodyRow(row)}
					{#if row.isExpanded()}
						<div class="grid-body-row">
							<div class="grid-body-cell">
								Have you watched Kingdom of Heaven (2005) yet? It's an incredible movie!
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	<MadeWithLoveByTzezar />
</div>

<!-- <div class="border p-2 px-4">
	{JSON.stringify($state.snapshot(datagrid.features.rowSelection.getSelectedIdentifiers()))}
</div> -->
