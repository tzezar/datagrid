<script lang="ts">
	import './styles.css';

	import { Portal } from 'bits-ui';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import Toolbar from '../_blocks/toolbar.svelte';
	import HeaderCellWrapper from '../_components/base/header-cell-wrapper.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import HeaderGroupCell from '../_components/base/header-group-cell.svelte';
	import type { GroupColumn } from '$lib/datagrid/core/types';
	import HeaderCellDropdown from '../_components/header-cell-dropdown.svelte';
	import HeaderBasicCell from '../_components/base/header-basic-cell.svelte';
	import HeaderBasicCellContentWrapper from '../_components/base/header-basic-cell-content-wrapper.svelte';
	import RenderBasicHeaderCellContent from '../../core/render-basic-header-cell-content.svelte';
	import HeaderColumnActions from '../_components/header-column-actions.svelte';
	import HeaderColumnFilters from '../_components/header-column-filters.svelte';
	import Pagination from '../_components/pagination.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import SortingIndicator from '../_components/sorting-indicator.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		toolbar?: Snippet;
		pagination?: Snippet;
	};

	let { datagrid, toolbar, pagination }: Props = $props();

	let headerColumns = $derived(
		datagrid.extra.features.groupHeadersVisibility.showGroupHeaders
			? datagrid.columnManager.getColumnsInOrder()
			: datagrid.columnManager.getLeafColumnsInOrder()
	);
</script>

<!-- <div class="grid-toolbar-container">
	<button onclick={() => datagrid.fullscreen.toggleFullscreen()}> Toggle Fullscreen </button>
</div> -->

<Portal disabled={!datagrid.isFullscreenEnabled()}>
	<div
		class={cn(
			'flex h-full flex-col',
			datagrid.extra.features.fullscreen.isFullscreen &&
				'bg-background/80 absolute inset-0 z-[20] p-4'
		)}
	>
		{@render ToolbarSnippet()}
		<div
			class={cn(
				'grid-wrapper',
				datagrid.isFullscreenEnabled() && 'h-full max-h-full overflow-auto'
			)}
		>
			<div class="grid-container">
				{@render GridHeaderSnippet()}
				{@render GridBodySnippet()}
			</div>
			<div class="grid-footer-container"></div>
		</div>
		{@render PaginationSnippet()}
		<MadeWithLoveByTzezar />
	</div>
</Portal>

{#snippet ToolbarSnippet()}
	{#if toolbar}
		{@render toolbar()}
	{:else}
		<Toolbar {datagrid} />
	{/if}
{/snippet}

{#snippet PaginationSnippet()}
	{#if pagination}
		{@render pagination(datagrid)}
	{:else}
		<Pagination {datagrid} />
	{/if}
{/snippet}

{#snippet GridBodySnippet()}
	<div class="grid-body">
		{#each datagrid.rows.getVisibleRows() as row (row.identifier)}
			{@const columns = datagrid.columnManager.getLeafColumnsInOrder()}
			{#if row.isGroupRow()}
				<div class="grid-body-group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
					{#each columns as column, columnIndex (column.columnId)}
						{#if column.isVisible()}
							<div
								class={cn('grid-body-cell')}
								class:justify-center={column?._meta?.align === 'center'}
								data-pinned={column.state.pinning.position !== 'none'
									? column.state.pinning.position
									: null}
								style:--width={column.state.size.width + 'px'}
								style:--min-width={column.state.size.minWidth + 'px'}
								style:--max-width={column.state.size.maxWidth + 'px'}
								style:--pin-left-offset={column.state.pinning.offset + 'px'}
								style:--pin-right-offset={column.state.pinning.offset + 'px'}
							>
								{#if column.columnId == row.groupKey}
									<div class="flex flex-col place-items-start justify-start gap-1">
										<span class="text-muted-foreground flex place-items-center text-xs">
											({row.children.length} items)
										</span>
										<button
											class="flex gap-1"
											onclick={() => datagrid.rows.toggleGroupRowExpansion(row)}
										>
											<span class="border-primary/30 rounded-sm border-[1px]">
												<ArrowRight
													class={`${datagrid.rows.isGroupRowExpanded(row) && 'rotate-90'} transition-all `}
												/>
											</span>
											<span class="">
												{row.groupValue[0]}
											</span>
										</button>
									</div>
								{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
									<div class="">
										<div class="text-muted-foreground text-xs">
											{#each row.aggregations.filter((agg) => agg.columnId === column.columnId) as aggregation}
												<p>
													{aggregation.type}: {#if aggregation.type === 'percentChange'}
														{aggregation.value.toFixed(2)}%
													{:else if typeof aggregation.value === 'number'}
														{aggregation.value.toLocaleString()}
													{:else}
														{aggregation.value}
													{/if}
												</p>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			{:else}
				<div class="grid-body-row">
					{#each columns as column (column.columnId)}
						{#if column.isVisible()}
							<div
								class={cn(
									'grid-body-cell',
									column._meta.styles?.bodyCell,
									datagrid.extra.state.highlightSelectedRow &&
										datagrid.features.rowSelection.isRowSelected(row.identifier)
										? 'bg-blue-400/10'
										: ''
								)}
								class:justify-center={column?._meta?.align === 'center'}
								data-pinned={column.state.pinning.position !== 'none'
									? column.state.pinning.position
									: null}
								style:--width={column.state.size.width + 'px'}
								style:--min-width={column.state.size.minWidth + 'px'}
								style:--max-width={column.state.size.maxWidth + 'px'}
								style:--pin-left-offset={column.state.pinning.offset + 'px'}
								style:--pin-right-offset={column.state.pinning.offset + 'px'}
							>
								{#if column.cell}
									{@const cellContent = column.cell({ datagrid, column, row })}
									{#if typeof cellContent === 'string'}
										{@html cellContent}
									{:else if isCellComponent(cellContent)}
										<cellContent.component {datagrid} {row} {column} />
									{/if}
								{:else}
									{@html getCellContent(column, row.original)}
								{/if}
							</div>
						{/if}
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
{/snippet}

{#snippet GridHeaderSnippet()}
	<div class="grid-header">
		<div class="grid-header-row">
			{#each headerColumns as column (column.columnId)}
				{#if isGroupColumn(column)}
					{@render HeaderGroupCellSnippet(column)}
				{:else if column.state.visible === true}
					{@render HeaderCellSnippet(column)}
				{/if}
			{/each}
		</div>
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
			<RenderBasicHeaderCellContent {datagrid} {column}>
				{#snippet title(header)}
					<span class="grid-header-cell-content-header">{header}</span>
				{/snippet}
			</RenderBasicHeaderCellContent>
			<div class="flex gap-1">
				{#if column.isSortable()}
					<SortingIndicator {datagrid} {column} />
				{/if}
				{#if column._meta.showColumnManagerDropdownMenu === true}
					<HeaderCellDropdown {datagrid} {column} />
				{/if}
			</div>
			
		</HeaderBasicCellContentWrapper>
		<HeaderColumnFilters {datagrid} {column} />
	</HeaderBasicCell>
{/snippet}
