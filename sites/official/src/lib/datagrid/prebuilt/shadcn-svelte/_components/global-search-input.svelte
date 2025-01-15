<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';

	let { datagrid }: { datagrid: DataGrid<any> } = $props();
</script>

<Input
	type="text"
	placeholder="Search"
	class='rounded-none border-0 outline-none ring-0 border-l border-t focus-visible:ring-0'
	value={datagrid.features.globalSearch.value}
	oninput={(e) => {datagrid.handlers.globalSearch.updateValue(e.currentTarget.value)}}
/>
