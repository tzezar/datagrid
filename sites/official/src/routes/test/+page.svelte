<script lang="ts">
	import { type AnyColumn } from './datagrid/core/helpers/column-creators';
	import type { User } from './types';
	import { isGroupColumn } from './datagrid/core/column-guards';
	import type {
		ColumnId,
		GridBasicRow,
		GridGroupRow,
		GridRow,
		PinningPosition
	} from './datagrid/core/types';
	import { Datagrid } from './datagrid/core/index.svelte';
	import {
		filterOutGroupColumns,
		findColumnById,
		flattenColumns,
		getCellContent,
		getSortIcon,
		getSortIndex,
		isDescendantOf,
		isGridGroupRow,
		onSort
	} from './datagrid/core/utils.svelte';
	import { userColumns } from './columns.svelte';
	import ColumnFilter from './datagrid/prebuilt/native/column-filter.svelte';
	import './datagrid/styles.css';

	let { data } = $props();

	const datagrid = new Datagrid(userColumns, data.users);


	function handleGroupByChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions);

		const newGroupBy: ColumnId[] = selectedOptions
			.map((option) => {
				const column = findColumnById(datagrid.columns, option.value);
				if (!column) return null;
				if (column.options.groupable === false) return null;
				return option.value;
			})
			.filter((group): group is ColumnId => group !== null); // Type guard to filter out null values

		datagrid.grouping.groupByColumns = newGroupBy;
		datagrid.pagination.goToFirstPage();
		datagrid.executeFullDataTransformation();
	}

	const handleColumnPinningChange = (column: AnyColumn<any>, position: PinningPosition) => {
		datagrid.columnPinning.changeColumnPinningPosition(column, position);
		datagrid.refreshColumnPinningOffsets();
	};

	// datagrid.columnGrouping.createGroupColumn('New Group', null);
</script>

{#snippet GroupControls(column: AnyColumn<User>)}
	<div class="text-muted-foreground flex flex-row gap-2 text-xs">
		<button onclick={() => datagrid.columnOrdering.moveColumnUp(column)}>UP</button>
		<button onclick={() => datagrid.columnOrdering.moveColumnDown(column)}>DOWN</button>
		<select
			class="w-full"
			value={column.parentColumnId || ''}
			onchange={(e) => {
				const targetGroupId = e.currentTarget.value;
				if (targetGroupId === column.parentColumnId) return;

				if (column.type === 'group') {
					const targetGroup = datagrid.columnOrdering
						.getGroupColumns()
						.find((group) => group.columnId === targetGroupId);

					if (targetGroup && isDescendantOf(targetGroup, column)) {
						console.warn('Cannot move a group into its own descendant');
						e.currentTarget.value = column.parentColumnId || '';
						return;
					}
				}

				datagrid.columnOrdering.moveColumnToGroup(column, targetGroupId);
			}}
		>
			<option value="">Root Level</option>
			{#each datagrid.columnOrdering
				.getGroupColumns()
				.filter((groupCol) => column.type !== 'group' || (groupCol !== column && !isDescendantOf(groupCol, column))) as groupColumn}
				<option value={groupColumn.columnId} disabled={groupColumn === column}>
					{groupColumn.header}
				</option>
			{/each}
		</select>
	</div>
{/snippet}

{#snippet Ordering(columns: AnyColumn<User>[])}
	{#each columns as column (column.columnId)}
		{#if isGroupColumn(column)}
			<div class="border p-2">
				<div class="font-bold underline">
					{column.header}
					<button onclick={() => datagrid.columnGrouping.deleteGroupColumn(column)}>X</button>
				</div>
				{@render GroupControls(column)}
				{@render Ordering(column.columns)}
			</div>
		{:else}
			<div>
				<div>{column.header}</div>
				{@render GroupControls(column)}
			</div>
		{/if}
	{/each}
{/snippet}

<div class="flex flex-col gap-2">
	{@render Ordering(datagrid.columns)}
</div>

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
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		{#if column.cell && typeof column.cell === 'function'}
			{@const cellContent = column.cell(row)}
			{#if cellContent.component}
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
				{#if cellContent.component}
					<!-- svelte-ignore svelte_component_deprecated -->
					<svelte:component this={cellContent.component} {...cellContent.props} {datagrid} />
				{/if}
			{/if}
		{/if}

		{#if column.columnId === row.groupKey}
			<div class="group-cell-content">
				<button
					class="group-expand-inline-toggle"
					onclick={() => datagrid.toggleGroupRowIsExpanded(row)}
				>
					<span class="expand-icon">
						{datagrid.isGroupRowExpanded(row) ? '▼' : '▶'}
					</span>
					<span class="group-value">
						{row.groupValue[0]}
					</span>
				</button>
				<span class="group-items-count">
					({row.children.length} items)
				</span>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet GroupRow(row: GridGroupRow<User>)}
	<div
		class="grid-body-row group-row"
		data-depth={row.depth}
		data-expanded={datagrid.isGroupRowExpanded(row)}
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
	{:else if row.parentIndex}
		{#if datagrid.rowPinning.isPinnedToTop(row.index) || datagrid.rowPinning.isPinnedToBottom(row.index)}
			<!-- typescript hack -->
			{@const flattenedRow = datagrid
				.getAllFlattenedRows(datagrid.groupedRowsCache)
				.find((r) => r.index === row.parentIndex) as GridGroupRow<User>}
			{#if datagrid.grouping.expandedGroups.has(flattenedRow?.groupId)}
				{@render BasicRow(row)}
			{/if}
		{:else}
			{@render BasicRow(row)}
		{/if}
	{:else}
		{@render BasicRow(row)}
	{/if}
{/snippet}

<input
	type="text"
	value={datagrid.globalSearch.value}
	oninput={(e) => {
		datagrid.globalSearch.value = e.currentTarget.value;
		datagrid.executeFullDataTransformation();
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
			<!-- {#each datagrid.processedRowsCache as row (row.index)}
				{@render Row(row)}
			{/each} -->
			<!-- Top pinned rows -->
			{#each datagrid.rowPinning.getTopRows() as row (row.index)}
				{@render Row(row)}
			{/each}

			<!-- Center (unpinned) rows -->
			{#each datagrid.rowPinning.getCenterRows() as row (row.index)}
				{@render Row(row)}
			{/each}

			<!-- Bottom pinned rows -->
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
<div class="flex flex-col pb-6">
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label>Colum pinning:</label>
	<div class="border p-2">
		{#each filterOutGroupColumns(flattenColumns(datagrid.columns)) as column}
			<div class="flex max-w-[200px] flex-row justify-between gap-2">
				{column.header}
				<select
					value={column.state.pinning.position}
					disabled={column.options.pinnable === false}
					onchange={(e) =>
						handleColumnPinningChange(column, e.currentTarget.value as PinningPosition)}
				>
					<option value="none">none</option>
					<option value="left">left</option>
					<option value="right">right</option>
				</select>
			</div>
		{/each}
	</div>
</div>
<div class="flex flex-col gap-2 pb-6">
	<label for="resizeColumns">Resize columns:</label>
	{#each filterOutGroupColumns(flattenColumns(datagrid.columns)) as column}
		<span>{column.header}</span>
		<input
			type="range"
			min={column.state.size.minWidth}
			max={column.state.size.maxWidth}
			value={column.state.size.width}
			oninput={(e) => {
				datagrid.columnSizing.setColumnSize(column.columnId, Number(e.currentTarget.value));
				datagrid.refreshColumnPinningOffsets();
			}}
		/>
	{/each}
</div>
<div class="flex flex-col place-items-start gap-2 pb-6">
	<label for="toggleColumns">Column visibility:</label>
	{#each filterOutGroupColumns(flattenColumns(datagrid.columns)) as column}
		<button
			class=""
			onclick={() => datagrid.columnVisibility.toggleColumnVisibility(column.columnId)}
		>
			<span>
				{column.header}
			</span>
		</button>
	{/each}
</div>

<div class="flex flex-col gap-2 pb-6">
	<label for="groupBy">Group by:</label>
	<select
		multiple
		value={datagrid.grouping.groupByColumns}
		onchange={(e) => handleGroupByChange(e)}
		id="groupBy"
		style={`border-radius: 0.25rem;
		border: 1px solid hsl(var(--grid-border));
		padding: 0 0.5rem;
		height: 140px;
		`}
	>
		{#each datagrid.columns as column}
			<option value={column.columnId} disabled={column?.options?.groupable === false}>
				{column.header}
			</option>
		{/each}
	</select>
</div>
