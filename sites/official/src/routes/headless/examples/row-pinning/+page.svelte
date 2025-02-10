<script lang="ts">
	import RowPinningDatagrid from '../_components/datagrids/row-pinning/row-pinning-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Row pinning example implementation</h2>
<RowPinningDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
