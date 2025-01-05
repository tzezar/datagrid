<script lang="ts">
	import { isGroupColumn } from '$lib/datagrid/core/column-guards';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { getSortIcon, getSortIndex, onSort } from '$lib/datagrid/core/utils.svelte';
	import ColumnFilter from '$lib/datagrid/prebuilt/native/column-filter.svelte';
	let { datagrid, column }: { datagrid: Datagrid<any>; column: any } = $props();
	import HeaderCell from './header-cell.svelte';
</script>

{#if isGroupColumn(column)}
	<div class="grid-header-group ">
		{#if column.columns.some((c) => c.state.visible === true)}
			<div class="">{column.header}</div>
			<div class="flex flex-row grow ">
				{#each column.columns ?? [] as subColumn (subColumn.header)}
					{#if subColumn.state.visible === true}
						<HeaderCell {datagrid} column={subColumn} />
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
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
			<div
				class="grid-header-cell-content {column.options.sortable ? 'sortable' : ''}"
				onclick={(e) => onSort(datagrid, column, e)}
			>
				<span>{column.header}</span>
				{#if column.options.sortable}
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
				<ColumnFilter {datagrid} {column} />
			</div>
		</div>
	{/if}
{/if}
