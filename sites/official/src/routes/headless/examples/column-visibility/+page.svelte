<script lang="ts">
	import ColumnSizingDatagrid from '../_components/datagrids/column-sizing/column-sizing-datagrid.svelte';
	import ColumnVisibilityDatagrid from '../_components/datagrids/column-visibility/column-visibility-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Column visibility datagrid implementation</h2>
<ColumnVisibilityDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
