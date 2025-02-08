<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Sort from '$lib/datagrid/icons/material-symbols/sort.svelte';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import type { EnhancedDatagrid } from '../../core/index.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};

	let { datagrid }: Props = $props();

	const leafColumns = datagrid.columns.getLeafColumns();
	let sortableColumns = $derived(leafColumns.filter((column) => column.options.sortable === true));


</script>

<DropdownMenu.Sub>
	<DropdownMenu.SubTrigger>
		<Sort class="mr-2 size-4" />
		<span>Sorting</span>
	</DropdownMenu.SubTrigger>
	<DropdownMenu.SubContent>
		{#each sortableColumns as column}
			<DropdownMenu.Item
				closeOnSelect={false}
				onclick={(e) => {
					const multisort = !e.shiftKey;
					datagrid.handlers.sorting.toggleColumnSort(column, multisort);
				}}
			>
				{#if column.options.sortable}
					<div class="flex flex-row">
						{#if datagrid.features.sorting.getSortDirection(column.columnId) === 'desc'}
							<SortDescending />
						{:else if datagrid.features.sorting.getSortDirection(column.columnId) === 'asc'}
							<SortAscending />
						{:else if datagrid.features.sorting.getSortDirection(column.columnId) === 'intermediate'}
							<ArrowsSort />
						{/if}

						{#if datagrid.features.sorting.getSortIndex(column.columnId)}
							<span class="text-xs">{datagrid.features.sorting.getSortIndex(column.columnId)}</span>
						{/if}
					</div>
				{/if}
				<span>{column.header}</span>
			</DropdownMenu.Item>
		{/each}
		<DropdownMenu.Item disabled>
			<span>Hold <Badge>Shift</Badge> to single sort</span>
		</DropdownMenu.Item>
	</DropdownMenu.SubContent>
</DropdownMenu.Sub>
