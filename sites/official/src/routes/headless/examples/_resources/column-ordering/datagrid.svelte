<script lang="ts">
	import '$lib/datagrid/styles.css';

	import { userColumns } from './columns.svelte';
	import { DataGrid } from '$lib/datagrid/core/index.svelte';

	import { generateUser } from '$lib/data-generators/generate/user';
	import { generateData } from '$lib/data-generators/generate-data';

	import {
		HeaderBasicCell,
		HeaderBasicCellContentWrapper,
		HeaderCellWrapper,
		HeaderGroupCell
	} from '$lib/datagrid/prebuilt/native/_components';
	import {
		RenderBasicHeaderCellContent,
		RenderBasicRowCellContent
	} from '$lib/datagrid/prebuilt/core';

	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { GroupColumn } from '$lib/datagrid/core/column-creation/types';
	import ColumnOrderingControls from './column-ordering-controls.svelte';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';

	const data = generateData(generateUser, 100);

	let datagrid = new DataGrid({
		columns: userColumns,
		data: data
	});

	// TODO

	const columns = datagrid.columnManager.getColumnsInOrder();
</script>

{#snippet HeaderGroupCellSnippet(column: GroupColumn<any>)}
	<HeaderGroupCell {datagrid} {column}>
		<div class="grid-header-group-header">
			{column.header}
		</div>
		<div class="flex grow flex-row">
			{#each column.columns ?? [] as subColumn (subColumn.columnId)}
				<HeaderCellWrapper {datagrid} column={subColumn}>
					{#snippet groupCell(column)}
						{@render HeaderGroupCellSnippet(column)}
					{/snippet}
					{#snippet cell(column)}
						{@render HeaderCellSnippet(column)}
					{/snippet}
				</HeaderCellWrapper>
			{/each}
		</div>
	</HeaderGroupCell>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
	<HeaderBasicCell {datagrid} {column}>
		<HeaderBasicCellContentWrapper
			{datagrid}
			{column}
			onclick={(e: any) => {
				const multisort = e.shiftKey;
				datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
			}}
		>
			<RenderBasicHeaderCellContent {datagrid} {column}>
				{#snippet title(header)}
					<span class="grid-header-cell-content-header">{header}</span>
				{/snippet}
			</RenderBasicHeaderCellContent>
		</HeaderBasicCellContentWrapper>
	</HeaderBasicCell>
{/snippet}

<ColumnOrderingControls {datagrid} />
<div class='flex flex-col'>
	<div class="grid-wrapper">
		<div class="grid-container">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each columns as column (column.columnId)}
						<HeaderCellWrapper {datagrid} {column}>
							{#snippet groupCell(column)}
								{@render HeaderGroupCellSnippet(column)}
							{/snippet}
							{#snippet cell(column)}
								{@render HeaderCellSnippet(column)}
							{/snippet}
						</HeaderCellWrapper>
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rows.getVisibleRows() as row (row.identifier)}
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
				{/each}
			</div>
		</div>
	</div>
	<MadeWithLoveByTzezar />
</div>
