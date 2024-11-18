<script lang="ts">
	import type { PinningPosition } from '$lib/tzezars-datagrid/features/column-manager.svelte';
	import type { Group } from '$lib/tzezars-datagrid/features/grouping-manager.svelte';
	import {
		type RowSelectionMode,
		type RowExpansionMode
	} from '$lib/tzezars-datagrid/features/row-manager.svelte';
	import { type SortMode } from '$lib/tzezars-datagrid/features/sorting-manager.svelte';
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';
	import type { Column } from '$lib/tzezars-datagrid/processors/column-processor.svelte';
	import { debounce } from '$lib/tzezars-datagrid/utils/debounce';
	import Collapse from './icons/collapse.svelte';
	import Expand from './icons/expand.svelte';

	type Props = {
		grid: Datagrid;
	};
	let { grid }: Props = $props();

	const handleColumnPinningChange = (column: Column, position: PinningPosition) => {
		grid.columnManager.changeColumnPinningPosition(column, position);
		grid.columnManager.refreshColumnPinningOffsets();
	};

	const handleColumnResize = (column: Column, width: number) => {
		grid.columnManager.resizeColumn(column, Number(width));
		grid.columnManager.refreshColumnPinningOffsets();
	};
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

	let isOptionsPanelOpen = $state(false);
</script>

{#if isOptionsPanelOpen}
	<button
		class="mb-4 !bg-blue-400 px-2 py-1"
		onclick={() => {
			isOptionsPanelOpen = false;
		}}
	>
		Hide options
	</button>

	<div class="flex flex-row flex-wrap gap-4 pb-4 [&>*]:grow md:[&>*]:w-[calc(50%-8px)]">
		<div class="flex flex-col">
			<label for="groupBy">Group by:</label>
			<select multiple onchange={(e) => handleGroupByChange(e)} id="groupBy">
				{#each grid.columns as column}
					<option value={column.columnId} disabled={column.groupable === false}>
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
							disabled={column.hideable === false}
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
							disabled={column.pinnable === false}
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
							disabled={column.resizable === false}
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
								class="bg-orange-400 px-2 text-xl text-white hover:bg-orange-500 disabled:opacity-50"
								onclick={() => grid.columnManager.moveColumnLeft(column)}
								disabled={!grid.columnManager.canMoveColumnLeft(column) || column.movable === false}
							>
								<Expand />
							</button>
							<button
								class="bg-orange-400 px-2 text-xl text-white hover:bg-orange-500 disabled:opacity-50"
								onclick={() => grid.columnManager.moveColumnRight(column)}
								disabled={!grid.columnManager.canMoveColumnRight(column) ||
									column.movable === false}
							>
								<Collapse />
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
						grid.rowManager.selectionMode = e.currentTarget.value as RowSelectionMode;
						grid.rowManager.selectedRows.clear();
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
						grid.rowManager.expansionMode = e.currentTarget.value as RowExpansionMode;
						grid.rowManager.expandedRows.clear();
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
{:else}
	<button
		class="mb-4 !bg-blue-400 px-2 py-1"
		onclick={() => {
			isOptionsPanelOpen = true;
		}}
	>
		Show options
</button>
{/if}
