<script lang="ts">
	import '../styles.css';
	import { Datagrid } from '$lib/datagrid/index.svelte';
	import CellRenderer from '$lib/datagrid/utils/cell-renderer.svelte';
	import type { SalesDataRow } from '$lib/generate-data/generate-sales-data';
	import ChevronLeft from '$lib/icons/chevron-left.svelte';
	import ChevronRight from '$lib/icons/chevron-right.svelte';
	import { columns } from './columns';
	import ActionsGroup from './actions-group.svelte';
	import OptionsPanel from './options-panel.svelte';
	import ColumnFilter from './column-filter.svelte';
	import { VirtualList } from 'svelte-virtuallists';
	import { type Row } from '$lib/datagrid/processors/data-processor.svelte';

	let { data }: { data: SalesDataRow[] } = $props();

	let grid = new Datagrid({
		data,
		columns,
		pagination: {
			count: 0,
			page: 1,
			pageSize: 1000,
			pageSizes: [100, 1000, 10000, 25000, 50000, 100000]
		}
	});
</script>

<OptionsPanel {grid} />

<div class="grid-wrapper">
	<div class="grid-content">
		<VirtualList items={grid.rows} class="list-table" style="height:600px" isTable={true}>
			{#snippet header()}
				<div class="grid-header-row sticky top-0 -translate-y-[1px]">
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
									if (e.key === 'Enter')
										grid.reload(() => grid.sorting.toggleSort(column.columnId));
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
							{#if grid.columnManager.isFilterable(column)}
								<ColumnFilter {column} {grid} />
							{/if}
						</div>
					{/each}
				</div>
			{/snippet}
			{#snippet vl_slot({ item: row, index }: { item: Row<any>; index: number })}
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
								style="{['left', 'right'].includes(column.pinning.position) && `background-color: black;`}"
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
								style="{column.cell && column.cell.style && column.cell.style(row)} {['left', 'right'].includes(column.pinning.position) && `background-color: black;`}"
							>
								<CellRenderer {column} {row} {grid} />
							</div>
						{/each}
					</div>
					{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
						<div class="grid-row">
							<div class="grid-cell">Ducks can surf! They’ve been spotted riding waves for fun. 🦆🌊</div>
						</div>
					{/if}
				{/if}
			{/snippet}
		</VirtualList>
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
