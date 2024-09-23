<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getContext } from 'svelte';
	import MaterialSymbolsContentCopyOutline from '~icons/material-symbols/content-copy-outline';
	import { copyToClipboardSelectedCells } from '../fns/cell-selection/copy-to-clipboard';
	import { copyToClipboard } from '../fns/copy-to-clipboard';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let {}: {} = $props();

	const datagrid = getContext<TzezarDatagrid>('datagrid');

	const exportableColumns = $derived(datagrid.columns.filter((c) => c.exportable !== false));
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm">
			<MaterialSymbolsContentCopyOutline />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>Copy</DropdownMenu.Label>

		<DropdownMenu.Group>
			<DropdownMenu.Item
				onclick={() =>
					copyToClipboardSelectedCells({
						selectionRange: datagrid.internal.selectionState.range,
						columns: datagrid.columns,
						data: datagrid.data
					})}
			>
				selected cells
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={() => copyToClipboard(datagrid.state.selectedRows, exportableColumns)}
			>
				selected rows
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={() => copyToClipboard(datagrid.internal.paginatedData, exportableColumns)}
			>
				visible data
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => copyToClipboard(datagrid.data, exportableColumns)}>
				whole data
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
