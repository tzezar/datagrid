<script lang="ts">
	import ColumnPinningDetachedDatagrid from '../_components/datagrids/column-pinning-detached/column-pinning-detached-datagrid.svelte';


	let { data } = $props();
</script>

<h2>Header groups datagrid implementation</h2>
<ColumnPinningDetachedDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
