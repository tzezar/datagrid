<script lang="ts">
	import GroupingDatagrid from '../_components/datagrids/grouping/grouping-datagrid.svelte';
	import PaginationDatagrid from '../_components/datagrids/pagination/pagination-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Pagination implementation</h2>
<PaginationDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
