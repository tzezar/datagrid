<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getContext } from 'svelte';
	import MingcuteFileExportLine from '~icons/mingcute/file-export-line';
	import { exportToExcel } from '../fns/export-to-xlsx';
	import { exportToCSV } from '../fns/export-to-csv';
	import { exportToXML } from '../fns/export-to-xml';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		title
	}: {
		title: string;
	} = $props();

	const datagrid = getContext<TzezarDatagrid>('datagrid');
	const exportableColumns = $derived(datagrid.columns.filter((c) => c.exportable !== false));
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm"><MingcuteFileExportLine /></Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>Export data on page to:</DropdownMenu.Label>

		<DropdownMenu.Group>
			<DropdownMenu.Item
				onclick={() => exportToExcel(datagrid.internal.paginatedData, exportableColumns, title)}
			>
				excel
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={() => exportToCSV(datagrid.internal.paginatedData, exportableColumns, title)}
			>
				csv
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => exportToXML(datagrid.internal.paginatedData, exportableColumns)}>
				xml
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
