<script lang="ts">
	import '../styles.css';
	import { Datagrid } from '$lib/tzezars-datagrid/core/index.svelte';
	import CellRenderer from '$lib/tzezars-datagrid/core/utils/cell-renderer.svelte';
	import type { SalesDataRow } from '$lib/generate-data/generate-sales-data';
	import ChevronLeft from '$lib/icons/chevron-left.svelte';
	import ChevronRight from '$lib/icons/chevron-right.svelte';
	import { columns } from './columns';
	import type { Group } from '$lib/tzezars-datagrid/core/features/grouping-manager.svelte';
	import ActionsGroup from './actions-group.svelte';

	let { data }: { data: SalesDataRow[] } = $props();

	let grid = new Datagrid({
		data,
		columns
	});

	function handleGroupByChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions);

		const newGroupBy = selectedOptions
			.map((option) => {
				const column = grid.columnManager.getColumn(option.value);
				if (!column.groupable) return null;
				return {
					accessor: column.accessor,
					columnId: option.value
				} as Group;
			})
			.filter((group): group is Group => group !== null); // Type guard to filter out null values

		grid.reload(() => {
			grid.pagination.goToFirstPage();
			grid.grouping.setGroupBy(newGroupBy);
			grid.pagination.updatePageCount();
		});
	}
</script>

<div class="flex flex-col pb-6">
	<label for="groupBy">Group by:</label>
	<select
		multiple
		onchange={(e) => handleGroupByChange(e)}
		id="groupBy"
		style={`border-radius: 0.25rem;
		border: 1px solid hsl(var(--grid-border));
		padding: 0 0.5rem;
		height: 140px;
		`}
	>
		{#each grid.columns as column}
			<option value={column.columnId} disabled={column.groupable === false}>
				{column.header}
			</option>
		{/each}
	</select>
</div>

<div class="grid-wrapper">
	<div class="grid-content">
		<div class="grid-header">
			<div class="grid-header-row">
				{#each grid.columnManager.getVisibleColumns() as column}
					<div
						class="grid-header-cell"
						style="{column.size.grow === false
							? `--width:${column.size.width}px; --max-width:${column.size.width}px;`
							: 'flex-grow:1;'} --min-width:{column.size.minWidth}px; 
							{['left', 'right'].includes(column.pinning.position) && `background-color: black;`}
							"
						class:offset-left={column.pinning.position === 'left'}
						class:offset-right={column.pinning.position === 'right'}
						style:--offset={`${column.pinning.offset}px`}
					>
						<div
							aria-label="Click to sort column"
							role="button"
							tabindex="0"
							class="flex w-full items-center gap-1 overflow-hidden"
							class:justify-end={column.align === 'end'}
							class:justify-center={column.align === 'center'}
							class:justify-start={column.align === 'start'}
							onclick={() => {
								if (column.sortable === false) return;
								grid.reload(() => grid.sorting.toggleSort(column.columnId));
							}}
							onkeydown={(e) => {
								if (column.sortable === false) return;
								if (e.key === 'Enter') grid.reload(() => grid.sorting.toggleSort(column.columnId));
								else if (e.key === 'Escape') grid.reload(() => grid.sorting.clearSort());
							}}
						>
							<span class="overflow-hidden text-ellipsis">{column.header}</span>
							{#if column.isSorted()}
								<span class="text-nowrap text-xs">
									{column.getSortingDirection() === 'asc'
										? `▲ ${grid.sorting.getColumnSortPosition(column)}`
										: column.getSortingDirection() === 'desc'
											? `▼ ${grid.sorting.getColumnSortPosition(column)}`
											: ' '}
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid-body">
			{#each grid.rows as row}
				{#if row.groupId}
					<div class="grid-row">
						{#each grid.columns as column, colIndex}
							<div
								class="grid-cell items-center text-ellipsis text-nowrap bg-green-400/5"
								class:justify-end={column.align === 'end'}
								class:justify-center={column.align === 'center'}
								class:justify-start={column.align === 'start'}
								class:offset-left={column.pinning.position === 'left'}
								class:offset-right={column.pinning.position === 'right'}
								style:--offset="{column.pinning.offset}px"
								style:--min-width="{column.size.minWidth}px"
								style:--width={!column.size.grow ? `${column.size.width}px` : null}
								style:--max-width={!column.size.grow ? `${column.size.width}px` : null}
								style:flex-grow={column.size.grow ? 1 : null}
								style={`${['left', 'right'].includes(column.pinning.position) && `background-color: black;`}`}
							>
								{#if column.columnId === 'actions'}
									<ActionsGroup {grid} {row} />
								{/if}

								{#if column.columnId === row.columnId}
									<!-- <span>{column.accessor(row)}</span> -->
									<span class="overflow-hidden text-ellipsis font-bold">{row.groupId}</span>
								{:else if row.aggregates[column.columnId]}
									{#each Object.entries(row.aggregates[column.columnId]) as [aggKey, aggValue]}
										<span class="text-muted-foreground text-xs"
											>{aggKey}: {aggValue.toFixed(2)}</span
										>
									{/each}
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="grid-row">
						{#each grid.columnManager.getVisibleColumns() as column}
							<div
								class="grid-cell text-ellipsis text-nowrap"
								class:justify-end={column.align === 'end'}
								class:justify-center={column.align === 'center'}
								class:justify-start={column.align === 'start'}
								class:offset-left={column.pinning.position === 'left'}
								class:offset-right={column.pinning.position === 'right'}
								style:--offset="{column.pinning.offset}px"
								style:--min-width="{column.size.minWidth}px"
								style:--width={!column.size.grow ? `${column.size.width}px` : null}
								style:--max-width={!column.size.grow ? `${column.size.width}px` : null}
								style:flex-grow={column.size.grow ? 1 : null}
								style={`${['left', 'right'].includes(column.pinning.position) && `background-color: black;`}`}
							>
								<CellRenderer {column} {row} {grid} />
							</div>
						{/each}
					</div>
					
				{/if}
			{/each}
		</div>
	</div>
</div>

<div class="pagination">
	<div class="pagination-details">
		Showing: {grid.pagination.page * grid.pagination.pageSize - grid.pagination.pageSize}
		to {grid.pagination.page * grid.pagination.pageSize} of {grid.pagination.count}
	</div>
	<div class="pagination-navigation-container">
		<button
			class="pagination-button"
			disabled={grid.pagination.canPrevPage()}
			onclick={() => grid.refresh(() => grid.pagination.goToPrevPage())}
		>
			<ChevronLeft />
		</button>
		<input
			type="text"
			class="pagination-input"
			value={grid.pagination.page}
			onchange={(e) => {
				if (+e.currentTarget.value > 0 && +e.currentTarget.value <= grid.pagination.pageCount) {
					grid.refresh(() => grid.pagination.goToPage(Number(e.currentTarget.value)));
				} else {
					e.currentTarget.value = String(grid.pagination.page);
				}
			}}
			min="1"
		/>
		<button
			class="pagination-button"
			disabled={grid.pagination.canNextPage()}
			onclick={() => grid.refresh(() => grid.pagination.goToNextPage())}
		>
			<ChevronRight />
		</button>
	</div>
	<div class="pagination-per-page-wrapper">
		<select
			class="pagination-select"
			value={grid.pagination.pageSize}
			onchange={(e) => {
				grid.refresh(() => grid.pagination.updatePageSize(Number(e.currentTarget.value)));
			}}
		>
			{#each grid.pagination.pageSizes as pageSize}
				<option value={pageSize}>{pageSize}</option>
			{/each}
		</select>
	</div>
</div>
