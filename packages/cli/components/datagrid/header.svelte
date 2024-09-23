<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import SortingIndicator from './sorting-indicator.svelte';
	import { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import type { BaseColumn } from './types';
	import { toggleSortingState } from './fns/toggle-sorting-state';
	import { getHeadSize } from './fns/get-header-height';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	type Props = {
		column: BaseColumn;
		filter?: Snippet;
		custom?: Snippet;
		class?: {
			header?: string;
			title?: string;
			topContainer?: string;
			filterContainer?: string;
		};
	};

	let {
		column,
		custom,
		filter,
		class: _class = {
			header: ''
		}
	}: Props = $props();

	function handleContainerClick(e: MouseEvent) {
		e.stopPropagation();
		if (column.sortable) {
	
			toggleSortingState(column.id, datagrid);
		}
	}

	function handleChildClick(e: MouseEvent) {
		e.stopPropagation(); // Stop propagation for the child elements
	}

	// recalculate head size on related changes
	$effect(() => {
		datagrid.options.spacing.selected.horizontal;
		datagrid.options.spacing.selected.vertical;
		datagrid.options.fontSize.selected.value;
		datagrid.state.isHeadFilterVisible;
		datagrid.internal.headSize = getHeadSize(datagrid.identifier);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if column.visible !== false}
	<div
		style:width={column.width || '100px'}
		style:padding-top={datagrid.options.spacing.selected.vertical}
		style:padding-bottom={datagrid.options.spacing.selected.vertical}
		style:padding-left={datagrid.options.spacing.selected.horizontal}
		style:padding-right={datagrid.options.spacing.selected.horizontal}
		style:--offset={column.pinned?.offset ? column.pinned.offset : '0px'}
		style:--offset-right={column.pinned?.offset ? column.pinned.offset : '0px'}
		onclick={handleContainerClick}
		style={`${column.align === 'center' ? ' align-items: center;' : column.align === 'end' ? 'align-items: flex-end' : column.align === 'start' ? 'align-items: flex-start' : ''}`}
		class={cn(
			'th flex shrink-0 flex-col gap-2  overflow-hidden text-ellipsis border-r bg-table-primary font-semibold last:border-r-0 hover:bg-table-primary-hover',
			column.sortable && 'cursor-pointer',
			column.pinned?.position == 'left' && 'offset-left border-r',
			column.pinned?.position == 'right' && 'offset-right border-l',
			column.grow && 'grow',
			_class.header
		)}
	>
		{#if custom}
			{@render custom()}
		{:else}
			<div class={cn('flex justify-between gap-1 ', _class.topContainer)}>
				<span class={cn('grow overflow-hidden text-ellipsis', _class.title)}>
					{column.title}
				</span>
				{#if column.sortable}
					<SortingIndicator columnId={column.id} />
				{/if}
			</div>
		{/if}
		{#if datagrid.state.isHeadFilterVisible && filter}
			<!-- render filter component -->
			<div onclick={handleChildClick} class={_class.filterContainer}>
				{@render filter()}
			</div>
		{/if}
	</div>
{/if}

<style>
	.offset-left {
		left: var(--offset);
		position: sticky;
		z-index: 100;
	}

	.th {
		font-size: smaller;
	}

	.offset-right {
		right: var(--offset-right);
		position: sticky;
		z-index: 100;
	}
</style>
