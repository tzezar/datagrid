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
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-dropdown.svelte';
	import HeaderCellColumnFilter from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-column-filter.svelte';
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
	import RowSelectionColumnHeaderCell from './built-in/row-selection-column-header-cell.svelte';
	import RowExpandingColumnHeaderCell from './built-in/row-expanding-column-header-cell.svelte';
	import type { Action } from 'svelte/action';

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
			<div use:identifier={'wrapper-overlay'} class="wrapper-overlay"></div>
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
						<div use:identifier={'header-row'} class="header-row w-full">
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
								<div class="group-row " data-depth={row.depth} data-expanded={row.isExpanded()}>
									{#each leafColumns as column, columnIndex (column.columnId)}
										{#if column.isVisible()}
											<div
												class={cn('cell min-h-full !m-0 !p-0')}
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
													{@render GroupCellHeaderSnippet(column, row)}
												{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
													{@render GroupCellAggregationSnippet(row, column)}
												{/if}
											</div>
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
													<div
														class:grow={column?._meta?.grow}
														class={cn(
															'cell group',
															shouldHighlightSelectedRow(datagrid, row) && 'bg-blue-400/10',
															column._meta.styles?.bodyCell({ datagrid, column, row })
														)}
														class:justify-center={column?._meta?.align === 'center'}
														data-pinned={column.state.pinning.position !== 'none'
															? column.state.pinning.position
															: 'none'}
														style:--width={column.state.size.width + 'px'}
														style:--min-width={column.state.size.minWidth + 'px'}
														style:--max-width={column.state.size.maxWidth + 'px'}
														style:--pin-left-offset={column.state.pinning.offset + 'px'}
														style:--pin-right-offset={column.state.pinning.offset + 'px'}
													>
														<span class={cn('cell-content')}>
															{@html getCellContent(column, row.original)}
														</span>

														{@render CopyCellButton(column, row)}
													</div>
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
	<div class="grid-header-group">
		<div class="grid-header-group-header">
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
	</div>
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
		<div
			class:grow={column._meta.grow === true}
			class={cn('column-header-cell')}
			data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
			style:--pin-left-offset={column.state.pinning.offset + 'px'}
			style:--pin-right-offset={column.state.pinning.offset + 'px'}
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class:sortable={column.options.sortable &&
					datagrid.extra.features.sorting.enableSorting === true}
				class="column-header-cell-content"
				onclick={(e) => {
					if (datagrid.extra.features.sorting.enableSorting === false) return;

					let multisort = false;
					if (datagrid.extra.features.sorting.enableMultiSort) {
						multisort = e.shiftKey;
					}
					datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
				}}
			>
				<span class="column-header">{column.header}</span>
				<div class="column-actions">
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
		</div>
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
		class="group-row-cell  flex !min-h-full !h-full !px-[8px] !py-[4px] "
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		<button
			class="flex w-full items-center justify-center gap-1 overflow-hidden "
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
			<span class="text-muted-foreground flex place-items-center  pl-1 text-xs leading-none">
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

<style lang="postcss">
	/* Grid */

	.wrapper-overlay {
		@apply pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[10000] h-full w-full bg-black opacity-50;
	}

	.body-overlay {
		@apply pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[5] h-full w-full bg-black opacity-50;
	}

	.grid-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: fit-content;
	}

	[data-fullscreen='true'].grid-wrapper {
		background-color: hsl(var(--background) / 0.8);
		position: absolute;
		inset: 0;
		padding: 1rem;
		z-index: 20;
	}

	.grid-container-wrapper {
		width: 100%;
		overflow: auto;
		display: inline-block;
		max-height: 600px;
		border: var(--grid-border-width) solid hsl(var(--grid-border));
		/* background-color: hsl(var(--grid-background)); */
	}

	[data-fullscreen='true'] .grid-container-wrapper {
		height: 100%;
		max-height: 100%;
		overflow: auto;
	}

	.grid-container {
		/* height: 100%; */
		flex-grow: 0;
		display: flex;
		flex-direction: column;
		/* overflow: auto; */
		/* fix for coloring width not taking whole width */
		display: inline-block;
	}

	/* Header */
	.grid-header {
		display: flex;
		flex-direction: row;
		position: sticky;
		top: 0px;
		z-index: 10;
		/* background-color: hsl(var(--grid-header)); */
	}

	.header-row {
		display: flex;
		flex-direction: row;
		/* background-color: hsl(var(--grid-header)); */
		border-bottom: var(--grid-border-width) solid hsl(var(--grid-border));
	}

	.column-header-cell {
		display: flex;
		flex-direction: column;
		padding: 8px;
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
		/* background-color: hsl(var(--grid-header-cell)); */
		border-right: var(--grid-border-width) solid hsl(var(--grid-border));
		/* border-top: var(--grid-border-width) solid hsl(var(--grid-border)); */
		height: 100%;
		justify-content: flex-end;
		align-self: flex-end;
		font-size: 0.75rem /* 12px */;
		line-height: 1rem /* 16px */;
		font-weight: 500;
	}

	.column-header-cell-content {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
	}

	.column-header {
		text-overflow: ellipsis;
		text-wrap: nowrap;
		overflow: hidden;
	}

	.grid-header-group {
		/* background-color: hsl(var(--grid-header-group)); */
		display: flex;
		flex-direction: column;
		height: 100%;
		font-size: 0.75rem /* 12px */;
		line-height: 1rem /* 16px */;
		font-weight: 500;
	}

	.grid-header-group-header {
		padding: 8px;
		border-right: var(--grid-border-width) solid hsl(var(--grid-border));
		border-left: var(--grid-border-width) solid hsl(var(--grid-border));
		border-bottom: var(--grid-border-width) solid hsl(var(--grid-border));
		/* box-sizing: border-box; */
		display: flex;
		flex-direction: row;
		height: 100%;
		justify-content: left;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.grid-header-group-header:first-child {
		border-right: var(--grid-border-width) solid hsl(var(--grid-border));
		border-left: 0px;
	}

	.grid-header-group-cell {
		font-weight: bold;
		width: 100%;
		padding: 8px;
		margin: 0;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
	}

	/* Body */
	.grid-body {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		/* height: 100%; */
	}

	.grid-body-row {
		display: flex;
		height: 100%;
		flex-direction: row;
		border-bottom: var(--grid-border-width) solid hsl(var(--grid-border));
	}

	.grid-body-row:last-child {
		border-bottom: none;
	}

	.cell {
		@apply transition-all duration-300;

		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
		display: flex;
		padding: 4px 8px;
		align-items: center;
	}

	.cell .cell-content {
		/* flex: 1; */
		/* min-width: 0; */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	/* Odd rows */
	/* .grid-body-row:nth-child(odd) {
    background-color: hsl(var(--grid-body-row-odd)); 
} */

	/* Even rows */
	/* .grid-body-row:nth-child(even) {
    background-color: hsl(var(--grid-body-row-even)); 
} */

	.group-row {
		display: flex;
		flex-direction: row;
		width: 100%;
		border-bottom: var(--grid-border-width) solid hsl(var(--grid-border));
	}

	.group-row-cell {
		@apply flex flex-col place-items-start justify-start gap-1 h-full min-h-full;
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
	}

	/* Pinned columns base positioning */
	[data-pinned='right'],
	[data-pinned='left'] {
		position: sticky;
		z-index: 2;
		background-clip: padding-box;
	}

	/* Pinned positions */
	[data-pinned='right'] {
		right: var(--pin-right-offset, 0);
	}

	[data-pinned='left'] {
		left: var(--pin-left-offset, 0);
	}

	/* Pinned header cells */
	[data-pinned='right'] .column-header-cell,
	[data-pinned='left'] .column-header-cell {
		/* background-color: hsl(var(--grid-pinned-header-cell)); */
	}

	/* Pinned body cells */
	div[data-pinned='right'].cell,
	div[data-pinned='left'].cell {
		/* background-color: hsl(var(--grid-pinned-cell)); */
	}

	/* Sorting indicator */
	.sortable {
		cursor: pointer;
		user-select: none;
	}
	.sortable:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.sort-indicator {
		display: flex;
		align-items: center;
		opacity: 0.5;
	}

	.sortable:hover .sort-indicator {
		opacity: 1;
	}

	/* Footer */

	.grid-footer-container {
		position: sticky;
		bottom: 0px;
		left: 0px;
		/* background-color: hsl(var(--grid-footer)); */
		border-bottom-width: 1px;
	}

	.grid-toolbar-container {
		position: sticky;
		top: 0px;
		left: 0px;
		/* background-color: hsl(var(--grid-toolbar)); */
	}
	/* Pagination */

	.pagination-container {
		/* background-color: hsl(var(--grid-pagination)); */
		border: var(--grid-border-width) solid var(--border-color);
	}

	.pagination-page-input {
		border-color: hsl(var(--grid-border));
	}

	/* Column Filtering */

	.column-filter-input {
		/* background-color: hsl(var(--grid-border)); */
		border: 1px solid hsl(var(--grid-border));
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		height: 1.25rem;
		color: hsl(var(--muted-foreground));
		font-size: 0.8rem;
	}

	.copy-feedback {
		animation: copyFeedback 1s ease;
	}

	.column-filter {
		@apply h-9 w-full pt-1;
	}

	.column-actions {
		@apply flex gap-1;
	}

	@keyframes copyFeedback {
		0% {
			background-color: rgb(59 130 246 / 0.2); /* bg-blue-500/20 */
		}
		100% {
			background-color: transparent;
		}
	}
</style>
