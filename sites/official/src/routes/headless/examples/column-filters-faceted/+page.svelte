<script lang="ts">
	import ColumnFiltersFacetedDatagrid from '../_components/datagrids/column-filters-faceted/column-filters-faceted-datagrid.svelte';


	let { data } = $props();
</script>

<h2>Header groups datagrid implementation</h2>
<ColumnFiltersFacetedDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
