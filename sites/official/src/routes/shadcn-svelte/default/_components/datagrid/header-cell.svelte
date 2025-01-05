<script lang="ts">
	import { isGroupColumn } from '$lib/datagrid/core/column-guards';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import {
		getSortDirection,
		getSortIcon,
		getSortIndex,
		onSort
	} from '$lib/datagrid/core/utils.svelte';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import ColumnFilter from '$lib/datagrid/prebuilt/native/column-filter.svelte';
	let { datagrid, column }: { datagrid: Datagrid<any>; column: any } = $props();
	import HeaderCell from './header-cell.svelte';
</script>

{#if isGroupColumn(column)}
	<div class="grid-header-group">
		{#if column.columns.some((c) => c.state.visible === true)}
			<div class="grid-header-group-header">{column.header}</div>
			<div class="flex grow flex-row">
				{#each column.columns ?? [] as subColumn (subColumn.header)}
					{#if subColumn.state.visible === true}
						<HeaderCell {datagrid} column={subColumn} />
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{:else}
	{#if column.state.visible === true}
		<div
			class="grid-header-cell"
			data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
			style:--pin-left-offset={column.state.pinning.offset + 'px'}
			style:--pin-right-offset={column.state.pinning.offset + 'px'}
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="grid-header-cell-content {column.options.sortable ? 'sortable' : ''}"
				onclick={(e) => onSort(datagrid, column, e)}
			>
				<span class="grid-header-cell-content-header">{column.header}</span>
				{#if column.options.sortable}
					<div class="sort-indicator">
						{#if getSortDirection(datagrid, column) === 'desc'}
							<SortDescending />
						{:else if getSortDirection(datagrid, column) === 'asc'}
							<SortAscending />
						{:else if getSortDirection(datagrid, column) === 'intermediate'}
							<ArrowsSort />
						{/if}
						{#if getSortIndex(datagrid, column)}
							<span class="text-xs">{getSortIndex(datagrid, column)}</span>
						{/if}

					</div>
				{/if}
			</div>

			<div class="w-full">
				<ColumnFilter {datagrid} {column} />
			</div>
		</div>
	{/if}
{/if}
