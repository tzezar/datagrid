<script lang="ts">
	import { type AnyColumn } from './datagrid/core/helpers/column-creators';
	import type { User } from './types';
	import { isGroupColumn } from './datagrid/core/column-guards';
	import type {
		GridBasicRow,
		GridGroupRow,
		GridRow,
	} from './datagrid/core/types';
	import { Datagrid } from './datagrid/core/index.svelte';
	import {
		flattenColumns,
		getCellContent,
		getSortIcon,
		getSortIndex,
		isGridGroupRow,
		onSort
	} from './datagrid/core/utils.svelte';
	import { userColumns } from './columns.svelte';
	import ColumnFilter from './datagrid/prebuilt/native/column-filter.svelte';
	import './datagrid/styles.css';
	import GroupBy from './_components/grid-controls/group-by.svelte';
	import ColumnVisibility from './_components/grid-controls/column-visibility.svelte';
	import ColumnOrdering from './_components/grid-controls/column-ordering.svelte';
	import ColumnPinning from './_components/grid-controls/column-pinning.svelte';

	let { data } = $props();

	const datagrid = new Datagrid({
		columns: userColumns,
		data: data.users
	});
	datagrid.grouping.groupByColumns = ['role'];
	datagrid.processors.data.executeFullDataTransformation();
</script>

{#snippet HeaderCell(column: (typeof Datagrid.prototype.columns)[0])}
	{#if isGroupColumn(column)}
		<div class="grid-header-group">
			{#if column.columns.some((c) => c.state.visible === true)}
				<div class="grid-header-group-cell">{column.header}</div>
				<div class="grid-header-row">
					{#each column.columns ?? [] as subColumn (subColumn.header)}
						{#if subColumn.state.visible === true}
							{@render HeaderCell(subColumn)}
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		{#if column.state.visible === true}
			<div
				class="grid-header-cell"
				data-pinned={column.state.pinning.position !== 'none'
					? column.state.pinning.position
					: null}
				style:--pin-left-offset={column.state.pinning.offset + 'px'}
				style:--pin-right-offset={column.state.pinning.offset + 'px'}
				style:--width={column.state.size.width + 'px'}
				style:--min-width={column.state.size.minWidth + 'px'}
				style:--max-width={column.state.size.maxWidth + 'px'}
			>
				<div
					class="header-content {column.options.sortable ? 'sortable' : ''}"
					onclick={(e) => onSort(datagrid, column, e)}
				>
					<span>{column.header}</span>
					{#if column.options.sortable}
						<div class="sort-indicator">
							{#if getSortIndex(datagrid, column)}
								<span class="sort-index">{getSortIndex(datagrid, column)}</span>
							{/if}
							<!-- svelte-ignore svelte_component_deprecated -->
							<svelte:component this={getSortIcon(datagrid, column)} class="sort-icon" size={14} />
						</div>
					{/if}
				</div>
				<div class="w-full">
					<ColumnFilter {datagrid} {column} />
				</div>
			</div>
		{/if}
	{/if}
{/snippet}

{#snippet BodyCell(column: AnyColumn<User>, row: GridBasicRow<User>)}
	<div
		class="grid-body-cell"
		data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
		style:--pin-left-offset={column.state.pinning.offset + 'px'}
		style:--pin-right-offset={column.state.pinning.offset + 'px'}
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		{#if column.cell && typeof column.cell === 'function'}
			{@const cellContent = column.cell(row)}
			{#if cellContent && typeof cellContent === 'object' && 'component' in cellContent}
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={cellContent.component} {...cellContent.props} {datagrid} />
			{/if}
		{:else}
			{@html getCellContent(column, row.original)}
		{/if}
	</div>
{/snippet}

{#snippet GroupRowCell(row: GridGroupRow<User>, column: AnyColumn<User>)}
	<div
		class="grid-body-cell group-cell"
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		{#if column._meta?.showInGroupRow}
			{#if column.cell && typeof column.cell === 'function'}
				{@const cellContent = column.cell(row)}
				{#if cellContent && typeof cellContent === 'object' && 'component' in cellContent}
					<!-- svelte-ignore svelte_component_deprecated -->
					<svelte:component this={cellContent.component} {...cellContent.props} {datagrid} />
				{/if}
			{/if}
		{/if}
		{#if column.columnId === row.groupKey}
			<div class="group-cell-content">
				<button
					class="group-expand-inline-toggle"
					onclick={() => datagrid.rowManager.toggleGroupRowExpansion(row)}
				>
					<span class="expand-icon">
						{datagrid.rowManager.isGroupRowExpanded(row) ? '▼' : '▶'}
					</span>
					<span class="group-value">
						{row.groupValue[0]}
					</span>
				</button>
				<span class="group-items-count">
					({row.children.length} items)
				</span>
			</div>
		{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
			<div class="group-cell-content">
				<div class="group-cell-content-value">
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
{/snippet}

{#snippet GroupRow(row: GridGroupRow<User>)}
	<div
		class="grid-body-row group-row"
		data-depth={row.depth}
		data-expanded={datagrid.rowManager.isGroupRowExpanded(row)}
	>
		{#each flattenColumns(datagrid.columns) as column, columnIndex (columnIndex)}
			{#if column.state.visible === true}
				{@render GroupRowCell(row, column)}
			{/if}
		{/each}
	</div>
{/snippet}

{#snippet BasicRow(row: GridBasicRow<User>)}
	<div class="grid-body-row">
		{#each flattenColumns(datagrid.columns) as column (column.header)}
			{#if column.state.visible === true}
				{@render BodyCell(column, row)}
			{/if}
		{/each}
	</div>
	{#if datagrid.rowExpanding.isRowExpanded(row.index)}
		<div class="grid-body-row">
			<div class="grid-body-cell">
				<div class="grid-body-cell">
					Content for row with ID {row.original.id}
				</div>
			</div>
		</div>
	{/if}
{/snippet}

<!-- TODO: simplify this -->
{#snippet Row(row: GridRow<User>)}
	{#if isGridGroupRow(row)}
	  {@render GroupRow(row)}
	{:else}
	  {@render BasicRow(row)}
	{/if}
  {/snippet}

<input
	type="text"
	value={datagrid.globalSearch.value}
	oninput={(e) => {
		datagrid.globalSearch.value = e.currentTarget.value;
		datagrid.processors.data.executeFullDataTransformation();
	}}
/>

<div class="grid-wrapper">
	<div class="grid">
		<div class="grid-header">
			<div class="grid-header-row">
				{#each datagrid.columns as column (column.header)}
					{@render HeaderCell(column)}
				{/each}
			</div>
		</div>
		<div class="grid-body">
			<!-- {#each datagrid.cache.__paginatedRows || [] as row (row.index)}
				{@render Row(row)}
			{/each} -->
			{#each datagrid.rowPinning.getTopRows() as row (row.index)}
				{@render Row(row)}
			{/each}

			{#each datagrid.rowPinning.getCenterRows() as row (row.index)}
				{@render Row(row)}
			{/each}

			{#each datagrid.rowPinning.getBottomRows() as row (row.index)}
				{@render Row(row)}
			{/each}
		</div>
	</div>
</div>
<div class="pagination">
	<button
		disabled={datagrid.pagination.canGoToPrevPage()}
		onclick={() => datagrid.refresh(() => datagrid.pagination.goToPrevPage())}
	>
		Prev
	</button>
	<span>
		Page {datagrid.pagination.page} of {datagrid.pagination.pageCount}
	</span>
	<button
		disabled={datagrid.pagination.canGoToNextPage()}
		onclick={() => datagrid.refresh(() => datagrid.pagination.goToNextPage())}
	>
		Next
	</button>
	<select
		value={datagrid.pagination.pageSize}
		onchange={(e) => {
			datagrid.refresh(() => {
				datagrid.pagination.pageSize = Number(e.currentTarget.value);
				datagrid.pagination.goToFirstPage();
			});
		}}
	>
		{#each datagrid.pagination.pageSizes as pageSize}
			<option value={pageSize}>{pageSize}</option>
		{/each}
	</select>
</div>

<ColumnOrdering {datagrid} />
<ColumnPinning {datagrid} />
<ColumnVisibility {datagrid} />
<GroupBy {datagrid} />
