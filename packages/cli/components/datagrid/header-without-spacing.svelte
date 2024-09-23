<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import SortingIndicator from './sorting-indicator.svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import type { BaseColumn } from './types';
	import { toggleSortingState } from './fns/toggle-sorting-state';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	type Props = {
		column: BaseColumn;
		title: string;
		filter?: Snippet;
		custom?: Snippet;
		class?: {
			container: string;
		};
	};

	let {
		column,
		title,
		custom,
		filter,
		class: _class = {
			container: ''
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

	// TODO: Refactor this component
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if column.visible !== false}
	<div
		style="width: {column.width || '100px'}; flex-shrink: 0;"
		class={cn(
			'th flex shrink-0 flex-col bg-table-primary hover:bg-table-primary-hover',
			column.sortable && 'cursor-pointer',
			column.pinned?.position == 'left' && 'offset-left border-r ',
			column.pinned?.position == 'right' && 'offset-right border-l ',
			_class.container
		)}
		style:--offset={column.pinned?.offset ? column.pinned.offset : '0px'}
		style:--offset-right={column.pinned?.offset ? column.pinned.offset : '0px'}
		class:grow={column.grow}
		onclick={handleContainerClick}
	>
		<div class="flex grow flex-col justify-center">
			{#if custom}
				{@render custom()}
			{:else}
				<div class="flex justify-between gap-1">
					<span class=" overflow-hidden text-ellipsis">
						{title}
					</span>
					{#if column.sortable}
						<SortingIndicator columnId={column.id} />
					{/if}
				</div>
			{/if}
			{#if filter}
				<div onclick={handleChildClick}>
					{@render filter()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.offset-left {
		left: var(--offset);
		position: sticky;
		z-index: 100;
	}

	.offset-right {
		right: var(--offset-right);
		position: sticky;
		z-index: 100;
	}

	.th {
		/* border-left-width: 1px; */
		border-right-width: 1px;
		/* border-top-width: 1px; */
		/* border-bottom-width: 1px; */

		text-overflow: ellipsis;
		overflow: hidden;
		font-size: smaller;
		font-weight: 600;
	}
	.grow {
		flex-grow: 1;
	}

	.th:last-child {
		border-right-width: 0px;
	}
</style>
