<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { type Datagrid } from '$lib/tzezars-datagrid/core/index.svelte';
	import FilterAltOff from '../../icons/material-symbols/filter-alt-off.svelte';
	import FilterAlt from '../../icons/material-symbols/filter-alt.svelte';
	import FullscreenExit from '../../icons/material-symbols/fullscreen-exit.svelte';
	import Fullscreen from '../../icons/material-symbols/fullscreen.svelte';
	import OptionsDropdown from './options-dropdown.svelte';

	let { grid }: { grid: Datagrid<any, any> } = $props();

	let fullscreen = $state(false);
	let columnFilters = $state(false)
</script>

<div class="flex gap-2 pb-2 self-end w-full justify-end">
	<Button variant='outline'>
		{#if columnFilters}
			<FilterAltOff class="size-4" />
		{:else}
			<FilterAlt class="size-4" />
		{/if}
	</Button>
	<Button variant='outline'>
		{#if fullscreen}
			<FullscreenExit class="size-4" />
		{:else}
			<Fullscreen class="size-4" />
		{/if}
	</Button>
	<OptionsDropdown {grid} />
</div>
