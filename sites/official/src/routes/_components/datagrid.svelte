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
	import OptionsPanel from './options-panel.svelte';

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

	let isOptionsPanelOpen = $state(false);
</script>

{#if isOptionsPanelOpen}
	<button
		class="mb-4 !bg-blue-400"
		onclick={() => {
			isOptionsPanelOpen = false;
		}}
	>
		<Expand />
	</button>
	<OptionsPanel {grid} />
{:else}
	<button
		class="mb-4 !bg-blue-400"
		onclick={() => {
			isOptionsPanelOpen = true;
		}}
	>
		<Collapse />
	</button>
{/if}

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
									(condition) => condition.columnId === column.columnId
								)[0]?.operator}
								onchange={(e) =>
									grid.filtering.addFilter({
										accessor: column.accessor,
										columnId: column.columnId,
										operator: e.currentTarget.value as FilterOperator,
										value: grid.filtering.getConditionValue(column.columnId)
									})}
							>
								{#each column._meta.operators as filterOperator}
									<option value={filterOperator}>
										{filterOperator}
									</option>
								{/each}
							</select>
							{#if column._meta.type === 'number'}
								<input
									class="h-6 text-xs"
									placeholder="Search..."
									type="text"
									value={grid.filtering.conditions.filter(
										(c) => c.columnId === column.columnId
									)[0]?.value || ''}
									onchange={(e) =>
										grid.filtering.addFilter({
											accessor: column.accessor,
											columnId: column.columnId,
											operator: grid.filtering.getConditionOperator(column.columnId),
											value: +e.currentTarget.value || '',
											valueTo: grid.filtering.getConditionValueTo(column.columnId)
										})}
								/>
								{#if grid.filtering.conditions.filter((c) => c.columnId === column.columnId)[0]?.operator === 'between'}
									<input
										placeholder="Search..."
										type="text"
										class="h-6 text-xs"
										value={grid.filtering.getConditionValueTo(column.columnId)}
										onchange={(e) =>
											grid.filtering.addFilter({
												accessor: column.accessor,
												columnId: column.columnId,
												operator: grid.filtering.getConditionOperator(column.columnId),
												value: grid.filtering.getConditionValue(column.columnId),
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
										(c) => c.columnId === column.columnId
									)[0]?.value || ''}
									onchange={(e) =>
										grid.filtering.addFilter({
											accessor: column.accessor,
											columnId: column.columnId,
											operator: grid.filtering.getConditionOperator(column.columnId),
											value: e.currentTarget.value
										})}
								/>
							{/if}
							<div class="flex h-6 gap-2">
								<button
									class="w-full !rounded-none !bg-white !py-[2px] text-xs !text-black"
									onclick={() => grid.filtering.removeFilter(column.columnId)}
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
