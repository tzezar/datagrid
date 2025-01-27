<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import FilterAltOff from '$lib/datagrid/icons/material-symbols/filter-alt-off.svelte';
	import FilterAlt from '$lib/datagrid/icons/material-symbols/filter-alt.svelte';
	import GlobalSearch from '$lib/datagrid/prebuilt/shadcn/built-in/global-search-input.svelte';
	import Fullscreen from '$lib/datagrid/icons/material-symbols/fullscreen.svelte';
	import FullscreenExit from '$lib/datagrid/icons/material-symbols/fullscreen-exit.svelte';
	import { cn } from '$lib/utils';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import ControlCenter from '../built-in/control-center/control-center.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;

		title?: string;
		class?: string;
	};

	let { datagrid, title, class: _class }: Props = $props();

	const toggleColumnFiltersVisibility = () => {
		datagrid.extra.features.globalSearch.toggleInputVisibility();
		datagrid.extra.features.columnFiltering.toggle();
	};
</script>

<div
	class={cn(
		'flex items-end justify-end bg-grid-toolbar',
		datagrid.extra.features.columnFiltering.shouldDisplayButton() && 'top-bar ',
		_class
	)}
>
	{#if datagrid.extra.features.globalSearch.shouldDisplayInput()}
		<GlobalSearch {datagrid} />
	{:else}
		<div class="flex h-full grow items-center border-l border-t pl-2">
			<span class="text-md w-full">
				{#if title}
					{title}
				{:else}
					{datagrid.extra.getTitle()}
				{/if}
			</span>
		</div>
	{/if}

	{#if datagrid.extra.features.columnFiltering.shouldDisplayButton()}
		{@render columnFilteringToggleButton()}
	{/if}

	{#if datagrid.extra.features.fullscreen.shouldDisplayFullscreenToggleButton()}
		{@render fullscreenToggleButton()}
	{/if}

	<ControlCenter {datagrid} />
</div>

{#snippet columnFilteringToggleButton()}
	<Button
		class="rounded-none border-b-0 border-r-0"
		variant="outline"
		onclick={toggleColumnFiltersVisibility}
	>
		{#if datagrid.extra.features.columnFiltering.isEnabled()}
			<FilterAlt />
		{:else}
			<FilterAltOff />
		{/if}
	</Button>
{/snippet}

{#snippet fullscreenToggleButton()}
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
{/snippet}

<style>

</style>
