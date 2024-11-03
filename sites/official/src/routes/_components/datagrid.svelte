<script lang="ts">
	import { browser } from '$app/environment';
	import type { SortBy, SortMode } from '$lib/datagrid/features/sorting-manager.svelte';
	import { Datagrid } from '$lib/datagrid/index.svelte';
	import type { DataItem } from '../utils/generata-data';
	import { columns } from './columns';

	let { data }: { data: DataItem[] } = $props();

	let grid = new Datagrid(data, columns);

	function handleGroupToggle(groupId: string) {
		grid.dataProcessor.toggleGroupExpansion(groupId);
		grid.pagination.pageCount = Math.ceil(
			grid.dataProcessor.getVisibleRowCount() / grid.pagination.pageSize
		);
		grid.pagination.page = Math.min(grid.pagination.page, grid.pagination.pageCount);
		grid.refreshRows();
	}

	function handleGroupByChange(event: Event) {
		let timeStart = performance.now();
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions);
		const newGroupBy = selectedOptions.map((option) => option.value);

		// Update the grouping state
		grid.grouping.state.groupBy = newGroupBy;
		// grid.dataProcessor.state.groupBy = newGroupBy;

		// Reset expanded groups when grouping changes
		grid.grouping.state.expandedRows.clear();

		// Reinitialize the grid with new grouping
		grid.rows = grid.dataProcessor.initialize();

		// Update pagination
		grid.pagination.pageCount = Math.ceil(
			grid.dataProcessor.getVisibleRowCount() / grid.pagination.pageSize
		);
		grid.pagination.page = 1; // Reset to first page when grouping changes
		console.log(`${grid.grouping.state.groupBy} Time taken: ${performance.now() - timeStart}ms`);
	}
</script>

{grid.pagination.page}
{grid.pagination.pageSize}
{grid.pagination.pageCount}
<div class="flex flex-col gap-4 pb-4">
	<div class="flex flex-col">
		<label for="groupBy">Group by:</label>
		<select
			multiple
			onchange={handleGroupByChange}
			value={grid.grouping.state.groupBy}
			id="groupBy"
		>
			{#each grid.columns as column}
				<option value={column.accessorKey}>{column.header}</option>
			{/each}
		</select>
	</div>
	<div class="flex flex-col">
		<label for="sortBy">Sort mode (single, multi, none):</label>
		<select
			value={grid.sorting.mode}
			onchange={(e) => grid.sorting.setSortMode(e.currentTarget.value as SortMode)}
			id="sortBy"
		>
			<option value="single">single</option>
			<option value="multi">multi</option>
			<option value="none">none</option>
		</select>
	</div>
</div>
<div class="grid-wrapper overflow-auto">
	<div class="grid">
		<div class="grid-header">
			<div class="grid-header-row">
				{#each grid.columns as column}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="grid-header-cell flex cursor-pointer flex-col"
						style={`--width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'}; --min-width: ${column.size.width + 'px'}`}
					>
						<div class="flex flex-row">
							<span
								class="grow flex-nowrap overflow-hidden text-ellipsis text-nowrap"
								onclick={(e) => {
									if (e.currentTarget === e.target) {
										e.stopPropagation();
										grid.reload(() => grid.sorting.toggleSort(column.accessorKey));
									}
								}}
							>
								{column.header}
							</span>
							<span>
								{#if column.isSorted()}
									{#if column.getSortingDirection() === 'asc'}
										▲
									{:else if column.getSortingDirection() === 'desc'}
										▼
									{:else}
										&nbsp;
									{/if}
								{/if}
							</span>
						</div>
						<input
							type="text"
							onchange={(e) =>
								grid.filtering.addFilter({
									accessor: column.accessorKey,
									operator: 'contains',
									value: e.currentTarget.value
								})}
						/>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid-body">
			{#each grid.rows as row}
				{#if row.groupId}
					<div class="grid-row">
						{#each grid.columns as column, colIndex}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="grid-cell"
								onclick={() => colIndex === 0 && handleGroupToggle(row.groupId as string)}
							>
								{#if colIndex === 0}
									<span class="group-toggle">
										{grid.grouping.state.expandedRows.has(row.groupId) ? '▼' : '▶'}
									</span>
									{row.groupId}
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="grid-row">
						{#each grid.columns as column}
							<div
								class="grid-cell"
								style={`--width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'}; --min-width: ${column.size.width + 'px'}`}
							>
								{row.original?.[column.accessorKey]}
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
<!-- Pagination controls -->
<div class="pagination">
	<button
		disabled={grid.pagination.canPrevPage()}
		onclick={() => grid.command(() => grid.pagination.goToPrevPage())}
	>
		Previous
	</button>
	<span>Page {grid.pagination.page}</span>
	<button
		disabled={grid.pagination.canNextPage()}
		onclick={() => grid.command(() => grid.pagination.goToNextPage())}
	>
		Next
	</button>
	<select
		value={grid.pagination.pageSize}
		onchange={(e) => {
			grid.command(() => grid.pagination.updatePageSize(Number(e.currentTarget.value)));

			// setPageSize(Number(e.currentTarget.value));
		}}
	>
		{#each grid.pagination.pageSizes as pageSize}
			<option value={pageSize}>{pageSize}</option>
		{/each}
	</select>
</div>

<style>
	.grid-header-row {
		background-color: theme('colors.orange.400');
		display: flex;
	}
	.grid-header-cell {
		width: var(--width);
		max-width: var(--max-width);
		min-width: var(--min-width);
		padding: 0.5rem 0.5rem;
	}

	.grid-row {
		@apply flex border;
	}
	.grid-cell {
		width: var(--width);
		max-width: var(--max-width);
		min-width: var(--min-width);
		padding: 0.5rem 0.5rem;
		cursor: pointer;
	}

	.group-toggle {
		margin-right: 0.5rem;
	}

	.pagination {
		@apply mt-4 flex items-center justify-center gap-4;
	}

	button {
		@apply rounded bg-orange-400 px-4 py-2 text-white;
	}

	button:disabled {
		@apply cursor-not-allowed opacity-50;
	}

	input {
		@apply border px-2 py-1;
	}

	select {
		@apply border px-2 py-1;
	}

	label {
		@apply pb-1 text-sm font-medium;
	}
</style>
