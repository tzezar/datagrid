<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn-svelte/core/index.svelte';
	import GridHeader from './_components/grid-header.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { GroupColumn } from '$lib/datagrid/core/column-creation/types';

	import GroupRowCellContent from '$lib/datagrid/prebuilt/core/render-group-row-cell-content.svelte';
	import BasicRowCellContent from '$lib/datagrid/prebuilt/core/render-basic-row-cell-content.svelte';
	import BodyRowGroupCellHeader from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-row-group-cell-header.svelte';
	import BodyRowGroupCellAggregations from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-row-group-cell-aggregations.svelte';
	import BodyBasicRowCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-basic-row-cell.svelte';
	import BodyGroupRowCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-group-row-cell.svelte';
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn-svelte/_components/header-cell-dropdown.svelte';
	import HeaderGroupCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/header-group-cell.svelte';
	import BasicHeaderCellContent from '$lib/datagrid/prebuilt/core/render-basic-header-cell-content.svelte';
	import HeaderColumnActions from '$lib/datagrid/prebuilt/shadcn-svelte/_components/header-column-actions.svelte';
	import HeaderColumnFilters from '$lib/datagrid/prebuilt/shadcn-svelte/_components/header-column-filters.svelte';
	import HeaderBasicCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/header-basic-cell.svelte';
	import HeaderBasicCellContentWrapper from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/header-basic-cell-content-wrapper.svelte';
	import HeaderCellWrapper from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/header-cell-wrapper.svelte';
	// import { userColumns as simplifiedColumns } from './simplefied-columns.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn-svelte/_components/pagination.svelte';
	import { cn } from '$lib/utils';
	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users
	});

	let columns = $derived(
		datagrid.extra.features.groupHeadersVisibility.showGroupHeaders
			? datagrid.columnManager.getColumnsInOrder()
			: datagrid.columnManager.getLeafColumnsInOrder()
	);

	import { Portal } from 'bits-ui';
	import { userColumns } from './columns.svelte';

</script>

{#snippet GroupRowSnippet(row: GridGroupRow<any>, leafColumns: LeafColumn<any>[])}
	<div class="grid-body-group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
		{#each leafColumns as column, columnIndex (column.columnId)}
			<BodyGroupRowCell {datagrid} {column} {row}>
				<GroupRowCellContent {datagrid} {column} {row}>
					{#snippet header()}
						<BodyRowGroupCellHeader {datagrid} {column} {row} />
					{/snippet}
					{#snippet aggregations()}
						<BodyRowGroupCellAggregations {datagrid} {column} {row} />
					{/snippet}
				</GroupRowCellContent>
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
			<HeaderCellDropdown {datagrid} {column} />
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
			<BasicHeaderCellContent {datagrid} {column}>
				{#snippet title(header)}
					<span class="grid-header-cell-content-header">{header}</span>
				{/snippet}
			</BasicHeaderCellContent>
			<HeaderColumnActions {datagrid} {column} />
		</HeaderBasicCellContentWrapper>

		<HeaderColumnFilters {datagrid} {column} />
	</HeaderBasicCell>
{/snippet}

<Portal disabled={!datagrid.isFullscreenEnabled()}>
	<div
		class={cn(
			'flex h-full flex-col',
			datagrid.extra.features.fullscreen.isFullscreen &&
				'bg-background/80 absolute inset-0 z-[20] p-4'
		)}
	>
		<GridHeader {datagrid} />
		<!-- <div class="grid-toolbar-container">
			<button onclick={() => datagrid.fullscreen.toggleFullscreen()}> Toggle Fullscreen </button>
		</div> -->
		<div
			class={cn(
				'grid-wrapper',
				datagrid.isFullscreenEnabled() && 'h-full max-h-full overflow-auto'
			)}
		>
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
						{@const columns = datagrid.columnManager.getLeafColumnsInOrder()}
						{#if row.isGroupRow()}
							{@render GroupRowSnippet(row, columns)}
						{:else}
							<div class="grid-body-row">
								{#each columns as column (column.columnId)}
									<BodyBasicRowCell {datagrid} {column} {row}>
										<BasicRowCellContent {datagrid} {column} {row} />
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
		<Pagination {datagrid} />
		<div class="text-muted-foreground ml-auto w-fit border-x border-b p-1 px-2 text-[0.5rem]">
			Made with ❤️ by Tzezar
		</div>
	</div>
</Portal>
