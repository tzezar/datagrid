<script lang="ts">
	import { shouldShowColumnFilter } from '$lib/datagrid/prebuilt/shadcn/utils';
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import Datagrid from '$lib/datagrid/prebuilt/shadcn/datagrid.svelte';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { LeafColumn, GroupColumn } from '$lib/datagrid/core/types';

	import {
		Header,
		Body,
		Row,
		HeaderRow,
		GroupCell,
		GroupRow,
		BasicRow,
		ExpandableBasicRow,
		GroupCellContent,
		RenderCell,
		GroupColumnCell,
		LeafColumnCell,
		LeafColumnCaption,
		RenderLeafColumnCaption,
		GroupColumnChildren,
		GroupColumnCellCaption
	} from '$lib/datagrid/prebuilt/shadcn/structure';


	import {
		GroupCellAggregations,
		LeafColumnCellCaptionOptions
	} from '$lib/datagrid/prebuilt/shadcn/components';

	import { userColumns } from './columns.svelte';
	import HeaderCellColumnFilter from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-column-filter.svelte';
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-dropdown.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users,
		extra: {
			title: 'Headless Datagrid'
		}
	});
</script>

<Datagrid {datagrid}>
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
					<Row {datagrid} {row} {columns}>
						{#snippet groupRow(row)}
							<GroupRow {row} {columns} {datagrid}>
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
							</GroupRow>
						{/snippet}
						{#snippet basicRow(row)}
							<BasicRow {datagrid} {row} {columns}>
								{#each columns as column (column.columnId)}
									<RenderCell {datagrid} {row} {column} />
								{/each}
							</BasicRow>
							<ExpandableBasicRow {datagrid} {row} {columns}>content</ExpandableBasicRow>
						{/snippet}
					</Row>
				{/each}
			{/snippet}
		</Body>
	{/snippet}
	{#snippet footerContent()}
		Enjoy!
	{/snippet}
</Datagrid>

{#snippet HeaderGroupCellSnippet(column: GroupColumn<any>)}
	<GroupColumnCell>
		<GroupColumnCellCaption>
			{column.header}
			<HeaderCellDropdown {datagrid} {column} />
		</GroupColumnCellCaption>
		<GroupColumnChildren columns={column.columns}>
			{#snippet groupCell(column)}
				{@render HeaderGroupCellSnippet(column)}
			{/snippet}
			{#snippet leafCell(column)}
				{@render HeaderCellSnippet(column)}
			{/snippet}
		</GroupColumnChildren>
	</GroupColumnCell>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
	<LeafColumnCell {column}>
		<LeafColumnCaption {column} {datagrid}>
			<RenderLeafColumnCaption {column} {datagrid}>
				{#snippet caption(header)}
					<span class="grid-header-cell-content-header">{header}</span>
				{/snippet}
			</RenderLeafColumnCaption>
			<LeafColumnCellCaptionOptions {column} {datagrid} />
		</LeafColumnCaption>
		{#if shouldShowColumnFilter(datagrid)}
			<div class="h-9 w-full pt-1">
				<HeaderCellColumnFilter {datagrid} {column} />
			</div>
		{/if}
	</LeafColumnCell>
{/snippet}
