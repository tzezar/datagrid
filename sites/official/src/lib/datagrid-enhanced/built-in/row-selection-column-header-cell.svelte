<script lang="ts" generics="T">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import LeafColumnCell from '../structure/leaf-column-cell.svelte';

	let { datagrid, column }: { datagrid: EnhancedDatagrid<any>; column: LeafColumn<any> } = $props();

	type SelectionAction = 'selectAll' | 'deselectAll' | 'selectPage' | 'deselectPage';

	const handleSelectionAction = (action: SelectionAction) => {
		switch (action) {
			case 'selectAll': {
				datagrid.handlers.rowSelection.selectAllRows();
				break;
			}
			case 'deselectAll': {
				datagrid.handlers.rowSelection.unselectAllRows();
				break;
			}
			case 'selectPage': {
				datagrid.handlers.rowSelection.selectRowsOnPage();
				break;
			}
			case 'deselectPage': {
				datagrid.handlers.rowSelection.unselectRowsOnPage();
				break;
			}
		}
	};
</script>

<LeafColumnCell
	{datagrid}
	{column}
	class={cn('flex h-full w-10 items-center justify-center border-r px-2')}
>
	{#if datagrid.extra.features.rowSelection.enableSelectAll || datagrid.extra.features.rowSelection.enableSelectAllOnPage}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button class="bg-primary size-[14px]" aria-label="Toggle row selection"></button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>Row selection</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#if datagrid.extra.features.rowSelection.enableSelectAll}
						<DropdownMenu.Item onclick={() => handleSelectionAction('selectAll')}>
							Select every row
						</DropdownMenu.Item>
					{/if}
					{#if datagrid.extra.features.rowSelection.enableSelectAllOnPage}
						<DropdownMenu.Item onclick={() => handleSelectionAction('selectPage')}>
							Select current page
						</DropdownMenu.Item>
					{/if}

					<DropdownMenu.Separator />
					{#if datagrid.extra.features.rowSelection.enableSelectAll}
						<DropdownMenu.Item onclick={() => handleSelectionAction('deselectAll')}>
							Deselect every row
						</DropdownMenu.Item>
					{/if}
					{#if datagrid.extra.features.rowSelection.enableSelectAllOnPage}
						<DropdownMenu.Item onclick={() => handleSelectionAction('deselectPage')}>
							Deselect current page
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</LeafColumnCell>
