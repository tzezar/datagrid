<script lang="ts">
	import type { SortMode } from '$lib/datagrid/features/sorting-manager.svelte';
	import { Datagrid } from '$lib/datagrid/index.svelte';
	import { Row } from '$lib/datagrid/processors/data-processor.svelte';
	import type { Data } from '$lib/datagrid/types';
	import { columns } from './columns';
	import { VirtualList } from 'svelte-virtuallists';

	let { data }: { data: Data[] } = $props();

	let grid = new Datagrid(data, columns);

	function handleGroupToggle(groupId: string) {
		grid.refresh(() => {
			grid.dataProcessor.toggleGroupExpansion(groupId);
			grid.pagination.updatePageCount();
			grid.pagination.goToClosestPage();
		});
	}

	function handleGroupByChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions);
		const newGroupBy = selectedOptions.map((option) => option.value);

		grid.reload(() => {
			grid.pagination.goToFirstPage();
			grid.grouping.setGroupBy(newGroupBy);
			grid.pagination.updatePageCount();
		});
	}

	$effect(() => {
		console.log($state.snapshot(grid.columns));
	});
</script>

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
				<option value={column.columnId}>{column.header}</option>
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

	<div class="flex flex-col">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>Colum visibility:</label>
		<div class="border p-2">
			{#each grid.columns as column}
				<div class="flex max-w-[200px] flex-row justify-between gap-2">
					{column.header}
					<input
						type="checkbox"
						checked={column.visible}
						onchange={() => grid.columnManager.toggleColumnVisibility(column)}
					/>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex flex-col">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>Colum resizing:</label>
		<div class="border p-2">
			{#each grid.columns as column}
				<div class="flex max-w-[300px] flex-row justify-between gap-2">
					{column.header}
					<input
						type="range"
						min={column.size.minWidth}
						max={column.size.maxWidth}
						value={column.size.width}
						onchange={(e) => grid.columnManager.resizeColumn(column, Number(e.currentTarget.value))}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
<div class="grid-wrapper overflow-auto">
	<div class="grid">
		<VirtualList items={grid.rows} class="list-table" style="height:600px" isTable={true}>
			{#snippet header()}
				<div class="grid-header-row sticky top-0">
					{#each grid.columnManager.getVisibleColumns() as column}
						<div
							class="grid-header-cell flex cursor-pointer flex-col"
							style={`--width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'}; --min-width: ${column.size.width + 'px'}`}
						>
							<div class="flex flex-row">
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<span
									class="grow flex-nowrap overflow-hidden text-ellipsis text-nowrap"
									onclick={(e) => {
										if (e.currentTarget === e.target) {
											e.stopPropagation();
											grid.reload(() => grid.sorting.toggleSort(column.columnId));
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
										accessor: column.accessor,
										operator: 'contains',
										value: e.currentTarget.value
									})}
							/>
						</div>
					{/each}
				</div>
			{/snippet}

			{#snippet vl_slot({ item, index }: { item: Row; index: number })}
				{#if item.groupId}
					<div class="grid-row">
						{#each grid.columns as column, colIndex}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="grid-cell"
								onclick={() => colIndex === 0 && handleGroupToggle(item.groupId as string)}
							>
								{#if colIndex === 0}
									<span class="group-toggle">
										{grid.grouping.state.expandedRows.has(item.groupId) ? '▼' : '▶'}
									</span>
									{item?.groupId}
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="grid-row">
						{#each grid.columnManager.getVisibleColumns() as column}
							<div
								class="grid-cell overflow-hidden text-ellipsis text-nowrap"
								style={`${column.cell && column.cell.style && column.cell.style(item)}; --width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'}; --min-width: ${column.size.width + 'px'}`}
							>
								{#if column.cell && column.cell.component}
									<!-- svelte-ignore svelte_component_deprecated -->
									<svelte:component this={column.cell.component} row={item} />
								{:else if column.formatter}
									{column.formatter(item.original)}
								{:else}
									{column.accessor(item.original)}
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			{/snippet}
		</VirtualList>
	</div>
</div>
<!-- Pagination controls -->
<div class="pagination">
	<button
		disabled={grid.pagination.canPrevPage()}
		onclick={() => grid.refresh(() => grid.pagination.goToPrevPage())}
	>
		Previous
	</button>
	<span>Page {grid.pagination.page}</span>
	<button
		disabled={grid.pagination.canNextPage()}
		onclick={() => grid.refresh(() => grid.pagination.goToNextPage())}
	>
		Next
	</button>
	<select
		value={grid.pagination.pageSize}
		onchange={(e) => {
			grid.refresh(() => grid.pagination.updatePageSize(Number(e.currentTarget.value)));

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
