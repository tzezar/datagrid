<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import FilterAltOff from '$lib/datagrid/icons/material-symbols/filter-alt-off.svelte';
	import FilterAlt from '$lib/datagrid/icons/material-symbols/filter-alt.svelte';
	import GlobalSearch from '$lib/datagrid/prebuilt/shadcn/blocks/global-search-input.svelte';
	import Fullscreen from '$lib/datagrid/icons/material-symbols/fullscreen.svelte';
	import FullscreenExit from '$lib/datagrid/icons/material-symbols/fullscreen-exit.svelte';
	import { cn } from '$lib/utils';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import ControlCenterDropdown from './control-center-dropdown.svelte';

	let { datagrid }: { datagrid: TzezarsDatagrid } = $props();
</script>

<div class={cn("flex items-end justify-end", datagrid.extra.features.columnFiltering.isEnabled() && 'top-bar ')}>
	{#if datagrid.extra.features.columnFiltering.isEnabled()}
		<GlobalSearch {datagrid} />
	{:else}
		<div class="flex h-full grow items-end pb-1 pl-2">
			<span class='font-semibold text-lg w-full'>Your data, our datagrid</span>
		</div>
	{/if}

	<Button
		class="rounded-none border-b-0 border-r-0"
		variant="outline"
		onclick={() => datagrid.extra.features.columnFiltering.toggleColumnFiltering()}
	>
		{#if datagrid.extra.features.columnFiltering.isEnabled()}
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
	<ControlCenterDropdown {datagrid} />
</div>

<style>
	.top-bar {
		background-color: hsl(var(--grid-header));
	}
</style>
