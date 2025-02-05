<script lang='ts'>
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { getSortDirection, getSortIndex } from '$lib/datagrid/core/utils.svelte';
	import Sort from '$lib/datagrid/icons/material-symbols/sort.svelte';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import type { EnhancedDatagrid } from '../../core/index.svelte';

    type Props = {
        datagrid: EnhancedDatagrid<any>;
    }

    let { datagrid }: Props = $props();

	const leafColumns = datagrid.columnManager.getLeafColumns();
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
                    datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
                }}
            >
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
                <span>{column.header}</span>
            </DropdownMenu.Item>
        {/each}
        <DropdownMenu.Item disabled>
            <span>Hold <Badge>Shift</Badge> to single sort</span>
        </DropdownMenu.Item>
    </DropdownMenu.SubContent>
</DropdownMenu.Sub>