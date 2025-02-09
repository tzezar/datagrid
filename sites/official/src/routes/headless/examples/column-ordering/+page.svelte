<script lang="ts">
	import ColumnOrderingDatagrid from '../_components/datagrids/column-ordering/column-ordering-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Header groups datagrid implementation</h2>
<ColumnOrderingDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
