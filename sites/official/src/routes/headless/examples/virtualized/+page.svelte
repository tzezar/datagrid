<script lang="ts">
	import VirtualizedDatagrid from '../_components/datagrids/virtualized/virtualized-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Virtualized datagrid example implementation</h2>

<VirtualizedDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
