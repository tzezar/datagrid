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
	import RenderCell from './structure/render-cell.svelte';
	import RenderGroupCell from './structure/render-group-cell.svelte';
	import RenderColumn from './structure/render-column.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;

		// Blocks
		toolbar?: Snippet;
		header?: Snippet;
		body?: Snippet;
		footer?: Snippet;
		footerContent?: Snippet;
		pagination?: Snippet;
		statusIndicator?: Snippet;
	};

	let {
		datagrid,

		toolbar,
		header: head,
		body,
		footer,
		footerContent,
		pagination,
		statusIndicator
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

{#snippet HeadSnippet()}
	<div use:identifier={'head'} class="grid-head">
		<div use:identifier={'head-row'} class="grid-head-row">
			{@render AdditionalHeaderCells('left')}
			{#each headerColumnsWithoutAdditional as column (column.columnId)}
				<div
					class:contents={!shouldAnimateHeaders}
					animate:flip={{
						duration: (len) => datagrid.extra.features.animations.getHeadersFlipDuration(len)
					}}
				>
					<RenderColumn {datagrid} {column} />
				</div>
			{/each}
			{@render AdditionalHeaderCells('right')}
		</div>
	</div>
{/snippet}

{#snippet BodySnippet()}
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
							<RenderGroupCell {datagrid} {row} {column} />
						{/each}
					</div>
				{:else}
					<div class="row">
						{@render AdditionalBodyCells('left', row)}
						{#each leafColumnsToDisplay as column (column.columnId)}
							<div
								class:contents={!datagrid.extra.features.animations.shouldAnimateRows()}
								class={cn()}
								animate:flip={{
									duration: (len) => datagrid.extra.features.animations.getRowsFlipDuration(len)
								}}
							>
								<RenderCell {datagrid} {row} {column} />
							</div>
						{/each}
						{@render AdditionalBodyCells('right', row)}
					</div>
				{/if}
				{#if row.isExpanded()}
					<div class="row">
						<div class="cell sticky left-0">
							Content for row with ID {row.identifier}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
{/snippet}

<Portal disabled={!isFullscreenEnabled}>
	<div use:identifier={'wrapper'} data-fullscreen={isFullscreenEnabled} class={cn('grid-wrapper')}>
		{@render WrapperOverlaySnippet()}
		{@render ToolbarSnippet()}
		<!-- <div class="grid-toolbar-container">
			<button onclick={() => datagrid.fullscreen.toggleFullscreen()}> Toggle Fullscreen </button>
			</div> -->
		{@render PaginationSnippet(['both', 'top'])}
		{@render StatusIndicatorSnippet('top')}
		<div data-fullscreen={isFullscreenEnabled} class="grid-container-wrapper">
			<div class="grid-container">
				{@render HeadSnippet()}
				{@render BodySnippet()}
			</div>
		</div>

		{@render FooterSnippet()}
		{@render StatusIndicatorSnippet('bottom')}
		{@render PaginationSnippet(['bottom', 'both'])}
		{#if datagrid.extra.features.credentials.enabled}
			<MadeWithLoveByTzezar />
		{/if}
	</div>
</Portal>

{#snippet ToolbarSnippet()}
	{#if toolbar}
		{@render toolbar()}
	{:else}
		<Toolbar {datagrid} />
	{/if}
{/snippet}

{#snippet WrapperOverlaySnippet()}
	{#if showWrapperOverlay}
		<div
			use:identifier={'wrapper-overlay'}
			class="pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[10000] h-full w-full bg-black opacity-50"
		></div>
	{/if}
{/snippet}

{#snippet StatusIndicatorSnippet(position: 'top' | 'bottom' | 'both')}
	<StatusIndicator {datagrid} {position} />
{/snippet}

{#snippet PaginationSnippet(directions: ('top' | 'bottom' | 'both')[])}
	{#if shouldDisplayPagination}
		{#if directions.includes(datagrid.extra.features.pagination.paginationPosition)}
			{#if pagination}
				{@render pagination()}
			{:else}
				<Pagination {datagrid} class={{ container: 'border-t' }} />
			{/if}
		{/if}
	{/if}
{/snippet}

{#snippet FooterSnippet()}
	{#if footer}
		{@render footer()}
	{:else}
		<div class={cn('grid-footer-container', footerContent && 'p-2')}>
			{@render footerContent?.()}
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
