<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import ShowHeadFiltersToggler from './shadcn/show-head-filters-toggler.svelte';
	import CopyToClipboardMenu from './shadcn/copy-to-clipboard-menu.svelte';
	import ExportMenu from './shadcn/export-menu.svelte';
	import FullscreenToggler from './shadcn/fullscreen-toggler.svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import OptionsMenu from './shadcn/options-menu.svelte';

	let {
		class: _class,
		children,
	}: {
		class?: {
			wrapper?: string;
			title?: string;
		};
		children?: Snippet;
	} = $props();

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<div
	class={cn('flex flex-wrap items-center justify-between gap-2 py-2 align-middle', _class?.wrapper)}
>
	<p class={cn('text-xl font-semibold leading-none', _class?.title)}>{datagrid.title}</p>
	{#if children}
		{@render children()}
	{:else}
		<div class="ml-auto flex flex-wrap gap-2">
			{#if datagrid.options.topbar.displayHeadFilterToggle}
				<ShowHeadFiltersToggler />
			{/if}
			{#if datagrid.options.topbar.displayCopyDataMenu}
				<CopyToClipboardMenu />
			{/if}
			{#if datagrid.options.topbar.displayExportDataMenu}
				<ExportMenu title="tzezar-table" />
			{/if}
			{#if datagrid.options.fullscreenMode.enabled && datagrid.options.topbar.displayFullscreenToggle}
				<FullscreenToggler />
			{/if}
			{#if datagrid.options.topbar.settingsMenu.display}
				<OptionsMenu />
			{/if}
		</div>
	{/if}
</div>
