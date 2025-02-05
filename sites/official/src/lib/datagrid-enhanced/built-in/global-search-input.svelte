<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { debounce } from '$lib/datagrid/core/utils.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();

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
	class="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring border-grid-border focus-visible:bg-grid-secondary  flex w-full rounded-none border-none px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
	value={datagrid.features.globalSearch.value}
	oninput={(e) => debouncedUpdateValue(e.currentTarget.value)}
/>
