<script lang="ts">
	import { cn } from '$lib/utils';
	import type { LeafColumn, GridBasicRow, GridRow } from '$lib/datagrid/core/types';

	import { Portal } from 'bits-ui';

	// Blocks
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
	import { VirtualList } from './virtualization';
	import type { EnhancedDatagrid } from './core/index.svelte';
	import Pagination from './built-in/pagination.svelte';
	import MadeWithLoveByTzezar from './built-in/made-with-love-by-tzezar.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;

		// Snippets
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

		// Snippets
		toolbar,
		head,
		body,
		footer,
		footerContent,
		pagination,
		expandedRow,
		expandedRowContent,
		statusIndicator
	}: Props = $props();

	let headerColumns = $derived.by(() => {
		if (datagrid.extra.features.columnGroups.showColumnGroups) {
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

	const isFullscreenEnabled = $derived(datagrid.extra.features.fullscreen.isFullscreenModeEnabled());
	const showWrapperOverlay = $derived(datagrid.extra.features.overlay.isEntireDatagridOverlayEnabled());
	const shouldDisplayPagination = $derived(
		datagrid.extra.features.pagination.isPaginationVisible()
	);
	const shouldAnimateHeaders = $derived(datagrid.extra.features.animations.shouldAnimateHeaders());
</script>

<Portal disabled={!isFullscreenEnabled}>
	<div
		use:identifier={{ datagrid, value: 'wrapper' }}
		data-fullscreen={isFullscreenEnabled}
		class={cn(datagrid.customization.styling.getWrapperClasses())}
	>
		{@render WrapperOverlaySnippet()}
		{@render ToolbarSnippet()}
		<!-- <div class="grid-toolbar-container">
			<button onclick={() => datagrid.fullscreen.toggleFullscreen()}> Toggle Fullscreen </button>
			</div> -->
		{@render PaginationSnippet(['both', 'top'])}
		{@render StatusIndicatorSnippet('top')}

		{@render ContainerSnippet(datagrid.extra.features.virtualization.enabled)}

		{@render FooterSnippet()}
		{@render StatusIndicatorSnippet('bottom')}
		{@render PaginationSnippet(['bottom', 'both'])}
		{@render CredentialsSnippet()}
	</div>
</Portal>

{#snippet ContainerSnippet(virtualized: boolean = false)}
	{#if virtualized}
		{@render VirtualizedContainerSnippet()}
	{:else}
		{@render NotVirtualizedContainerSnippet()}
	{/if}
{/snippet}

{#snippet VirtualizedContainerSnippet()}
	<VirtualList items={datagrid.rows.getVisibleRows()}>
		{#snippet header()}
			{@render HeadSnippet()}
		{/snippet}
		{#snippet vl_slot({
			item: row,
			index: rowIndex
		}: {
			item: GridRow<any>;
			index: string | number;
		})}
			{@render BodyRowSnippet(row, Number(rowIndex))}
		{/snippet}
	</VirtualList>
{/snippet}

{#snippet NotVirtualizedContainerSnippet()}
	<div data-fullscreen={isFullscreenEnabled} class="grid-container-wrapper">
		<div class={cn(datagrid.customization.styling.getContainerClasses())}>
			{@render HeadSnippet()}
			{@render BodySnippet()}
		</div>
	</div>
{/snippet}

{#snippet BodyRowSnippet(row: GridRow<any>, rowIndex: number)}
	{#if row.isGroupRow()}
	<div
		use:identifier={{ datagrid, value: 'row-' + row.identifier }}
		class={datagrid.customization.styling.getBodyGroupRowClasses()}
		data-depth={row.depth}
		data-expanded={row.isExpanded()}
	>
		{#each leafColumns as column, columnIndex (column.columnId)}
			<RenderGroupCell {datagrid} {row} {column} />
		{/each}
	</div>
{:else}
	<div
		class={cn(
			datagrid.customization.styling.getBodyRowClasses(row, Number(rowIndex)), ''
		)}
		use:identifier={{ datagrid, value: 'row-' + row.identifier }}
	>
		{@render AdditionalBodyCells('left', row)}
		{#if datagrid.extra.features.animations.shouldAnimateRows()}
			{#each leafColumnsToDisplay as column (column.columnId)}
				<div
					class:contents={!datagrid.extra.features.animations.shouldAnimateRows()}
					class={cn(column._meta.grow && 'grow flex')}
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
			<div class={datagrid.customization.styling.getBodyRowExpandedClasses()}>
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
{/snippet}


{#snippet HeadSnippet()}
	{#if head}
		{@render head()}
	{:else}
		<div
			use:identifier={{ datagrid, value: 'head' }}
			class={datagrid.customization.styling.getHeadClasses()}
		>
			<div
				use:identifier={{ datagrid, value: 'head-row' }}
				class={datagrid.customization.styling.getHeadRowClasses()}
			>
				{@render AdditionalHeaderCells('left')}

				{#if shouldAnimateHeaders}
					{#each headerColumnsWithoutAdditional as column (column.columnId)}
						<div
							class:contents={!shouldAnimateHeaders}
							class={cn(column._meta.grow && 'grow flex')}
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
	{/if}
{/snippet}

{#snippet BodySnippet()}
	{#if body}
		{@render body()}
	{:else}
		<div
			use:identifier={{ datagrid, value: 'body' }}
			class={cn(datagrid.customization.styling.getBodyClasses())}
		>
			{#if datagrid.extra.features.overlay.isBodyOverlayEnabled()}
				<div class="body-overlay"></div>
			{/if}

			{#each datagrid.rows.getVisibleRows() as row, rowIndex (row.identifier)}
				{#if row.isGroupRow()}
					<div
						use:identifier={{ datagrid, value: 'row-' + row.identifier }}
						class={datagrid.customization.styling.getBodyGroupRowClasses()}
						data-depth={row.depth}
						data-expanded={row.isExpanded()}
					>
						{#each leafColumns as column, columnIndex (column.columnId)}
							<RenderGroupCell {datagrid} {row} {column} />
						{/each}
					</div>
				{:else}
					<div
						class={cn(datagrid.customization.styling.getBodyRowClasses(row, rowIndex),)}
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
							<div class={datagrid.customization.styling.getBodyRowExpandedClasses()}>
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
		<Toolbar {datagrid} />
	{/if}
{/snippet}

{#snippet WrapperOverlaySnippet()}
	{#if showWrapperOverlay}
		<div
			use:identifier={{ datagrid, value: 'wrapper-overlay' }}
			class={datagrid.customization.styling.getWrapperOverlayClasses()}
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
	<!-- Simplified logic, preserving original intent -->
	{#if shouldDisplayPagination}
		{#if ['both', 'top'].includes(datagrid.extra.features.pagination.position) && directions.includes('top')}
			{#if pagination}
				{@render pagination()}
			{:else}
				<Pagination {datagrid} class={{ container: 'border-t ' }} />
			{/if}
		{/if}

		{#if ['both', 'bottom'].includes(datagrid.extra.features.pagination.position) && directions.includes('bottom')}
			{#if pagination}
				{@render pagination()}
			{:else}
				<Pagination {datagrid} class={{ container: 'border-b border-t-0' }} />
			{/if}
		{/if}
	{/if}
{/snippet}

{#snippet CredentialsSnippet()}
	{#if datagrid.extra.features.credentials.enabled && datagrid.extra.features.fullscreen.fullscreenModeEnabled === false}
		<MadeWithLoveByTzezar />
	{/if}
{/snippet}

{#snippet FooterSnippet()}
	{#if footer}
		{@render footer()}
	{:else if footerContent}
		<div class={cn(datagrid.customization.styling.getFooterContainerClasses())}>
			{@render footerContent?.()}
		</div>
	{/if}
{/snippet}

{#snippet AdditionalHeaderCells(position: 'left' | 'right')}
	{#if datagrid.extra.features.rowSelection.position === position}
		<RowSelectionColumnHeaderCell
			{datagrid}
			column={headerColumns.find((col) => col.columnId === '_selection') as LeafColumn<any>}
		/>
	{/if}
	{#if datagrid.extra.features.rowExpanding.position === position}
		<RowExpandingColumnHeaderCell
			{datagrid}
			column={headerColumns.find((col) => col.columnId === '_expand') as LeafColumn<any>}
		/>
	{/if}
{/snippet}

{#snippet AdditionalBodyCells(position: 'left' | 'right', row: GridBasicRow<any>)}
	{#if datagrid.extra.features.rowSelection.position === position}
		<RowSelectionCell
			{datagrid}
			{row}
			column={headerColumns.find((col) => col.columnId === '_selection') as LeafColumn<any>}
		/>
	{/if}
	{#if datagrid.extra.features.rowExpanding.position === position && datagrid.extra.features.rowExpanding.createColumnManually === true}
		<RowExpandingCell
			{datagrid}
			{row}
			column={headerColumns.find((col) => col.columnId === '_expand') as LeafColumn<any>}
		/>
	{/if}
{/snippet}
