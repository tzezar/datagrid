<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { exportToCSV } from "../fns/export-to-csv";
	import { getExportableColumns } from "../fns/get-exportable-columns";
	import type { BaseColumn } from "../types";


	let {
		data,
		columns,
		title,
		class: _class
	}: {
		data: any[];
		columns: BaseColumn[];
		title: string;
		class?: string;
	} = $props();
</script>

<Button
	size="sm"
	class={_class}
	onclick={() => exportToCSV(data, getExportableColumns(columns), title)}
>
	{#if title}
		{title}
	{:else}
		Export to CSV
	{/if}
</Button>
