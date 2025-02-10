<script lang="ts">
	import RowSelectionDatagrid from '../_components/datagrids/row-selection/row-selection-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Row selection example implementation</h2>
<RowSelectionDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
