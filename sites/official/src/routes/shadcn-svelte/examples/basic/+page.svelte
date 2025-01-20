<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { cn } from '$lib/utils';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { LeafColumn, GroupColumn } from '$lib/datagrid/core/types';

	import { Portal } from 'bits-ui';
	import { userColumns } from './columns.svelte';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';

	// Icones
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';

	// Blocks
	import HeaderCellColumnFilter from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-column-filter.svelte';
	import ColumnSortingIndicator from '$lib/datagrid/prebuilt/shadcn/built-in/column-sorting-indicator.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn/built-in/pagination.svelte';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import Toolbar from '$lib/datagrid/prebuilt/shadcn/built-in/toolbar.svelte';
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-dropdown.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users,

		
		extra: {
			features: {
				
				
			}
		}

	});

	let columns = $derived(
		datagrid.extra.features.groupHeadersVisibility.showGroupHeaders
			? datagrid.columnManager.getColumnsInOrder()
			: datagrid.columnManager.getLeafColumnsInOrder()
	);

	// Crazy boost in performance
	const leafColumns = $derived(datagrid.columnManager.getLeafColumnsInOrder());
</script>

<Portal disabled={!datagrid.isFullscreenEnabled()}>
	<div data-fullscreen={datagrid.isFullscreenEnabled()} class="grid-wrapper">
		<Toolbar {datagrid} />
		<!-- <div class="grid-toolbar-container">
			<button onclick={() => datagrid.fullscreen.toggleFullscreen()}> Toggle Fullscreen </button>
		</div> -->
		<div data-fullscreen={datagrid.isFullscreenEnabled()} class="grid-container-wrapper">
			<div class="grid-container">
				<div class="grid-header">
					<div class="grid-header-row">
						{#each columns as column (column.columnId)}
							{#if isGroupColumn(column)}
								{@render HeaderGroupCellSnippet(column)}
							{:else if column.state.visible === true}
								{@render HeaderCellSnippet(column)}
							{/if}
						{/each}
					</div>
				</div>
				<div class="grid-body">
					{#each datagrid.rows.getVisibleRows() as row (row.identifier)}
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
							<div class="grid-body-row">
								{#each leafColumns as column (column.columnId)}
									{#if column.isVisible()}
										{#if column.cell}
											{@const cellContent = column.cell({ datagrid, column, row })}
											{#if typeof cellContent === 'string'}
												{@html cellContent}
											{:else if isCellComponent(cellContent)}
												<cellContent.component {datagrid} {row} {column} />
											{/if}
										{:else}
											<div
												class={cn(
													'grid-body-cell',
													column._meta.styles?.bodyCell,
													datagrid.extra.features.rowSelection.highlightSelectedRow &&
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
												{@html getCellContent(column, row.original)}
											</div>
										{/if}
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
			</div>
			<div class="grid-footer-container"></div>
		</div>
		<Pagination {datagrid} />
		<MadeWithLoveByTzezar />
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
				{#if isGroupColumn(subColumn)}
					{@render HeaderGroupCellSnippet(subColumn)}
				{:else if subColumn.state.visible === true}
					{@render HeaderCellSnippet(subColumn)}
				{/if}
			{/each}
		</div>
	</div>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
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
			class="grid-header-cell-content {column.options.sortable ? 'sortable' : ''}"
			onclick={(e) => {
				const multisort = e.shiftKey;
				datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
			}}
		>
			{#if column.headerCell}
				{@const cellContent = column.headerCell({ datagrid, column })}
				{#if typeof cellContent === 'string'}
					{@html cellContent}
				{:else if isCellComponent(cellContent)}
					<cellContent.component {datagrid} {column} />
				{/if}
			{:else}
				<span class="grid-header-cell-content-header">{column.header}</span>
			{/if}

			<div class="flex gap-1">
				{#if column.isSortable()}
					<ColumnSortingIndicator {datagrid} {column} />
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
{/snippet}
