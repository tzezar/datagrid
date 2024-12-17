<script lang="ts">
	import {
		createComputedColum,
		createAccessorColumn,
		createColumnGroup,
		type ColumnDef
	} from './datagrid/core/helpers/column-creators';
	import type { Row, User } from './types';
	import { isGroupColumn } from './datagrid/core/column-guards';
	import type { ColumnId, GridBasicRow, GridGroupRow, GridRow } from './datagrid/core/types';
	import { Datagrid } from './datagrid/core/index.svelte';
	import {
		findColumnById,
		flattenColumns,
		getCellContent,
		getSortIcon,
		getSortIndex,
		isGridGroupRow,
		onSort
	} from './datagrid/core/utils.svelte';
	import { userColumns } from './columns.svelte';

	let { data } = $props();

	const datagrid = new Datagrid(userColumns, data.users);


	function handleGroupByChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions);

		const newGroupBy: ColumnId[] = selectedOptions
			.map((option) => {
				const column = findColumnById(datagrid.columns, option.value);
				if (column?.options?.groupable === false) return null;
				return option.value;
			})
			.filter((group): group is ColumnId => group !== null); // Type guard to filter out null values


		
		datagrid.grouping.groupByColumns = newGroupBy;
		datagrid.changePage(1);
		datagrid.executeFullDataTransformation();
	}
</script>

{#snippet HeaderCell(column: ColumnDef<User>)}
	{#if isGroupColumn(column)}
		<div class="grid-header-group">
			<div class="grid-header-group-cell">{column.header}</div>
			<div class="grid-header-row">
				{#each column.columns ?? [] as subColumn (subColumn.header)}
					{@render HeaderCell(subColumn)}
				{/each}
			</div>
		</div>
	{:else}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="grid-header-cell">
			<div
				class="header-content {column?.sortable ? 'sortable' : ''}"
				onclick={(e) => onSort(datagrid, column, e)}
			>
				<span>{column.header}</span>
				{#if column?.sortable}
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
				{#if column.filterable !== false}
					{#if column._meta.filterType === 'number'}
						<input
							type="number"
							class="column-filter-input w-full"
							value={datagrid.filtering.getConditionValue(column.columnId)}
							oninput={(e) => {
								const value = e.currentTarget.value === '' ? null : +e.currentTarget.value;
								datagrid.filtering.updateFilterCondition({
									column,
									value
								});
								datagrid.executeFullDataTransformation();
							}}
						/>
					{/if}
					{#if column._meta.filterType === 'text'}
						<input
							type="text"
							class="column-filter-input w-full"
							value={datagrid.filtering.getConditionValue(column.columnId)}
							oninput={(e) => {
								datagrid.filtering.updateFilterCondition({
									column,
									value: e.currentTarget.value
								});
								datagrid.executeFullDataTransformation();
							}}
						/>
					{/if}
					{#if column._meta.filterType === 'select'}
						<select
							value={datagrid.filtering.getConditionValue(column.columnId)}
							oninput={(e) => {
								datagrid.filtering.updateFilterCondition({
									column,
									value: e.currentTarget.value
								});
								datagrid.executeFullDataTransformation();
							}}
						>
							<option value=""></option>
							{#each column._meta.filterOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet BodyCell(column: ColumnDef<User>, row: GridBasicRow<User>)}
	<div class="grid-body-cell">
		{@html getCellContent(column, row.original)}
	</div>
{/snippet}

{#snippet GroupRowCell(row: GridGroupRow<User>, column: ColumnDef<User>)}
	<div class="grid-body-cell group-cell">
		{#if column.columnId === row.groupKey}
			<div class="group-cell-content">
				<button
					class="group-expand-inline-toggle"
					onclick={() => datagrid.toggleGroupRowIsExpanded(row)}
				>
					<span class="expand-icon">
						{row.isExpanded ? '▼' : '▶'}
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
	<div class="grid-body-row group-row" data-depth={row.depth} data-expanded={row.isExpanded}>
		{#each flattenColumns(datagrid.columns) as column, columnIndex (columnIndex)}
			{@render GroupRowCell(row, column)}
		{/each}
	</div>
{/snippet}

{#snippet BasicRow(row: GridBasicRow<User>)}
	<div class="grid-body-row">
		{#each flattenColumns(datagrid.columns) as column (column.header)}
			{@render BodyCell(column, row)}
		{/each}
	</div>
{/snippet}

{#snippet Row(row: GridRow<User>)}
	{#if isGridGroupRow(row)}
		{@render GroupRow(row)}
	{:else}
		{@render BasicRow(row)}
	{/if}
{/snippet}

<div class="flex flex-col pb-6">
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

<input
	type="text"
	value={datagrid.globalSearch.value}
	oninput={(e) => {
		datagrid.globalSearch.value = e.target.value;
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
			{#each datagrid.processedRowsCache as row (row.index)}
				{@render Row(row)}
			{/each}
		</div>
	</div>
</div>
<div class="pagination">
	<button
		disabled={!datagrid.pagination.canGoToPrevPage()}
		onclick={() =>
			datagrid.pagination.canGoToPrevPage() && datagrid.changePage(datagrid.pagination.page - 1)}
	>
		Prev
	</button>
	<span>
		Page {datagrid.pagination.page} of {datagrid.pagination.pageCount}
	</span>
	<button
		disabled={!datagrid.pagination.canGoToNextPage()}
		onclick={() =>
			datagrid.pagination.canGoToNextPage() && datagrid.changePage(datagrid.pagination.page + 1)}
	>
		Next
	</button>
</div>

<style>
	:root {
		--border-color: orange;
		--border-width: 1px;
	}

	.grid-wrapper {
		width: 100%;
		height: 400px;
		overflow: auto;
		border: var(--border-width) solid var(--border-color);
		box-sizing: border-box;
	}

	.grid {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: max-content;
		height: 100%;
	}

	.grid-header,
	.grid-body {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	/* Row styles */
	.grid-header-row,
	.grid-body-row {
		display: flex;
		flex-direction: row;
		border-bottom: var(--border-width) solid var(--border-color);
		width: 100%;
	}

	/* Cell styles */
	.grid-header-cell,
	.grid-body-cell {
		width: 120px;
		flex-shrink: 0;
		padding: 8px;
		margin: 0;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: relative;
		box-sizing: border-box;
		/* Move border to pseudo-element */
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			width: var(--border-width);
			background-color: var(--border-color);
		}
	}

	/* Group styles */
	.grid-header-group {
		display: flex;
		flex-direction: column;
		/* Remove direct border */
		position: relative;
		/* Add border using pseudo-element */
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			width: var(--border-width);
			background-color: var(--border-color);
		}
	}

	.grid-header-group-cell {
		width: 100%;
		padding: 8px;
		margin: 0;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-bottom: var(--border-width) solid var(--border-color);
		box-sizing: border-box;
	}

	/* Handle nested group borders */
	.grid-header-group .grid-header-row {
		border-bottom: none;
		width: 100%;
	}

	.grid-header-group .grid-header-cell {
		border-bottom: none;
	}

	.grid-header-cell {
		gap: 0.5rem;
		display: flex;
		flex-direction: column;
	}

	/* Fix for group headers spanning multiple columns */
	.grid-header-group {
		display: flex;
		flex-direction: column;
	}

	.grid-header-group .grid-header-group-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Fix for nested header rows in groups */
	.grid-header-group .grid-header-row {
		display: flex;
		flex-direction: row;
	}

	/* Optional: Add some padding and visual hierarchy */
	.grid-header-cell,
	.grid-body-cell,
	.grid-header-group-cell {
		padding: 8px 8px;
	}

	.grid-header-group-cell {
		font-weight: bold;
	}

	/* Fix for the width calculations */
	.grid-header-group {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.sortable {
		cursor: pointer;
		user-select: none;
	}

	.sortable:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 8px;
		justify-content: space-between;
	}

	.sort-indicator {
		display: flex;
		align-items: center;
		opacity: 0.5;
	}

	.sortable:hover .sort-indicator {
		opacity: 1;
	}

	.grid-header-cell[data-sort-direction='asc'] .sort-indicator,
	.grid-header-cell[data-sort-direction='desc'] .sort-indicator {
		opacity: 1;
	}

	/* TODO: change coloring */
	.group-expand-inline-toggle {
		display: flex;
		align-items: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
		gap: 0.5rem;
		flex-grow: 1;
	}

	.group-expand-inline-toggle:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.expand-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		color: #666;
	}

	.group-value {
		font-weight: 600;
		color: #333;
		flex-grow: 1;
	}

	.group-items-count {
		color: #666;
		font-size: 0.8em;
		margin-left: auto;
	}

	.group-row {
		background-color: #f9f9f9;
	}

	.group-row[data-expanded='true'] {
		background-color: #f0f0f0;
	}

	.group-cell {
		display: flex;
		align-items: center;
	}

	/* Filtering */
	.column-filter-input {
		background-color: hsl(var(--grid-row-odd-background));
		border-radius: 0.25rem;
		border: 1px solid hsl(var(--grid-border));
		padding: 0 0.5rem;
		height: 1.25rem;
		color: hsl(var(--grid-text-color));
	}
</style>
