<script lang="ts" generics="T">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';

	let { datagrid, column }: { datagrid: DataGrid<any>; column: LeafColumn<any> } = $props();

	type SelectionAction = 'selectAll' | 'deselectAll' | 'selectPage' | 'deselectPage'

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

<div class="flex h-full w-full items-center justify-center">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button size="sm" class="m-0 h-full w-full rounded-none">O</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Row selection</DropdownMenu.Label>
				<DropdownMenu.Separator />
                <DropdownMenu.Item onclick={() => handleSelectionAction('selectAll')}>
					Select every row
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => handleSelectionAction('selectPage')}>
					Select current page
				</DropdownMenu.Item>
		
				<DropdownMenu.Separator />
	
				<DropdownMenu.Item onclick={() => handleSelectionAction('deselectAll')}>
					Deselect every row
				</DropdownMenu.Item>
                <DropdownMenu.Item onclick={() => handleSelectionAction('deselectPage')}>
					Deselect current page
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
