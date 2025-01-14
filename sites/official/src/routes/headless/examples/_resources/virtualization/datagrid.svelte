<script lang="ts">
	import '$lib/datagrid/styles.css';

	import { userColumns } from './columns.svelte';
	import { DataGrid } from '$lib/datagrid/core/index.svelte';

	import { generateUser } from '$lib/data-generators/generate/user';
	import { generateData } from '$lib/data-generators/generate-data';
	import { VirtualList } from 'svelte-virtuallists';

	import { HeaderBasicCell } from '$lib/datagrid/prebuilt/native/_components';

	import {
		RenderBasicHeaderCellContent,
		RenderBasicRowCellContent
	} from '$lib/datagrid/prebuilt/core';

	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import SortingIndicator from '$lib/datagrid/prebuilt/shadcn-svelte/_components/sorting-indicator.svelte';

	const data = generateData(generateUser, 100000);

	let datagrid = new DataGrid({
		columns: userColumns,
		data: data,

		features: {
			pagination: {
				page: 1,
				pageSize: 1000000,
				pageSizes: [1000000, 100000, 10000, 1000, 100, 10, 1],
				pageCount: 1,
				visibleRowsCount: 1000000
			}
		}
	});

	const columns = datagrid.columnManager.getLeafColumnsInOrder();
</script>

{#snippet HeaderSnippet()}
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
			<VirtualList
				items={datagrid.rows.getBasicRows()}
				class="list-table"
				style="height:600px"
			>
				{#snippet header()}
					{@render HeaderSnippet()}
				{/snippet}
				{#snippet vl_slot({ item, index }: { item: GridBasicRow<any>; index: number })}
					{@render BodyRow(item)}
				{/snippet}
			</VirtualList>
	<MadeWithLoveByTzezar />
</div>

<!-- <div class="border p-2 px-4">
	{JSON.stringify($state.snapshot(datagrid.features.rowSelection.getSelectedIdentifiers()))}
</div> -->
