<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();
</script>

<input
	type="text"
	value={datagrid.globalSearch.value}
	oninput={(e) => {
		datagrid.globalSearch.value = e.currentTarget.value;
		datagrid.processors.data.executeFullDataTransformation();

	}}
/>
