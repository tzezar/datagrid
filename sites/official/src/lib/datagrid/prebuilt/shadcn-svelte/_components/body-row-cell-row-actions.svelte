<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import MoreVert from '$lib/datagrid/icons/material-symbols/more-vert.svelte';
	import { cn } from '$lib/utils';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import MoveDown from '$lib/datagrid/icons/material-symbols/move-down.svelte';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';

	let {
		datagrid,
		column,
		row
	}: { datagrid: DataGrid<any>; column: LeafColumn<any>; row: GridBasicRow<any> } = $props();

</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-4 p-2 ')}
		><MoreVert /></DropdownMenu.Trigger
	>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => datagrid.handlers.rowPinning.pinRowTop(row.identifier)}>
				<MoveUp class="mr-2 size-4" />
				<span>Pin to top</span>
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => datagrid.handlers.rowPinning.pinRowBottom(row.identifier)}>
				<MoveDown class="mr-2 size-4" />
				<span>Pin to bottom</span>
				<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => datagrid.handlers.rowPinning.unpinRow(row.identifier)} disabled={!datagrid.features.rowPinning.isPinned(row.identifier)}>
				<span>Unpin row</span>
				<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
