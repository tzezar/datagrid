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

<div class={cn('flex p-2 px-[8px] flex-col justify-end self-end h-full text-[0.75rem] leading-none', '')}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger >
				<button class="bg-primary size-4" aria-label="Toggle row selection"></button>
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

		<!-- some space for the column filtering -->
		{#if datagrid.extra.features.columnFiltering.isEnabled()}
			<div class="h-9 w-full pt-1"></div>
		{/if}
</div>
