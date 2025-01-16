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
	import Header from '$lib/datagrid/prebuilt/shadcn/structure/header/header.svelte';
	import HeaderRow from '$lib/datagrid/prebuilt/shadcn/structure/header/row/header-row.svelte';
	import HeaderRowGroupColumnCell from '$lib/datagrid/prebuilt/shadcn/structure/header/row/cell/header-row-group-column-cell.svelte';
	import { shouldShowColumnFilter } from '$lib/datagrid/prebuilt/shadcn/utils';
	import HeaderRowGroupColumnChildren from '$lib/datagrid/prebuilt/shadcn/structure/header/row/cell/header-row-group-column-children.svelte';
	import LeafColumnCaption from '$lib/datagrid/prebuilt/shadcn/structure/header/row/cell/leaf-column-caption.svelte';
	import LeafColumnCell from '$lib/datagrid/prebuilt/shadcn/structure/header/row/cell/leaf-column-cell.svelte';
	import RenderLeafColumnCaption from '$lib/datagrid/prebuilt/shadcn/structure/header/row/cell/content/render-leaf-column-caption.svelte';
	import GroupCell from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/group-cell.svelte';
	import GroupCellContent from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/group-cell-content.svelte';
	import GroupCellAggregations from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/group-cell-aggregations.svelte';
	import RenderCell from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/render-cell.svelte';
	import Row from '$lib/datagrid/prebuilt/shadcn/structure/header/row/row.svelte';
	import Body from '$lib/datagrid/prebuilt/shadcn/structure/body/body.svelte';
	import BasicRow from '$lib/datagrid/prebuilt/shadcn/structure/body/row/basic-row.svelte';
	import BasicRowExpandable from '$lib/datagrid/prebuilt/shadcn/structure/body/row/basic-row-expandable.svelte';

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
		<Header {datagrid}>
			{#snippet children(columns)}
				<HeaderRow>
					{#each columns as column (column.columnId)}
						{#if isGroupColumn(column)}
							{@render HeaderGroupCellSnippet(column)}
						{:else if column.state.visible === true}
							{@render HeaderCellSnippet(column)}
						{/if}
					{/each}
				</HeaderRow>
			{/snippet}
		</Header>
	{/snippet}
	{#snippet body()}
		<Body {datagrid}>
			{#snippet children(columns)}
				{#each datagrid.rows.getVisibleRows() as row (row.identifier)}
					<Row {datagrid} {row} leafColumns={columns}>
						{#snippet groupRow(row)}
							{#each columns as column, columnIndex (column.columnId)}
								<GroupCell {column} {row} {datagrid}>
									{#snippet content()}
										<GroupCellContent {column} {row} {datagrid} />
									{/snippet}
									{#snippet aggregations()}
										<GroupCellAggregations {column} {row} {datagrid} />
									{/snippet}
								</GroupCell>
							{/each}
						{/snippet}
						{#snippet basicRow(row)}
							<BasicRow {datagrid} {row} leafColumns={columns}>
								{#each columns as column (column.columnId)}
									<RenderCell {datagrid} {row} {column} />
								{/each}
							</BasicRow>
							<div class="sticky left-0 bg-red-400">321312</div>
							<BasicRowExpandable {datagrid} {row} leafColumns={columns}>
								content
							</BasicRowExpandable>
						{/snippet}
					</Row>
				{/each}
			{/snippet}
		</Body>
	{/snippet}
	{#snippet footerContent()}
		Enjoy!
	{/snippet}
</DatagridShadcnSvelte>

{#snippet HeaderGroupCellSnippet(column: GroupColumn<any>)}
	<HeaderRowGroupColumnCell>
		<div class="grid-header-group-header">
			{column.header}
			<HeaderCellDropdown {datagrid} {column} />
		</div>
		<HeaderRowGroupColumnChildren columns={column.columns}>
			{#snippet groupCell(column)}
				{@render HeaderGroupCellSnippet(column)}
			{/snippet}
			{#snippet leafCell(column)}
				{@render HeaderCellSnippet(column)}
			{/snippet}
		</HeaderRowGroupColumnChildren>
	</HeaderRowGroupColumnCell>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
	{#if column.state.visible === true}
		<LeafColumnCell {column}>
			<LeafColumnCaption {column} {datagrid}>
				<RenderLeafColumnCaption {column} {datagrid}>
					{#snippet caption(header)}
						<span class="grid-header-cell-content-header">{header}</span>
					{/snippet}
				</RenderLeafColumnCaption>
				<div class="flex gap-1">
					{#if column.isSortable()}
						<ColumnSortingIndicator {datagrid} {column} />
					{/if}
					{#if column._meta.showColumnManagerDropdownMenu === true}
						<HeaderCellDropdown {datagrid} {column} />
					{/if}
				</div>
			</LeafColumnCaption>
			{#if shouldShowColumnFilter(datagrid)}
				<div class="h-9 w-full pt-1">
					<HeaderCellColumnFilter {datagrid} {column} />
				</div>
			{/if}
		</LeafColumnCell>
	{/if}
{/snippet}
