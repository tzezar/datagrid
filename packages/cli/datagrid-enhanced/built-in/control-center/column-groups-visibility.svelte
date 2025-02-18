<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ExpandLess from '$lib/datagrid/icons/material-symbols/expand-less.svelte';
	import ExpandMore from '$lib/datagrid/icons/material-symbols/expand-more.svelte';
	import type { EnhancedDatagrid } from '../../core/index.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};

	let { datagrid }: Props = $props();
</script>

<DropdownMenu.Item
	closeOnSelect={false}
	onclick={() => datagrid.extra.features.columnGroups.toggleVisibility()}
>
	{#if datagrid.extra.features.columnGroups.showColumnGroups}
		<ExpandLess class="mr-2 size-4" />
		Hide column groups
	{:else}
		<ExpandMore class="mr-2 size-4" />
		Show column groups
	{/if}
</DropdownMenu.Item>
