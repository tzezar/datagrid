<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import FilterAltOff from '$lib/datagrid/icons/material-symbols/filter-alt-off.svelte';
	import FilterAlt from '$lib/datagrid/icons/material-symbols/filter-alt.svelte';
	import GlobalSearch from '$lib/datagrid/prebuilt/shadcn-svelte/_components/global-search-input.svelte';
	import DatagridSettingsDropdown from '$lib/datagrid/prebuilt/shadcn-svelte/_components/datagrid-settings-dropdown.svelte';
	import Fullscreen from '$lib/datagrid/icons/material-symbols/fullscreen.svelte';
	import FullscreenExit from '$lib/datagrid/icons/material-symbols/fullscreen-exit.svelte';
	import { cn } from '$lib/utils';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn-svelte/core/index.svelte';

	let { datagrid }: { datagrid: TzezarsDatagrid } = $props();
</script>

<div class={cn("flex items-end justify-end", datagrid.features.filtering.showColumnFiltering && 'top-bar ')}>
	{#if datagrid.features.filtering.showColumnFiltering}
		<GlobalSearch {datagrid} />
	{:else}
		<div class="flex h-full grow items-end pb-1 pl-2">
			<span class='font-semibold text-lg w-full'>Your data, our datagrid</span>
		</div>
	{/if}

	<Button
		class="rounded-none border-b-0 border-r-0"
		variant="outline"
		onclick={() => datagrid.features.filtering.toggleColumnFiltering()}
	>
		{#if datagrid.features.filtering.showColumnFiltering}
			<FilterAlt />
		{:else}
			<FilterAltOff />
		{/if}
	</Button>
	<Button
		class="rounded-none border-b-0 border-r-0"
		variant="outline"
		onclick={() => datagrid.extra.features.fullscreen.toggleFullscreen()}
	>
		{#if datagrid.extra.features.fullscreen.isFullscreen}
			<FullscreenExit />
		{:else}
			<Fullscreen />
		{/if}
	</Button>
	<DatagridSettingsDropdown {datagrid} />
</div>

<style>
	.top-bar {
		background-color: hsl(var(--grid-header));
	}
</style>
