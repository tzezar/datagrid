<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import { debounce } from '$lib/datagrid/core/utils.svelte';

	let { datagrid }: { datagrid: DataGrid<any> } = $props();

	const debouncedUpdateValue = debounce((value: string) => {
		datagrid.features.globalSearch.updateSearchValue(value);
		datagrid.features.pagination.goToFirstPage();
		datagrid.cache.invalidate('filteredData');
		datagrid.processors.data.executeFullDataTransformation();
	}, datagrid.features.globalSearch.delay);

</script>

<Input
	type="text"
	placeholder="Search"
	class="rounded-none border-0 border-l border-t outline-none ring-0 focus-visible:ring-0"
	value={datagrid.features.globalSearch.value}
	oninput={(e) => debouncedUpdateValue(e.currentTarget.value)}
/>
