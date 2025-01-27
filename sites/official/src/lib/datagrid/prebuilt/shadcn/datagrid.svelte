<script lang="ts">
	import { cn } from '$lib/utils';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type {
		LeafColumn,
		GroupColumn,
		GridRow,
		GridBasicRow,
		GridGroupRow
	} from '$lib/datagrid/core/types';

	import { Portal } from 'bits-ui';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';

	// Icones
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';

	// Blocks
	import ColumnSortingIndicator from '$lib/datagrid/prebuilt/shadcn/built-in/column-sorting-indicator.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn/built-in/pagination.svelte';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import type { Snippet } from 'svelte';
	import RowSelectionCell from './built-in/row-selection-cell.svelte';
	import RowExpandingCell from './built-in/row-expanding-cell.svelte';
	import StatusIndicator from './built-in/status-indicator.svelte';
	import ContentCopyOutline from '$lib/datagrid/icons/material-symbols/content-copy-outline.svelte';
	import Toolbar from './built-in/toolbar.svelte';
	import { shouldHighlightSelectedRow } from './utils';
	import { flip } from 'svelte/animate';
	import type { Action } from 'svelte/action';
	import LeafColumnCell from './structure/leaf-column-cell.svelte';
	import HeaderCellDropdown from './built-in/header-cell-dropdown.svelte';
	import HeaderCellColumnFilter from './built-in/header-cell-column-filter.svelte';
	import RowSelectionColumnHeaderCell from './built-in/row-selection-column-header-cell.svelte';
	import RowExpandingColumnHeaderCell from './built-in/row-expanding-column-header-cell.svelte';
	import GroupColumnCell from './structure/group-column-cell.svelte';
	import Cell from './structure/cell.svelte';
	import GroupCell from './structure/group-cell.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;

		// Blocks
		toolbar?: Snippet;
		header?: Snippet;
		body?: Snippet;
		footer?: Snippet;
		footerContent?: Snippet;
		pagination?: Snippet;
	};

	let {
		datagrid,

		toolbar,
		header,
		body,
		footer,
		footerContent,
		pagination
	}: Props = $props();

	let headerColumns = $derived.by(() => {
		if (datagrid.extra.features.groupHeadersVisibility.showGroupHeaders) {
			return datagrid.columnManager.getColumnsInOrder();
		}
		return datagrid.columnManager.getLeafColumnsInOrder();
	});

	let headerColumnsWithoutAdditional = $derived(
		headerColumns.filter((col) => !col.columnId.startsWith('_'))
	);

	// Crazy boost in performance
	const leafColumns = $derived(datagrid.columnManager.getLeafColumnsInOrder());
	const leafColumnsToDisplay = $derived(leafColumns.filter((col) => !col.columnId.startsWith('_')));

	const identifier: Action<HTMLElement, string> = (node, data) => {
		$effect(() => {
			node.id = datagrid.identifier + '-' + data;

			return () => {
				// teardown goes here
			};
		});
	};

	const isFullscreenEnabled = $derived(datagrid.extra.features.fullscreen.isFullscreenEnabled());
	const showWrapperOverlay = $derived(datagrid.extra.features.overlay.shouldShowWrapperOverlay());
	const shouldDisplayPagination = $derived(
		datagrid.extra.features.pagination.shouldDisplayPagination()
	);
	const shouldAnimateHeaders = $derived(datagrid.extra.features.animations.shouldAnimateHeaders());
</script>

<Portal disabled={!isFullscreenEnabled}>
	<div use:identifier={'wrapper'} data-fullscreen={isFullscreenEnabled} class={cn('grid-wrapper')}>
		{#if showWrapperOverlay}
			<div
				use:identifier={'wrapper-overlay'}
				class="pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[10000] h-full w-full bg-black opacity-50"
			></div>
		{/if}
		{#if toolbar}
			{@render toolbar()}
		{:else}
			<Toolbar {datagrid} />
		{/if}
		<!-- <div class="grid-toolbar-container">
			<button onclick={() => datagrid.fullscreen.toggleFullscreen()}> Toggle Fullscreen </button>
			</div> -->
		{#if shouldDisplayPagination}
			{#if ['both', 'top'].includes(datagrid.extra.features.pagination.paginationPosition)}
				{#if pagination}
					{@render pagination()}
				{:else}
					<Pagination {datagrid} class={{ container: 'border-t' }} />
				{/if}
			{/if}
		{/if}
		<StatusIndicator {datagrid} position="top" />
		<div data-fullscreen={isFullscreenEnabled} class="grid-container-wrapper">
			<div class="grid-container min-w-full">
				{#if header}
					{@render header()}
				{:else}
					<div use:identifier={'header'} class="grid-header">
						<div use:identifier={'header-row'} class="grid-header-row w-full">
							{@render AdditionalHeaderCells('left')}
							{#each headerColumnsWithoutAdditional as column (column.columnId)}
								<div
									class:contents={!shouldAnimateHeaders}
									animate:flip={{
										duration: (len) =>
											datagrid.extra.features.animations.getHeadersFlipDuration(len)
									}}
								>
									{#if isGroupColumn(column)}
										{@render ColumnGroupHeaderSnippet(column)}
									{:else if column.state.visible === true}
										{@render ColumnHeaderSnippet(column)}
									{/if}
								</div>
							{/each}
							{@render AdditionalHeaderCells('right')}
						</div>
					</div>
				{/if}
				{#if body}
					{@render body()}
				{:else}
					<div use:identifier={'body'} class="grid-body">
						{#if datagrid.extra.features.overlay.shouldShowBodyOverlay()}
							<div class="body-overlay"></div>
						{/if}

						{#each datagrid.rows.getVisibleRows() as row, rowIndex (row.identifier)}
							{#if row.isGroupRow()}
								<div class="group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
									{#each leafColumns as column, columnIndex (column.columnId)}
										{#if column.isVisible()}
											<GroupCell {column}>
												{#if column.columnId == row.groupKey}
													{@render GroupCellHeaderSnippet(column, row)}
												{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
													{@render GroupCellAggregationSnippet(row, column)}
												{/if}
											</GroupCell>
										{/if}
									{/each}
								</div>
							{:else}
								<div class="grid-body-row">
									{@render AdditionalBodyCells('left', row)}
									{#each leafColumnsToDisplay as column (column.columnId)}
										<div
											class:contents={!datagrid.extra.features.animations.shouldAnimateRows()}
											class={cn()}
											animate:flip={{
												duration: (len) =>
													datagrid.extra.features.animations.getRowsFlipDuration(len)
											}}
										>
											{#if column.isVisible()}
												{#if column.cell}
													{@const cellContent = column.cell({ datagrid, column, row })}
													{#if typeof column.cell({ datagrid, column, row }) === 'string'}
														{@html cellContent}
													{:else if isCellComponent(cellContent)}
														<cellContent.component {datagrid} {row} {column} />
													{/if}
												{:else}
													<Cell {datagrid} {row} {column}>
														<span class={cn('cell-content')}>
															{@html getCellContent(column, row.original)}
														</span>

														{@render CopyCellButton(column, row)}
													</Cell>
												{/if}
											{/if}
										</div>
									{/each}
									{@render AdditionalBodyCells('right', row)}
								</div>
							{/if}
							{#if row.isExpanded()}
								<div class="grid-body-row">
									<div class="cell sticky left-0">
										Content for row with ID {row.identifier}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>
		{#if footer}
			{@render footer()}
		{:else}
			<div class={cn('grid-footer-container', footerContent && 'p-2')}>
				{@render footerContent?.()}
			</div>
		{/if}
		<StatusIndicator {datagrid} position="bottom" />
		{#if shouldDisplayPagination}
			{#if ['bottom', 'both'].includes(datagrid.extra.features.pagination.paginationPosition)}
				{#if pagination}
					{@render pagination()}
				{:else}
					<Pagination {datagrid} class={{ container: 'border-b' }} />
				{/if}
			{/if}
		{/if}
		{#if datagrid.extra.features.credentials.enabled}
			<MadeWithLoveByTzezar />
		{/if}
	</div>
</Portal>

{#snippet ColumnGroupHeaderSnippet(column: GroupColumn<any>)}
	<GroupColumnCell {column}>
		<div class="group-column-cell-header">
			{column.header}
			<HeaderCellDropdown {datagrid} {column} />
		</div>
		<div class="flex grow flex-row">
			{#each column.columns ?? [] as subColumn (subColumn.columnId)}
				<div animate:flip>
					{#if isGroupColumn(subColumn)}
						{@render ColumnGroupHeaderSnippet(subColumn)}
					{:else if subColumn.state.visible === true}
						{@render ColumnHeaderSnippet(subColumn)}
					{/if}
				</div>
			{/each}
		</div>
	</GroupColumnCell>
{/snippet}

{#snippet ColumnHeaderSnippet(column: LeafColumn<any>)}
	{#if column.headerCell}
		{@const cellContent = column.headerCell({ datagrid, column })}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {column} />
		{/if}
	{:else}
		<LeafColumnCell {column}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class:sortable={column.options.sortable &&
					datagrid.extra.features.sorting.enableSorting === true}
				class="grid-header-cell-content"
				onclick={(e) => {
					if (datagrid.extra.features.sorting.enableSorting === false) return;
					let multisort = false;
					if (datagrid.extra.features.sorting.enableMultiSort) {
						multisort = e.shiftKey;
					}
					datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
				}}
			>
				<span class="group-column-header">{column.header}</span>

				<div class="flex gap-1">
					{#if datagrid.extra.features.sorting.enableSorting && datagrid.extra.features.sorting.enableSorting === true}
						{#if column.isSortable()}
							<ColumnSortingIndicator {datagrid} {column} />
						{/if}
					{/if}
					{#if column._meta.showColumnManagerDropdownMenu === true}
						<HeaderCellDropdown {datagrid} {column} />
					{/if}
				</div>
			</div>
			{#if datagrid.extra.features.columnFiltering.isEnabled()}
				<div class="column-filter">
					<HeaderCellColumnFilter {datagrid} {column} />
				</div>
			{/if}
		</LeafColumnCell>
	{/if}
{/snippet}

{#snippet AdditionalHeaderCells(position: 'left' | 'right')}
	{#if datagrid.extra.features.rowSelection.position === position && datagrid.extra.features.rowSelection.displayBuiltInComponents === true}
		<RowSelectionColumnHeaderCell
			{datagrid}
			column={headerColumns.find((col) => col.columnId === '_selection') as LeafColumn<any>}
		/>
	{/if}
	{#if datagrid.extra.features.rowExpanding.position === position && datagrid.extra.features.rowExpanding.displayBuiltInComponents === true}
		<RowExpandingColumnHeaderCell
			{datagrid}
			column={headerColumns.find((col) => col.columnId === '_expand') as LeafColumn<any>}
		/>
	{/if}
{/snippet}

{#snippet AdditionalBodyCells(position: 'left' | 'right', row: GridBasicRow<any>)}
	{#if datagrid.extra.features.rowSelection.position === position && datagrid.extra.features.rowSelection.displayBuiltInComponents === true}
		<RowSelectionCell
			{datagrid}
			{row}
			column={headerColumns.find((col) => col.columnId === '_selection') as LeafColumn<any>}
		/>
	{/if}
	{#if datagrid.extra.features.rowExpanding.position === position && datagrid.extra.features.rowExpanding.displayBuiltInComponents === true}
		<RowExpandingCell
			{datagrid}
			{row}
			column={headerColumns.find((col) => col.columnId === '_expand') as LeafColumn<any>}
		/>
	{/if}
{/snippet}

{#snippet CopyCellButton(column: LeafColumn<any>, row: GridBasicRow<any>)}
	{#if datagrid.extra.features.clickToCopy.isValidColumn(column)}
		{#if datagrid.extra.features.clickToCopy.shouldDisplayCopyButton(column)}
			<button
				class="pl-1"
				onclick={(e) => {
					datagrid.extra.features.clickToCopy.handleClickToCopy(row.original, column);

					const cellElement = (e.target as HTMLElement).closest('.cell');
					if (cellElement) {
						datagrid.extra.features.clickToCopy.addCopyFeedback(cellElement as HTMLElement);
					}
				}}
			>
				<ContentCopyOutline
					width="0.75rem"
					class={cn('hidden opacity-0 transition-all group-hover:block group-hover:opacity-100')}
				/>
			</button>
		{/if}
	{/if}
{/snippet}

{#snippet GroupCellHeaderSnippet(column: LeafColumn<any>, row: GridGroupRow<any>)}
	<!-- padding: 4px 8px; -->

	<div
		class="group-row-cell flex !h-full !min-h-full overflow-hidden !px-[8px] !py-[4px]"
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		<button
			class="flex w-full items-center justify-center gap-1 overflow-hidden"
			onclick={() => datagrid.rows.toggleGroupRowExpansion(row)}
		>
			<span class="border-primary/30 rounded-sm border-[1px]">
				<ArrowRight
					class={`${datagrid.rows.isGroupRowExpanded(row) && 'rotate-90'} transition-all `}
				/>
			</span>
			<span class="w-full overflow-hidden text-ellipsis whitespace-nowrap leading-normal">
				{row.groupValue[0]}
			</span>
			<span class="text-muted-foreground flex place-items-center pl-1 text-xs leading-none">
				[{row.children.length}]
			</span>
		</button>
	</div>
{/snippet}

{#snippet GroupCellAggregationSnippet(row: GridGroupRow<any>, column: LeafColumn<any>)}
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
{/snippet}
