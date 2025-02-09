<script lang="ts">
	import ColumnFiltersDatagrid from '../_components/datagrids/column-filters/column-filters-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Header groups datagrid implementation</h2>
<ColumnFiltersDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
