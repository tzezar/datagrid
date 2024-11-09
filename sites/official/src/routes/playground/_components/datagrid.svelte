<script lang="ts">
	import { Datagrid } from '$lib/datagrid/index.svelte';
	import type { Data } from '$lib/datagrid/types';
	import CellRenderer from '$lib/datagrid/utils/cell-renderer.svelte';
	import ActionsGroup from './cells/actions-group.svelte';
	import ColumnFilter from './column-filter.svelte';
	import { columns } from './columns';
	import OptionsPanel from './options-panel.svelte';
	import type { GeneratedRow } from './types';

	let { data }: { data: GeneratedRow[] } = $props();

	let grid = new Datagrid({
		data,
		columns
	});
</script>

<OptionsPanel {grid} />

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
							<ColumnFilter {column} {grid} />
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="grid-body">
			{#each grid.rows as row}
				{#if row.groupId}
					<div class="grid-row">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->

						{#each grid.columns as column, colIndex}
							{#if column.columnDef.accessorKey === 'department'}
							
							{/if}	
						<div
								class="grid-cell overflow-hidden text-ellipsis"
								style:--offset={column.pinning.offset + 'px'}
								style={`${column.cell && column.cell.style && column.cell.style(row)}; --width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'}; --min-width: ${column.size.width + 'px'};`}
							>
								{#if column.columnId === 'actions'}
									<ActionsGroup {grid} {row} />
								{/if}

								{#if column.columnId === row.columnId && Object.keys(row.aggregates).find((key) => key === column.columnId)}
									<!-- <span>{column.accessor(row)}</span> -->
									<span>{row.groupId}</span>
								{:else if row.aggregates[column.columnId]}
									{#each Object.entries(row.aggregates[column.columnId]) as [aggKey, aggValue]}
										<span>{aggKey}: {aggValue.toFixed(2)}</span>
									{/each}
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
						{#each grid.columnManager.getVisibleColumns() as column}
							<div
								class={`grid-cell overflow-hidden text-ellipsis text-nowrap ${column.pinning.position === 'left' && 'offset-left bg-white'} ${column.pinning.position === 'right' && 'offset-right bg-white'}`}
								style:--offset={column.pinning.offset + 'px'}
								style={`${column.cell && column.cell.style && column.cell.style(row)}; --width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'}; --min-width: ${column.size.width + 'px'};`}
							>
								<CellRenderer {column} {row} {grid} />
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
