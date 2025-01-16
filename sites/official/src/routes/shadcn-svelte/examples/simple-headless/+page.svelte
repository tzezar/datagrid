<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { userColumns } from './columns.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid-shadcn-svelte.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { LeafColumn, GroupColumn } from '$lib/datagrid/core/types';
	import ColumnSortingIndicator from '$lib/datagrid/prebuilt/shadcn/blocks/column-sorting-indicator.svelte';
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn/blocks/header-cell-dropdown.svelte';
	import HeaderCellColumnFilter from '$lib/datagrid/prebuilt/shadcn/blocks/header-cell-column-filter.svelte';
	import { shouldShowColumnFilter } from '$lib/datagrid/prebuilt/shadcn/utils';

	import * as Structure from '$lib/datagrid/prebuilt/shadcn/structure';
	import GroupCellAggregations from '$lib/datagrid/prebuilt/shadcn/components/group-cell-aggregations.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users,
		extra: {
			title: 'Headless Datagrid'
		}
	});
</script>

<DatagridShadcnSvelte {datagrid}>
	{#snippet header()}
		<Structure.Header {datagrid}>
			{#snippet children(columns)}
				<Structure.HeaderRow>
					{#each columns as column (column.columnId)}
						{#if isGroupColumn(column)}
							{@render HeaderGroupCellSnippet(column)}
						{:else if column.state.visible === true}
							{@render HeaderCellSnippet(column)}
						{/if}
					{/each}
				</Structure.HeaderRow>
			{/snippet}
		</Structure.Header>
	{/snippet}
	{#snippet body()}
		<Structure.Body {datagrid}>
			{#snippet children(columns)}
				{#each datagrid.rows.getVisibleRows() as row (row.identifier)}
					<Structure.Row {datagrid} {row} {columns}>
						{#snippet groupRow(row)}
							<Structure.GroupRow {row} {columns} {datagrid}>
								{#each columns as column, columnIndex (column.columnId)}
									<Structure.GroupCell {column} {row} {datagrid}>
										{#snippet content()}
											<Structure.GroupCellContent {column} {row} {datagrid} />
										{/snippet}
										{#snippet aggregations()}
											<GroupCellAggregations {column} {row} {datagrid} />
										{/snippet}
									</Structure.GroupCell>
								{/each}
							</Structure.GroupRow>
						{/snippet}
						{#snippet basicRow(row)}
							<Structure.BasicRow {datagrid} {row} leafColumns={columns}>
								{#each columns as column (column.columnId)}
									<Structure.RenderCell {datagrid} {row} {column} />
								{/each}
							</Structure.BasicRow>
							<Structure.BasicRowExpandable {datagrid} {row} {columns}>content</Structure.BasicRowExpandable>
						{/snippet}
					</Structure.Row>
				{/each}
			{/snippet}
		</Structure.Body>
	{/snippet}
	{#snippet footerContent()}
		Enjoy!
	{/snippet}
</DatagridShadcnSvelte>

{#snippet HeaderGroupCellSnippet(column: GroupColumn<any>)}
	<Structure.HeaderRowGroupColumnCell>
		<div class="grid-header-group-header">
			{column.header}
			<HeaderCellDropdown {datagrid} {column} />
		</div>
		<Structure.HeaderRowGroupColumnChildren columns={column.columns}>
			{#snippet groupCell(column)}
				{@render HeaderGroupCellSnippet(column)}
			{/snippet}
			{#snippet leafCell(column)}
				{@render HeaderCellSnippet(column)}
			{/snippet}
		</Structure.HeaderRowGroupColumnChildren>
	</Structure.HeaderRowGroupColumnCell>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
	{#if column.state.visible === true}
		<Structure.LeafColumnCell {column}>
			<Structure.LeafColumnCaption {column} {datagrid}>
				<Structure.RenderLeafColumnCaption {column} {datagrid}>
					{#snippet caption(header)}
						<span class="grid-header-cell-content-header">{header}</span>
					{/snippet}
				</Structure.RenderLeafColumnCaption>
				<div class="flex gap-1">
					{#if column.isSortable()}
						<ColumnSortingIndicator {datagrid} {column} />
					{/if}
					{#if column._meta.showColumnManagerDropdownMenu === true}
						<HeaderCellDropdown {datagrid} {column} />
					{/if}
				</div>
			</Structure.LeafColumnCaption>
			{#if shouldShowColumnFilter(datagrid)}
				<div class="h-9 w-full pt-1">
					<HeaderCellColumnFilter {datagrid} {column} />
				</div>
			{/if}
		</Structure.LeafColumnCell>
	{/if}
{/snippet}
