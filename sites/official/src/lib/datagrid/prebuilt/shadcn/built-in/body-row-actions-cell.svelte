<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import Cell from '../headless-structure/body/row/cell/cell.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import MoreVert from '$lib/datagrid/icons/material-symbols/more-vert.svelte';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import MoveDown from '$lib/datagrid/icons/material-symbols/move-down.svelte';

	let {
		row,
		column,
		datagrid
	}: { row: GridBasicRow<any>; column: LeafColumn<any>; datagrid: TzezarsDatagrid<any> } = $props();

	const handleClick = () => {
		datagrid.handlers.rowExpanding.toggleRowExpansion(row.identifier);
	};
</script>

<Cell {datagrid} {row} {column}>
	<div class="flex gap-2 justify-center items-center">
		<button onclick={handleClick}>
			<LayoutNavbarExpandFilled
			class={`${row.isExpanded() ? 'rotate-180' : ''} transition-all`}
			/>
		</button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-4 p-2 ')}>
				<MoreVert />
			</DropdownMenu.Trigger>
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
					<DropdownMenu.Item
						onclick={() => datagrid.handlers.rowPinning.unpinRow(row.identifier)}
						disabled={!datagrid.features.rowPinning.isPinned(row.identifier)}
					>
						<span>Unpin row</span>
						<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		
	</div>
</Cell>