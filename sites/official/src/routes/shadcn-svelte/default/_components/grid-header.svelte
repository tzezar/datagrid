<script lang="ts">
	import type { DataGrid } from "$lib/datagrid/core/index.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import FilterAltOff from "$lib/datagrid/icons/material-symbols/filter-alt-off.svelte";
	import FilterAlt from "$lib/datagrid/icons/material-symbols/filter-alt.svelte";
	import GlobalSearch from "$lib/datagrid/prebuilt/shadcn-svelte/controls/global-search.svelte";
	import DatagridSettingsDropdown from "$lib/datagrid/prebuilt/shadcn-svelte/controls/settings/datagrid-settings-dropdown.svelte";


    let {datagrid}: {datagrid: DataGrid<any>} = $props()

</script>

<div class="top-bar flex justify-end">
    <GlobalSearch {datagrid} />
    <Button
        class="rounded-none border-b-0 border-r-0"
        variant="outline"
        onclick={() => datagrid.filtering.toggleColumnFiltering()}
    >
        {#if datagrid.filtering.showColumnFiltering}
            <FilterAlt />
        {:else}
            <FilterAltOff />
        {/if}
    </Button>

    <DatagridSettingsDropdown {datagrid} />
</div>

<style>
	.top-bar {
		background-color: hsl(var(--grid-header));
	}
</style>
