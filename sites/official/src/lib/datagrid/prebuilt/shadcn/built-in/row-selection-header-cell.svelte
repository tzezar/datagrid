<script lang="ts" generics="T">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils';
	import type { TzezarsDatagrid } from '../core/index.svelte';

	let { datagrid }: { datagrid: TzezarsDatagrid<any> } = $props();

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

<div class={cn('flex')}>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={cn(
				'flex',
				datagrid.extra.features.columnFiltering.isEnabled() ? 'self-center' : 'self-end'
			)}
		>
			<button class="bg-primary m-2 size-4" aria-label="Toggle row selection"></button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content side="right">
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
