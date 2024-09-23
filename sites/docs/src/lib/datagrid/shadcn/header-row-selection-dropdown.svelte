<script lang="ts" generics="T">
	import { getContext } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { SvelteSet } from 'svelte/reactivity';
	import type { Data, WithIdentifier } from '../types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	const datagrid = getContext<TzezarDatagrid>('datagrid');

	let {}: {} = $props();

	// handle-row-selection-change.ts
	export const handleSelectionChange = ({
		value,
		data,
		selectedRows,
		paginatedData
	}: {
		value: string;
		data: Data<WithIdentifier>;
		selectedRows: Data<WithIdentifier>;
		paginatedData: Data<WithIdentifier>;
	}): Data<WithIdentifier> => {
		switch (value) {
			case 'all': {
				// Select all rows
				datagrid.state.selectedRows = data;
				// Update selectedRowIds to include all IDs
				datagrid.internal.selectedRowIds = new SvelteSet(data.map((row) => row.id));
				break;
			}
			case 'none': {
				// Deselect all rows
				datagrid.state.selectedRows = [];
				// Clear selectedRowIds set
				datagrid.internal.selectedRowIds.clear();
				break;
			}
			case 'allOnPage': {
				// Add rows on the current page if not already selected
				const newSelections = paginatedData.filter((row) => !selectedRows.includes(row));
				datagrid.state.selectedRows = [...selectedRows, ...newSelections] as Data;

				// Update selectedRowIds to include IDs from the new selections on the page
				newSelections.forEach((row) => datagrid.internal.selectedRowIds.add(row.id));
				break;
			}
			case 'noneOnPage': {
				// Remove rows on the current page from selected rows
				datagrid.state.selectedRows = selectedRows.filter(
					(row) => !paginatedData.includes(row)
				) as Data;

				// Update selectedRowIds by removing the IDs of rows on the current page
				paginatedData.forEach((row) => {
					datagrid.internal.selectedRowIds.delete(row.id);
				});
				break;
			}
			default:
				// If no valid case is provided, keep selected rows unchanged
				datagrid.state.selectedRows = selectedRows as Data;
				break;
		}
		return datagrid.state.selectedRows;
	};
</script>

<div class=" flex h-full w-full items-center justify-center">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} size="sm" class="m-0 h-full w-full rounded-none">O</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Select rows</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={() =>
						handleSelectionChange({
							value: 'all',
							data: datagrid.data,
							selectedRows: datagrid.state.selectedRows,
							paginatedData: datagrid.internal.paginatedData
						})}
				>
					Everything
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						handleSelectionChange({
							value: 'none',
							data: datagrid.data,
							selectedRows: datagrid.state.selectedRows,
							paginatedData: datagrid.internal.paginatedData
						})}
				>
					None
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						handleSelectionChange({
							value: 'allOnPage',
							data: datagrid.data,
							selectedRows: datagrid.state.selectedRows,
							paginatedData: datagrid.internal.paginatedData
						})}
				>
					Everything on page
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						handleSelectionChange({
							value: 'noneOnPage',
							data: datagrid.data,
							selectedRows: datagrid.state.selectedRows,
							paginatedData: datagrid.internal.paginatedData
						})}
				>
					None on page
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
