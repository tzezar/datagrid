<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import MoreVert from '$lib/datagrid/icons/material-symbols/more-vert.svelte';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import MoveDown from '$lib/datagrid/icons/material-symbols/move-down.svelte';
	import CellWithoutColumn from '../headless-structure/body/row/cell/cell-without-column.svelte';

	let { row, datagrid }: { row: GridBasicRow<any>; datagrid: TzezarsDatagrid<any> } = $props();

	const handleClick = () => {
		datagrid.handlers.rowExpanding.toggleRowExpansion(row.identifier);
	};
</script>

<CellWithoutColumn {datagrid} {row} class=''>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'p-0 m-0 h-fit w-[20px')}>
				<MoreVert />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => datagrid.handlers.rowPinning.pinRowTop(row.identifier)}>
						<MoveUp class="mr-2 size-4" />
						<span>Pin to top</span>
						<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={() => datagrid.handlers.rowPinning.pinRowBottom(row.identifier)}
					>
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
</CellWithoutColumn>
