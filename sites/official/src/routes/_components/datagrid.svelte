<script lang="ts">
	import type { PinningPosition } from '$lib/datagrid/features/column-manager.svelte';
	import { type FilterOperator } from '$lib/datagrid/features/filtering-manager.svelte';
	import type { Group } from '$lib/datagrid/features/grouping-manager.svelte';
	import type { SortMode } from '$lib/datagrid/features/sorting-manager.svelte';
	import { Datagrid } from '$lib/datagrid/index.svelte';
	import type { Column } from '$lib/datagrid/processors/column-processor.svelte';
	import type { Data } from '$lib/datagrid/types';
	import { debounce } from '$lib/datagrid/utils/debounce';
	import { columns } from './columns';
	import Collapse from './icons/collapse.svelte';
	import Expand from './icons/expand.svelte';

	let { data }: { data: Data[] } = $props();

	let grid = new Datagrid({
		data,
		columns,
		pagination: {
			page: 2
		}
	});

	function handleGroupToggle(groupId: string) {
		grid.refresh(() => {
			grid.dataProcessor.toggleGroupExpansion(groupId);
			grid.pagination.updatePageCount();
			grid.pagination.goToClosestPage();
		});
	}

	function handleGroupByChange(event: Event) {
		let newGroupBy = [];
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions);

		newGroupBy = selectedOptions.map((option) => {
			const column = grid.columnManager.getColumn(option.value);
			return {
				accessor: column.accessor,
				columnId: option.value
			};
		});


		grid.reload(() => {
			grid.pagination.goToFirstPage();
			grid.grouping.setGroupBy(newGroupBy);
			grid.pagination.updatePageCount();
		});
	}
	const debouncedSearch = debounce((searchText: string) => {
		grid.filtering.search.value = searchText;
		grid.reload(() => {
			grid.pagination.goToFirstPage();
		});
	}, grid.filtering.search.delay);

	function handleSearch(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const searchText = input.value;
		debouncedSearch(searchText);
	}

	$effect(() => {
		// console.log($state.snapshot(grid.grouping.state.expandedRows));
	});

	const handleColumnPinningChange = (column: Column, position: PinningPosition) => {
		grid.columnManager.changeColumnPinning(column, position);
		grid.columnManager.refreshColumnPinningOffsets();
	};

	const handleColumnResize = (column: Column, width: number) => {
		grid.columnManager.resizeColumn(column, Number(width));
		grid.columnManager.refreshColumnPinningOffsets();
	};

</script>

<div class="flex flex-row flex-wrap gap-4 pb-4 [&>*]:grow md:[&>*]:w-[calc(50%-8px)]">
	<div class="flex flex-col">
		<label for="groupBy">Group by:</label>
		<select multiple onchange={(e) => handleGroupByChange(e)} id="groupBy">
			{#each grid.columns as column}
				<option value={column.columnId}>
					{column.header}
				</option>
			{/each}
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
		<label>Colum pinning:</label>
		<div class="border p-2">
			{#each grid.columns as column}
				<div class="flex max-w-[200px] flex-row justify-between gap-2">
					{column.header}
					<select
						value={column.pinning.position}
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
						onchange={(e) => handleColumnResize(column, +e.currentTarget.value)}
					/>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex flex-col">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>Colum reordering:</label>
		<div class="flex flex-col gap-2 border p-2">
			{#each grid.columns as column}
				<div class="flex max-w-[300px] flex-row justify-between gap-2">
					{column.header}
					<div class="flex gap-4">
						<button
							onclick={() => grid.columnManager.moveColumnLeft(column)}
							disabled={!grid.columnManager.canMoveColumnLeft(column)}
						>
							up
						</button>
						<button
							onclick={() => grid.columnManager.moveColumnRight(column)}
							disabled={!grid.columnManager.canMoveColumnRight(column)}
						>
							down
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div>
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
			<label>Global search:</label>
			<input type="text" placeholder="Search..." oninput={handleSearch} />
			<div class="flex gap-2 pt-2">
				<label for="fuzzy">Fuzzy?</label>
				<input
					type="checkbox"
					checked={grid.filtering.search.fuzzy}
					onchange={() => {
						grid.filtering.search.fuzzy = !grid.filtering.search.fuzzy;
						grid.reload(() => {
							grid.pagination.goToFirstPage();
						});
					}}
				/>
			</div>
		</div>

		<div class="flex flex-col">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label>Row selection mode:</label>
			<select
				value={grid.rowManager.selectionMode}
				onchange={(e) => {
					grid.rowManager.selectionMode = e.currentTarget.value as 'none' | 'single' | 'multiple';
					grid.rowManager.state.selectedRows.clear();
				}}
			>
				<option value="none">none</option>
				<option value="single">single</option>
				<option value="multiple">multiple</option>
			</select>
		</div>
		<div class="flex flex-col">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label>Row expansion mode:</label>
			<select
				value={grid.rowManager.selectionMode}
				onchange={(e) => {
					grid.rowManager.expansionMode = e.currentTarget.value as 'none' | 'single' | 'multiple';
					grid.rowManager.state.expandedRows.clear();
				}}
			>
				<option value="none">none</option>
				<option value="single">single</option>
				<option value="multiple">multiple</option>
			</select>
		</div>
	</div>
	<div class="flex flex-col">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>Apply column filters:</label>
		<button
			onclick={() => {
				grid.reload(() => {});
			}}
		>
			Apply
		</button>
	</div>
</div>
<div class="grid-wrapper overflow-auto">
	<div class="grid max-h-[600px]">
		<div class="grid-header">
			<div class="grid-header-row">
				<div class="grid-header-cell">&nbsp; &nbsp;</div>
				{#each grid.columnManager.getVisibleColumns() as column}
					<div
						class={`grid-header-cell flex cursor-pointer flex-col ${column.pinning.position === 'left' && 'offset-left bg-orange-500'} ${column.pinning.position === 'right' && 'offset-right bg-orange-500'}`}
						style:--offset={column.pinning.offset + 'px'}
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
						{#if grid.columnManager.isFilterable(column)}
							<select
								class="h-6 text-xs"
								value={grid.filtering.conditions.filter(
									(c) => c.accessorKey === column.accessorKey
								)[0]?.operator}
								onchange={(e) =>
									grid.filtering.addFilter({
										accessor: column.accessor,
										accessorKey: column.accessorKey,
										operator: e.currentTarget.value as FilterOperator,
										value: grid.filtering.getConditionValue(column.accessorKey)
									})}
							>
								{#each column.allowedFilterOperators as filterOperator}
									<option value={filterOperator}>
										{filterOperator}
									</option>
								{/each}
							</select>
							{#if column.type === 'number'}
								<input
									class="h-6 text-xs"
									placeholder="Search..."
									type="text"
									value={grid.filtering.conditions.filter(
										(c) => c.accessorKey === column.accessorKey
									)[0]?.value || ''}
									onchange={(e) =>
										grid.filtering.addFilter({
											accessor: column.accessor,
											accessorKey: column.accessorKey,
											operator: grid.filtering.getConditionOperator(column.accessorKey),
											value: +e.currentTarget.value || '',
											valueTo: grid.filtering.getConditionValueTo(column.accessorKey)
										})}
								/>
								{#if grid.filtering.conditions.filter((c) => c.accessorKey === column.accessorKey)[0]?.operator === 'between'}
									<input
										placeholder="Search..."
										type="text"
										class="h-6 text-xs"
										value={grid.filtering.getConditionValueTo(column.accessorKey)}
										onchange={(e) =>
											grid.filtering.addFilter({
												accessor: column.accessor,
												accessorKey: column.accessorKey,
												operator: grid.filtering.getConditionOperator(column.accessorKey),
												value: grid.filtering.getConditionValue(column.accessorKey),
												valueTo: +e.currentTarget.value
											})}
									/>
								{/if}
							{:else}
								<input
									placeholder="Search..."
									type="text"
									class="h-6 text-xs"
									value={grid.filtering.conditions.filter(
										(c) => c.accessorKey === column.accessorKey
									)[0]?.value || ''}
									onchange={(e) =>
										grid.filtering.addFilter({
											accessor: column.accessor,
											accessorKey: column.accessorKey,
											operator: grid.filtering.getConditionOperator(column.accessorKey),
											value: e.currentTarget.value
										})}
								/>
							{/if}
							<div class="flex h-6 gap-2">
								<button
									class="w-full !rounded-none !bg-white !py-[2px] text-xs !text-black"
									onclick={() => grid.filtering.removeFilter(column.accessorKey)}
								>
									clear
								</button>
							</div>
						{/if}
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
										{grid.grouping.isGroupExpanded(row.groupId) ? '▼' : '▶'}
									</span>
									{row?.groupId}
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div
						class="grid-row {grid.rowManager.isPinned(String(row?.original?.id), 'top')
							? 'sticky top-0 bg-red-400'
							: ''}"
					>
						<button
							onclick={() => grid.rowManager.toggleRowExpansion(String(row?.original?.id))}
							class="my-auto ml-2 h-fit !px-0 !py-0"
						>
							{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
								<Expand />
							{:else}
								<Collapse />
							{/if}
						</button>
						<div>
							<button
								onclick={() => grid.rowManager.toggleRowPinning(String(row?.original?.id), 'top')}
								>pin up</button
							>
							<button
								onclick={() =>
									grid.rowManager.toggleRowPinning(String(row?.original?.id), 'bottom')}
								>pin down</button
							>
						</div>
						{#each grid.columnManager.getVisibleColumns() as column}
							<div
								class={`grid-cell overflow-hidden text-ellipsis text-nowrap ${column.pinning.position === 'left' && 'offset-left bg-white'} ${column.pinning.position === 'right' && 'offset-right bg-white'}`}
								style:--offset={column.pinning.offset + 'px'}
								style={`${column.cell && column.cell.style && column.cell.style(row)}; --width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'}; --min-width: ${column.size.width + 'px'};`}
							>
								{#if column.cell && column.cell.component}
									<svelte:component this={column.cell.component} {row} {grid} />
								{:else if column.formatter}
									{column.formatter(row.original)}
								{:else}
									{column.accessor(row.original)}
								{/if}
							</div>
						{/each}
					</div>
					{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
						<div class="grid-row">
							<div class="grid-cell">some content here eg lazy loaded</div>
						</div>
					{/if}
				{/if}
			{/each}
		</div>
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
	{grid.pagination.pageCount}
</div>

<pre>
	<p>Selected Rows</p>
	{JSON.stringify(grid.rowManager.getSelectedRows(), null, 2)}
</pre>

<pre>
	<p>Expanded Rows</p>
	{JSON.stringify(grid.rowManager.getExpandedRows(), null, 2)}
</pre>
<pre>
	<p>Pinned Rows</p>
	{JSON.stringify(grid.rowManager.getPinnedRows(), null, 2)}
</pre>

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
	.offset-left {
		left: var(--offset);
		position: sticky;
	}

	.offset-right {
		right: var(--offset);
		position: sticky;
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

	button:hover:not(:disabled) {
		@apply bg-orange-500;
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
