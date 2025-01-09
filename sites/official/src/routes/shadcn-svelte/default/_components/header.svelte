<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import type { DataGrid } from "$lib/datagrid/core/index.svelte";
	import FilterAltOff from "$lib/datagrid/icons/material-symbols/filter-alt-off.svelte";
	import FilterAlt from "$lib/datagrid/icons/material-symbols/filter-alt.svelte";
	import GlobalSearch from "$lib/datagrid/prebuilt/shadcn-svelte/controls/global-search.svelte";
	import DatagridSettingsDropdown from "$lib/datagrid/prebuilt/shadcn-svelte/controls/settings/datagrid-settings-dropdown.svelte";


    let {datagrid}: {datagrid: DataGrid<any>} = $props()

</script>

<div class="flex justify-end">
    <GlobalSearch {datagrid} />
    <Button class='rounded-none' variant="outline" onclick={() => datagrid.filtering.toggleColumnFiltering()}>
        {#if datagrid.filtering.showColumnFiltering}
            <FilterAlt />
        {:else}
            <FilterAltOff />
        {/if}
    </Button>

    <!-- <DatagridSettingsDropdown {datagrid} /> -->
</div>