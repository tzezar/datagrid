<script lang="ts">
	import RowExpandingDatagrid from '../_components/datagrids/row-expanding/row-expanding-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Pagination implementation</h2>
<RowExpandingDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
