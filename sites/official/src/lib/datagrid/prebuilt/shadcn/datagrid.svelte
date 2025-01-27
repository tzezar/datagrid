<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { cn } from '$lib/utils';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { LeafColumn, GroupColumn } from '$lib/datagrid/core/types';

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
	import RowSelectionHeaderCell from './built-in/row-selection-header-cell.svelte';
	import RowExpandingCell from './built-in/row-expanding-cell.svelte';
	import StatusIndicator from './built-in/status-indicator.svelte';
	import ContentCopyOutline from '$lib/datagrid/icons/material-symbols/content-copy-outline.svelte';
	import Toolbar from './built-in/toolbar.svelte';
	import { shouldHighlightSelectedRow } from './utils';
	import { blur, fade, fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import BodyRowActionsCell from './built-in/body-row-actions-cell.svelte';
	import { quartIn } from 'svelte/easing';
	import { fa } from '@faker-js/faker';
	import RowSelectionBodyRowCell from './built-in/row-selection-body-row-cell.svelte';
	import RowSelectionColumnHeaderCell from './built-in/row-selection-column-header-cell.svelte';
	import RowExpandingColumnHeaderCell from './built-in/row-expanding-column-header-cell.svelte';

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

	let headerColumns = $derived(
		datagrid.extra.features.groupHeadersVisibility.showGroupHeaders
			? datagrid.columnManager.getColumnsInOrder()
			: datagrid.columnManager.getLeafColumnsInOrder()
	);

	// Crazy boost in performance
	const leafColumns = $derived(datagrid.columnManager.getLeafColumnsInOrder());
</script>

<Portal disabled={!datagrid.isFullscreenEnabled()}>
	<div data-fullscreen={datagrid.isFullscreenEnabled()} class="grid-wrapper relative h-full">
		{#if datagrid.extra.features.overlay.shouldShowWrapperOverlay()}
			<div
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
		{#if datagrid.extra.features.pagination.shouldDisplayPagination()}
			{#if ['both', 'top'].includes(datagrid.extra.features.pagination.paginationPosition)}
				{#if pagination}
					{@render pagination()}
				{:else}
					<Pagination {datagrid} class={{ container: 'border-t' }} />
				{/if}
			{/if}
		{/if}
		<StatusIndicator {datagrid} position="top" />
		<div data-fullscreen={datagrid.isFullscreenEnabled()} class="grid-container-wrapper">
			<div class="grid-container">
				{#if header}
					{@render header()}
				{:else}
					<div class="grid-header">
						<div class="grid-header-row">
							{#if datagrid.extra.features.rowSelection.position === 'left' && datagrid.extra.features.rowSelection.displayBuiltInComponents === true}
								<RowSelectionColumnHeaderCell
									{datagrid}
									column={headerColumns.find(
										(col) => col.columnId === 'selection'
									) as LeafColumn<any>}
								/>
							{/if}
							{#if datagrid.extra.features.rowExpanding.position === 'left' && datagrid.extra.features.rowExpanding.displayBuiltInComponents === true}
								<RowExpandingColumnHeaderCell
									{datagrid}
									column={headerColumns.find((col) => col.columnId === 'expand') as LeafColumn<any>}
								/>
							{/if}

							{#each headerColumns
								.filter((col) => col.columnId !== 'selection')
								.filter((col) => col.columnId !== 'expand') as column (column.columnId)}
								<div
									class={cn(
										!datagrid.extra.features.animations.shouldAnimateHeaders() && 'contents'
									)}
									animate:flip={{
										duration: (len) =>
											datagrid.extra.features.animations.getHeadersFlipDuration(len)
									}}
								>
									{#if isGroupColumn(column)}
										{@render HeaderGroupCellSnippet(column)}
									{:else if column.state.visible === true}
										{@render HeaderCellSnippet(column)}
									{/if}
								</div>
							{/each}
							{#if datagrid.extra.features.rowSelection.position === 'right' && datagrid.extra.features.rowSelection.displayBuiltInComponents === true}
								<RowSelectionColumnHeaderCell
									{datagrid}
									column={headerColumns.find(
										(col) => col.columnId === 'selection'
									) as LeafColumn<any>}
								/>
							{/if}
							{#if datagrid.extra.features.rowExpanding.position === 'right' && datagrid.extra.features.rowExpanding.displayBuiltInComponents === true}
								<RowExpandingColumnHeaderCell
									{datagrid}
									column={headerColumns.find((col) => col.columnId === 'expand') as LeafColumn<any>}
								/>
							{/if}
						</div>
					</div>
				{/if}
				{#if body}
					{@render body()}
				{:else}
					<div class="grid-body relative">
						{#if datagrid.extra.features.overlay.shouldShowBodyOverlay()}
							<div
								class="pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[5] h-full w-full bg-black opacity-50"
							></div>
						{/if}

						{#each datagrid.rows.getVisibleRows() as row, rowIndex (row.identifier)}
							{#if row.isGroupRow()}
								<div
									class="grid-body-group-row"
									data-depth={row.depth}
									data-expanded={row.isExpanded()}
								>
									{#each leafColumns as column, columnIndex (column.columnId)}
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
								<div class="grid-body-row flex">
									{#if datagrid.extra.features.rowSelection.position === 'left' && datagrid.extra.features.rowSelection.displayBuiltInComponents === true}
										<RowSelectionCell
											{datagrid}
											{row}
											column={headerColumns.find(
												(col) => col.columnId === 'selection'
											) as LeafColumn<any>}
										/>
									{/if}
									{#if datagrid.extra.features.rowExpanding.position === 'left' && datagrid.extra.features.rowExpanding.displayBuiltInComponents === true}
										<RowExpandingCell
											{datagrid}
											{row}
											column={headerColumns.find(
												(col) => col.columnId === 'expand'
											) as LeafColumn<any>}
										/>
									{/if}
									{#each leafColumns
										.filter((col) => col.columnId !== 'selection')
										.filter((col) => col.columnId !== 'expand') as column (column.columnId)}
										<div
											class={cn(
												!datagrid.extra.features.animations.shouldAnimateRows() && 'contents'
											)}
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
														class={cn(
															'grid-body-cell group items-center transition-all duration-300',
															shouldHighlightSelectedRow(datagrid, row) && 'bg-blue-400/10',
															column._meta.styles?.bodyCell({ datagrid, column, row })
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
														<span class={cn('cell-content  ')}>
															{@html getCellContent(column, row.original)}
														</span>

														{#if datagrid.extra.features.clickToCopy.isValidColumn(column)}
															{#if datagrid.extra.features.clickToCopy.shouldDisplayCopyButton(column)}
																<button
																	class="pl-1"
																	onclick={(e) => {
																		datagrid.extra.features.clickToCopy.handleClickToCopy(
																			row.original,
																			column
																		);

																		const cellElement = (e.target as HTMLElement).closest(
																			'.grid-body-cell'
																		);
																		if (cellElement) {
																			datagrid.extra.features.clickToCopy.addCopyFeedback(
																				cellElement as HTMLElement
																			);
																		}
																	}}
																>
																	<ContentCopyOutline
																		width="0.75rem"
																		class={cn('opacity-0 transition-all group-hover:opacity-100 ')}
																	/>
																</button>
															{/if}
														{/if}
													</div>
												{/if}
											{/if}
										</div>
									{/each}
									{#if datagrid.extra.features.rowSelection.position === 'right' && datagrid.extra.features.rowSelection.displayBuiltInComponents === true}
										<RowSelectionCell
											{datagrid}
											{row}
											column={headerColumns.find(
												(col) => col.columnId === 'selection'
											) as LeafColumn<any>}
										/>
									{/if}
									{#if datagrid.extra.features.rowExpanding.position === 'right' && datagrid.extra.features.rowExpanding.displayBuiltInComponents === true}
										<RowExpandingCell
											{datagrid}
											{row}
											column={headerColumns.find(
												(col) => col.columnId === 'expand'
											) as LeafColumn<any>}
										/>
									{/if}
								</div>
							{/if}
							{#if row.isExpanded()}
								<div class="grid-body-row sticky left-0">
									<div class="grid-body-cell sticky left-0">
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
			<div class={cn('grid-footer-container border-b', footerContent && 'p-2')}>
				{@render footerContent?.()}
			</div>
		{/if}
		<StatusIndicator {datagrid} position="bottom" />
		{#if datagrid.extra.features.pagination.shouldDisplayPagination()}
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

{#snippet HeaderGroupCellSnippet(column: GroupColumn<any>)}
	<div class={`grid-header-group`}>
		<div class="grid-header-group-header">
			{column.header}
			<HeaderCellDropdown {datagrid} {column} />
		</div>
		<div class="flex grow flex-row">
			{#each column.columns ?? [] as subColumn (subColumn.columnId)}
				<div animate:flip>
					{#if isGroupColumn(subColumn)}
						{@render HeaderGroupCellSnippet(subColumn)}
					{:else if subColumn.state.visible === true}
						{@render HeaderCellSnippet(subColumn)}
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
	{#if column.headerCell}
		{@const cellContent = column.headerCell({ datagrid, column })}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {column} />
		{/if}
	{:else}
		<div
			class={cn('grid-header-cell')}
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
				class="grid-header-cell-content {column.options.sortable &&
				datagrid.extra.features.sorting.enableSorting === true
					? 'sortable'
					: ''}"
				onclick={(e) => {
					if (datagrid.extra.features.sorting.enableSorting === false) return;

					let multisort = false;
					if (datagrid.extra.features.sorting.enableMultiSort) {
						multisort = e.shiftKey;
					}
					datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
				}}
			>
				<span class="grid-header-cell-content-header">{column.header}</span>

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
				<div class="h-9 w-full pt-1">
					<HeaderCellColumnFilter {datagrid} {column} />
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

<style>
	.copy-feedback {
		animation: copyFeedback 1s ease;
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
