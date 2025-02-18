<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { exportToXML } from '../fns/export-to-xml';
	import { getExportableColumns } from '../fns/get-exportable-columns';
	import type { BaseColumn } from '../types';

	let {
		data,
		columns,
		class: _class,
		title
	}: {
		class?: string;
		data: any[];
		columns: BaseColumn[];
		title: string;
	} = $props();
</script>

<Button size="sm" class={_class} onclick={() => exportToXML(data, getExportableColumns(columns))}>
	{#if title}
		{title}
	{:else}
		Export to XML
	{/if}
</Button>
