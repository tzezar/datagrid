<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import FileExport from '$lib/datagrid/icons/material-symbols/file-export.svelte';
	import type { TzezarsDatagrid } from '../../core/index.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
	};

	let { datagrid }: Props = $props();
</script>

<DropdownMenu.Sub>
	<DropdownMenu.SubTrigger>
		<FileExport class="mr-2 size-4" />
		<span>Exporting</span>
	</DropdownMenu.SubTrigger>
	<DropdownMenu.SubContent>
		{#if datagrid.extra.features.exporting.exportMethods.includes('toExcel')}
			<DropdownMenu.Item onclick={() => datagrid.extra.features.exporting.exportToExcel()}>
				Export to EXCEL
			</DropdownMenu.Item>
		{/if}
		{#if datagrid.extra.features.exporting.exportMethods.includes('toCSV')}
			<DropdownMenu.Item onclick={() => datagrid.extra.features.exporting.exportToCSV()}>
				Export to CSV
			</DropdownMenu.Item>
		{/if}
		{#if datagrid.extra.features.exporting.exportMethods.includes('toXML')}
			<DropdownMenu.Item onclick={() => datagrid.extra.features.exporting.exportToXML()}>
				Export to XML
			</DropdownMenu.Item>
		{/if}
		{#if datagrid.extra.features.exporting.exportMethods.includes('toJSON')}
			<DropdownMenu.Item onclick={() => datagrid.extra.features.exporting.exportToJSON()}>
				Export to JSON
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.SubContent>
</DropdownMenu.Sub>
