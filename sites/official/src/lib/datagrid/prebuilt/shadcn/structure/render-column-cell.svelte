<script lang="ts">
	import type { GroupColumn, LeafColumn } from '$lib/datagrid/core/types';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import LeafColumnCell from './leaf-column-cell.svelte';
	import ColumnSortingIndicator from '$lib/datagrid/prebuilt/shadcn/built-in/column-sorting-indicator.svelte';
	import { isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import { flip } from 'svelte/animate';
	import GroupColumnCell from './group-column-cell.svelte';
	import HeaderCellDropdown from '../built-in/header-cell-dropdown.svelte';
	import ColumnFilterInput from '../built-in/column-filter-input.svelte';
	import type { ShadcnColumnMeta } from '../core/types';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: GroupColumn<any, ShadcnColumnMeta> | LeafColumn<any, ShadcnColumnMeta>;
	};

	let { datagrid, column }: Props = $props();
</script>

{#if isGroupColumn(column)}
	{@render ColumnGroupHeaderSnippet(column)}
{:else if column.state.visible === true}
	{@render ColumnHeaderSnippet(column)}
{/if}

{#snippet ColumnGroupHeaderSnippet(column: GroupColumn<any>)}
	<GroupColumnCell {column} {datagrid}>
		<div class={datagrid.customization.styling.getHeadRowGroupColumnCellContentClasses()}>
			<span class={datagrid.customization.styling.getHeadRowGroupColumnCellHeaderClasses()}>
				{column.header}
			</span>
			<HeaderCellDropdown {datagrid} {column} />
		</div>
		<div class="flex grow flex-row">
			{#each column.columns ?? [] as subColumn (subColumn.columnId)}
				<div
					animate:flip={{
						duration: (len) => datagrid.extra.features.animations.getHeadersFlipDuration(len)
					}}
				>
					{#if isGroupColumn(subColumn)}
						{@render ColumnGroupHeaderSnippet(subColumn)}
					{:else if subColumn.state.visible === true}
						{@render ColumnHeaderSnippet(subColumn)}
					{/if}
				</div>
			{/each}
		</div>
	</GroupColumnCell>
{/snippet}

{#snippet ColumnHeaderSnippet(column: LeafColumn<any>)}
	{#if column.headerCell}
		{@const cellContent = column.headerCell({ datagrid, column })}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {column} />
		{/if}
	{:else}
		<LeafColumnCell {datagrid} {column}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class:sortable={column.options.sortable &&
					datagrid.extra.features.sorting.enableSorting === true}
				class={datagrid.customization.styling.getHeadRowLeafColumnCellContentClasses(column)}
				onclick={(e) => {
					if (datagrid.extra.features.sorting.enableSorting === false) return;
					let multisort = false;
					if (datagrid.extra.features.sorting.enableMultiSort) {
						multisort = e.shiftKey;
					}
					datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
				}}
			>
				<span class="group-column-header">{column.header}</span>

				<div class="flex gap-1">
					{#if datagrid.extra.features.sorting.enableSorting && datagrid.extra.features.sorting.enableSorting === true}
						{#if column.isSortable()}
							<ColumnSortingIndicator {datagrid} {column} />
						{/if}
					{/if}
					{#if column._meta.showColumnManagerDropdownMenu === true}
						<HeaderCellDropdown {datagrid} {column} />
					{/if}
				</div>
			</div>
			{#if datagrid.extra.features.columnFiltering.isEnabled()}
				<div
					class={datagrid.customization.styling.getHeadRowLeafColumnFilterInputWrapperClasses()}
				>
					<ColumnFilterInput {datagrid} {column} />
				</div>
			{/if}
		</LeafColumnCell>
	{/if}
{/snippet}

