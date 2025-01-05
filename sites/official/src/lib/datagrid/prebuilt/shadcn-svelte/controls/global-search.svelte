<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();
</script>

<Input
	type="text"
	value={datagrid.globalSearch.value}
	oninput={(e) => {
		datagrid.globalSearch.value = e.currentTarget.value;
		datagrid.processors.data.executeFullDataTransformation();

	}}
/>
