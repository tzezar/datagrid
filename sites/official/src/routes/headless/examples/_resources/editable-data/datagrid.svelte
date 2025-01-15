<script lang="ts">
	import '$lib/datagrid/styles.css';

	import { userColumns } from './columns.svelte';
	import { DataGrid } from '$lib/datagrid/core/index.svelte';

	import { generateUser } from '$lib/data-generators/generate/user';
	import { generateData } from '$lib/data-generators/generate-data';

	import {
		HeaderBasicCell,
		HeaderBasicCellContentWrapper,
		HeaderGroupCell,
		BodyBasicRowCell,
		HeaderCellWrapper,
		BodyGroupRowCell,
		BodyRowGroupCellHeader,
		BodyRowGroupCellAggregations
	} from '$lib/datagrid/prebuilt/native/_components';

	import {
		RenderBasicHeaderCellContent,
		RenderBasicRowCellContent
	} from '$lib/datagrid/prebuilt/core';

	import type { GridBasicRow, GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import RenderGroupRowCellContent from '$lib/datagrid/prebuilt/core/render-group-row-cell-content.svelte';
	import { cn } from '$lib/utils';
	import type { AccessorColumn, GroupColumn } from '$lib/datagrid/core/types';

	const data = generateData(generateUser, 100);

	let datagrid = new DataGrid({
		columns: userColumns,
		data: data
	});


	function updateCellValue(column: AccessorColumn<any>, row: GridBasicRow<any>, value: string) { 
		const foundRow = datagrid.initial.data.find(r => r.id === row.original.id) as any
		if (!foundRow) return;
		foundRow[column.accessorKey] = value;
		datagrid.processors.data.executeFullDataTransformation();
	}

</script>

{#snippet GroupRowSnippet(row: GridGroupRow<any>, leafColumns: LeafColumn<any>[])}
	<div class="grid-body-group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
		{#each leafColumns as column, columnIndex (column.columnId)}	
			<BodyGroupRowCell {datagrid} {column} {row}>
				<RenderGroupRowCellContent {datagrid} {column} {row}>
					{#snippet header()}
						<BodyRowGroupCellHeader {datagrid} {column} {row} />
					{/snippet}
					{#snippet aggregations()}
						<BodyRowGroupCellAggregations {datagrid} {column} {row} />
					{/snippet}
				</RenderGroupRowCellContent>
			</BodyGroupRowCell>
		{/each}
	</div>
{/snippet}

{#snippet HeaderGroupCellSnippet(column: GroupColumn<any>)}
	<HeaderGroupCell {datagrid} {column}>
		<div
			class="grid-header-group-header box-border flex h-full items-center justify-center gap-2 text-center"
		>
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

<div class={cn('flex h-full flex-col')}>
	<div class={cn('grid-wrapper')}>
		<div class="grid-container">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columnManager.getColumnsInOrder() as column (column.columnId)}
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
					{@const columns = datagrid.columnManager.getLeafColumnsInOrder()}
					{#if row.isGroupRow()}
						{@render GroupRowSnippet(row, columns)}
					{:else}
						<div class="grid-body-row">
							{#each columns as column (column.columnId)}
								<BodyBasicRowCell {datagrid} {column} {row}>
									{#if column.type === 'accessor'}
										<input type="text" value={column.getValueFn(row.original)} onchange={(e)=> updateCellValue(column, row, e.currentTarget.value)} />
									{/if}
									<!-- <RenderBasicRowCellContent {datagrid} {column} {row} /> -->
								</BodyBasicRowCell>
							{/each}
						</div>
						{#if row.isExpanded()}
							<div class="grid-body-row">
								<div class="grid-body-cell">
									Content for row with ID {row.identifier}
								</div>
							</div>
						{/if}
					{/if}
				{/each}
			</div>
		</div>
		<div class="grid-footer-container"></div>
	</div>
	<!-- <Pagination {datagrid} /> -->
	<MadeWithLoveByTzezar />
</div>
