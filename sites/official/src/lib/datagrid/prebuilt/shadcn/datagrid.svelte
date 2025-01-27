<script lang="ts">
	import { cn } from '$lib/utils';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { LeafColumn, GridBasicRow } from '$lib/datagrid/core/types';

	import { Portal } from 'bits-ui';

	// Icones

	// Blocks
	import Pagination from '$lib/datagrid/prebuilt/shadcn/built-in/pagination.svelte';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import type { Snippet } from 'svelte';
	import RowSelectionCell from './built-in/row-selection-cell.svelte';
	import RowExpandingCell from './built-in/row-expanding-cell.svelte';
	import StatusIndicator from './built-in/status-indicator.svelte';
	import Toolbar from './built-in/toolbar.svelte';
	import { flip } from 'svelte/animate';
	import RowSelectionColumnHeaderCell from './built-in/row-selection-column-header-cell.svelte';
	import RowExpandingColumnHeaderCell from './built-in/row-expanding-column-header-cell.svelte';
	import RenderCell from './structure/render-cell.svelte';
	import RenderGroupCell from './structure/render-group-cell.svelte';
	import RenderColumnCell from './structure/render-column-cell.svelte';
	import { identifier } from './actions.svelte';
	import type { PaginationClasses } from './built-in/types';

	type Props = {
		datagrid: TzezarsDatagrid<any>;

		// Blocks
		toolbar?: Snippet;
		head?: Snippet;
		body?: Snippet;
		footer?: Snippet;
		footerContent?: Snippet;
		pagination?: Snippet;
		statusIndicator?: Snippet;
		expandedRow?: Snippet<[row: GridBasicRow<any>]>;
		expandedRowContent?: Snippet;

		
	};

	let {
		datagrid,
		toolbar,
		head,
		body,
		footer,
		footerContent,
		pagination,
		expandedRow,
		expandedRowContent,
		statusIndicator,

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

	const isFullscreenEnabled = $derived(datagrid.extra.features.fullscreen.isFullscreenEnabled());
	const showWrapperOverlay = $derived(datagrid.extra.features.overlay.shouldShowWrapperOverlay());
	const shouldDisplayPagination = $derived(
		datagrid.extra.features.pagination.shouldDisplayPagination()
	);
	const shouldAnimateHeaders = $derived(datagrid.extra.features.animations.shouldAnimateHeaders());
</script>

<Portal disabled={!isFullscreenEnabled}>
	<div
		use:identifier={{ datagrid, value: 'wrapper' }}
		data-fullscreen={isFullscreenEnabled}
		class={cn('grid-wrapper', 'bg-grid')}
	>
		{@render WrapperOverlaySnippet()}
		{@render ToolbarSnippet()}
		<!-- <div class="grid-toolbar-container">
			<button onclick={() => datagrid.fullscreen.toggleFullscreen()}> Toggle Fullscreen </button>
			</div> -->
		{@render PaginationSnippet(['both', 'top'])}
		{@render StatusIndicatorSnippet('top')}
		<div data-fullscreen={isFullscreenEnabled} class="grid-container-wrapper">
			<div class={cn('grid-container', 'bg-grid-container', )}>
				{@render HeadSnippet()}
				{@render BodySnippet()}
			</div>
		</div>
		{@render FooterSnippet()}
		{@render StatusIndicatorSnippet('bottom')}
		{@render PaginationSnippet(['bottom', 'both'])}
		{@render CredentialsSnippet()}
	</div>
</Portal>

{#snippet HeadSnippet()}
	<div use:identifier={{ datagrid, value: 'head' }} class="grid-head">
		<div use:identifier={{ datagrid, value: 'head-row' }} class="grid-head-row">
			{@render AdditionalHeaderCells('left')}

			{#if shouldAnimateHeaders}
				{#each headerColumnsWithoutAdditional as column (column.columnId)}
					<div
						class:contents={!shouldAnimateHeaders}
						animate:flip={{
							duration: (len) => datagrid.extra.features.animations.getHeadersFlipDuration(len)
						}}
					>
						<RenderColumnCell {datagrid} {column} />
					</div>
				{/each}
			{:else}
				{#each headerColumnsWithoutAdditional as column (column.columnId)}
					<RenderColumnCell {datagrid} {column} />
				{/each}
			{/if}

			{@render AdditionalHeaderCells('right')}
		</div>
	</div>
{/snippet}

{#snippet BodySnippet()}
	{#if body}
		{@render body()}
	{:else}
		<div use:identifier={{ datagrid, value: 'body' }} class="grid-body">
			{#if datagrid.extra.features.overlay.shouldShowBodyOverlay()}
				<div class="body-overlay"></div>
			{/if}

			{#each datagrid.rows.getVisibleRows() as row, rowIndex (row.identifier)}
				{#if row.isGroupRow()}
					<div
						use:identifier={{ datagrid, value: 'row-' + row.identifier }}
						class={cn('group-row', 'bg-datagrid-gro')}
						data-depth={row.depth}
						data-expanded={row.isExpanded()}
					>
						{#each leafColumns as column, columnIndex (column.columnId)}
							<RenderGroupCell {datagrid} {row} {column} />
						{/each}
					</div>
				{:else}
					<div
						class={cn('row', datagrid.extra.features.stripedRows.applyStripedRows(row, rowIndex))}
						use:identifier={{ datagrid, value: 'row-' + row.identifier }}
					>
						{@render AdditionalBodyCells('left', row)}
						{#if datagrid.extra.features.animations.shouldAnimateRows()}
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
						{:else}
							{#each leafColumnsToDisplay as column (column.columnId)}
								<RenderCell {datagrid} {row} {column} />
							{/each}
						{/if}
						{@render AdditionalBodyCells('right', row)}
					</div>
					{#if row.isExpanded()}
						{#if expandedRow}
							{@render expandedRow(row)}
						{:else}
							<div class="expanded-row">
								<div class="cell sticky left-0">
									{#if expandedRowContent}
										{@render expandedRowContent()}
									{:else}
										Place your content in the `expandedRowContent` snippet
									{/if}
								</div>
							</div>
						{/if}
					{/if}
				{/if}
			{/each}
		</div>
	{/if}
{/snippet}

{#snippet ToolbarSnippet()}
	{#if toolbar}
		{@render toolbar()}
	{:else}
		<Toolbar {datagrid}  />
	{/if}
{/snippet}

{#snippet WrapperOverlaySnippet()}
	{#if showWrapperOverlay}
		<div
			use:identifier={{ datagrid, value: 'wrapper-overlay' }}
			class={cn(
				'bg-grid-wrapper-overlay pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[10000] h-full w-full opacity-50',
			)}
		></div>
	{/if}
{/snippet}

{#snippet StatusIndicatorSnippet(position: 'top' | 'bottom' | 'both')}
	{#if statusIndicator}
		{@render statusIndicator()}
	{:else}
		<StatusIndicator {datagrid} {position} />
	{/if}
{/snippet}

{#snippet PaginationSnippet(directions: ('top' | 'bottom' | 'both')[])}
	<!-- ? rewrite it later -->
	{#if shouldDisplayPagination}
		{#if ['both', 'top'].includes(datagrid.extra.features.pagination.paginationPosition)}
			{#if directions.includes('top' || 'both')}
				{#if pagination}
					{@render pagination()}
				{:else}
					<Pagination {datagrid} class={{ container: 'border-t', }} />
				{/if}
			{/if}
		{/if}

		{#if ['both', 'bottom'].includes(datagrid.extra.features.pagination.paginationPosition)}
			{#if directions.includes('bottom' || 'both')}
				{#if pagination}
					{@render pagination()}
				{:else}
					<Pagination
						{datagrid}
						class={{ container: 'border-b border-t-0',  }}
					/>
				{/if}
			{/if}
		{/if}
	{/if}
{/snippet}

{#snippet CredentialsSnippet()}
	{#if datagrid.extra.features.credentials.enabled}
		<MadeWithLoveByTzezar />
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
