<script lang="ts">
	import ColumnPinningDatagrid from '../_components/datagrids/column-pinning/column-pinning-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Columng pinning datagrid implementation</h2>
<ColumnPinningDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
