<script lang="ts">
	import ColumnSizingDatagrid from '../_components/datagrids/column-sizing/column-sizing-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Header groups datagrid implementation</h2>
<ColumnSizingDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
